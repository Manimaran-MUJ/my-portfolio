import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { manimaranKnowledgeBase } from "./knowledgeBase";
import { sendInquiryEmail } from "./mailer";
import rateLimit from "express-rate-limit";
import { saveInquiry } from "./database";
import crypto from "crypto";
import { getInquiries } from "./database";
import session from "express-session";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50kb" }));

app.use(
  session({
    secret: process.env.ADMIN_SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many inquiries submitted. Please try again later.",
  },
});

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many chatbot requests. Please try again later.",
  },
});

const requireAdmin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session.isAdmin !== true) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  next();
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (_req, res) => {
  res.json({
    message: "Manimaran AI Portfolio API is running",
  });
});

app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "Message is too long. Please keep it under 2000 characters.",
      });
    }

    const conversationHistory = Array.isArray(history)
      ? history
          .filter(
            (item: any) =>
              item &&
              typeof item.text === "string" &&
              item.text.length <= 2000 &&
              (item.role === "user" || item.role === "bot")
          )
          .slice(-20)
      : [];

    const contents = [
      ...conversationHistory.map((item: any) => ({
        role: item.role === "bot" ? "model" : "user",
        parts: [
          {
            text: item.text,
          },
        ],
      })),

      {
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",

      contents,

      config: {
        systemInstruction: manimaranKnowledgeBase,
      },
    });

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    res.status(500).json({
      error: "Unable to process your request",
    });
  }
});

app.post("/api/admin/login", (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey || typeof apiKey !== "string") {
      return res.status(400).json({
        success: false,
        error: "Admin key is required.",
      });
    }

    const adminApiKey = process.env.ADMIN_API_KEY;

    if (!adminApiKey) {
      return res.status(500).json({
        success: false,
        error: "Admin authentication is not configured.",
      });
    }

    const expectedBuffer = Buffer.from(adminApiKey);
    const providedBuffer = Buffer.from(apiKey);

    const isValid =
      expectedBuffer.length === providedBuffer.length &&
      crypto.timingSafeEqual(
        expectedBuffer,
        providedBuffer
      );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid admin credentials.",
      });
    }

    req.session.isAdmin = true;

    res.json({
      success: true,
      message: "Admin login successful.",
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to process admin login.",
    });
  }
});

app.post("/api/inquiry", inquiryLimiter, async (req, res) => {
  try {
    const {
      name,
      email,
      project,
      budget,
      timeline,
      website,
    } = req.body;

    if (website) {
      return res.status(400).json({
        success: false,
        error: "Unable to submit the project inquiry.",
      });
    }

    if (
      !name ||
      typeof name !== "string" ||
      !email ||
      typeof email !== "string" ||
      !project ||
      typeof project !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "Name, email and project details are required.",
      });
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    const inquiry = {
      name: name.trim(),
      email: email.trim(),
      project: project.trim(),
      budget:
        typeof budget === "string"
          ? budget.trim()
          : "",
      timeline:
        typeof timeline === "string"
          ? timeline.trim()
          : "",
      receivedAt: new Date().toISOString(),
    };

    console.log("\n==============================");
    console.log("NEW PROJECT INQUIRY");
    console.log("==============================");
    console.log(`Name: ${inquiry.name}`);
    console.log(`Email: ${inquiry.email}`);
    console.log(`Project: ${inquiry.project}`);
    console.log(
      `Budget: ${inquiry.budget || "Not provided"}`
    );
    console.log(
      `Timeline: ${inquiry.timeline || "Not provided"}`
    );
    console.log(
      `Received: ${inquiry.receivedAt}`
    );
    console.log("==============================\n");

    const inquiryId = saveInquiry(inquiry);

    await sendInquiryEmail(inquiry);

    console.log(`Inquiry saved with ID: ${inquiryId}`);

    res.json({
      success: true,
      message:
        "Your project inquiry has been received successfully.",
    });
  } catch (error) {
    console.error("Inquiry error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to submit the project inquiry.",
    });
  }
});

app.get("/api/inquiries", requireAdmin, (_req, res) => {
  try {
    const inquiries = getInquiries();

    res.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error("Get inquiries error:", error);

    res.status(500).json({
      success: false,
      error: "Unable to retrieve inquiries.",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Manimaran AI Portfolio API running on http://localhost:${PORT}`
  );
});
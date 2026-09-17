import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { manimaranKnowledgeBase } from "./knowledgeBase";
import { sendInquiryEmail } from "./mailer";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://manimaran-portfolio-pi.vercel.app",
    ],
  })
);

app.use(express.json({ limit: "50kb" }));

// ------------------------------------
// Rate Limiting
// ------------------------------------

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

// ------------------------------------
// Groq AI
// ------------------------------------

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ------------------------------------
// Health Check
// ------------------------------------

app.get("/", (_req, res) => {
  res.json({
    message: "Manimaran AI Portfolio API is running",
  });
});

// ------------------------------------
// AI Chat
// ------------------------------------

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
        error:
          "Message is too long. Please keep it under 2000 characters.",
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

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: manimaranKnowledgeBase,
        },
        ...contents.map((item: any) => ({
          role: item.role === "model" ? "assistant" : item.role,
          content: item.parts[0].text,
        })),
      ],
    });

    const reply = response.choices[0]?.message?.content;

    if (!reply) {
      throw new Error("Groq returned an empty response");
    }

    res.json({ reply });
  } catch (error) {
    console.error("Groq API error:", error);

    res.status(500).json({
      error: "Unable to process your request",
    });
  }
});

// ------------------------------------
// Project Inquiry
// ------------------------------------

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

    // Honeypot protection
    if (website) {
      return res.status(400).json({
        success: false,
        error: "Unable to submit the project inquiry.",
      });
    }

    // Required fields
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

    // Email validation
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

    console.log("==============================\n");

    // Send email notification
    await sendInquiryEmail(inquiry);

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

// ------------------------------------
// Start Server
// ------------------------------------

app.listen(PORT, () => {
  console.log(
    `Manimaran AI Portfolio API running on http://localhost:${PORT}`
  );
});
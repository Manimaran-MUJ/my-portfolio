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

// ------------------------------------
// CORS
// ------------------------------------

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

    // ------------------------------------
    // Validate message
    // ------------------------------------

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    if (trimmedMessage.length > 2000) {
      return res.status(400).json({
        error: "Message is too long. Please keep it under 2000 characters.",
      });
    }

    // ------------------------------------
    // Validate conversation history
    // ------------------------------------

    const conversationHistory = Array.isArray(history)
      ? history
          .filter(
            (item: any) =>
              item &&
              typeof item.text === "string" &&
              item.text.trim().length > 0 &&
              item.text.length <= 2000 &&
              (item.role === "user" || item.role === "bot")
          )
          .slice(-20)
      : [];

    // ------------------------------------
    // Build Groq messages
    // ------------------------------------
    //
    // Previous messages are provided only as
    // conversational context.
    //
    // The final user message is explicitly marked
    // as the question that must be answered.
    // ------------------------------------

    const groqMessages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      {
        role: "system",
        content: `
${manimaranKnowledgeBase}

IMPORTANT CONVERSATION RULES:

1. Answer ONLY the latest user question.
2. Previous conversation messages are provided only for context.
3. Do NOT repeat, copy, summarize, or reproduce previous assistant answers unless the user explicitly asks you to.
4. Do NOT answer previous questions again.
5. If the latest question is about one specific topic, focus only on that topic.
6. Keep the answer concise and professional.
7. Use the portfolio knowledge base as the source of truth.
8. Never invent experience, employers, clients, projects, certifications, skills, or technologies.
9. If information is not available in the knowledge base, clearly say that it is not available.
10. When the user asks a follow-up question, use previous messages only to understand the context of that follow-up.
11. Do not generate numbered sections such as "1.", "2.", "3." unless they are genuinely useful for answering the latest question.
12. Do not reproduce content from an earlier response simply because it appears in the conversation history.

The message marked "LATEST USER QUESTION" is the ONLY question you should answer.
        `.trim(),
      },
    ];

    // ------------------------------------
    // Add previous conversation as context
    // ------------------------------------

    for (const item of conversationHistory) {
      groqMessages.push({
        role: item.role === "bot" ? "assistant" : "user",
        content: item.text,
      });
    }

    // ------------------------------------
    // Add latest question separately
    // ------------------------------------

    groqMessages.push({
      role: "user",
      content: `
LATEST USER QUESTION:

${trimmedMessage}

Answer only this latest question.
      `.trim(),
    });

    // ------------------------------------
    // Call Groq
    // ------------------------------------

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: groqMessages,
    });

    const reply = response.choices[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("Groq returned an empty response");
    }

    // ------------------------------------
    // Send response
    // ------------------------------------

    res.json({
      reply,
    });
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

    // ------------------------------------
    // Honeypot protection
    // ------------------------------------

    if (website) {
      return res.status(400).json({
        success: false,
        error: "Unable to submit the project inquiry.",
      });
    }

    // ------------------------------------
    // Required fields
    // ------------------------------------

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

    // ------------------------------------
    // Email validation
    // ------------------------------------

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address.",
      });
    }

    // ------------------------------------
    // Prepare inquiry
    // ------------------------------------

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

    // ------------------------------------
    // Log inquiry
    // ------------------------------------

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

    // ------------------------------------
    // Send email notification
    // ------------------------------------

    await sendInquiryEmail(inquiry);

    // ------------------------------------
    // Success response
    // ------------------------------------

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
# AI-Powered Personal Portfolio

A modern personal portfolio website with an integrated AI assistant and project inquiry system.

## Features

- Responsive personal portfolio
- Professional profile and experience showcase
- Skills and technology overview
- Project portfolio
- AI-powered portfolio assistant
- Gemini API integration
- Context-aware chatbot using a custom knowledge base
- Project inquiry form
- Email notification for new inquiries
- SQLite database for inquiry storage
- Protected admin dashboard
- Rate limiting for chatbot and inquiry APIs
- Honeypot protection for inquiry submissions

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS
- React Markdown

### Backend

- Node.js
- Express
- TypeScript
- Gemini API
- Nodemailer
- SQLite
- Express Session
- Express Rate Limit

## Architecture

```text
User
  │
  ▼
React Portfolio
  │
  ├── AI Chatbot ───────► Express API ───────► Gemini API
  │
  └── Project Inquiry ─► Express API
                              │
                              ├── SQLite
                              │
                              └── Email Notification
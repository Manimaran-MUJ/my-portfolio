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
                              ▼
                       Email Notification
                              │
                              ▼
                         Your Gmail
```

## Project Structure

```text
my-portfolio/
│
├── backend/
│   ├── src/
│   │   ├── knowledgeBase.ts
│   │   ├── mailer.ts
│   │   └── server.ts
│   │
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone https://github.com/Manimaran-MUJ/my-portfolio.git
cd my-portfolio
```

## Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
GEMINI_API_KEY=your_gemini_api_key

EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password
EMAIL_TO=your_destination_email
```

Start the backend development server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

## Environment Variables

### Backend

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Gemini API authentication |
| `EMAIL_USER` | Gmail account used to send inquiry notifications |
| `EMAIL_APP_PASSWORD` | Gmail App Password |
| `EMAIL_TO` | Email address receiving project inquiries |

### Frontend

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API URL |

**Never commit `.env` files to GitHub.**

## AI Assistant

The portfolio includes an AI assistant that can answer questions about:

- Professional experience
- Technical skills
- Projects
- Automation experience
- Education
- Certifications
- Freelance services

The AI assistant uses a dedicated knowledge base to keep responses aligned with the portfolio owner's actual experience.

## Project Inquiry

Visitors can use the **Hire Me** section to submit a project inquiry.

The inquiry includes:

- Name
- Email
- Project requirement
- Budget
- Timeline

The backend validates the submission and sends an email notification.

No inquiry database or admin dashboard is currently used.

## Security

Sensitive configuration is stored using environment variables.

The repository does not contain:

- API keys
- Email passwords
- Environment files
- Node modules
- Local database files

Additional protections include:

- API rate limiting
- Input validation
- Honeypot protection for project inquiries
- Server-side API key handling

## Development Commands

### Backend

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

### Frontend

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build the frontend for production:

```bash
npm run build
```

## Current Status

The portfolio is ready for production deployment.

Future enhancements may include:

- Persistent inquiry database
- Admin dashboard
- Inquiry management
- Lead tracking
- Additional AI capabilities
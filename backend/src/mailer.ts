import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendInquiryEmail = async (inquiry: {
  name: string;
  email: string;
  project: string;
  budget?: string;
  timeline?: string;
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    replyTo: inquiry.email,

    subject: `New Project Inquiry — ${inquiry.name}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: 0 auto;
        background: #f6f8fc;
        padding: 30px;
      ">

        <div style="
          background: #172033;
          color: white;
          padding: 24px;
          border-radius: 12px 12px 0 0;
        ">
          <h2 style="margin: 0 0 8px;">
            New Project Inquiry
          </h2>

          <p style="
            margin: 0;
            color: #cbd5e1;
          ">
            Someone is interested in working with you.
          </p>
        </div>

        <div style="
          background: white;
          padding: 24px;
          border-radius: 0 0 12px 12px;
        ">

          <h3 style="margin-top: 0;">
            Client Details
          </h3>

          <p>
            <strong>Name:</strong>
            ${inquiry.name}
          </p>

          <p>
            <strong>Email:</strong>
            <a href="mailto:${inquiry.email}">
              ${inquiry.email}
            </a>
          </p>

          <hr style="
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 20px 0;
          " />

          <h3>
            Project Requirement
          </h3>

          <p style="
            white-space: pre-line;
            line-height: 1.6;
          ">
            ${inquiry.project}
          </p>

          <h3>
            Project Details
          </h3>

          <p>
            <strong>Budget:</strong>
            ${inquiry.budget || "Not provided"}
          </p>

          <p>
            <strong>Timeline:</strong>
            ${inquiry.timeline || "Not provided"}
          </p>

          <div style="
            margin-top: 25px;
            padding: 16px;
            background: #f1f5f9;
            border-radius: 8px;
          ">
            <strong>Next Step</strong>

            <p style="margin-bottom: 0;">
              Reply to this email to contact the client directly.
            </p>
          </div>

        </div>

        <p style="
          text-align: center;
          color: #64748b;
          font-size: 12px;
          margin-top: 20px;
        ">
          Manimaran AI Portfolio
        </p>

      </div>
    `,
  });
};
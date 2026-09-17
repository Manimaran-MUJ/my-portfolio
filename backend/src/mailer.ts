import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInquiryEmail = async (inquiry: {
  name: string;
  email: string;
  project: string;
  budget?: string;
  timeline?: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: "Manimaran Portfolio <onboarding@resend.dev>",
    to: ["manimaran.techie@gmail.com"],
    replyTo: inquiry.email,
    subject: `New Project Inquiry — ${inquiry.name}`,
    html: `
      <h2>New Project Inquiry</h2>

      <p><strong>Name:</strong> ${inquiry.name}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>

      <p><strong>Project Requirement:</strong></p>
      <p>${inquiry.project}</p>

      <p><strong>Budget:</strong> ${
        inquiry.budget || "Not provided"
      }</p>

      <p><strong>Timeline:</strong> ${
        inquiry.timeline || "Not provided"
      }</p>

      <hr>

      <p>
        This inquiry was submitted through the
        <strong>Manimaran Annamalai portfolio</strong>.
      </p>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message);
  }

  console.log("Inquiry email sent:", data?.id);
};
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_SERVER!,
  port: Number(process.env.SMTP_PORT!),
  secure: false, // utiliser STARTTLS sur port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

type MailOptions = {
  email: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendMail(options: MailOptions) {
  const mail = {
    from: process.env.SMTP_USER || "",
    to: process.env.MESSAGECRAFT_EMAIL || "",
    subject: options.subject,
    text: options.text,
    html: options.html,
    reply_to: options.email
  };
  console.log("Attempting to send email with payload:", mail);
  try {
    const result = await mailer.sendMail(mail)
    console.log("Resend API response:", result);
    return result;
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    throw error;
  }
}
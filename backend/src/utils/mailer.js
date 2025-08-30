import nodemailer from "nodemailer";

export function createTransportFromEnv() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 465),
    secure: String(SMTP_SECURE || "false") === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendMail({ to, subject, html, attachments }) {
  const { SENDER_EMAIL, SENDER_NAME } = process.env;
  const transporter = createTransportFromEnv();

  return transporter.sendMail({
    from: { address: SENDER_EMAIL, name: SENDER_NAME || "Mailer" },
    to,
    subject,
    html,
    attachments, // optional
  });
}

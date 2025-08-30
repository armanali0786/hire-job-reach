import { Router } from "express";
import pLimit from "p-limit";
import Email from "../models/Email.js";
import { sendMail } from "../utils/mailer.js";
import nodemailer from "nodemailer";  // <-- ADD THIS
import path from "path";          // 👈 FIX: add this
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();



router.post("/send", async (req, res, next) => {
  try {
    const { pdfId, subject, html, filter = "pending" } = req.body;
    if (!pdfId || !subject || !html)
      return res
        .status(400)
        .json({ error: "pdfId, subject, html are required" });

    const query = { pdfId };
    if (filter === "pending") query.status = "pending";

    const emails = await Email.find(query).lean();
    const limit = pLimit(Number(process.env.MAX_CONCURRENCY || 5));

    let sent = 0,
      failed = 0;

    await Promise.all(
      emails.map((e) =>
        limit(async () => {
          try {
            await sendMail({ to: e.email, subject, html });
            await Email.updateOne(
              { _id: e._id },
              { $set: { status: "sent", sentAt: new Date(), error: null } }
            );
            sent += 1;
          } catch (err) {
            await Email.updateOne(
              { _id: e._id },
              { $set: { status: "failed", error: err.message } }
            );
            failed += 1;
          }
        })
      )
    );

    res.json({ total: emails.length, sent, failed });
  } catch (err) {
    next(err);
  }
});

router.post("/send-mail", async (req, res) => {
  const { email, subject, html } = req.body;

  try {
    // const pdf = await PdfFile.findById(pdfId);
    // if (!pdf) return res.status(404).json({ error: "PDF not found" });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // await transporter.sendMail({
    //   from: process.env.SMTP_USER,
    //   to: email,
    //   subject,
    //   html,
    //   // attachments: [
    //   //   {
    //   //     filename: pdf.name,
    //   //     path: pdf.path, // where you stored PDF
    //   //   },
    //   // ],
    // });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html,
      attachments: [
        {
          filename: "ArmanAliResume.pdf",
          path: path.join(__dirname, "../assets/ArmanAliResume.pdf"), // 👈 backend local file
          contentType: "application/pdf",
        },
      ],
    });


    res.json({ success: true, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {   // ✅ only "/"
  try {
    const emails = await Email.find();
    res.json(emails);
  } catch (err) {
    console.error("Error fetching emails:", err);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;

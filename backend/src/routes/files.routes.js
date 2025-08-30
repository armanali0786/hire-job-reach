import { Router } from "express";
import multer from "multer";
// import pdfParse from "pdf-parse";
// import { PDFDocument } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

import PdfFile from "../models/PdfFile.js";
import Email from "../models/Email.js";
const router = Router();

// Use memory storage so we can read the buffer directly
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// router.post("/upload", upload.single("file"), async (req, res, next) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

//     if (req.file.mimetype !== "application/pdf") {
//       return res.status(400).json({ error: "Only PDF files are allowed" });
//     }

//     const pdfDoc = await PdfFile.create({
//       originalName: req.file.originalname,
//       mimeType: req.file.mimetype,
//       size: req.file.size,
//       uploadedBy: req.user?.email || "anonymous",
//     });

//     // ✅ Use multer's in-memory buffer
//     const dataBuffer = req.file.buffer;
//     const data = await pdfParse(dataBuffer);

//     const found = (data.text.match(emailRegex) || []).map((e) =>
//       e.trim().toLowerCase()
//     );
//     const unique = Array.from(new Set(found));

//     const ops = unique.map((em) => ({
//       updateOne: {
//         filter: { pdfId: pdfDoc._id, email: em },
//         update: { $setOnInsert: { status: "pending" } },
//         upsert: true,
//       },
//     }));

//     if (ops.length) await Email.bulkWrite(ops);

//     const count = await Email.countDocuments({ pdfId: pdfDoc._id });

//     res.json({
//       pdf: { id: pdfDoc._id, name: pdfDoc.originalName, count },
//       emails: unique,
//     });
//   } catch (err) {
//     next(err);
//   }
// });



// router.post("/upload", upload.single("file"), async (req, res, next) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const pdfDoc = await PDFDocument.load(req.file.buffer);
//     const pages = pdfDoc.getPages();
//     let text = "";

//     for (const page of pages) {
//       text += page.getTextContent ? await page.getTextContent() : "";
//     }

//     const found = (text.match(emailRegex) || []).map((e) => e.toLowerCase());
//     const unique = [...new Set(found)];

//     const pdfEntry = await PdfFile.create({
//       originalName: req.file.originalname,
//       mimeType: req.file.mimetype,
//       size: req.file.size,
//     });

//     console.log("pdfEntry", pdfEntry)

//     const ops = unique.map((em) => ({
//       updateOne: {
//         filter: { pdfId: pdfEntry._id, email: em },
//         update: { $setOnInsert: { status: "pending" } },
//         upsert: true,
//       },
//     }));
//     console.log("unique ops::", ops);


//     if (ops.length) await Email.bulkWrite(ops);

//     console.log("unique Emails::", unique);

//     res.json({ pdf: pdfEntry, emails: unique });
//   } catch (err) {
//     next(err);
//   }
// });
 
router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const pdf = await getDocument({ data: new Uint8Array(req.file.buffer) }).promise;
    let text = "";

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }

    const found = (text.match(emailRegex) || []).map((e) => e.toLowerCase());
    const unique = [...new Set(found)];

    const pdfEntry = await PdfFile.create({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    const ops = unique.map((em) => ({
      updateOne: {
        filter: { pdfId: pdfEntry._id, email: em },
        update: { $setOnInsert: { status: "pending" } },
        upsert: true,
      },
    }));

    if (ops.length) await Email.bulkWrite(ops);

    res.json({ pdf: pdfEntry, emails: unique });
  } catch (err) {
    next(err);
  }
});

router.get("/:pdfId/emails", async (req, res, next) => {
  try {
    const { pdfId } = req.params;
    const list = await Email.find({ pdfId }).sort({ email: 1 });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

export default router;

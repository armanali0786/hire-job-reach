import mongoose from "mongoose";

const PdfFileSchema = new mongoose.Schema(
  {
    originalName: String,
    mimeType: String,
    size: Number,
    uploadedBy: { type: String, default: "anonymous" },
  },
  { timestamps: true }
);

export default mongoose.model("PdfFile", PdfFileSchema);

import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema(
  {
    pdfId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PdfFile",
      index: true,
    },
    email: { type: String, index: true },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    error: String,
    sentAt: Date,
  },
  { timestamps: true }
);

EmailSchema.index({ pdfId: 1, email: 1 }, { unique: true });

export default mongoose.model("Email", EmailSchema);

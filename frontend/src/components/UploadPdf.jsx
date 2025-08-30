import React, { useState } from "react";
import { uploadPdf } from "../api";

export default function UploadPdf({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    setError("");
    if (!file) return setError("Please select a PDF");
    if (file.type !== "application/pdf") return setError("Only PDF allowed");
    setLoading(true);
    try {
      const res = await uploadPdf(file);
      console.log("all Enails in frontend code:::", res.emails)
      onUploaded(res.pdf, res.emails);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <h3> Upload PDF</h3>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{ marginLeft: 8 }}
      >
        {loading ? "Uploading…" : "Upload"}
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}

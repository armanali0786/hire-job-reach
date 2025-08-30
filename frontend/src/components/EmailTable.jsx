

import React, { useState,useEffect } from "react";
import { getAllEmails, sendSingleEmail } from "../api";

export default function EmailTable({ emails, resumePdf, subject, html, setEmails }) {
  const [sending, setSending] = useState(null);
  const [status, setStatus] = useState({}); // per-email status

useEffect(() => {
  const loadEmails = async () => {
    try {
      const list = await getAllEmails();
      console.log("Fetched emails:", list); // debug
      setEmails(list);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    }
  };
  loadEmails();
}, []);



  // if (!emails?.length) return null;



  const handleSend = async (email,pdfId) => {
    setSending(email);
    try {
      await sendSingleEmail({ email, subject, html, pdfId: pdfId, resumePdf  });
      setStatus((s) => ({ ...s, [email]: "✅ Sent" }));
    }
    //  catch (err) {
    //   setStatus((s) => ({ ...s, [email]: "❌ Failed" }));
    // } 
    finally {
      setSending(null);
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
      <h3>Extracted Emails ({emails.length})</h3>
      <div
        style={{ maxHeight: 400, overflow: "auto", border: "1px solid #eee" }}
      >
        <table width="100%">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Email</th>
              <th>Action</th>
              <th>Send</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((e) => {
              const email = e.email || e;
              return (
                <tr key={email}>
                  <td>{email}</td>
                  <td>{e.status}</td>
                  <td>
                    <button
                      onClick={() => handleSend(email, e.pdfId)}
                      disabled={sending === email}
                    >
                      {sending === email ? "Sending…" : "Send"}
                    </button>
                  </td>
                  {/* <td>{status[email]}</td> */}
                   <td className="px-4 py-3 font-semibold">
                    <span
                      className={`${
                        status[email]?.includes("✅")
                          ? "text-green-600"
                          : status[email]?.includes("❌")
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {status[email] || "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


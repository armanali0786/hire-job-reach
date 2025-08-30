// import React, { useState } from "react";
// import { sendEmails } from "../api";

// export default function TemplateEditor({ pdf, onSent }) {
//   const [subject, setSubject] = useState("Hello from Our Team");
//   const [html, setHtml] = useState(`
// <div style="font-family:Arial,sans-serif">
// <p>Hi there,</p>
// <p>This is a test message sent via our PDF mailer app.</p>
// <p>Regards,<br/>Team</p>
// </div>
// `);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   if (!pdf?.id) return null;

//   const handleSend = async () => {
//     setMsg("");
//     setLoading(true);
//     try {
//       const res = await sendEmails({ pdfId: pdf.id, subject, html });
//       setMsg(`Sent ${res.sent} / ${res.total} (failed: ${res.failed})`);
//       onSent?.(res);
//     } catch (e) {
//       setMsg(e.response?.data?.error || e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
//       <h3>3) Compose & Send</h3>
//       <p>
//         <b>PDF:</b> {pdf.name}
//       </p>
//       <div style={{ display: "grid", gap: 8 }}>
//         <input
//           type="text"
//           placeholder="Subject"
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//           style={{ padding: 8 }}
//         />
//         <textarea
//           rows={10}
//           value={html}
//           onChange={(e) => setHtml(e.target.value)}
//           style={{ padding: 8, fontFamily: "monospace" }}
//         />
//       </div>
//       <button onClick={handleSend} disabled={loading} style={{ marginTop: 8 }}>
//         {loading ? "Sending…" : "Send Emails"}
//       </button>
//       {msg && <p>{msg}</p>}
//       <small>
//         Emails are sent from the SMTP account configured on the server.
//       </small>
//     </div>
//   );
// }


import React, { useState } from "react";
import { sendEmails } from "../api";

export default function TemplateEditor({ pdf, onSent }) {
  const [subject, setSubject] = useState("Application for Full Stack Developer");
  const [html, setHtml] = useState(`
<div style="font-family:Arial,sans-serif; line-height:1.6; color:#333;">
  <p>Dear Hiring Team,</p>

  <p>
    I hope you're doing well. I came across your opening for a 
    <b>Full Stack Developer</b> and couldn't resist reaching out to express my interest.
  </p>

  <p>
    With over 2+ years of experience building full-stack applications using 
    <b>React.js, Node.js, Next.js, MongoDB, and MySQL</b>.
  </p>

  <p>
    I'm confident that my skills and enthusiasm for building modern web applications would 
    make a meaningful impact on your team.
  </p>

  <p>
    I'd love the chance to connect and discuss how I can contribute to your projects. 
    Please find my resume attached for your review.
  </p>

  <p>
    Thank you for considering my application. I look forward to the opportunity to speak further.
  </p>

  <p>
    Warm regards,<br/>
    Arman Ali
  </p>
</div>
`);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  if (!pdf?.id) return null;

  const handleSend = async () => {
    setMsg("");
    setLoading(true);
    try {
      const res = await sendEmails({ pdfId: pdf.id, subject, html });
      setMsg(`Sent ${res.sent} / ${res.total} (failed: ${res.failed})`);
      onSent?.(res);
    } catch (e) {
      setMsg(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
      <h3> Compose & Send</h3>
      <p>
        <b>PDF:</b> {pdf.name}
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ padding: 8 }}
        />
        <textarea
          rows={15}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          style={{ padding: 8, fontFamily: "monospace" }}
        />
      </div>
      <button onClick={handleSend} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Sending…" : "Send Emails"}
      </button>
      {msg && <p>{msg}</p>}
      <small>
        Emails are sent from the SMTP account configured on the server.
      </small>
    </div>
  );
}

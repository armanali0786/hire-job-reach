import { useEffect, useState } from "react";
import "./App.css";
import UploadPdf from './components/UploadPdf';
import EmailTable from './components/EmailTable';
import TemplateEditor from './components/TemplateEditor';
import { fetchEmails } from './api';
import ResumePdf from './assets/ArmanAliResume.pdf'

function App() {
  const [pdf, setPdf] = useState(null);
  const [emails, setEmails] = useState([]);
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
  const handleUploaded = async (extractedList) => {
    // Prefer server copy (deduped & stored) but show immediate list too
    setEmails(
      extractedList.map((e) => (typeof e === "string" ? { email: e } : e))
    );
  };

  useEffect(() => {
    const load = async () => {
      if (!pdf?.id) return;
      const list = await fetchEmails(pdf.id);
      setEmails(list);
    };
    load();
  }, [pdf?.id]);

  return (
    <>
      <div
        style={{
          maxWidth: 900,
          margin: "24px auto",
          fontFamily: "Inter, system-ui, Arial",
        }}
      >
        <h1>PDF → Extract Emails → Send Mail</h1>
        <p style={{ color: "#666" }}>
          Upload a PDF, we extract emails on the server, then send a templated
          email from your configured SMTP account.
        </p>

        <UploadPdf onUploaded={handleUploaded} />
        <span>Select Subject For Application:</span>
         <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-200"
            value={subject}   // controlled component
            onChange={(e) => setSubject(`Application for ${e.target.value}`)}
          >
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Web Developer">Web Developer</option>
            <option value="Software Developer">Software Developer</option>
            <option value="ReactJS Developer">ReactJS Developer</option>
          </select>

        {/* <EmailTable emails={emails} /> */}
        <EmailTable emails={emails} subject={subject} html={html} setEmails={setEmails} ResumePdf={ResumePdf} />

        <TemplateEditor ResumePdf={ResumePdf} onSent={() => {}} />
      </div>
    </>
  );
}

export default App;

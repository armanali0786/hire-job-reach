import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE });

export async function uploadPdf(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/files/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function fetchEmails(pdfId) {
  const { data } = await api.get(`/files/${pdfId}/emails`);
  return data;
}

export async function sendEmails({ pdfId, subject, html }) {
  const { data } = await api.post("/emails/send", {
    pdfId,
    subject,
    html,
    filter: "pending",
  });
  return data;
}


export async function sendSingleEmail({ email, subject, html, pdfId }) {
  const res = await axios.post("/api/emails/send-mail", {
    email,
    subject,
    html,
    pdfId,
  });
  return res.data;
}

// export async function getAllEmails(pdfId) {
//   const res = await axios.get("/api/emails", { params: { pdfId } });
//   return res.data;
// }


export const getAllEmails = async () => {
  console.log("calling api")
  const res = await axios.get("/api/emails");
  console.log("calling api res data", res.data);
  return res.data;
};
Hire Job Reach is a job application mailer app that helps job seekers efficiently send resumes to multiple recruiters or companies in bulk.

It provides an easy way to manage email lists, attach resumes, customize subject & HTML body, and track sending status with proper rate control.

🚀 Features

✅ Bulk Email Sending – Send applications to multiple recruiters at once

✅ Single Email Option – Send to one recruiter directly from the table

✅ Custom Email Templates – Supports subject and HTML content

✅ Resume Attachment – Automatically attaches your PDF resume

✅ Email Tracking – Shows per-email status (Sent ✅ / Failed ❌)

✅ Full-Stack App – React (frontend) + Node.js/Express (backend) + MongoDB


🛠️ Tech Stack

Frontend: React 18 , Tailwind CSS , Axios

Backend: Node.js + Express , Nodemailer (SMTP with Gmail or custom provider), Multer (for resume uploads)

Database: MongoDB (Atlas)



hire-job-reach/
│── backend/             # Express server + Email logic
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Mailer utility
│   └── server.js        # Entry point
│
│── frontend/            # React application
│   ├── src/
│   │   ├── components/  # UI Components
│   │   ├── pages/       # Pages (EmailTable, Dashboard, etc.)
│   │   └── api.js       # API calls
│   └── vite.config.js
│
└── README.md            # Project description

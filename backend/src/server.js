import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import filesRoutes from "./routes/files.routes.js";
import emailsRoutes from "./routes/emails.routes.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);

// Basic rate limiter for API abuse protection
const limiter = rateLimit({ windowMs: 60 * 1000, max: 200 });
app.use(limiter);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/files", filesRoutes);
app.use("/api/emails", emailsRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`🚀 Server listening on :${PORT}`))
  )
  .catch((e) => {
    console.error("Mongo connect failed", e);
    process.exit(1);
  });

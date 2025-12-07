import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  PORT = 8080,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  TO_EMAIL,
  FROM_NAME
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === "true",
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

app.get("/", (_, res) => res.send("Yealem backend OK"));

app.post("/submit", async (req, res) => {
  const data = req.body || {};
  const pretty = Object.entries(data).map(([k,v]) => `${k}: ${v || ""}`).join("\n");

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${SMTP_USER}>`,
      to: TO_EMAIL,
      subject: `New Yealem Quote Request - ${data.name || "Customer"}`,
      text: pretty
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "email_failed" });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const {
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

  const data = req.body || {};
  const pretty = Object.entries(data)
    .map(([k, v]) => `${k}: ${v || ""}`)
    .join("\n");

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${SMTP_USER}>`,
      to: TO_EMAIL,
      subject: `New Yealem Quote Request - ${data.name || "Customer"}`,
      text: pretty
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "email_failed" });
  }
}

import { Resend } from "resend";

export async function sendEmailVerification(to: string, verifyUrl: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "OdontoX <no-reply@odontox.io>";
  if (!key) return;
  const resend = new Resend(key);
  await resend.emails.send({
    from,
    to,
    subject: "Verify your email",
    html: `<p>Confirm your email for OdontoX.</p><p><a href="${verifyUrl}">Verify Email</a></p>`
  });
}


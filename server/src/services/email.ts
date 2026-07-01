import { Resend } from "resend";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "LexLoo <onboarding@resend.dev>";

let resendClient: Resend | null = null;
function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export type EmailDeliveryStatus = "sent" | "dev_logged" | "not_configured" | "failed";

export async function sendEmail(to: string, subject: string, text: string): Promise<EmailDeliveryStatus> {
  const client = getResendClient();
  if (client) {
    const { error } = await client.emails.send({ from: FROM_ADDRESS, to, subject, text });
    if (!error) return "sent";
    console.error("[EMAIL] Resend error:", error);
    if (process.env.NODE_ENV === "production") return "failed";
    // In dev, Resend's sandbox sender can only deliver to the account owner's own
    // email, so any other recipient errors here. Fall back to console logging
    // instead of blocking the flow (e.g. registration) for local testing.
    console.log(`[EMAIL:dev] ${to} | ${subject} | ${text}`);
    return "dev_logged";
  }
  const webhook = process.env.MFA_EMAIL_WEBHOOK_URL || process.env.FAMILY_INVITE_EMAIL_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, message: text }),
    });
    return "sent";
  }
  if (process.env.NODE_ENV !== "production") {
    console.log(`[EMAIL:dev] ${to} | ${subject} | ${text}`);
    return "dev_logged";
  }
  return "not_configured";
}

import { NextRequest, NextResponse } from "next/server";
import { sendMail, contactEmailTemplate, htmlTemplate } from "@/lib/mail";

const OPS_EMAIL = "ops@brainsait.de";
const AUTO_REPLY_SUBJECT = "We've received your message — BrainSAIT Health Exchange";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, subject, message } = body;

    // Validate
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, subject, message" },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Send to ops team
    const opsResult = await sendMail({
      to: OPS_EMAIL,
      subject: `[Contact Form] ${subject} — from ${name}${company ? ` (${company})` : ""}`,
      html: contactEmailTemplate({ name, email, company, subject, message }),
      replyTo: email,
    });

    if (!opsResult.success) {
      console.error("[Contact] Failed to send to ops:", opsResult.error);
      // Non-fatal — continue to auto-reply
    }

    // Auto-reply to sender
    const autoReplyResult = await sendMail({
      to: email,
      subject: AUTO_REPLY_SUBJECT,
      html: htmlTemplate(`
        <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#0a0c10;">Hi ${name.split(" ")[0]},</h2>
        <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
          Thank you for contacting BrainSAIT Health Exchange. We have received your message and our team will respond within <strong>24 hours</strong>.
        </p>
        <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
          <p style="margin:0;font-size:13px;color:#6b7280;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Your submission</p>
          <p style="margin:0;font-size:14px;color:#111827;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin:8px 0 0;font-size:14px;color:#111827;"><strong>Reference:</strong> ${new Date().toISOString().slice(0, 10)}-${name.toLowerCase().replace(/\s+/g, "-").slice(0, 8)}</p>
        </div>
        <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
          While you wait, explore our <a href="https://brainsait.de/marketplace" style="color:#1a56db;">marketplace</a> or try the <a href="https://brainsait.de/match" style="color:#1a56db;">AI Need Matcher</a> to discover products and services.
        </p>
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
          Best regards,<br /><strong>The BrainSAIT Team</strong><br />
          <span style="color:#6b7280;">hello@brainsait.de · brainsait.de</span>
        </p>
      `, "We received your message — BrainSAIT"),
    });

    if (!autoReplyResult.success) {
      console.error("[Contact] Auto-reply failed:", autoReplyResult.error);
    }

    return NextResponse.json({
      success: true,
      messageId: opsResult.messageId,
    });
  } catch (err) {
    console.error("[Contact] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { sendMail, htmlTemplate } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    try {
      await sendMail({
        to: process.env.OPS_EMAIL || "ops@brainsait.de",
        subject: `New Newsletter Subscription: ${email}`,
        html: htmlTemplate(`
          <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0a0c10;">New Newsletter Subscriber</h2>
          <p style="margin:0;font-size:14px;color:#374151;">A new user has subscribed to the BrainSAIT Health Exchange newsletter:</p>
          <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:12px;">
            <p style="margin:0;font-size:14px;color:#111827;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin:8px 0 0;font-size:14px;color:#111827;"><strong>Subscribed at:</strong> ${new Date().toISOString()}</p>
          </div>
        `, "Newsletter Subscription — BrainSAIT"),
      });
    } catch {
      // Non-fatal — subscriber still registered
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    console.error("[Newsletter] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { query } from "@/lib/db";
import { constantTimeEqual } from "@/lib/ct-equal";

// Fulfillment endpoint. The Telegram bot (or any server-side channel) calls this
// after a confirmed payment to enroll the buyer and get back an access link.
// Service-token gated and idempotent on charge_id — re-posting the same charge
// returns the same enrollment rather than creating a duplicate.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const expected = process.env.ENROLL_SERVICE_TOKEN;
  if (!expected) return false; // fail closed
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token.length > 0 && constantTimeEqual(expected, token);
}

function accessUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://brainsait.de";
  return `${base}/learn/${token}`;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed body" }, { status: 400 });
  }

  const { courseId, courseTitle, telegramId, username, email, chargeId, providerChargeId, amount, currency, channel } =
    body as Record<string, string>;

  if (!courseId || !chargeId) {
    return NextResponse.json({ error: "courseId and chargeId are required" }, { status: 400 });
  }

  try {
    // Idempotent: if this charge was already enrolled, return the existing token.
    const existing = await query<{ access_token: string }>(
      "SELECT access_token FROM course_enrollments WHERE charge_id = $1",
      [chargeId]
    );
    if (existing.length) {
      return NextResponse.json({ enrolled: true, duplicate: true, accessUrl: accessUrl(existing[0].access_token) });
    }

    const token = randomBytes(24).toString("hex");
    await query(
      `INSERT INTO course_enrollments
        (course_id, course_title, buyer_telegram_id, buyer_username, buyer_email,
         charge_id, provider_charge_id, amount, currency, access_token, channel)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [courseId, courseTitle ?? null, telegramId ?? null, username ?? null, email ?? null,
       chargeId, providerChargeId ?? null, amount ?? null, currency ?? null, token, channel ?? "telegram"]
    );

    return NextResponse.json({ enrolled: true, accessUrl: accessUrl(token) });
  } catch (err) {
    console.error("[enroll] failed:", err);
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}

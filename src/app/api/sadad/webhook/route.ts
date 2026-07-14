import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getGateway } from "@/lib/backend";

// SADAD sends webhook notifications when payments are confirmed.
// This endpoint receives those callbacks and updates the order status.
//
// This endpoint books money. It fails closed: if the shared secret is not
// configured, every callback is rejected rather than trusted. Accepting an
// unverified "CONFIRMED" is worse than dropping a real one, because a dropped
// payment is still recoverable through the admin verification flow.

// timingSafeEqual needs the node runtime, not edge.
export const runtime = "nodejs";

// Reject callbacks whose timestamp is outside this window, so a signed payload
// captured off the wire cannot be replayed indefinitely.
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

function signaturesMatch(expected: string, provided: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(provided, "utf8");
  // timingSafeEqual throws on length mismatch, which would itself leak length.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.SADAD_WEBHOOK_SECRET;
    const billerCode = process.env.SADAD_BILLER_CODE;

    if (!webhookSecret || !billerCode) {
      // Do not degrade to "trust everything" when misconfigured.
      console.error(
        "[SADAD Webhook] Rejected: SADAD_WEBHOOK_SECRET and/or SADAD_BILLER_CODE not configured. " +
          "Payment callbacks cannot be verified and are being refused.",
      );
      return NextResponse.json(
        { error: "Webhook verification unavailable" },
        { status: 503 },
      );
    }

    // The signature covers the exact bytes SADAD signed, so read the raw body
    // and parse it ourselves. Re-serializing parsed JSON would change the bytes
    // (key order, spacing) and break verification.
    const raw = await request.text();

    const provided =
      request.headers.get("x-sadad-signature") ??
      request.headers.get("x-signature") ??
      "";

    const expected = createHmac("sha256", webhookSecret).update(raw).digest("hex");

    if (!provided || !signaturesMatch(expected, provided)) {
      console.warn("[SADAD Webhook] Rejected: signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
    }

    const { billCode, accountNumber, paymentRef, amount, currency, status, timestamp } =
      body as Record<string, string>;

    if (billCode !== billerCode) {
      return NextResponse.json({ error: "Unknown biller code" }, { status: 400 });
    }

    const sentAt = Date.parse(String(timestamp));
    if (Number.isNaN(sentAt) || Math.abs(Date.now() - sentAt) > MAX_CLOCK_SKEW_MS) {
      console.warn("[SADAD Webhook] Rejected: timestamp outside replay window");
      return NextResponse.json({ error: "Stale or invalid timestamp" }, { status: 400 });
    }

    const paymentStatus =
      status === "CONFIRMED" ? "verified" : status === "REJECTED" ? "rejected" : "pending";

    try {
      const gw = getGateway();
      const result = await gw.post("/v1/sadad/webhook", {
        billCode,
        accountNumber,
        paymentRef,
        amount,
        currency,
        status: paymentStatus,
        timestamp,
        source: "sadad_webhook",
      });

      return NextResponse.json({ received: true, processed: true, result });
    } catch (gwErr) {
      // Gateway unavailable — the callback was authentic, so report it as
      // retryable rather than dropping it.
      console.error("[SADAD Webhook] Gateway error:", gwErr);

      return NextResponse.json({
        received: true,
        processed: false,
        error: "Downstream processing unavailable",
        retry: true,
      });
    }
  } catch (err) {
    console.error("[SADAD Webhook] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET for health checks
export async function GET() {
  return NextResponse.json({
    endpoint: "sadad_webhook",
    status: "listening",
    provider: "stc_pay",
    verification: process.env.SADAD_WEBHOOK_SECRET ? "enforced" : "unconfigured",
  });
}

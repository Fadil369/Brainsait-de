import { createHmac, timingSafeEqual } from "node:crypto";

// Verify a SADAD webhook signature: HMAC-SHA256 over the exact raw request body,
// compared in constant time. Uses node:crypto, so callers must run on the Node
// runtime (not Edge). Returns false on any mismatch — never throws.
export function verifySadadSignature(rawBody: string, providedHex: string, secret: string): boolean {
  if (!secret || !providedHex) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(providedHex, "utf8");
  // timingSafeEqual throws on length mismatch, which would itself leak length.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

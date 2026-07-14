import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { constantTimeEqual } from "./ct-equal";
import { verifySadadSignature } from "./sadad-signature";

describe("constantTimeEqual", () => {
  it("returns true for identical strings", () => {
    expect(constantTimeEqual("s3cr3t-token", "s3cr3t-token")).toBe(true);
  });

  it("returns false for different strings of equal length", () => {
    expect(constantTimeEqual("s3cr3t-token", "s3cr3t-toXen")).toBe(false);
  });

  it("returns false for different lengths (no throw, no leak)", () => {
    expect(constantTimeEqual("short", "much-longer-value")).toBe(false);
  });

  it("returns true for two empty strings", () => {
    expect(constantTimeEqual("", "")).toBe(true);
  });
});

describe("verifySadadSignature", () => {
  const secret = "webhook-shared-secret";
  const body = JSON.stringify({ billCode: "207", status: "CONFIRMED", amount: 449900 });
  const sign = (b: string, s = secret) => createHmac("sha256", s).update(b).digest("hex");

  it("accepts a correct signature over the exact body", () => {
    expect(verifySadadSignature(body, sign(body), secret)).toBe(true);
  });

  it("rejects a tampered body (amount changed after signing)", () => {
    const signature = sign(body);
    const tampered = JSON.stringify({ billCode: "207", status: "CONFIRMED", amount: 1 });
    expect(verifySadadSignature(tampered, signature, secret)).toBe(false);
  });

  it("rejects a signature made with the wrong secret", () => {
    expect(verifySadadSignature(body, sign(body, "attacker-guess"), secret)).toBe(false);
  });

  it("rejects an empty or missing signature", () => {
    expect(verifySadadSignature(body, "", secret)).toBe(false);
  });

  it("rejects when no secret is configured (fail closed)", () => {
    expect(verifySadadSignature(body, sign(body), "")).toBe(false);
  });

  it("rejects a non-hex / wrong-length signature without throwing", () => {
    expect(verifySadadSignature(body, "not-a-real-signature", secret)).toBe(false);
  });
});

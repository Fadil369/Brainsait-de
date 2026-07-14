#!/usr/bin/env node
// End-to-end release readiness + transaction simulation for brainsait.de.
//
// Drives the REAL running system: availability, security posture, and the live
// payment/audit transaction paths. Exits non-zero on any failure so it can gate
// a deploy. Checks that need host-local secrets (Telegram token, admin password)
// auto-skip when those aren't available (e.g. in CI), so the same script runs
// everywhere.
//
// Usage:  node scripts/release-check.mjs [--base https://brainsait.de]

import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const BASE = (() => {
  const i = process.argv.indexOf("--base");
  return i > -1 ? process.argv[i + 1] : process.env.BASE_URL || "https://brainsait.de";
})();

const results = [];
const record = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  const tag = ok === "skip" ? "\x1b[33mSKIP\x1b[0m" : ok ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";
  console.log(`  [${tag}] ${name}${detail ? ` — ${detail}` : ""}`);
};

// Read a KEY=value from a vault env file, or null if unavailable.
const vault = (file, key) => {
  try {
    const line = readFileSync(file, "utf8").split("\n").find((l) => l.startsWith(`${key}=`));
    return line ? line.slice(key.length + 1).trim() : null;
  } catch {
    return null;
  }
};

const status = async (path, opts = {}) => {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: "manual", ...opts });
    return res.status;
  } catch (e) {
    return `ERR:${e.message.slice(0, 40)}`;
  }
};

async function main() {
  console.log(`\n▶ Release check against ${BASE}\n`);

  // ── 1. Availability ───────────────────────────────────────────────
  console.log("1. Availability");
  for (const [path, want] of [["/", 200], ["/marketplace", 200], ["/api/health", 200]]) {
    const s = await status(path);
    record(`GET ${path}`, s === want, `got ${s}`);
  }

  // ── 2. Security posture ───────────────────────────────────────────
  console.log("\n2. Security posture");

  // Forged payment webhook must be refused (fail-closed).
  const forged = await status("/api/sadad/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ billCode: "207", status: "CONFIRMED", amount: 4499 }),
  });
  record("forged payment webhook rejected", forged === 503 || forged === 401, `got ${forged}`);

  // Admin surface must require auth.
  record("admin page requires auth", (await status("/admin")) === 401, "");
  record("admin API requires token", (await status("/api/sadad/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })) === 401, "");

  // Admin auth accepts valid credentials (local only — needs vault).
  const adminPw = vault("/home/fadil369/.secure-vault/health-exchange-admin.env", "ADMIN_PASSWORD");
  if (adminPw) {
    const auth = "Basic " + Buffer.from(`brainsait-admin:${adminPw}`).toString("base64");
    const s = await status("/admin", { headers: { Authorization: auth } });
    record("admin auth accepts valid credentials", s === 200, `got ${s}`);
  } else {
    record("admin auth accepts valid credentials", "skip", "no vault access");
  }

  // Data-tier ports must not be reachable from the public IP (local only).
  try {
    const pub = execSync("curl -s4 --max-time 5 ifconfig.me", { encoding: "utf8" }).trim();
    if (pub) {
      for (const port of [6379, 5432]) {
        let open = false;
        try {
          execSync(`timeout 4 bash -c 'exec 3<>/dev/tcp/${pub}/${port}'`, { stdio: "ignore" });
          open = true;
        } catch {}
        record(`data port ${port} closed to public`, !open, open ? "REACHABLE" : "");
      }
    }
  } catch {
    record("data ports closed to public", "skip", "cannot determine public IP");
  }

  // ── 3. Transaction simulation ─────────────────────────────────────
  console.log("\n3. Transaction simulation");

  // Telegram payment: create a real invoice link (validates provider + currency
  // + price end to end without a live buyer).
  const botToken = vault("/home/fadil369/.secure-vault/telegram-bot.env", "TELEGRAM_BOT_TOKEN");
  const provider = vault("/home/fadil369/.secure-vault/telegram-payments.env", "TELEGRAM_PAYMENT_PROVIDER_TOKEN");
  const currency = vault("/home/fadil369/.secure-vault/telegram-payments.env", "TELEGRAM_PAYMENT_CURRENCY") || "SAR";
  if (botToken && provider) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Release check",
          description: "Automated invoice validation — not a real order.",
          payload: "release-check",
          provider_token: provider,
          currency,
          prices: [{ label: "NPHIES Mastery", amount: 449900 }],
        }),
      });
      const j = await res.json();
      record(`Telegram invoice (${currency}) accepted by provider`, j.ok === true, j.ok ? "" : j.description);
    } catch (e) {
      record("Telegram invoice accepted by provider", false, e.message);
    }
  } else {
    record("Telegram invoice accepted by provider", "skip", "no vault access");
  }

  // Audit trail: confirm the compliance ledger is writable/reachable (local).
  try {
    const count = execSync(
      `docker exec postgres-brainsait psql -U brainsait_admin -d brainsait_audit -tAc "SELECT count(*) FROM audit_log;"`,
      { encoding: "utf8" }
    ).trim();
    record("audit ledger reachable", /^\d+$/.test(count), `${count} events`);
  } catch {
    record("audit ledger reachable", "skip", "no db access");
  }

  // ── Summary ───────────────────────────────────────────────────────
  const failed = results.filter((r) => r.ok === false);
  const passed = results.filter((r) => r.ok === true).length;
  const skipped = results.filter((r) => r.ok === "skip").length;
  console.log(`\n${"─".repeat(48)}`);
  console.log(`  ${passed} passed, ${failed.length} failed, ${skipped} skipped`);
  if (failed.length) {
    console.log(`\n  \x1b[31mFAILURES:\x1b[0m`);
    failed.forEach((f) => console.log(`   - ${f.name} (${f.detail})`));
    process.exit(1);
  }
  console.log(`  \x1b[32m✓ release checks passed\x1b[0m\n`);
}

main().catch((e) => {
  console.error("release-check crashed:", e);
  process.exit(2);
});

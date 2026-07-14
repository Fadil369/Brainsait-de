// ─── BrainSAIT Mail Client ───
// Supports Resend (API) and SMTP (nodemailer) backends.
// Configure MAIL_PROVIDER=resend|smtp in environment.

export type MailProvider = "resend" | "smtp" | "mock";

export interface MailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: { filename: string; content: Buffer | string }[];
}

export interface MailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

function getProvider(): MailProvider {
  const p = process.env.MAIL_PROVIDER?.toLowerCase();
  if (p === "resend" || p === "smtp") return p;
  if (p === "mock") {
    if (process.env.NODE_ENV === "production") {
      console.error("[Mail] MAIL_PROVIDER=mock is not allowed in production. Set MAIL_PROVIDER=resend or MAIL_PROVIDER=smtp.");
    }
    return "mock";
  }
  return process.env.NODE_ENV === "production" ? "smtp" : "mock";
}

function normalizeRecipients(recipients: string | string[] | undefined): string[] {
  if (!recipients) return [];
  if (Array.isArray(recipients)) return recipients;
  return recipients.split(",").map((r) => r.trim()).filter(Boolean);
}

// ─── Resend ────────────────────────────────────────────────
async function sendViaResend(msg: MailMessage): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "RESEND_API_KEY not configured" };

  const from = msg.from || process.env.MAIL_FROM || "BrainSAIT <noreply@brainsait.de>";
  const to = normalizeRecipients(msg.to);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      cc: msg.cc ? normalizeRecipients(msg.cc) : undefined,
      bcc: msg.bcc ? normalizeRecipients(msg.bcc) : undefined,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      reply_to: msg.replyTo || undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "Unknown error");
    return { success: false, error: `Resend ${res.status}: ${err}` };
  }

  const data = await res.json();
  return { success: true, messageId: data.id };
}

// ─── SMTP ─────────────────────────────────────────────────
async function sendViaSMTP(msg: MailMessage): Promise<MailResult> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = msg.from || process.env.MAIL_FROM || "BrainSAIT <noreply@brainsait.de>";

  if (!host || !user || !pass) {
    return { success: false, error: "SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS missing)" };
  }

  // Build raw email (simplified MIME)
  const to = normalizeRecipients(msg.to).join(", ");
  const cc = msg.cc ? normalizeRecipients(msg.cc).join(", ") : "";
  const now = new Date().toUTCString();
  const boundary = `brain_${Date.now()}_sait`;

  const htmlPart = `--${boundary}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${msg.html}`;
  const textPart = msg.text ? `--${boundary}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${msg.text}` : "";
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    cc ? `Cc: ${cc}` : "",
    `Subject: ${msg.subject}`,
    `Date: ${now}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ].filter(Boolean).join("\r\n");

  const body = [
    headers,
    "",
    htmlPart,
    textPart,
    `--${boundary}--`,
  ].join("\r\n");

  // Simple SMTP dialog over TCP
  const net = await import("net");
  const { Socket } = net;

  return new Promise((resolve) => {
    const socket = new Socket();
    let step = 0;
    let response = "";

    socket.setTimeout(15000);

    socket.on("data", (chunk: Buffer) => {
      response = chunk.toString("utf-8").trim();
      const code = parseInt(response.slice(0, 3), 10);

      if (step === 0 && code === 220) {
        socket.write(`EHLO ${host}\r\n`);
        step = 1;
      } else if (step === 1 && (code === 250 || response.includes("AUTH"))) {
        if (response.includes("AUTH")) {
          socket.write(`AUTH LOGIN\r\n`);
          step = 2;
        } else {
          const b64user = Buffer.from(user).toString("base64");
          const b64pass = Buffer.from(pass).toString("base64");
          socket.write(`AUTH LOGIN\r\n`);
          step = 2;
        }
      } else if (step === 2 && code === 334) {
        const cred = Buffer.from(step === 2 ? user : pass).toString("base64");
        socket.write(`${cred}\r\n`);
        step++;
      } else if (step === 3 && code === 235) {
        socket.write(`MAIL FROM:<${from.match(/<(.+)>/)?.[1] || from}>\r\n`);
        step = 4;
      } else if (step === 4 && code === 250) {
        socket.write(`RCPT TO:<${to.split(",")[0].trim()}>\r\n`);
        step = 5;
      } else if (step === 5 && code === 250) {
        socket.write(`DATA\r\n`);
        step = 6;
      } else if (step === 6 && code === 354) {
        socket.write(`${body}\r\n.\r\n`);
        step = 7;
      } else if (step === 7 && code === 250) {
        socket.write(`QUIT\r\n`);
        socket.end();
        resolve({ success: true, messageId: `smtp_${Date.now()}` });
      } else if (code >= 400) {
        socket.destroy();
        resolve({ success: false, error: `SMTP error ${code}: ${response}` });
      }
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ success: false, error: "SMTP connection timeout" });
    });

    socket.on("error", (err: Error) => {
      resolve({ success: false, error: `SMTP socket error: ${err.message}` });
    });

    socket.connect(port, host, () => {
      socket.write(`CONNECT ${host} ${port}\r\n`);
    });
  });
}

// ─── Mock ─────────────────────────────────────────────────
async function sendMock(msg: MailMessage): Promise<MailResult> {
  console.log("[Mail Mock]", {
    to: msg.to,
    subject: msg.subject,
    snippet: msg.text?.slice(0, 80) || msg.html.replace(/<[^>]+>/g, "").slice(0, 80),
  });
  return { success: true, messageId: `mock_${Date.now()}` };
}

// ─── Public API ───────────────────────────────────────────

export async function sendMail(msg: MailMessage): Promise<MailResult> {
  const provider = getProvider();

  if (provider === "resend") return sendViaResend(msg);
  if (provider === "smtp") return sendViaSMTP(msg);
  return sendMock(msg);
}

// ─── Template Helpers ──────────────────────────────────────

export function htmlTemplate(content: string, title?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title || "BrainSAIT"}</title>
</head>
<body style="margin:0;padding:0;background:#f8f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#0a0c10,#1a1f2e);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
        <h1 style="margin:0;font-size:22px;font-weight:800;color:#e9c46a;letter-spacing:-0.02em;">BrainSAIT</h1>
        <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;">Health Exchange</p>
      </td></tr>
      <!-- Content -->
      <tr><td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
        ${content}
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:20px 40px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#9ca3af;">© ${new Date().getFullYear()} BrainSAIT GmbH · brainsait.de · Riyadh, Saudi Arabia</p>
        <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">This email was sent by the BrainSAIT Health Exchange platform.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function contactEmailTemplate(data: {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}): string {
  return htmlTemplate(`
    <h2 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#0a0c10;">New Contact Form Submission</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#6b7280;font-size:12px;display:inline-block;width:100px;">Name</strong><span style="color:#111827;">${data.name}</span></td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#6b7280;font-size:12px;display:inline-block;width:100px;">Email</strong><a href="mailto:${data.email}" style="color:#1a56db;">${data.email}</a></td></tr>
      ${data.company ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#6b7280;font-size:12px;display:inline-block;width:100px;">Company</strong><span style="color:#111827;">${data.company}</span></td></tr>` : ""}
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#6b7280;font-size:12px;display:inline-block;width:100px;">Subject</strong><span style="color:#111827;">${data.subject}</span></td></tr>
    </table>
    <h3 style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Message</h3>
    <div style="background:#f9fafb;border-radius:12px;padding:20px;font-size:14px;color:#374151;line-height:1.6;white-space:pre-wrap;">${data.message}</div>
  `, "Contact Form — BrainSAIT");
}

export function invoiceEmailTemplate(invoice: {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  vat?: number;
  total: number;
  sadadNumber: string;
  billerCode: string;
}): string {
  const itemsHtml = invoice.items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;">${item.description}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:center;">${item.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:right;">SAR ${item.unitPrice.toLocaleString()}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#374151;font-size:14px;text-align:right;">SAR ${item.total.toLocaleString()}</td>
    </tr>`
    )
    .join("");

  const vatRow = invoice.vat
    ? `<tr><td colspan="3" style="padding:8px 0;text-align:right;color:#6b7280;font-size:13px;">VAT (15%)</td><td style="padding:8px 0;text-align:right;color:#374151;font-size:13px;">SAR ${invoice.vat.toLocaleString()}</td></tr>`
    : "";

  return htmlTemplate(`
    <div style="margin-bottom:32px;">
      <h2 style="margin:0 0 4px;font-size:24px;font-weight:800;color:#0a0c10;">Invoice #${invoice.invoiceNumber}</h2>
      <p style="margin:0;font-size:13px;color:#6b7280;">Issued ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <thead>
        <tr style="border-bottom:2px solid #e5e7eb;">
          <th style="padding:8px 0;text-align:left;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Description</th>
          <th style="padding:8px 0;text-align:center;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
          <th style="padding:8px 0;text-align:right;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Unit Price</th>
          <th style="padding:8px 0;text-align:right;color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div style="text-align:right;margin-bottom:32px;">
      <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Subtotal: <span style="color:#374151;">SAR ${invoice.subtotal.toLocaleString()}</span></p>
      ${vatRow}
      <p style="margin:0;font-size:18px;font-weight:700;color:#0a0c10;">Total: <span style="color:#e9c46a;">SAR ${invoice.total.toLocaleString()}</span></p>
    </div>
    <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:20px;">
      <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#0a0c10;text-transform:uppercase;letter-spacing:0.05em;">Payment via SADAD</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Biller Name</td><td style="padding:4px 0;color:#111827;font-size:13px;text-align:right;">stc pay</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Biller Code</td><td style="padding:4px 0;color:#111827;font-size:13px;text-align:right;">${invoice.billerCode}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Account Number</td><td style="padding:4px 0;color:#111827;font-size:13px;text-align:right;font-family:monospace;">${invoice.sadadNumber}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280;font-size:13px;">Min. Amount</td><td style="padding:4px 0;color:#111827;font-size:13px;text-align:right;">SAR 5,000</td></tr>
      </table>
      <p style="margin:12px 0 0;font-size:12px;color:#6b7280;">Please retain this invoice. Payment confirmation will be sent to <strong>${invoice.customerEmail}</strong> once verified.</p>
    </div>
    <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">BrainSAIT GmbH · Riyadh, Saudi Arabia · Trade Registration No. 1010xxxx · VAT No. 3100xxxx</p>
  `, `Invoice #${invoice.invoiceNumber} — BrainSAIT`);
}

export function orderConfirmationTemplate(data: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  amount: number;
  sadadReference?: string;
}): string {
  return htmlTemplate(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,#0d9488,#1a56db);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0a0c10;">Order Confirmed!</h2>
      <p style="margin:0;font-size:14px;color:#6b7280;">Order ID: <strong style="color:#111827;">${data.orderId}</strong></p>
    </div>
    <div style="background:#f9fafb;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h3 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#0a0c10;text-transform:uppercase;letter-spacing:0.05em;">Order Summary</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Product</td><td style="padding:6px 0;color:#111827;font-size:13px;text-align:right;font-weight:600;">${data.productName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Amount Paid</td><td style="padding:6px 0;color:#e9c46a;font-size:13px;text-align:right;font-weight:700;">SAR ${data.amount.toLocaleString()}</td></tr>
        ${data.sadadReference ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">SADAD Reference</td><td style="padding:6px 0;color:#111827;font-size:13px;text-align:right;font-family:monospace;">${data.sadadReference}</td></tr>` : ""}
      </table>
    </div>
    <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
      Thank you for your purchase, <strong>${data.customerName}</strong>! Your order is being processed.
      You will receive access instructions at <strong>${data.customerEmail}</strong> once payment is verified.
    </p>
  `, "Order Confirmed — BrainSAIT");
}

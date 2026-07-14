import { NextRequest, NextResponse } from "next/server";
import { getGateway } from "@/lib/backend";
import { sendMail, invoiceEmailTemplate } from "@/lib/mail";
import { SADAD_INFO } from "@/lib/sadad-pricing";
import type { MarketplaceCollection } from "@/lib/backend";

interface SubmitBody {
  collection: MarketplaceCollection;
  data: Record<string, unknown>;
  sendInvoice?: boolean;
  customerEmail?: string;
  customerName?: string;
}

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 900000) + 100000;
  return `INV-${year}-${seq}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitBody = await request.json();
    const { collection, data, sendInvoice = true, customerEmail, customerName } = body;

    if (!collection || !data) {
      return NextResponse.json(
        { error: "Missing required fields: collection, data" },
        { status: 400 }
      );
    }

    const validCollections: MarketplaceCollection[] = [
      "needs", "offers", "projects", "challenges", "experts",
      "ai", "jobs", "education", "equipment", "data", "apis",
    ];
    if (!validCollections.includes(collection)) {
      return NextResponse.json(
        { error: `Invalid collection. Must be one of: ${validCollections.join(", ")}` },
        { status: 400 }
      );
    }

    // Submit to gateway
    let submission: { id: string; status: string };
    try {
      const gw = getGateway();
      submission = await gw.post<{ id: string; status: string }>(
        `/v1/marketplace/${collection}`,
        { ...data, submittedAt: new Date().toISOString(), source: "web" }
      );
    } catch (gwErr) {
      console.error("[Marketplace Submit] Gateway error:", gwErr);
      // Still generate an invoice ID so the UI can proceed
      submission = {
        id: `local_${Date.now()}`,
        status: "pending_review",
      };
    }

    // Generate invoice if requested and customer info provided
    if (sendInvoice && customerEmail && data.amount) {
      const invoice = {
        invoiceNumber: generateInvoiceNumber(),
        customerName: customerName || "Customer",
        customerEmail,
        items: [
          {
            description: `Marketplace submission: ${data.title || collection}`,
            quantity: 1,
            unitPrice: Number(data.amount),
            total: Number(data.amount),
          },
        ],
        subtotal: Number(data.amount),
        total: Number(data.amount),
        sadadNumber: SADAD_INFO.sadadNumber,
        billerCode: SADAD_INFO.billerCode,
      };

      try {
        await sendMail({
          to: customerEmail,
          subject: `Invoice ${invoice.invoiceNumber} — BrainSAIT Health Exchange`,
          html: invoiceEmailTemplate(invoice),
        });
      } catch (mailErr) {
        console.error("[Marketplace Submit] Invoice email failed:", mailErr);
        // Non-fatal — submission still succeeded
      }

      return NextResponse.json({
        success: true,
        id: submission.id,
        status: submission.status,
        invoiceNumber: invoice.invoiceNumber,
        invoice: sendInvoice ? invoice : undefined,
      });
    }

    return NextResponse.json({
      success: true,
      id: submission.id,
      status: submission.status,
    });
  } catch (err) {
    console.error("[Marketplace Submit] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

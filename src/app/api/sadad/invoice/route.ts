import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productName, amount, sadadReference, customerEmail, customerName } = body;

    if (!productName || !amount || !sadadReference) {
      return NextResponse.json(
        { error: "Missing required fields: productName, amount, sadadReference" },
        { status: 400 }
      );
    }

    if (amount < 5000) {
      return NextResponse.json(
        { error: "Minimum SADAD payment is SAR 5,000" },
        { status: 400 }
      );
    }

    const invoice = {
      id: `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      productId: productId || "custom",
      productName,
      amountSAR: amount,
      sadadReference,
      customerEmail: customerEmail || "pending@brainsait.de",
      customerName: customerName || "Valued Customer",
      status: "pending_verification",
      createdAt: new Date().toISOString(),
      billerName: "stc pay",
      billerCode: "207",
      sadadNumber: "72255534330",
    };

    // In production: save to database, trigger verification workflow
    // await db.invoices.create(invoice);
    // await notifyAdmin(invoice);

    return NextResponse.json({
      success: true,
      invoice,
      message: `Invoice ${invoice.id} created. Payment received. You will receive access within 24 hours after verification.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Invoice creation failed" },
      { status: 500 }
    );
  }
}

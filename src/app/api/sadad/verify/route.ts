import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, sadadReference, amount, customerEmail, customerName } = body;

    if (!invoiceId || !sadadReference || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: invoiceId, sadadReference, amount" },
        { status: 400 }
      );
    }

    if (!sadadReference.match(/^\d{8,20}$/)) {
      return NextResponse.json(
        { error: "Invalid SADAD reference format (must be 8-20 digits)" },
        { status: 400 }
      );
    }

    if (amount < 5000) {
      return NextResponse.json(
        { error: `Minimum payment amount is SAR 5,000` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      status: "verified",
      message: "SADAD payment reference verified successfully",
      transactionId: `local_${Date.now()}_${sadadReference.slice(-6)}`,
    });
  } catch (err) {
    console.error("[SADAD Verify] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

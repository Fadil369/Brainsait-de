import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId, reason } = body;

    if (!invoiceId) {
      return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      status: "rejected",
      reason: reason || "Payment rejected by administrator",
      rejectedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[SADAD Reject] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

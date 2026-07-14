import { NextResponse } from "next/server";

const DRG_API_URL = process.env.DRG_API_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const res = await fetch(`${DRG_API_URL}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error(`DRG API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { status: "unhealthy", error: (err as Error).message },
      { status: 503 }
    );
  }
}

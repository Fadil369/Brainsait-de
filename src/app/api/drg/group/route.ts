import { NextRequest, NextResponse } from "next/server";

const DRG_API_URL = process.env.DRG_API_URL || "http://127.0.0.1:8000";
const DRG_API_TOKEN = process.env.DRG_API_TOKEN || "";

function drgHeaders(contentType = true) {
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = "application/json";
  if (DRG_API_TOKEN) headers["Authorization"] = `Bearer ${DRG_API_TOKEN}`;
  return headers;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${DRG_API_URL}/group`, {
      method: "POST",
      headers: drgHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`DRG API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 502 }
    );
  }
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, boolean> = {};
  let healthy = true;

  // Check gateway connectivity
  try {
    const gatewayUrl = process.env.BRAINSAIT_GATEWAY_URL || "http://127.0.0.1:58443";
    const res = await fetch(`${gatewayUrl}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    checks.gateway = res.ok;
  } catch {
    checks.gateway = false;
    healthy = false;
  }

  // Check FHIR gateway
  try {
    const fhirUrl = process.env.FHIR_GATEWAY_URL || "http://127.0.0.1:58080";
    const res = await fetch(`${fhirUrl}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    checks.fhir = res.ok;
  } catch {
    checks.fhir = false;
  }

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      service: "brainsait-health-exchange",
      version: process.env.npm_package_version || "1.0.0",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      checks,
    },
    { status: healthy ? 200 : 503 }
  );
}

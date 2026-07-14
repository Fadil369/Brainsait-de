import { NextRequest, NextResponse } from "next/server";

const FALLBACK_RESPONSES = [
  "Based on your query, I'd recommend exploring our NPHIES Gateway Integration and FHIR R4 services — both are widely adopted by hospitals in Saudi Arabia. Would you like me to match specific products?",
  "For your use case, the ClaimLinc AI Revenue Cycle Management solution paired with our Compliance Monitor would provide comprehensive coverage. Shall I show you detailed product information?",
  "I can connect you with verified AI vendors for clinical decision support, revenue cycle automation, or patient engagement. Use the AI Need Matcher on the /match page for precise product recommendations.",
  "Our platform has 57+ products across 6 business units. Describe your challenge in more detail on the /match page and I'll identify the best-fit solutions from our marketplace.",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    let result: Record<string, unknown>;
    try {
      const { askCopilot } = await import("@/lib/api");
      result = await askCopilot(message) as unknown as Record<string, unknown>;
    } catch {
      result = {
        query: message,
        intent: "general inquiry",
        response: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)],
        recommendations: [
          { type: "product", label: "AI Need Matcher", href: "/match", desc: "Find the right product for your challenge" },
          { type: "marketplace", label: "Browse Marketplace", href: "/marketplace", desc: "Explore all marketplace categories" },
        ],
        nextSteps: [
          { action: "Try AI Need Matcher", link: "/match" },
          { action: "Post a Need", link: "/marketplace/needs/new" },
        ],
      };
    }

    return NextResponse.json(result as unknown as Record<string, unknown>);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Copilot request failed" },
      { status: 502 }
    );
  }
}

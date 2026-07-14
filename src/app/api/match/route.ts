import { NextRequest, NextResponse } from "next/server";
import { matchNeeds, suggestCategories, MatchQuery } from "@/lib/matching-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit, unit, category, minScore } = body;

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const matchQuery: MatchQuery = {
      query: query.trim(),
      limit: typeof limit === "number" ? limit : 10,
      unit: typeof unit === "string" ? unit : undefined,
      category: typeof category === "string" ? category : undefined,
      minScore: typeof minScore === "number" ? minScore : 5,
    };

    const result = matchNeeds(matchQuery);
    const suggestedCategories = suggestCategories(query);

    return NextResponse.json({
      ...result,
      suggestedCategories,
    });
  } catch (err) {
    console.error("Match API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Query parameter 'q' must be at least 2 characters" },
      { status: 400 }
    );
  }

  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const unit = searchParams.get("unit") || undefined;
  const category = searchParams.get("category") || undefined;

  const matchQuery: MatchQuery = {
    query: query.trim(),
    limit: isNaN(limit) ? 10 : limit,
    unit,
    category,
  };

  const result = matchNeeds(matchQuery);
  const suggestedCategories = suggestCategories(query);

  return NextResponse.json({
    ...result,
    suggestedCategories,
  });
}

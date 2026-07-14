import { NextRequest, NextResponse } from "next/server";
import {
  getMarketplaceCollection,
  getMarketplaceItem,
  MarketplaceCollection,
} from "@/lib/backend";

const VALID_COLLECTIONS = new Set<MarketplaceCollection>([
  "needs",
  "offers",
  "projects",
  "challenges",
  "experts",
  "ai",
  "jobs",
  "education",
  "equipment",
  "data",
  "apis",
]);

export async function GET(
  request: NextRequest,
  { params }: { params: { collection: string } }
) {
  const collection = params.collection as MarketplaceCollection;
  if (!VALID_COLLECTIONS.has(collection)) {
    return NextResponse.json(
      { error: "Invalid marketplace collection" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const item = await getMarketplaceItem(collection, id);
      return NextResponse.json(item);
    }

    const data = await getMarketplaceCollection(collection, {
      q: searchParams.get("q") || undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch marketplace data" },
      { status: 502 }
    );
  }
}

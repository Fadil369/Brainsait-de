// ─── BrainSAIT API Client ───
// Re-exports from backend.ts for backward compatibility.
// All primary API methods live in lib/backend.ts.

export {
  getGateway,
  getFHIRGateway,
  getNPHIESGateway,
  getMarketplaceCollection,
  getMarketplaceItem,
  submitMarketplaceItem,
  askCopilot,
  getPlatformStats,
  checkGatewayHealth,
  fhirSearch,
  fhirCreate,
  checkEligibility,
  submitClaim,
  getClaimStatus,
  resolveOid,
} from "@/lib/backend";

export type {
  MarketplaceCollection,
  PaginatedResponse,
  MarketplaceItem,
  CopilotResult,
  PlatformStats,
  NPHIESEligibility,
  NPHIESClaim,
} from "@/lib/backend";

// ─── Additional Gateway Methods ───
// These methods exist only in api.ts (not in backend.ts).
// Uses the same fetch pattern as backend.ts.

const GATEWAY_URL = process.env.BRAINSAIT_GATEWAY_URL || "http://127.0.0.1:58443";

async function fetchGateway<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${GATEWAY_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options?.headers as Record<string, string>),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`BrainSAIT API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function getHealthExchangeHealth(): Promise<{
  status: string;
  collections: number;
  regulators: string[];
  timestamp: string;
}> {
  return fetchGateway("/v1/health-exchange/health");
}

export async function getKnowledgeGraph(
  entityType: string,
  id: string
): Promise<{
  entityType: string;
  id: string;
  oid: string;
  nodes: unknown[];
  edges: unknown[];
}> {
  return fetchGateway(`/v1/knowledge/graph/${entityType}/${id}`);
}

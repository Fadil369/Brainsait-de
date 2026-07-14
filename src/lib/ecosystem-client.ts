const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:58443";
const FHIR_URL = process.env.NEXT_PUBLIC_FHIR_URL || "http://localhost:58080";
const IRIS_URL = process.env.NEXT_PUBLIC_IRIS_URL || "http://localhost:52773";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function gatewayRequest(path: string, opts: RequestOptions = {}) {
  const res = await fetch(`${GATEWAY_URL}/api${path}`, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", ...opts.headers },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "Gateway error");
    throw new Error(`Gateway ${res.status}: ${err}`);
  }
  return res.json();
}

export const ecosystem = {
  // ── Health ──
  health: () => gatewayRequest("/health"),

  // ── Platform Stats ──
  stats: () => gatewayRequest("/stats"),

  // ── Marketplace ──
  marketplace: {
    list: (collection: string) => gatewayRequest(`/marketplace/${collection}`),
    get: (collection: string, id: string) => gatewayRequest(`/marketplace/${collection}/${id}`),
    create: (collection: string, data: unknown) => gatewayRequest(`/marketplace/${collection}`, { method: "POST", body: data }),
  },

  // ── FHIR ──
  fhir: {
    search: async (resource: string, params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      const res = await fetch(`${FHIR_URL}/fhir/r4/${resource}${qs}`);
      return res.json();
    },
    read: async (resource: string, id: string) => {
      const res = await fetch(`${FHIR_URL}/fhir/r4/${resource}/${id}`);
      return res.json();
    },
  },

  // ── IRIS ──
  iris: {
    health: async () => {
      const res = await fetch(`${IRIS_URL}/csp/healthshare/dashboard.csp`, { method: "HEAD" });
      return res.ok;
    },
  },

  // ── LINC Agents ──
  linc: {
    // MasterLINC orchestrator
    orchestrate: (query: string) =>
      gatewayRequest("/linc/orchestrate", { method: "POST", body: { query } }),

    // Specific agent calls
    agent: (agentName: string, payload: unknown) =>
      gatewayRequest(`/linc/agents/${agentName}`, { method: "POST", body: payload }),

    // List deployed agents
    list: () => gatewayRequest("/linc/agents"),

    // Agent registry
    registry: () => gatewayRequest("/linc/registry"),
  },

  // ── Copilot / AI ──
  copilot: {
    chat: (message: string) =>
      gatewayRequest("/copilot", { method: "POST", body: { message } }),
    analyze: (query: string) =>
      gatewayRequest("/copilot/analyze", { method: "POST", body: { query } }),
  },

  // ── Revenue & Finance ──
  finance: {
    stats: () => gatewayRequest("/finance/stats"),
    transactions: () => gatewayRequest("/finance/transactions"),
    payout: {
      config: () => gatewayRequest("/finance/payout/config"),
      request: (amount: number) =>
        gatewayRequest("/finance/payout/request", { method: "POST", body: { amount } }),
    },
  },

  // ── Compliance ──
  compliance: {
    score: () => gatewayRequest("/compliance/score"),
    regulations: () => gatewayRequest("/compliance/regulations"),
    events: () => gatewayRequest("/compliance/events"),
  },

  // ── Infrastructure / Server Health ──
  infrastructure: {
    services: () => gatewayRequest("/infra/services"),
    regions: () => gatewayRequest("/infra/regions"),
    alerts: () => gatewayRequest("/infra/alerts"),
  },

  // ── User Management ──
  users: {
    list: () => gatewayRequest("/users"),
    roles: () => gatewayRequest("/users/roles"),
    accessLog: () => gatewayRequest("/users/access-log"),
    invite: (email: string) =>
      gatewayRequest("/users/invite", { method: "POST", body: { email } }),
  },

  // ── Integrations ──
  integrations: {
    list: () => gatewayRequest("/integrations"),
    webhooks: () => gatewayRequest("/integrations/webhooks"),
    connect: (provider: string) =>
      gatewayRequest("/integrations/connect", { method: "POST", body: { provider } }),
  },

  // ── Research Hub ──
  research: {
    trials: () => gatewayRequest("/research/trials"),
    publications: () => gatewayRequest("/research/publications"),
    datasets: () => gatewayRequest("/research/datasets"),
    grants: () => gatewayRequest("/research/grants"),
  },
};

export default ecosystem;

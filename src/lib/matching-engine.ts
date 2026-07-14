import { CatalogProduct, getCatalog } from "./product-catalog";

export interface MatchResult {
  product: CatalogProduct;
  score: number;
  matchType: "exact" | "keyword" | "category" | "description" | "fuzzy";
  matchedTerms: string[];
}

interface IntentCluster {
  patterns: RegExp[];
  categories: string[];
  keywords: string[];
}

const INTENT_CLUSTERS: IntentCluster[] = [
  {
    patterns: [/claim|revenue|billing|reimbursement|denial|rcm|reject/i],
    categories: ["revenue-cycle", "claims"],
    keywords: ["claims", "revenue", "billing", "denial"],
  },
  {
    patterns: [/nphies|insurance|eligibility|prior auth|pre.auth/i],
    categories: ["nphies"],
    keywords: ["nphies", "eligibility", "insurance"],
  },
  {
    patterns: [/ai|agent|chatbot|copilot|llm|artificial intelligence|machine learning|ml/i],
    categories: ["ai", "agents"],
    keywords: ["ai", "agent", "copilot"],
  },
  {
    patterns: [/integration|connect|interoperab|bridge|fhir|hl7|api|ehr|system/i],
    categories: ["integration", "interoperability"],
    keywords: ["integration", "connect", "fhir", "hl7"],
  },
  {
    patterns: [/compliance|regulat|audit|pdpl|cbahi|nca|iso|governance/i],
    categories: ["compliance", "regulatory", "governance"],
    keywords: ["compliance", "regulatory", "audit"],
  },
  {
    patterns: [/secur|trust|encrypt|identity|verification|kyb|risk/i],
    categories: ["trust", "security", "verification"],
    keywords: ["security", "trust", "verification"],
  },
  {
    patterns: [/coding|icd|icd-10|cpt|procedure code/i],
    categories: ["coding"],
    keywords: ["coding", "icd", "cpt"],
  },
  {
    patterns: [/patient|portal|engagement|appointment|schedule|referral/i],
    categories: ["patient-engagement"],
    keywords: ["patient", "portal", "appointment"],
  },
  {
    patterns: [/radiology|imaging|pacs|x.ray|mri|ct scan|diagnostic/i],
    categories: ["imaging", "diagnostics", "clinical-ai"],
    keywords: ["radiology", "imaging", "diagnostic"],
  },
  {
    patterns: [/lab|laboratory|pathology|test/i],
    categories: ["lab"],
    keywords: ["lab", "laboratory", "test"],
  },
  {
    patterns: [/pharmacy|medication|drug|dispens/i],
    categories: ["pharmacy"],
    keywords: ["pharmacy", "medication", "drug"],
  },
  {
    patterns: [/train|course|certif|educat|lms|academy|learning|bootcamp|cme/i],
    categories: ["education", "training", "certification"],
    keywords: ["training", "course", "certification", "education"],
  },
  {
    patterns: [/startup|incubat|acceler|founder|venture|investor|funding/i],
    categories: ["ventures", "incubation", "startups"],
    keywords: ["startup", "incubator", "founder", "investor"],
  },
  {
    patterns: [/innovation|idea|challenge|spark/i],
    categories: ["innovation"],
    keywords: ["innovation", "ideas", "challenge"],
  },
  {
    patterns: [/procurement|tender|rfp|vendor|supplier|contract/i],
    categories: ["procurement"],
    keywords: ["procurement", "tender", "vendor", "supplier"],
  },
  {
    patterns: [/telemedicine|telehealth|remote|virtual care/i],
    categories: ["digital-health", "patient-engagement"],
    keywords: ["telemedicine", "telehealth", "remote", "virtual"],
  },
  {
    patterns: [/voice|receptionist|basma|arabic|secretary/i],
    categories: ["voice"],
    keywords: ["voice", "receptionist", "arabic"],
  },
  {
    patterns: [/developer|sdk|cli|tool|code|programmer|engineer/i],
    categories: ["developer"],
    keywords: ["developer", "sdk", "api", "code"],
  },
  {
    patterns: [/analytics|dashboard|report|bi|business intelligence|metric/i],
    categories: ["analytics"],
    keywords: ["analytics", "dashboard", "report", "bi"],
  },
  {
    patterns: [/simulat|virtual training|scenario|role.play/i],
    categories: ["simulation"],
    keywords: ["simulation", "virtual training"],
  },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function detectIntentClusters(query: string): { categories: string[]; keywords: string[] } {
  const matchedCategories = new Set<string>();
  const matchedKeywords = new Set<string>();

  for (const cluster of INTENT_CLUSTERS) {
    if (cluster.patterns.some((p) => p.test(query))) {
      cluster.categories.forEach((c) => matchedCategories.add(c));
      cluster.keywords.forEach((k) => matchedKeywords.add(k));
    }
  }

  return {
    categories: Array.from(matchedCategories),
    keywords: Array.from(matchedKeywords),
  };
}

function scoreProduct(product: CatalogProduct, query: string, tokens: string[], intent: { categories: string[]; keywords: string[] }): MatchResult | null {
  const queryLower = query.toLowerCase();
  const matchedTerms: string[] = [];
  let score = 0;
  let matchType: MatchResult["matchType"] = "fuzzy";

  // Exact name match (highest)
  if (product.name.toLowerCase() === queryLower) {
    score += 100;
    matchType = "exact";
    matchedTerms.push(product.name);
  }

  // Partial name match
  if (product.name.toLowerCase().includes(queryLower) && queryLower.length > 2) {
    score += 50;
    if (matchType === "fuzzy") matchType = "exact";
    matchedTerms.push(product.name);
  }

  // Keyword matches
  for (const keyword of product.keywords) {
    const kw = keyword.toLowerCase();
    if (queryLower.includes(kw) || tokens.some((t) => kw.includes(t) || t.includes(kw))) {
      score += 20;
      matchedTerms.push(kw);
    }
  }

  // Intent keyword matches against product keywords
  for (const ikw of intent.keywords) {
    if (product.keywords.some((pk) => pk.includes(ikw) || ikw.includes(pk))) {
      score += 15;
      if (!matchedTerms.includes(ikw)) matchedTerms.push(ikw);
    }
  }

  // Intent category match
  for (const cat of intent.categories) {
    if (product.categories.includes(cat)) {
      score += 25;
      if (!matchedTerms.includes(cat)) matchedTerms.push(cat);
    }
  }

  // Description match (lower weight)
  for (const token of tokens) {
    if (product.description.toLowerCase().includes(token)) {
      score += 5;
      if (!matchedTerms.includes(token)) matchedTerms.push(token);
    }
  }

  // Tagline match
  if (product.tagline.toLowerCase().includes(queryLower) && queryLower.length > 3) {
    score += 10;
    if (!matchedTerms.includes(product.tagline)) matchedTerms.push(product.tagline);
  }

  // Boost live products
  if (product.status === "Live") score += 3;

  // Deduplicate matched terms
  const uniqueTerms = Array.from(new Set(matchedTerms));

  if (score > 0) {
    // Determine match type based on what actually matched
    if (matchType === "fuzzy" && uniqueTerms.length > 1) matchType = "keyword";

    return { product, score, matchType, matchedTerms: uniqueTerms };
  }

  return null;
}

export interface MatchQuery {
  query: string;
  limit?: number;
  unit?: string;
  category?: string;
  minScore?: number;
}

export interface MatchResponse {
  matches: MatchResult[];
  intent: { categories: string[]; keywords: string[] };
  total: number;
  query: string;
}

export function matchNeeds(query: MatchQuery): MatchResponse {
  const { query: q, limit = 10, unit, category, minScore = 5 } = query;

  if (!q || q.trim().length < 2) {
    return { matches: [], intent: { categories: [], keywords: [] }, total: 0, query: q };
  }

  const catalog = getCatalog();
  let filtered = catalog;

  if (unit) filtered = filtered.filter((p) => p.unit === unit);
  if (category) filtered = filtered.filter((p) => p.categories.includes(category));

  const tokens = tokenize(q);
  const intent = detectIntentClusters(q);

  const scored = filtered
    .map((product) => scoreProduct(product, q, tokens, intent))
    .filter((r): r is MatchResult => r !== null && r.score >= minScore)
    .sort((a, b) => b.score - a.score);

  return {
    matches: scored.slice(0, limit),
    intent,
    total: scored.length,
    query: q,
  };
}

export function suggestCategories(query: string): string[] {
  if (!query || query.trim().length < 2) return [];

  const intent = detectIntentClusters(query);
  const catalog = getCatalog();

  const categoryScores = new Map<string, number>();

  for (const product of catalog) {
    for (const cat of intent.categories) {
      if (product.categories.includes(cat)) {
        categoryScores.set(cat, (categoryScores.get(cat) || 0) + 1);
      }
    }

    for (const keyword of intent.keywords) {
      if (product.keywords.some((pk) => pk.includes(keyword) || keyword.includes(pk))) {
        for (const cat of product.categories) {
          categoryScores.set(cat, (categoryScores.get(cat) || 0) + 1);
        }
      }
    }
  }

  return Array.from(categoryScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat]) => cat);
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Bot, Sparkles, Stethoscope, Cloud, Shield, GraduationCap, Lightbulb, Filter, ChevronDown } from "lucide-react";
import { AIMatchWidget } from "@/components/AIMatchWidget";
import { getCatalog, getAllCategories, getAllUnits } from "@/lib/product-catalog";
import type { MatchResponse, MatchResult } from "@/lib/matching-engine";

const UNIT_INFO: Record<string, { label: string; color: string; desc: string }> = {
  health:  { label: "BrainSAIT Health",   color: "#1a56db", desc: "Clinical AI, RCM & hospital operations" },
  ai:      { label: "BrainSAIT AI",       color: "#7c3aed", desc: "LINC agents, MCP & agent studio" },
  cloud:   { label: "BrainSAIT Cloud",    color: "#0d9488", desc: "APIs, integration & developer platform" },
  trust:   { label: "BrainSAIT Trust",    color: "#b8963e", desc: "Wathq layer, KYB & compliance" },
  academy: { label: "BrainSAIT Academy",  color: "#e11d48", desc: "Training, certifications & LMS" },
  ventures:{ label: "BrainSAIT Ventures",  color: "#059669", desc: "Spark, incubator & accelerator" },
};

function MatchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MatchResponse | null>(null);
  const [filterUnit, setFilterUnit] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      triggerMatch(initialQuery);
    }
  }, [initialQuery]);

  async function triggerMatch(q: string) {
    if (!q || q.trim().length < 2) return;
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, limit: 50 }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setShowResults(true);
      }
    } catch {}
  }

  const filteredMatches = results?.matches?.filter((m: MatchResult) =>
    filterUnit === "all" || m.product.unit === filterUnit
  ) || [];

  const units = getAllUnits();
  const catalog = getCatalog();

  return (
    <main className="min-h-screen bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-[#1a56db]/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#0d9488]/[0.06] blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Hero */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#e9c46a]" />
            <span className="text-[11px] font-700 text-[#e9c46a] uppercase tracking-[0.12em]">AI Need Matcher</span>
          </div>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-800 text-white leading-[1.05] mb-4">
            What do you need to solve?
          </h1>
          <p className="text-[16px] text-white/50 leading-relaxed max-w-xl mx-auto mb-8">
            Describe your challenge in plain language. Our AI matches you to the right products, services, and partners — instantly.
          </p>
        </div>

        {/* Search */}
        <AIMatchWidget
          placeholder="e.g. We need to reduce claim rejections..."
          onMatch={(q, data) => { setResults(data); setShowResults(true); }}
          embedded
        />

        {/* Results section */}
        {showResults && results && (
          <div className="mt-12">
            {/* Stats bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div>
                <p className="text-[14px] text-white/70">
                  <span className="font-700 text-white">{results.total}</span> matches for &ldquo;<span className="text-[#e9c46a]">{results.query}</span>&rdquo;
                </p>
                {results.intent.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {results.intent.categories.map((cat) => (
                      <span key={cat} className="text-[10px] font-500 text-[#e9c46a]/60 bg-[#e9c46a]/10 px-2 py-0.5 rounded-full">
                        {cat.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Unit filter */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.10] text-[13px] text-white/60 hover:bg-white/[0.05] transition-all"
                >
                  <Filter className="w-3.5 h-3.5" />
                  {filterUnit === "all" ? "All Units" : UNIT_INFO[filterUnit]?.label || filterUnit}
                  <ChevronDown className={`w-3 h-3 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
                </button>
                {filterOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 rounded-xl border border-white/[0.08] bg-[#0a0c10]/95 backdrop-blur-xl shadow-2xl p-1 z-10">
                    <button
                      onClick={() => { setFilterUnit("all"); setFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-colors ${filterUnit === "all" ? "text-white bg-white/[0.08]" : "text-white/50 hover:text-white hover:bg-white/[0.05]"}`}
                    >
                      All Units
                    </button>
                    {units.map((u) => (
                      <button
                        key={u}
                        onClick={() => { setFilterUnit(u); setFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-colors ${filterUnit === u ? "text-white bg-white/[0.08]" : "text-white/50 hover:text-white hover:bg-white/[0.05]"}`}
                      >
                        {UNIT_INFO[u]?.label || u}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results grid */}
            <div className="space-y-3">
              {filteredMatches.map((match: MatchResult) => {
                const unit = UNIT_INFO[match.product.unit];
                return (
                  <Link
                    key={match.product.id}
                    href={match.product.href}
                    className="group flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Bot className="w-6 h-6" style={{ color: unit?.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[15px] font-600 text-white group-hover:text-[#e9c46a] transition-colors">{match.product.name}</span>
                        <span className="text-[9px] font-500 text-white/20 px-1.5 py-0.5 rounded bg-white/[0.06]">{match.product.unit}</span>
                        <span className="text-[9px] font-500 text-white/20 px-1.5 py-0.5 rounded bg-white/[0.06]">{match.product.type}</span>
                      </div>
                      <p className="text-[13px] text-[#e9c46a]/70 font-500 mb-1">{match.product.tagline}</p>
                      <p className="text-[13px] text-white/40 leading-relaxed">{match.product.description}</p>
                      {match.matchedTerms.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {match.matchedTerms.slice(0, 6).map((term) => (
                            <span key={term} className="text-[9px] font-500 text-[#e9c46a]/40 bg-[#e9c46a]/8 px-2 py-0.5 rounded">
                              {term}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="2.5" />
                          <circle cx="18" cy="18" r="16" fill="none" stroke={unit?.color || "#1a56db"} strokeOpacity="0.6" strokeWidth="2.5"
                            strokeDasharray={`${Math.min(match.score, 100)} 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-700 text-white/60">{Math.min(match.score, 99)}</span>
                      </div>
                      <span className="text-[9px] text-white/20">match</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filteredMatches.length === 0 && (
              <div className="text-center py-12">
                <Bot className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-[15px] text-white/50">No matches for this filter</p>
              </div>
            )}
          </div>
        )}

        {/* Browse all link */}
        {!showResults && (
          <div className="mt-16 text-center">
            <p className="text-[13px] text-white/30 mb-4">Or browse by business unit</p>
            <div className="flex flex-wrap justify-center gap-3">
              {units.map((u) => (
                <Link
                  key={u}
                  href={`/products/${u}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-[13px] text-white/60 hover:bg-white/[0.06] hover:text-white transition-all"
                >
                  <Bot className="w-4 h-4" style={{ color: UNIT_INFO[u]?.color }} />
                  {UNIT_INFO[u]?.label || u}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-center text-[20px] font-700 text-white mb-10">How the AI Matcher Works</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Describe", desc: "Tell us what you need in plain language" },
              { step: "02", title: "Analyze", desc: "AI classifies intent across 18 categories" },
              { step: "03", title: "Match", desc: "Scored against 57+ products & services" },
              { step: "04", title: "Deliver", desc: "Connect to solutions and verified providers" },
            ].map((s) => (
              <div key={s.step} className="text-center p-5 rounded-2xl border border-white/[0.06]">
                <span className="text-[28px] font-800 text-[#e9c46a]/30">{s.step}</span>
                <h3 className="text-[14px] font-700 text-white mt-2 mb-1">{s.title}</h3>
                <p className="text-[12px] text-white/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function MatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#e9c46a] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MatchContent />
    </Suspense>
  );
}

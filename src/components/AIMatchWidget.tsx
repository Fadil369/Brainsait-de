"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Search, Bot, Sparkles, Loader2, X, ChevronRight, Zap, Shield, Cloud, GraduationCap, Lightbulb, Stethoscope } from "lucide-react";
import type { MatchResponse, MatchResult } from "@/lib/matching-engine";
import { getCatalog } from "@/lib/product-catalog";

const UNIT_ICONS: Record<string, typeof Stethoscope> = {
  health: Stethoscope,
  ai: Bot,
  cloud: Cloud,
  trust: Shield,
  academy: GraduationCap,
  ventures: Lightbulb,
};

const UNIT_COLORS: Record<string, string> = {
  health: "#1a56db",
  ai: "#7c3aed",
  cloud: "#0d9488",
  trust: "#b8963e",
  academy: "#e11d48",
  ventures: "#059669",
};

const SUGGESTIONS = [
  "Reduce claim rejections",
  "AI chatbot for patients",
  "NPHIES compliance help",
  "Connect our EHR system",
  "Medical coding training",
  "Patient portal solution",
  "Cybersecurity audit",
  "Radiology AI workflow",
];

interface AIMatchWidgetProps {
  placeholder?: string;
  onMatch?: (query: string, results: MatchResponse) => void;
  embedded?: boolean;
}

export function AIMatchWidget({ placeholder = "Describe what you need...", onMatch, embedded = false }: AIMatchWidgetProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const match = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, limit: 8 }),
      });

      if (!res.ok) throw new Error("Matching service unavailable");

      const data: MatchResponse & { suggestedCategories: string[] } = await res.json();
      setResults(data);
      onMatch?.(q, data);
    } catch (err) {
      setError("Could not process your request. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [onMatch]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 2) {
      debounceRef.current = setTimeout(() => match(query), 400);
    } else {
      setResults(null);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, match]);

  const totalProducts = getCatalog().length;

  return (
    <div className={`w-full ${embedded ? "" : "max-w-4xl mx-auto"}`}>
      {/* Search bar */}
      <div className="relative">
        <div className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
          query ? "border-[#1a56db]/50 shadow-[0_0_0_3px_rgba(26,86,219,0.12)]" : "border-white/[0.12] hover:border-white/[0.25]"
        } bg-white/[0.05] backdrop-blur-sm`}>
          <Search className="w-5 h-5 text-white/30 ml-5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-0 text-[15px] text-white placeholder-white/25 py-4 px-3 focus:outline-none focus:ring-0"
          />
          {loading && <Loader2 className="w-5 h-5 text-[#e9c46a] mr-4 animate-spin flex-shrink-0" />}
          {!loading && query && (
            <button onClick={() => { setQuery(""); setResults(null); }} className="mr-4 p-1 rounded-lg hover:bg-white/[0.08] transition-colors">
              <X className="w-4 h-4 text-white/30" />
            </button>
          )}
          {!loading && !query && (
            <span className="mr-5 text-[12px] text-white/20 font-500 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> AI
            </span>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && !query && !loading && (
          <div className="absolute top-full mt-2 inset-x-0 rounded-2xl border border-white/[0.08] bg-[#0a0c10]/95 backdrop-blur-xl shadow-2xl p-4 z-50">
            <p className="text-[11px] font-600 text-white/30 uppercase tracking-[0.12em] mb-3 px-1">Try asking about</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); setShowSuggestions(false); inputRef.current?.focus(); }}
                  className="group flex items-center gap-1.5 text-[13px] text-white/50 bg-white/[0.05] hover:bg-white/[0.10] hover:text-white/80 rounded-xl px-3.5 py-2 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-[#e9c46a]/60" />
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-white/20 text-center">
              AI matching across <span className="text-white/40 font-600">{totalProducts}</span> products &amp; services
            </p>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <p className="text-[13px] text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && results.matches.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-white/30">
              Found <span className="text-white/60 font-600">{results.total}</span> matches for &ldquo;<span className="text-white/60">{results.query}</span>&rdquo;
            </p>
            {results.intent.categories.length > 0 && (
              <div className="flex gap-1.5">
                {results.intent.categories.slice(0, 3).map((cat) => (
                  <span key={cat} className="text-[10px] font-500 text-[#e9c46a]/70 bg-[#e9c46a]/10 px-2 py-0.5 rounded-full">
                    {cat.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {results.matches.map((match: MatchResult) => {
              const Icon = UNIT_ICONS[match.product.unit] || Bot;
              const color = UNIT_COLORS[match.product.unit] || "#1a56db";

              return (
                <Link
                  key={match.product.id}
                  href={match.product.href}
                  className="group flex items-start gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[14px] font-600 text-white group-hover:text-[#e9c46a] transition-colors">{match.product.name}</span>
                      <span className="text-[9px] font-500 text-white/20 px-1.5 py-0.5 rounded bg-white/[0.06]">{match.product.type}</span>
                    </div>
                    <p className="text-[12px] text-white/40 leading-snug">{match.product.tagline}</p>
                    {match.matchedTerms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {match.matchedTerms.slice(0, 4).map((term) => (
                          <span key={term} className="text-[9px] font-500 text-[#e9c46a]/50 bg-[#e9c46a]/8 px-1.5 py-0.5 rounded">
                            {term}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="2.5" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke={color} strokeOpacity="0.6" strokeWidth="2.5"
                          strokeDasharray={`${Math.min(match.score, 100)} 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-700 text-white/60">{Math.min(match.score, 99)}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link
              href={`/match?q=${encodeURIComponent(results.query)}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-600 text-[#e9c46a] hover:text-white transition-colors"
            >
              View all {results.total} matches <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Empty state */}
      {results && results.matches.length === 0 && query.length >= 2 && !loading && (
        <div className="mt-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] text-center">
          <Bot className="w-8 h-8 text-white/20 mx-auto mb-3" />
          <p className="text-[14px] text-white/50">No exact matches found for &ldquo;{query}&rdquo;</p>
          <p className="text-[12px] text-white/25 mt-1">Try describing your need differently or browse our product catalog</p>
          <Link href="/products/health" className="inline-flex items-center gap-1.5 text-[13px] font-600 text-[#e9c46a] mt-4 hover:text-white transition-colors">
            Browse all products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

export function AIMatchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] shadow-[0_8px_32px_rgba(26,86,219,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <Search className="w-6 h-6 text-white" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#0a0c10] border border-white/[0.10] rounded-3xl p-6 shadow-2xl animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#e9c46a]" />
                <span className="text-[14px] font-700 text-white">AI Need Matcher</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors">
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>
            <AIMatchWidget embedded />
            <p className="mt-4 text-[11px] text-white/20 text-center">
              AI analyzes your need and matches it to the right BrainSAIT products, services, and partners
            </p>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bot, Send, Sparkles, Users, BookOpen, DollarSign,
  Lightbulb, FileText, ArrowRight, Loader2, Building2,
  BrainCircuit,
} from "lucide-react";
import Link from "next/link";
import { StitchCopilot } from "@/components/stitch";

const suggestions = [
  "I need to automate ICU documentation",
  "How do I integrate with NPHIES?",
  "Find AI solutions for radiology",
  "What funding is available for health tech?",
  "Help me reduce ED wait times",
  "I need FHIR consultants in Riyadh",
];

interface CopilotRecommendation {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  price?: string;
  vendor?: { name: string };
  postedBy?: { name: string };
  rating?: number;
  tags?: string[];
}

interface CopilotResult {
  query: string;
  intent: string;
  model?: string;
  analysis?: string;
  roadmap: string[];
  recommendations: CopilotRecommendation[];
  nextSteps: { action: string; link: string }[];
}

function TypingText({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span>{displayed}{displayed.length < text.length && <span className="animate-pulse text-[#e9c46a]">|</span>}</span>;
}

export default function CopilotPage() {
  const [query, setQuery]                     = useState("");
  const [result, setResult]                   = useState<CopilotResult | null>(null);
  const [isLoading, setIsLoading]             = useState(false);
  const [showResults, setShowResults]         = useState(false);
  const [error, setError]                     = useState<string | null>(null);
  const [clinicalView, setClinicalView]       = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (clinicalView) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#e2e8f0] px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-4 h-4 text-[#7000ff]" />
            <span className="text-sm font-bold text-[#0b1c30]">AI Copilot</span>
          </div>
          <button
            onClick={() => setClinicalView(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748b] hover:bg-[#f1f5f9] transition-all"
          >
            <BrainCircuit className="w-3.5 h-3.5" /> Standard View
          </button>
        </div>
        <div className="flex-1 stitch-bg">
          <StitchCopilot />
        </div>
      </div>
    );
  }

  const handleSubmit = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setIsLoading(true);
    setShowResults(false);
    setError(null);

    try {
      const res = await fetch("/api/marketplace/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: searchQuery }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Copilot request failed");
      setResult(data);
      setTimeout(() => setShowResults(true), 400);
    } catch (err: any) {
      setError(err.message || "Unable to reach BrainSAIT Copilot.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero band */}
      <div className="relative overflow-hidden grad-hero noise">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#1a56db]/[0.15] blur-[100px] animate-orb pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#0d9488]/[0.10] blur-[80px] animate-orb pointer-events-none" style={{ animationDelay: "-5s" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-20 h-20 grad-brand rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float shadow-[var(--shadow-brand)]">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <span className="badge badge-gold mb-4">Healthcare-Tuned AI Assistant</span>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-800 text-white leading-tight mb-3">
            BrainSAIT AI Copilot
          </h1>
          <p className="text-[17px] text-white/60 max-w-2xl mx-auto leading-relaxed">
            Describe your healthcare challenge. Get a compliance-aware analysis,
            a matched ecosystem of verified vendors, experts, and a step-by-step
            implementation roadmap.
          </p>
          <button
            onClick={() => setClinicalView(true)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm font-medium text-white/80 hover:bg-white/20 hover:text-white transition-all"
          >
            <BrainCircuit className="w-4 h-4" /> Switch to Clinical Intelligence View
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8">
        {/* Search bar */}
        <div className="relative mb-8 card-premium p-2">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Describe your healthcare challenge…"
              className="flex-1 px-5 py-3.5 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading}
              className="btn btn-primary px-5 py-3.5 disabled:opacity-50 flex-shrink-0"
            >
              {isLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
              Analyze
            </button>
          </div>
        </div>

        {/* Suggestions */}
        {!result && !isLoading && (
          <div className="mb-12">
            <p className="text-[13px] font-600 text-gray-400 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSubmit(s)}
                  className="px-4 py-2 bg-white border border-[var(--border)] rounded-xl text-[13px] text-gray-600 hover:border-[#1a56db]/30 hover:text-[#1a56db] hover:bg-[#1a56db]/[0.05] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-3.5 bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-sm)]">
              <Loader2 className="w-5 h-5 text-[#1a56db] animate-spin" />
              <span className="text-[14px] text-gray-600">Analyzing your healthcare challenge…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-[14px]">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-premium p-7">
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#e9c46a]" />
                  <span className="text-[13px] font-700 text-gray-700">
                    AI Analysis · <span className="text-[#1a56db]">{result.intent.replace(/_/g, " ")}</span>
                  </span>
                </div>
                <span className="badge badge-dark text-[11px]">
                  {result.model === "keyword-matcher" ? "Rule-Based Engine" : result.model}
                </span>
              </div>

              <div className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                <TypingText text={result.analysis || `Based on your request, here is a tailored roadmap and matching ecosystem resources for "${result.query}".`} speed={12} />
              </div>
            </div>

            {showResults && (
              <div className="space-y-6 animate-fade-in">
                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <Section title="Recommended Resources" icon={Lightbulb}>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {result.recommendations.slice(0, 4).map((rec) => (
                        <div key={rec.id || rec.name || rec.title} className="card p-4 hover:border-[#1a56db]/20 transition-all">
                          <div className="text-[14px] font-700 text-gray-900 mb-1">{rec.title || rec.name}</div>
                          <div className="text-[12.5px] text-gray-500 line-clamp-2">{rec.description || rec.category || (rec.tags || []).join(", ")}</div>
                          <div className="text-[12.5px] text-emerald-600 font-600 mt-2">{rec.price || (rec.rating ? `★ ${rec.rating}` : "")}</div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Roadmap */}
                <Section title="Implementation Roadmap" icon={FileText}>
                  <div className="space-y-3">
                    {result.roadmap.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <span className="w-7 h-7 rounded-full grad-brand text-white text-[12px] font-700 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                          {i + 1}
                        </span>
                        <span className="text-[14px] text-gray-700 pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Users,      label: "Connect with Experts", href: "/marketplace/experts" },
                    { icon: BookOpen,    label: "View Research",        href: "/marketplace/research" },
                    { icon: DollarSign,  label: "Apply for Funding",    href: "/government" },
                    { icon: Building2,   label: "Browse AI Solutions",  href: "/marketplace/ai" },
                  ].map((a) => (
                    <Link
                      key={a.label}
                      href={a.href}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--border)] rounded-xl text-[13.5px] font-600 text-gray-700 hover:border-[#1a56db]/30 hover:text-[#1a56db] hover:bg-[#1a56db]/[0.05] transition-all"
                    >
                      <a.icon className="w-4 h-4" /> {a.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="card-premium p-6">
      <h4 className="flex items-center gap-2 text-[14px] font-700 text-gray-900 mb-4">
        <Icon className="w-4 h-4 text-[#1a56db]" /> {title}
      </h4>
      {children}
    </div>
  );
}

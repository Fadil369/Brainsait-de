"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Send, MapPin, Mail } from "lucide-react";

const COLS = [
  {
    heading: "Products",
    links: [
      { label: "BrainSAIT Health",     href: "/products/health" },
      { label: "BrainSAIT AI",         href: "/products/ai" },
      { label: "BrainSAIT Cloud",      href: "/products/cloud" },
      { label: "BrainSAIT Trust",      href: "/products/trust" },
      { label: "BrainSAIT Academy",    href: "/products/academy" },
      { label: "BrainSAIT Ventures",   href: "/products/ventures" },
    ],
  },
  {
    heading: "Marketplace",
    links: [
      { label: "Post a Need",           href: "/marketplace/needs" },
      { label: "Offer a Solution",      href: "/marketplace/offers" },
      { label: "AI Marketplace",        href: "/marketplace/ai" },
      { label: "API Marketplace",       href: "/marketplace/api" },
      { label: "Expert Network",        href: "/marketplace/experts" },
      { label: "Document Templates",    href: "/marketplace/templates" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "AI Copilot",            href: "/copilot" },
      { label: "Governance Framework", href: "/governance" },
      { label: "Product Store",         href: "/sadad" },
      { label: "Community",             href: "/community" },
      { label: "Government Portal",     href: "/government" },
      { label: "System Status",         href: "/status" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About BrainSAIT",       href: "/about" },
      { label: "Blog & Insights",       href: "/blog" },
      { label: "Contact",               href: "/contact" },
      { label: "Investor Relations",    href: "/investors" },
      { label: "Privacy Policy",        href: "/privacy" },
      { label: "Terms of Service",      href: "/terms" },
    ],
  },
];

const COMPLIANCE = ["PDPL Compliant", "NPHIES Certified", "FHIR R4 Native", "ISO 27001", "MOH Registered", "HIPAA Aligned"];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubState("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Subscription failed");
      }
      setSubState("success");
      setEmail("");
    } catch (err) {
      setSubState("error");
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <footer className="bg-[#06080c] text-gray-400 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a56db]/[0.07] rounded-full blur-[120px] pointer-events-none" />

      {/* Newsletter band */}
      <div className="border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-[18px] font-700 text-white mb-1.5">Stay ahead of healthcare innovation</h3>
              <p className="text-[14px] text-gray-500">Weekly digest of Saudi & MENA health-tech opportunities, regulation updates, and platform news.</p>
            </div>
            {subState === "success" ? (
              <div className="flex items-center gap-2 text-emerald-400 text-[14px] font-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Subscribed! Check your inbox.
              </div>
            ) : (
              <form className="flex w-full max-w-md" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 bg-white/[0.05] border border-white/[0.10] rounded-l-xl text-[14px] text-white placeholder-gray-600 focus:outline-none focus:border-[#1a56db]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={subState === "loading"}
                  className="px-5 py-3 grad-brand rounded-r-xl text-white text-[13.5px] font-600 hover:opacity-90 transition-opacity flex items-center gap-2 flex-shrink-0 disabled:opacity-60"
                >
                  {subState === "loading" ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10"/></svg>
                  ) : (
                    <><Send className="w-4 h-4" /> Subscribe</>
                  )}
                </button>
              </form>
            )}
          </div>
          {errMsg && subState === "error" && (
            <p className="text-red-400 text-[12px] mt-2 text-center lg:text-right">{errMsg}</p>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

          {/* Brand col */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 grad-brand rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M7 10h2V8a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H7a1 1 0 010-2z" fill="white"/>
                </svg>
              </div>
              <div>
                <span className="block text-[15px] font-700 text-white leading-none">BrainSAIT</span>
                <span className="block text-[10px] text-gray-600 tracking-widest uppercase mt-0.5">Health Exchange</span>
              </div>
            </Link>

            <p className="text-[13.5px] text-gray-500 leading-relaxed mb-5 max-w-[240px]">
              The Healthcare Operating Marketplace for Saudi Arabia and the MENA region. Aligned with Vision 2030.
            </p>

            <div className="space-y-2">
              <a href="mailto:hello@brainsait.de" className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#0d9488] transition-colors">
                <Mail className="w-3.5 h-3.5" /> hello@brainsait.de
              </a>
              <div className="flex items-center gap-2 text-[13px] text-gray-600">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> Riyadh, Kingdom of Saudi Arabia
              </div>
            </div>

            {/* Compliance badges */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {COMPLIANCE.slice(0, 4).map((b) => (
                <span key={b} className="text-[10.5px] font-500 text-gray-600 bg-white/[0.04] border border-white/[0.07] rounded-full px-2.5 py-1">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-700 text-gray-500 uppercase tracking-[0.12em] mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-gray-600 hover:text-[#0d9488] transition-colors hover:translate-x-0.5 inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12.5px] text-gray-700">
            © {new Date().getFullYear()} BrainSAIT GmbH · brainsait.de · All rights reserved
          </p>
          <div className="flex items-center gap-5">
            {COMPLIANCE.map((b) => (
              <span key={b} className="text-[11px] text-gray-700">{b}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

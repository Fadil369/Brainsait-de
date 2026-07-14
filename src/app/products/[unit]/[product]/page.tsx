"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Loader2, ShoppingCart, MessageSquare, ExternalLink, Sparkles } from "lucide-react";
import { getCatalog, CatalogProduct } from "@/lib/product-catalog";
import { AIMatchWidget } from "@/components/AIMatchWidget";
import { useState } from "react";

const UNIT_COLORS: Record<string, string> = {
  health: "#1a56db", ai: "#7c3aed", cloud: "#0d9488",
  trust: "#b8963e", academy: "#e11d48", ventures: "#059669",
};

const UNIT_LABELS: Record<string, string> = {
  health: "BrainSAIT Health", ai: "BrainSAIT AI", cloud: "BrainSAIT Cloud",
  trust: "BrainSAIT Trust", academy: "BrainSAIT Academy", ventures: "BrainSAIT Ventures",
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ unit: string; product: string }>;
}) {
  const { unit, product } = use(params);
  const catalog = getCatalog();
  const item = catalog.find(
    (p) => p.unit === unit && p.id === product
  );

  if (!item) return notFound();

  const relatedProducts = catalog
    .filter((p) => p.unit === unit && p.id !== product)
    .slice(0, 4);

  const color = UNIT_COLORS[unit] || "#1a56db";

  return (
    <main className="min-h-screen bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[500px] rounded-b-[3rem]" style={{ background: `linear-gradient(to bottom, ${color}12, transparent)` }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-white/30 mb-8">
          <Link href="/products/health" className="hover:text-white/60 transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products/${unit}`} className="hover:text-white/60 transition-colors" style={{ color }}>{UNIT_LABELS[unit]}</Link>
          <span>/</span>
          <span className="text-white/60">{item.name}</span>
        </div>

        {/* Product header */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
                <Bot className="w-7 h-7" style={{ color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-700 uppercase tracking-[0.12em] px-2 py-0.5 rounded-full text-white" style={{ background: color }}>{item.status}</span>
                  <span className="text-[10px] font-500 text-white/30 px-2 py-0.5 rounded-full bg-white/[0.06]">{item.type}</span>
                </div>
                <h1 className="text-[2.5rem] font-800 text-white leading-[1.05] mb-1">{item.name}</h1>
                <p className="text-[16px] font-500" style={{ color }}>{item.tagline}</p>
              </div>
            </div>

            <p className="text-[15px] text-white/50 leading-relaxed mb-8 max-w-2xl">{item.description}</p>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 mb-8">
              {item.keywords.map((kw) => (
                <span key={kw} className="text-[12px] text-white/40 bg-white/[0.06] border border-white/[0.08] rounded-full px-3 py-1">
                  {kw}
                </span>
              ))}
            </div>

            {/* AI Match for this product */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#e9c46a]" />
                <span className="text-[13px] font-600 text-white/70">Get a personalised demo</span>
              </div>
              <AIMatchWidget
                placeholder={`Tell us about your ${item.name} needs...`}
                embedded
              />
            </div>
          </div>

          {/* CTA sidebar */}
          <div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 sticky top-24">
              <h3 className="text-[14px] font-700 text-white mb-4">Get started with {item.name}</h3>
              <div className="space-y-3">
                <Link href="/sadad" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 gradient-health text-white rounded-xl text-[14px] font-semibold hover:opacity-90 transition-all shadow-lg">
                  <ShoppingCart className="w-4 h-4" /> Buy via SADAD
                </Link>
                <Link href="/marketplace/needs/new" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/[0.08] text-white rounded-xl text-[14px] font-semibold hover:bg-white/[0.12] transition-all border border-white/[0.10]">
                  <MessageSquare className="w-4 h-4" /> Request Consultation
                </Link>
                <Link href="/match" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-white/50 rounded-xl text-[13px] font-500 hover:text-white/70 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" /> Compare alternatives
                </Link>
              </div>
              <div className="mt-5 pt-5 border-t border-white/[0.07]">
                <p className="text-[11px] text-white/30 leading-relaxed">
                  All transactions via SADAD (stc pay) · Biller code 207 · Min SAR 5,000 · Invoicing included
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-[20px] font-700 text-white mb-6">More from {UNIT_LABELS[unit]}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.unit}/${p.id}`}
                  className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all"
                >
                  <h3 className="text-[14px] font-700 text-white mb-1 group-hover:text-[#e9c46a] transition-colors">{p.name}</h3>
                  <p className="text-[12px] text-white/40 leading-snug">{p.tagline}</p>
                  <div className="flex items-center gap-1 mt-3 text-[11px] text-[#e9c46a] font-500 opacity-0 group-hover:opacity-100 transition-all">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

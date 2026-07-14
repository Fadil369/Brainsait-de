"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Brain, Shield, Zap } from "lucide-react";
import { stitchViews } from "./components";

export default function ClinicalIntelligenceHub() {
  return (
    <div className="min-h-full">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1c30] via-[#0f2847] to-[#1a0a2e] px-6 py-16 lg:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#0052cc]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#7000ff]/15 rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white/70">
              Stitch Design System v1.0
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              15 Clinical Screens
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            Clinical Intelligence
            <span className="block bg-gradient-to-r from-[#28d9f3] via-[#7000ff] to-[#0052cc] bg-clip-text text-transparent">
              Design System
            </span>
          </h1>

          <p className="text-lg text-white/60 max-w-2xl leading-relaxed mb-8">
            A comprehensive suite of 15 healthcare UI screens powered by the Stitch design system —
            glassmorphic AI interfaces, clinical-grade data visualization, and RTL Arabic support.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              { icon: Brain, label: "AI-First Design", color: "from-[#7000ff] to-[#0052cc]" },
              { icon: Shield, label: "HIPAA Compliant", color: "from-[#059669] to-[#0d9488]" },
              { icon: Zap, label: "Real-time Data", color: "from-[#b8963e] to-[#e9c46a]" },
            ].map((badge) => (
              <span key={badge.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                <badge.icon className="w-3.5 h-3.5" />
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stitchViews.map((view, i) => (
            <Link
              key={view.id}
              href={`/clinical-intelligence/${view.id}`}
              className="group relative bg-white rounded-2xl border border-[#e2e8f0] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${view.color}12`, color: view.color }}
                >
                  <view.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-bold text-[#0b1c30] group-hover:text-[#0052cc] transition-colors">
                    {view.label}
                  </h3>
                  <p className="text-[13px] text-[#64748b] mt-0.5 leading-snug line-clamp-2">
                    {view.desc}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#0052cc] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-[#f1f5f9] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 group-hover:w-full" style={{ width: `${Math.random() * 40 + 30}%`, backgroundColor: view.color }} />
                </div>
                <span className="text-[10px] font-medium text-[#94a3b8]">Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[#e2e8f0] bg-white/50">
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="text-[13px] font-semibold text-[#64748b] uppercase tracking-wider mb-2">Design System Features</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { label: "Glassmorphism", value: "AI Surfaces" },
              { label: "Color Palette", value: "22 Variables" },
              { label: "Typography", value: "Inter + Mono" },
              { label: "RTL Support", value: "Arabic Ready" },
            ].map((f) => (
              <div key={f.label} className="bg-white rounded-xl border border-[#e2e8f0] p-3">
                <p className="text-xs text-[#64748b]">{f.label}</p>
                <p className="text-sm font-bold text-[#0b1c30]">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

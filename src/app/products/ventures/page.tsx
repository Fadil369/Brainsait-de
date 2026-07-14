"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Lightbulb, Rocket, Briefcase, Users, LineChart, Star, ShoppingBag, Target } from "lucide-react";

const PRODUCTS = [
  { icon: Lightbulb, name: "Spark", tagline: "AI-Native Innovation Engine", desc: "Innovation management platform — crowdsource challenges, manage ideas, and accelerate health-tech solutions with AI-powered matching.", status: "Live" },
  { icon: Rocket, name: "Incubator", tagline: "Health-Tech Incubation Program", desc: "Full incubation for early-stage health-tech startups — AI tooling, GitHub automation, mentorship, regulatory navigation, and seed funding access.", status: "Live" },
  { icon: Target, name: "Accelerator", tagline: "Growth-Stage Accelerator", desc: "Intensive 12-week accelerator for growth-stage health-tech companies — market access, investor readiness, and enterprise pilot facilitation.", status: "Live" },
  { icon: Briefcase, name: "Founder OS", tagline: "Startup Operating System", desc: "All-in-one toolkit for health-tech founders — cap table management, compliance tracking, investor updates, and milestone planning.", status: "Beta" },
  { icon: Users, name: "Startup CRM", tagline: "Health-Tech CRM", desc: "Purpose-built CRM for health-tech startups — hospital outreach, procurement tracking, partnership management, and deal pipeline.", status: "Beta" },
  { icon: LineChart, name: "Investor Portal", tagline: "Startup Investment Platform", desc: "Curated investor access to vetted health-tech startups — deal flow, due diligence materials, and portfolio tracking.", status: "Live" },
  { icon: Star, name: "Mentor Portal", tagline: "Expert Mentorship Network", desc: "Connect with healthcare industry experts, clinical advisors, and seasoned entrepreneurs for 1-on-1 guidance.", status: "Live" },
  { icon: ShoppingBag, name: "Demo Day Platform", tagline: "Virtual & Hybrid Demo Days", desc: "Platform for hosting demo days — pitch videos, live Q&A, investor matching, and follow-up tracking.", status: "Live" },
  { icon: Sparkles, name: "Startup Marketplace", tagline: "Health-Tech Startup Directory", desc: "Discover and connect with vetted health-tech startups — solutions for every healthcare challenge.", status: "Live" },
];

export default function VenturesPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-[#059669]/[0.08] blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#059669]" />
            </div>
            <span className="text-[11px] font-700 text-[#059669] uppercase tracking-[0.12em]">Business Unit</span>
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-4">BrainSAIT Ventures</h1>
          <p className="text-[18px] text-white/50 leading-relaxed max-w-2xl">
            Startup ecosystem platform combining AI-native tooling, GitHub automation, mentorship, regulatory navigation, and investor access for health-tech founders.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/marketplace" className="btn btn-gold">Explore Ecosystem</Link>
            <Link href="/sadad" className="btn btn-ghost-white">Browse Venture Products</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => (
            <Link key={p.name} href="/marketplace" className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <p.icon className="w-5 h-5 text-white/70" />
                </div>
                <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full ${
                  p.status === "Live" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                }`}>{p.status}</span>
              </div>
              <h3 className="text-[16px] font-700 text-white mb-1">{p.name}</h3>
              <p className="text-[12px] text-[#34d399] font-500 mb-2">{p.tagline}</p>
              <p className="text-[13px] text-white/40 leading-relaxed">{p.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[12.5px] font-600 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all">
                Learn more <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Bot, Globe, Users, BookOpen, Code, Briefcase, TrendingUp, Calculator } from "lucide-react";

const SECTIONS = [
  {
    heading: "Procurement",
    icon: Briefcase,
    color: "#1a56db",
    items: [
      { href: "/marketplace/needs", label: "Post a Need", desc: "Publish your challenge and receive proposals from verified providers", icon: "🎯" },
      { href: "/marketplace/offers", label: "Offer a Solution", desc: "Showcase your products, services, and capabilities to buyers", icon: "🤝" },
      { href: "/marketplace/procurement", label: "Tenders & RFPs", desc: "Formal procurement requests from hospitals and healthcare organisations", icon: "📄" },
      { href: "/marketplace/equipment", label: "Medical Equipment", desc: "Devices, instruments, and supplies from verified suppliers", icon: "🏥" },
    ],
  },
  {
    heading: "Revenue Cycle & Coding",
    icon: Calculator,
    color: "#059669",
    items: [
      { href: "/marketplace/drg", label: "BrainSAIT DRG Suite", desc: "Bilingual APR-DRG / EAPG coding, grouping and NPHIES claims", icon: "🏥" },
      { href: "/marketplace/offers?category=coding", label: "Coding Services", desc: "ICD-10-AM, CPT and Saudi procedure coding providers", icon: "📝" },
      { href: "/marketplace/offers?category=revenue-cycle", label: "RCM Solutions", desc: "Eligibility, claims, denials and payment reconciliation", icon: "💰" },
      { href: "/marketplace/needs/new?category=revenue-cycle", label: "Post RFP", desc: "Publish a revenue-cycle or coding RFP to verified vendors", icon: "📢" },
    ],
  },
  {
    heading: "Innovation",
    icon: Sparkles,
    color: "#7c3aed",
    items: [
      { href: "/marketplace/challenges", label: "Innovation Challenges", desc: "Crowdsourced problem-solving with prize-backed challenges", icon: "💡" },
      { href: "/marketplace/projects", label: "Projects", desc: "Collaborative delivery of complex healthcare initiatives", icon: "📋" },
      { href: "/marketplace/research", label: "Research Hub", desc: "Academic and clinical research collaboration opportunities", icon: "🔬" },
      { href: "/marketplace/ai", label: "AI Marketplace", desc: "Ready-made AI models, agents, and healthcare automation services", icon: "🤖" },
    ],
  },
  {
    heading: "Data & Technology",
    icon: Globe,
    color: "#0d9488",
    items: [
      { href: "/marketplace/api", label: "API Marketplace", desc: "FHIR, HL7, and REST APIs for healthcare integration", icon: "⚙️" },
      { href: "/marketplace/data", label: "Data Marketplace", desc: "Curated, compliant healthcare datasets for training and analytics", icon: "📊" },
    ],
  },
  {
    heading: "Talent & Learning",
    icon: BookOpen,
    color: "#e11d48",
    items: [
      { href: "/marketplace/experts", label: "Expert Network", desc: "Top healthcare consultants and specialists on demand", icon: "⭐" },
      { href: "/marketplace/jobs", label: "Jobs Board", desc: "Healthcare careers, roles, and talent matching", icon: "💼" },
      { href: "/marketplace/education", label: "Education & CME", desc: "Courses, certifications, and continuous medical education", icon: "🎓" },
      { href: "/marketplace/mentorship", label: "Mentorship", desc: "1-on-1 guidance from seasoned healthcare leaders", icon: "👥" },
    ],
  },
];

const FALLBACK_STATS = [
  { value: "2,400+", label: "Active Needs" },
  { value: "850+", label: "Verified Providers" },
  { value: "15K+", label: "Platform Users" },
  { value: "SAR 120M+", label: "Opportunities Posted" },
];

export default function MarketplacePage() {
  const [stats, setStats] = useState<typeof FALLBACK_STATS>(FALLBACK_STATS);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats([
          { value: `${data.activeListings?.toLocaleString() || "2,400+"}+`, label: "Active Needs" },
          { value: `${data.verifiedPartners?.toLocaleString() || "850+"}+`, label: "Verified Providers" },
          { value: `${Math.round((data.platformMembers || 15000) / 1000)}K+`, label: "Platform Users" },
          { value: "SAR 120M+", label: "Opportunities Posted" },
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0c10] py-24">
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#1a56db]/[0.08] blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.10] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#e9c46a]" />
            <span className="text-[12px] font-600 text-white/60">The Marketplace for Healthcare Innovation</span>
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-5">
            Where healthcare needs
            <br />
            <span className="text-grad-gold">meet verified solutions</span>
          </h1>
          <p className="text-[17px] text-white/50 max-w-2xl mx-auto leading-relaxed mb-8">
            BrainSAIT Health Exchange connects hospitals, clinics, and healthcare organisations
            with verified AI companies, consultants, and technology providers — powered by AI matching.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/marketplace/needs/new" className="btn btn-gold btn-lg shadow-[0_8px_32px_rgba(233,196,106,0.25)]">
              Post a Need <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/match" className="btn btn-ghost-white btn-lg">
              <Sparkles className="w-4 h-4" /> AI Need Matcher
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="bg-white p-5 text-center">
                <p className="text-[1.75rem] font-800 text-grad-brand leading-none mb-1">{s.value}</p>
                <p className="text-[12px] text-gray-500 font-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {SECTIONS.map((section) => (
              <div key={section.heading} className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${section.color}15` }}>
                    <section.icon className="w-5 h-5" style={{ color: section.color }} />
                  </div>
                  <h2 className="text-[18px] font-700 text-gray-900">{section.heading}</h2>
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl leading-none mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-[14px] font-600 text-gray-900 group-hover:text-[#1a56db] transition-colors">{item.label}</p>
                        <p className="text-[12px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Match CTA */}
      <section className="py-16 bg-[#0a0c10] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Bot className="w-10 h-10 text-[#e9c46a] mx-auto mb-5" />
          <h2 className="text-[2rem] font-800 text-white mb-4">Not sure what you need?</h2>
          <p className="text-[16px] text-white/50 leading-relaxed mb-8">
            Use our AI Need Matcher to describe your challenge in plain language.
            Our AI will recommend the right products, services, and verified providers — instantly.
          </p>
          <Link href="/match" className="btn btn-gold btn-lg shadow-[0_8px_32px_rgba(233,196,106,0.2)]">
            <Sparkles className="w-4 h-4" /> Try AI Need Matcher Free
          </Link>
        </div>
      </section>
    </main>
  );
}

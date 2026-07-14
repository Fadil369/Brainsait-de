"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, Award, Users, Target, TrendingUp,
  Shield, FileText, Clock, CheckCircle2, Lightbulb, Star,
  ChevronRight, Sparkles, BookOpen, Download, CreditCard, Globe,
  BarChart3, Layers, Zap, GraduationCap, Bot, Building2,
  FileSpreadsheet, ClipboardCheck, Lock, Scale, BookTemplate,
  ShoppingCart,
} from "lucide-react";

const TEMPLATE_STATS = [
  { value: "550+", label: "Policy Controls", desc: "Across 6 governance pillars", color: "#1a56db" },
  { value: "8", label: "Regulatory Regimes", desc: "PDPL, NPHIES, CBAHI, NCA-ECC & more", color: "#0d9488" },
  { value: "48", label: "Domain Policies", desc: "Comprehensive coverage", color: "#b8963e" },
  { value: "450+", label: "Document Templates", desc: "Ready-to-use healthcare docs", color: "#7c3aed" },
  { value: "100%", label: "PDPL Compliant", desc: "Saudi data privacy law aligned", color: "#059669" },
  { value: "SAR 45K", label: "Complete Bundle", desc: "Full framework suite", color: "#dc2626" },
];

const CATEGORIES = [
  {
    icon: Shield, title: "Governance Framework",
    desc: "Complete Saudi Healthcare Information Governance Framework (SHDIGF v3.0) covering policies, standards, and procedures for all healthcare document types.",
    examples: ["Data governance policies", "Document classification", "Retention schedules", "Access control matrices"],
    price: "SAR 45,000",
    popular: true,
  },
  {
    icon: Scale, title: "PDPL Compliance Toolkit",
    desc: "Comprehensive toolkit for Saudi Personal Data Protection Law compliance, including ROPA, DPIAs, consent forms, and breach notification templates.",
    examples: ["ROPA register", "DPIA templates", "Consent forms", "Breach notification"],
    price: "SAR 18,000",
    popular: true,
  },
  {
    icon: FileSpreadsheet, title: "NPHIES Data Governance",
    desc: "Data governance templates specifically designed for NPHIES integration, claims data management, and health information exchange compliance.",
    examples: ["Data quality frameworks", "NPHIES mapping docs", "Claims data policies", "Interoperability specs"],
    price: "SAR 15,000",
    popular: false,
  },
  {
    icon: ClipboardCheck, title: "Clinical Safety & Risk",
    desc: "Clinical safety case templates, risk management documentation, and patient safety frameworks aligned with Saudi healthcare standards.",
    examples: ["Clinical safety cases", "Risk registers", "Incident reporting", "CAPA templates"],
    price: "SAR 16,000",
    popular: false,
  },
  {
    icon: Lock, title: "Access Control & IAM",
    desc: "Identity and access management templates, RBAC matrices, audit log frameworks, and cybersecurity documentation for healthcare organisations.",
    examples: ["RBAC matrices", "IAM policies", "Audit frameworks", "Privileged access"],
    price: "SAR 10,000",
    popular: false,
  },
  {
    icon: Layers, title: "Records Management",
    desc: "Health records management templates covering creation, storage, retrieval, and disposal of patient and administrative records.",
    examples: ["Records retention", "Archive procedures", "File plans", "Disposal schedules"],
    price: "SAR 12,000",
    popular: false,
  },
];

const REGULATORY_REGS = [
  { code: "PDPL", name: "Personal Data Protection Law", icon: Shield },
  { code: "NPHIES", name: "National Platform for Health Insurance", icon: Globe },
  { code: "CBAHI", name: "Saudi Central Board for Accreditation", icon: Award },
  { code: "NCA-ECC", name: "National Cybersecurity Authority", icon: Lock },
  { code: "MOH", name: "Ministry of Health Regulations", icon: FileText },
  { code: "ISO 27001", name: "Information Security Management", icon: CheckCircle2 },
  { code: "SAMA", name: "Saudi Central Bank CSF", icon: TrendingUp },
  { code: "SFDA", name: "Saudi Food & Drug Authority", icon: Shield },
];

const STEPS = [
  { step: "1", title: "Select", desc: "Browse our library of 450+ document templates and choose the ones that match your compliance needs.", color: "#1a56db" },
  { step: "2", title: "Purchase", desc: "Pay securely via SADAD (stc pay) — biller code 207. Receive instant invoice and access instructions.", color: "#0d9488" },
  { step: "3", title: "Customise", desc: "Each template is provided in editable format. Adapt to your organisation's specific policies and workflows.", color: "#b8963e" },
  { step: "4", title: "Comply", desc: "Implement the documents, train your team, and achieve compliance with Saudi healthcare regulations.", color: "#7c3aed" },
];

const RESOURCES = [
  { icon: FileText, title: "SHDIGF v3.0 Framework", desc: "Full Arabic governance framework document (RTL)", href: "#resources" },
  { icon: Download, title: "Template Catalogue", desc: "Complete list of all 450+ available templates", href: "/sadad" },
  { icon: BookOpen, title: "Compliance Roadmap", desc: "Step-by-step guide to regulatory compliance", href: "/governance" },
  { icon: Shield, title: "PDPL Quick Start", desc: "Essential templates for PDPL compliance", href: "/sadad" },
];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<"library" | "purchase" | "resources">("library");

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden grad-hero noise">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#1a56db]/[0.10] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#b8963e]/[0.08] blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="max-w-[900px]">
            <div className="animate-fade-up mb-6">
              <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors mb-4">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-dark text-[11px]">
                  <Sparkles className="w-3 h-3 text-[#e9c46a]" />
                  Healthcare Document Templates
                </span>
                <span className="badge badge-dark text-[11px]">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  PDPL & NPHIES Compliant
                </span>
              </div>
            </div>

            <h1 className="animate-fade-up text-[clamp(2.25rem,5.5vw,4rem)] font-800 leading-[1.05] tracking-[-0.03em] mb-6" style={{ animationDelay: "0.1s" }}>
              <span className="text-white">Healthcare Document</span>
              <br />
              <span className="text-grad-gold">Templates & Compliance Suite</span>
            </h1>

            <p className="animate-fade-up text-[clamp(1rem,1.8vw,1.2rem)] text-white/60 leading-relaxed mb-8 max-w-[600px]" style={{ animationDelay: "0.2s" }}>
              450+ ready-to-use document templates, policies, and compliance frameworks for Saudi healthcare stakeholders.
              Aligned with <strong className="text-white">PDPL, NPHIES, CBAHI, NCA-ECC, MOH, ISO 27001, SAMA & SFDA</strong>.
            </p>

            <div className="animate-fade-up flex flex-wrap items-center gap-3 mb-12" style={{ animationDelay: "0.3s" }}>
              <button onClick={() => setActiveTab("purchase")} className="btn btn-gold btn-lg">
                Purchase Templates <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <button onClick={() => setActiveTab("library")} className="btn btn-ghost-white btn-lg">
                <BookTemplate className="w-4.5 h-4.5" /> Browse Library
              </button>
              <Link href="/governance" className="btn btn-ghost-white btn-lg">
                <Layers className="w-4.5 h-4.5" /> Governance Framework
              </Link>
            </div>

            <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: "0.4s" }}>
              {TEMPLATE_STATS.slice(0, 4).map((s) => (
                <div key={s.label} className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.09] backdrop-blur-sm">
                  <span className="block text-[20px] font-800 text-white leading-none">{s.value}</span>
                  <span className="block text-[11.5px] text-white/40 mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#f8f9fc] to-transparent pointer-events-none" />
      </section>

      {/* ===== FULL STATS BAND ===== */}
      <section className="py-10 -mt-4 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {TEMPLATE_STATS.map((s) => (
              <div key={s.label} className="bg-white p-5 text-center">
                <p className="text-[clamp(1.25rem,2vw,1.75rem)] font-800 leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[11px] font-600 text-gray-700 mt-1">{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TAB NAV ===== */}
      <section className="pb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 p-1 bg-white border border-[var(--border)] rounded-2xl shadow-sm">
            {[
              { key: "library" as const, label: "Template Library", icon: BookTemplate },
              { key: "purchase" as const, label: "Purchase & Pricing", icon: ShoppingCart },
              { key: "resources" as const, label: "Resources & Documents", icon: BookOpen },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-600 transition-all ${
                  activeTab === tab.key
                    ? "bg-[#1a56db] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TAB: LIBRARY ===== */}
      {activeTab === "library" && (
        <section className="pb-20 animate-fade-in">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* About */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[var(--border)] p-8 shadow-sm">
                <h2 className="text-[22px] font-800 text-gray-900 mb-4">Complete Document Templates for Healthcare Compliance</h2>
                <div className="space-y-4 text-[14px] text-gray-600 leading-relaxed">
                  <p>
                    The <strong className="text-gray-900">BrainSAIT Document Templates Library</strong> is the most comprehensive collection
                    of healthcare governance documents, compliance templates, and policy frameworks for the Saudi healthcare sector.
                    Every template is designed to align with Saudi regulatory requirements and international best practices.
                  </p>
                  <p>
                    Our templates cover <strong className="text-gray-900">8 regulatory regimes</strong> including PDPL, NPHIES, CBAHI,
                    NCA-ECC, MOH, ISO 27001, SAMA, and SFDA — ensuring your organisation meets every compliance obligation
                    under Saudi law.
                  </p>
                  <p>
                    Whether you are a hospital, health-tech startup, insurance provider, or government entity, our ready-to-use
                    templates save you months of document development time and thousands in consulting fees.
                    <strong className="text-gray-900"> All templates are SADAD-enabled for instant purchase.</strong>
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0a0c10] to-[#1a1d24] rounded-2xl p-8 text-white shadow-sm">
                <Award className="w-8 h-8 text-[#e9c46a] mb-4" />
                <h3 className="text-[17px] font-700 mb-3">Why Our Templates?</h3>
                <ul className="space-y-3">
                  {[
                    "450+ ready-to-use document templates",
                    "Aligned with 8 Saudi regulatory regimes",
                    "Editable formats — customise to your needs",
                    "Bilingual (Arabic / English) available",
                    "Instant delivery via SADAD payment",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13px] text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setActiveTab("purchase")} className="mt-6 w-full btn btn-gold justify-center">
                  Browse Pricing <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Regulatory regimes */}
            <div>
              <h2 className="text-[20px] font-800 text-gray-900 mb-6">Regulatory Coverage</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {REGULATORY_REGS.map((r) => (
                  <div key={r.code} className="bg-white rounded-xl p-4 border border-[var(--border)] flex items-center gap-3 hover:shadow-sm transition-shadow">
                    <div className="w-9 h-9 rounded-lg bg-[#e8effd] flex items-center justify-center flex-shrink-0">
                      <r.icon className="w-4.5 h-4.5 text-[#1a56db]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-700 text-gray-900 leading-tight">{r.code}</p>
                      <p className="text-[10.5px] text-gray-500 leading-tight">{r.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Template categories */}
            <div>
              <h2 className="text-[20px] font-800 text-gray-900 mb-6">Template Categories</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((cat, i) => (
                  <div key={cat.title} className="bg-white rounded-xl p-5 border border-[var(--border)] hover:shadow-md hover:-translate-y-0.5 transition-all group relative">
                    {cat.popular && (
                      <span className="absolute top-3 right-3 text-[9px] font-700 px-2 py-0.5 rounded-full bg-[#e9c46a]/20 text-[#b8963e] border border-[#e9c46a]/30">
                        Best Seller
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-[#e8effd] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <cat.icon className="w-5 h-5 text-[#1a56db]" />
                    </div>
                    <h3 className="text-[14px] font-700 text-gray-900 mb-1.5">{cat.title}</h3>
                    <p className="text-[12.5px] text-gray-500 leading-relaxed mb-3">{cat.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {cat.examples.map((ex) => (
                        <span key={ex} className="text-[10px] font-500 px-2 py-0.5 rounded-full bg-[#f8f9fc] text-gray-500 border border-[var(--border)]">
                          {ex}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                      <span className="text-[15px] font-800 text-emerald-600">{cat.price}</span>
                      <Link href="/sadad" className="flex items-center gap-1 text-[12px] font-600 text-[#1a56db] hover:underline">
                        Purchase <CreditCard className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document types showcase */}
            <div>
              <h2 className="text-[20px] font-800 text-gray-900 mb-6">Document Types Available</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: FileText, title: "Policies & Procedures", count: "120+" },
                  { icon: ClipboardCheck, title: "Compliance Checklists", count: "65+" },
                  { icon: Scale, title: "Legal & Regulatory", count: "80+" },
                  { icon: Layers, title: "Data Governance", count: "55+" },
                  { icon: Shield, title: "Security & Privacy", count: "70+" },
                  { icon: Users, title: "HR & Training", count: "40+" },
                  { icon: TrendingUp, title: "Risk Management", count: "30+" },
                  { icon: BookOpen, title: "Clinical Documentation", count: "50+" },
                ].map((d) => (
                  <div key={d.title} className="bg-white rounded-xl p-4 border border-[var(--border)] hover:shadow-sm transition-all text-center">
                    <d.icon className="w-6 h-6 text-[#1a56db] mx-auto mb-2" />
                    <p className="text-[12.5px] font-600 text-gray-900">{d.title}</p>
                    <p className="text-[10px] text-gray-400">{d.count} templates</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== TAB: PURCHASE ===== */}
      {activeTab === "purchase" && (
        <section className="pb-20 animate-fade-in">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Pricing showcase */}
            <div className="grid md:grid-cols-3 gap-5">
              {CATEGORIES.filter(c => c.popular).slice(0, 3).map((cat) => (
                <div key={cat.title} className="bg-white rounded-2xl border-2 border-[#1a56db]/20 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#1a56db]/5 rounded-bl-[100%]" />
                  <span className="text-[10px] font-700 px-2.5 py-0.5 rounded-full bg-[#1a56db] text-white inline-block mb-3">Featured</span>
                  <div className="w-10 h-10 rounded-xl bg-[#e8effd] flex items-center justify-center mb-3">
                    <cat.icon className="w-5 h-5 text-[#1a56db]" />
                  </div>
                  <h3 className="text-[16px] font-700 text-gray-900 mb-1">{cat.title}</h3>
                  <p className="text-[12px] text-gray-500 mb-4">{cat.desc}</p>
                  <p className="text-[24px] font-800 text-emerald-600 mb-4">{cat.price}</p>
                  <Link href="/sadad" className="w-full btn btn-primary justify-center">
                    <ShoppingCart className="w-4 h-4" /> Buy Now via SADAD
                  </Link>
                </div>
              ))}
            </div>

            {/* All products */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-8 shadow-sm">
              <h2 className="text-[20px] font-800 text-gray-900 mb-6">All Template Bundles</h2>
              <div className="space-y-4">
                {CATEGORIES.map((cat) => (
                  <div key={cat.title} className="flex items-center justify-between p-4 rounded-xl bg-[#f8f9fc] border border-[var(--border)] hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                        <cat.icon className="w-4.5 h-4.5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-600 text-gray-900">{cat.title}</h4>
                          {cat.popular && <span className="text-[9px] font-600 px-1.5 py-0.5 rounded-full bg-[#e8effd] text-[#1a56db]">Popular</span>}
                        </div>
                        <p className="text-[11.5px] text-gray-500">{cat.examples.slice(0, 3).join(" · ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-[16px] font-800 text-emerald-600">{cat.price}</span>
                      <Link href="/sadad" className="btn btn-primary btn-sm">
                        Buy Now <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-8 shadow-sm">
              <h2 className="text-[20px] font-800 text-gray-900 mb-6">How to Purchase</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STEPS.map((s) => (
                  <div key={s.step} className="text-center">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: `${s.color}15` }}>
                      <span className="text-[20px] font-800" style={{ color: s.color }}>{s.step}</span>
                    </div>
                    <h3 className="text-[14px] font-700 text-gray-900 mb-1.5">{s.title}</h3>
                    <p className="text-[12.5px] text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#0a0c10] to-[#1a1d24] rounded-2xl p-8 lg:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
              <div className="relative">
                <Sparkles className="w-10 h-10 text-[#e9c46a] mx-auto mb-4" />
                <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-800 text-white mb-3">Ready to achieve full compliance?</h2>
                <p className="text-[15px] text-white/50 max-w-xl mx-auto leading-relaxed mb-6">
                  Purchase the complete governance bundle and get all 550+ controls, 450+ templates, and coverage for all 8 regulatory regimes at a discounted price.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/sadad" className="btn btn-gold">
                    <ShoppingCart className="w-4 h-4" /> Purchase Complete Bundle — SAR 45,000
                  </Link>
                  <button onClick={() => setActiveTab("resources")} className="btn btn-ghost-white">
                    <BookOpen className="w-4 h-4" /> View Sample Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== TAB: RESOURCES ===== */}
      {activeTab === "resources" && (
        <section className="pb-20 animate-fade-in">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {RESOURCES.map((r) => (
                <Link key={r.title} href={r.href} className="bg-white rounded-xl p-6 border border-[var(--border)] hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#e8effd] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <r.icon className="w-5 h-5 text-[#1a56db]" />
                  </div>
                  <h3 className="text-[14px] font-700 text-gray-900 mb-1.5 group-hover:text-[#1a56db] transition-colors">{r.title}</h3>
                  <p className="text-[12.5px] text-gray-500 leading-relaxed">{r.desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-[12px] font-600 text-[#1a56db]">
                    Access <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>

            {/* SHDIGF iframe */}
            <div id="resources" className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-[#0a0c10] to-[#1a1d24] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#e9c46a]" />
                  <div>
                    <h3 className="text-[14px] font-700 text-white">Saudi Healthcare Documents & Information Governance Framework</h3>
                    <p className="text-[11px] text-white/40">SHDIGF v3.0 — Arabic full framework document (RTL)</p>
                  </div>
                </div>
                <Link href="/governance" className="flex items-center gap-1 text-[12px] font-600 text-[#e9c46a] hover:text-white transition-colors">
                  Interactive Version <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <iframe src="/shdigf.html" title="SHDIGF Document" className="w-full h-[70vh] border-0" sandbox="allow-scripts allow-same-origin" />
            </div>

            {/* Related products */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
              <h3 className="text-[15px] font-700 text-gray-900 mb-4">Productise Your Compliance — All Available via SADAD</h3>
              <p className="text-[12.5px] text-gray-500 mb-4 leading-relaxed">
                Every template, framework, and toolkit on this page is a commercial product. Purchase via SADAD (stc pay, biller code 207),
                receive instant invoice, and get immediate access to your documents. All products support Saudi Vision 2030 digital health transformation.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: CreditCard, title: "Complete Bundle", price: "SAR 45,000", href: "/sadad", badge: "Best Value" },
                  { icon: Scale, title: "PDPL Compliance Toolkit", price: "SAR 18,000", href: "/sadad", badge: "Popular" },
                  { icon: Shield, title: "NPHIES Data Governance", price: "SAR 15,000", href: "/sadad", badge: "Specialised" },
                ].map((p) => (
                  <Link key={p.title} href={p.href} className="group bg-[#f8f9fc] rounded-xl p-4 border border-[var(--border)] hover:shadow-sm transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center">
                        <p.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-[13px] font-600 text-gray-900 group-hover:text-[#1a56db] transition-colors">{p.title}</h4>
                          <span className="text-[9px] font-600 px-1.5 py-0.5 rounded-full bg-[#e8effd] text-[#1a56db]">{p.badge}</span>
                        </div>
                        <p className="text-[12px] font-700 text-emerald-600 mt-0.5">{p.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="py-16 relative overflow-hidden bg-[#0a0c10]">
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#b8963e]/[0.06] blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-800 text-white mb-4">
            All templates productised — buy what you need
          </h2>
          <p className="text-[15px] text-white/50 max-w-xl mx-auto leading-relaxed mb-8">
            Every document, policy, and compliance framework is a commercial product. Purchase instantly via SADAD (biller code 207)
            and receive immediate access. No subscription required — own your templates forever.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sadad" className="btn btn-gold btn-lg">
              <ShoppingCart className="w-4.5 h-4.5" /> Browse Product Store <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link href="/governance" className="btn btn-ghost-white btn-lg">
              <Layers className="w-4.5 h-4.5" /> Interactive Framework
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, FileText, Lock, Scale, Activity, Users, BookOpen, Download, Star, ChevronRight, CreditCard, TrendingUp, Sparkles } from "lucide-react";
import { GovernanceFrameworkExplorer, GovernanceProductShowcase } from "@/components/GovernanceFramework";
import { GovernanceChecklist } from "@/components/GovernanceChecklist";
import { SadadPaymentModal } from "@/components/SadadPayment";

const FEATURES = [
  { icon: FileText, title: "200+ Editable Policy Templates", desc: "Complete policy suite covering PDPL, NPHIES, CBAHI, ISO 27001, and more. Customise and deploy immediately." },
  { icon: Lock, title: "8-Regulatory Compliance Mapping", desc: "Every control mapped to PDPL, NPHIES, CBAHI, NCA-ECC, MOH, ISO 27001, SAMA, and SFDA requirements." },
  { icon: Users, title: "Role-Specific RBAC Matrices", desc: "150+ healthcare-specific roles with pre-built access control matrices for clinical and administrative systems." },
  { icon: Activity, title: "Clinical Safety & AI Governance", desc: "Comprehensive DCB 0129/0160 compliance framework plus ethical AI governance for clinical decision support." },
  { icon: Scale, title: "Risk Management Integration", desc: "Integrated risk, BCM, vendor risk, and compliance management aligned with ISO 31000 and NIST CSF." },
  { icon: BookOpen, title: "Bilingual (Arabic/English)", desc: "Complete framework available in both Arabic and English with culturally adapted templates and guidance." },
  { icon: Shield, title: "PDPL Article-by-Article Toolkit", desc: "Full PDPL compliance program with data protection impact assessments, consent management, and breach response." },
  { icon: Star, title: "Maturity Model & Benchmarking", desc: "Self-assessment tools and maturity models to benchmark your governance posture against industry peers." },
];

const BENEFITS = [
  "Achieve and demonstrate PDPL compliance by the SDAIA enforcement deadline",
  "Pass CBAHI accreditation with confidence through mapped governance standards",
  "Reduce information security incidents by 60%+ through proactive governance",
  "Streamline regulatory reporting with integrated compliance dashboards",
  "Protect patient data and build trust with patients and regulatory bodies",
  "Enable safe AI and digital health innovation within a controlled framework",
  "Reduce vendor risk with standardised third-party assessment processes",
  "Build a defensible governance posture for board-level accountability",
];

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<"explore" | "checklist" | "products">("explore");
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden grad-hero noise">
        <div className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#1a56db]/[0.10] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#0d9488]/[0.08] blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="max-w-[900px]">
            <div className="animate-fade-up mb-6">
              <span className="badge badge-dark text-[12px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                Saudi Healthcare Information Governance Framework
              </span>
            </div>

            <h1 className="animate-fade-up text-[clamp(2.5rem,6vw,4.5rem)] font-800 leading-[1.05] tracking-[-0.03em] mb-6" style={{ animationDelay: "0.1s" }}>
              <span className="text-white">The Definitive</span>
              <br />
              <span className="text-grad-gold">Information Governance</span>
              <br />
              <span className="text-white">Framework for Saudi Healthcare</span>
            </h1>

            <p className="animate-fade-up text-[clamp(1rem,1.8vw,1.2rem)] text-white/60 leading-relaxed mb-8 max-w-[600px]" style={{ animationDelay: "0.2s" }}>
              The first comprehensive, enterprise-grade information governance framework purpose-built for Saudi Arabia's healthcare ecosystem. Fully aligned with PDPL, NPHIES, CBAHI, NCA, MOH, and international standards.
            </p>

            <div className="animate-fade-up flex flex-wrap gap-3 mb-12" style={{ animationDelay: "0.3s" }}>
              <button onClick={() => { setActiveTab("products"); setShowPayment(true); }} className="btn btn-gold btn-lg">
                <CreditCard className="w-4.5 h-4.5" /> Purchase the Framework <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <button onClick={() => setActiveTab("explore")} className="btn btn-ghost-white btn-lg">
                <FileText className="w-4.5 h-4.5" /> Explore Framework
              </button>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-up flex flex-wrap gap-4" style={{ animationDelay: "0.4s" }}>
              {["PDPL Compliant", "MOH Aligned", "CBAHI Ready", "ISO 27001 Mapped", "NCA-ECC Integrated", "NPHIES Compatible"].map((b) => (
                <div key={b} className="flex items-center gap-1.5 text-[12px] text-white/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#f8f9fc] to-transparent pointer-events-none" />
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {[
              { val: "48", label: "Governance Domains", sub: "Comprehensive coverage" },
              { val: "550+", label: "Control Statements", sub: "Granular requirements" },
              { val: "200+", label: "Policy Templates", sub: "Editable & deployable" },
              { val: "8", label: "Regulatory Maps", sub: "Integrated frameworks" },
            ].map((s) => (
              <div key={s.label} className="bg-white p-6 text-center">
                <p className="text-[clamp(1.75rem,3vw,2.5rem)] font-800 text-grad-brand">{s.val}</p>
                <p className="text-[14px] font-600 text-gray-800 mt-1">{s.label}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TAB NAV ===== */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 p-1 bg-white border border-[var(--border)] rounded-2xl shadow-sm">
            {[
              { key: "explore" as const, label: "Framework Explorer", icon: Shield },
              { key: "checklist" as const, label: "Maturity Assessment", icon: TrendingUp },
              { key: "products" as const, label: "Pricing & Purchase", icon: CreditCard },
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
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TAB CONTENT ===== */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "explore" && (
            <div className="space-y-8 animate-fade-in">
              {/* Intro */}
              <div className="bg-white rounded-2xl border border-[var(--border)] p-8 shadow-sm">
                <h2 className="text-[22px] font-800 text-gray-900 mb-3">Interactive Framework Explorer</h2>
                <p className="text-[14px] text-gray-600 leading-relaxed max-w-3xl">
                  Explore the complete Saudi Healthcare Information Governance Framework — 6 pillars, 48 domains, and 550+ controls mapped to 8 regulatory regimes.
                  Click any pillar to expand its domains and see detailed control coverage across each standard.
                </p>
              </div>
              <GovernanceFrameworkExplorer />
            </div>
          )}

          {activeTab === "checklist" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl border border-[var(--border)] p-8 shadow-sm">
                <h2 className="text-[22px] font-800 text-gray-900 mb-3">Governance Maturity Self-Assessment</h2>
                <p className="text-[14px] text-gray-600 leading-relaxed max-w-3xl">
                  Evaluate your organisation's information governance maturity against 25 key controls across all 6 pillars.
                  Tick the controls you have implemented, then calculate your maturity score to identify gaps and prioritise improvements.
                </p>
              </div>
              <GovernanceChecklist />

              {/* Benefits section */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {BENEFITS.slice(0, 4).map((b) => (
                  <div key={b} className="flex items-start gap-2.5 p-4 bg-white rounded-xl border border-[var(--border)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[12.5px] text-gray-600 leading-snug">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white rounded-2xl border border-[var(--border)] p-8 shadow-sm">
                <h2 className="text-[22px] font-800 text-gray-900 mb-3">Framework Products & Pricing</h2>
                <p className="text-[14px] text-gray-600 leading-relaxed max-w-3xl mb-6">
                  Choose the governance framework product that matches your organisation's needs. All products are delivered digitally in bilingual (Arabic/English) editable format.
                  Payment via SADAD (stc pay).
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Enterprise Bundle", "PDPL Toolkit", "Records Management", "Clinical Safety"].map((t) => (
                    <span key={t} className="badge badge-gold text-[11px]">{t}</span>
                  ))}
                </div>
              </div>

              <GovernanceProductShowcase />

              {/* Features grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {FEATURES.map((f) => (
                  <div key={f.title} className="bg-white rounded-xl p-5 border border-[var(--border)] hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-[#e8effd] flex items-center justify-center mb-3">
                      <f.icon className="w-4.5 h-4.5 text-[#1a56db]" />
                    </div>
                    <h3 className="text-[13.5px] font-700 text-gray-900 mb-1">{f.title}</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 relative overflow-hidden bg-[#0a0c10]">
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1a56db]/[0.06] blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge badge-dark mb-4">Get Started Today</span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-800 text-white mb-4">
            Ready to transform your healthcare organisation's information governance?
          </h2>
          <p className="text-[16px] text-white/50 max-w-2xl mx-auto leading-relaxed mb-8">
            Join leading Saudi healthcare organisations that trust the BrainSAIT Governance Framework
            to achieve PDPL compliance, pass CBAHI accreditation, and build a defensible governance posture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => { setActiveTab("products"); setShowPayment(true); }} className="btn btn-gold btn-lg">
              <CreditCard className="w-4.5 h-4.5" /> Purchase the Framework
            </button>
            <Link href="/sadad" className="btn btn-ghost-white btn-lg">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && (
        <SadadPaymentModal
          amount={45000}
          productName="Saudi Healthcare Information Governance Framework — Complete Bundle"
          productId="framework-complete"
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}

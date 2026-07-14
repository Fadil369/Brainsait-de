"use client";

import { useState } from "react";
import {
  Shield, FileText, Users, Lock, Scale, Activity, BookOpen,
  Search, CheckCircle2, ArrowRight, ChevronRight, Building2,
  Globe, Database, ClipboardList, Eye, UserCheck, AlertTriangle,
  TrendingUp, Target, Layers, Settings,
} from "lucide-react";
import Link from "next/link";

interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  bgLight: string;
  domains: Domain[];
}

interface Domain {
  id: string;
  title: string;
  description: string;
  controls: number;
  standards: string[];
}

const PILLARS: Pillar[] = [
  {
    id: "governance-leadership",
    title: "Governance & Leadership",
    subtitle: "Strategic oversight and accountability structures",
    icon: Shield,
    color: "#1a56db",
    bgLight: "#e8effd",
    domains: [
      { id: "gov-board", title: "Board Governance & Oversight", description: "Board-level information governance committee structures, terms of reference, and reporting lines.", controls: 24, standards: ["ISO 38500", "COBIT 2019", "MOH Circular 12/2023"] },
      { id: "gov-roles", title: "Roles & Accountability Framework", description: "Defined roles from SIRO to information asset owners, with clear RACI matrices.", controls: 18, standards: ["ISO 27001 §5", "NIST CSF", "CBAHI IG-1"] },
      { id: "gov-policy", title: "Policy & Standards Framework", description: "Hierarchical policy architecture with tiered policies, standards, procedures, and guidelines.", controls: 32, standards: ["ISO 27001 §5.2", "PDPL Art. 14", "NCA-ECC"] },
      { id: "gov-audit", title: "Internal Audit & Assurance", description: "Risk-based audit program covering information governance, data protection, and cybersecurity.", controls: 15, standards: ["ISO 27007", "IIA Standards", "MOH Audit Framework"] },
    ],
  },
  {
    id: "data-protection",
    title: "Data Protection & Privacy",
    subtitle: "PDPL compliance and patient data rights",
    icon: Lock,
    color: "#059669",
    bgLight: "#ecfdf5",
    domains: [
      { id: "dp-pdpl", title: "PDPL Compliance Program", description: "Article-by-article compliance framework with policies, procedures, and operational controls.", controls: 46, standards: ["PDPL", "PDPL Implementing Regulations", "SDAIA Guidelines"] },
      { id: "dp-rights", title: "Data Subject Rights Management", description: "End-to-end process for handling access, rectification, erasure, portability, and objection requests.", controls: 12, standards: ["PDPL Art. 22-28", "GDPR Art. 15-22", "MOH Patient Rights"] },
      { id: "dp-consent", title: "Consent & Preference Management", description: "Bilingual consent frameworks for clinical care, research, marketing, and data sharing.", controls: 20, standards: ["PDPL Art. 10-13", "MOH Consent Policy", "CBAHI CPR-9"] },
      { id: "dp-dpia", title: "Data Protection Impact Assessment", description: "Systematic DPIA process for high-risk processing activities including AI and health research.", controls: 14, standards: ["PDPL Art. 21", "GDPR Art. 35", "ISO 27701"] },
      { id: "dp-breach", title: "Data Breach Response & Notification", description: "Incident response plan with regulatory notification workflows and patient communication templates.", controls: 16, standards: ["PDPL Art. 29-30", "NCA-CSIRT", "ISO 27035"] },
      { id: "dp-transfer", title: "Cross-Border Data Transfer", description: "Mechanisms for lawful international data transfers including SCCs, adequacy decisions, and binding corporate rules.", controls: 10, standards: ["PDPL Art. 30", "SDAIA Transfer Policy", "GDPR Ch. V"] },
    ],
  },
  {
    id: "records-management",
    title: "Records & Document Management",
    subtitle: "Lifecycle management from creation to disposal",
    icon: FileText,
    color: "#7c3aed",
    bgLight: "#f3e8ff",
    domains: [
      { id: "rm-lifecycle", title: "Records Lifecycle Management", description: "Complete records management from creation, through active use and retention, to final disposition.", controls: 28, standards: ["ISO 15489", "MOH Records Policy", "Saudi National Archives"] },
      { id: "rm-retention", title: "Retention & Disposition Schedule", description: "MOH-compliant retention schedules for all healthcare record types with legal hold integration.", controls: 22, standards: ["MOH Circular 15/2021", "CBAHI IM-4", "ISO 30301"] },
      { id: "rm-classification", title: "Document Classification & Taxonomy", description: "Multi-tier classification scheme with business classification, security classification, and metadata standards.", controls: 18, standards: ["ISO 27001 §5.10", "MOH Doc Standards", "NCA Data Classification"] },
      { id: "rm-digital", title: "Digital Document Management", description: "EDMS requirements, digitisation standards, electronic signatures, and system interoperability specifications.", controls: 24, standards: ["ISO 14641", "MOH Digital Health", "E-Signature Law KSA"] },
    ],
  },
  {
    id: "access-control",
    title: "Identity & Access Governance",
    subtitle: "Who accesses what, when, and why",
    icon: Users,
    color: "#dc2626",
    bgLight: "#fef2f2",
    domains: [
      { id: "iam-rbac", title: "Role-Based Access Control", description: "Comprehensive RBAC model with 150+ healthcare-specific roles mapped to clinical systems.", controls: 35, standards: ["ISO 27001 §9", "NIST SP 800-53", "CBAHI IS-2"] },
      { id: "iam-provisioning", title: "Identity Lifecycle Management", description: "Automated provisioning and de-provisioning integrated with HR systems and clinical rostering.", controls: 20, standards: ["ISO 27001 §9.1", "NIST SP 800-63", "MOH Access Policy"] },
      { id: "iam-auth", title: "Authentication & MFA", description: "Multi-factor authentication framework supporting biometric, smart card, and mobile-based authentication.", controls: 16, standards: ["NCA-ECC", "ISO 27001 §9.3", "Saudi E-Auth Framework"] },
      { id: "iam-privileged", title: "Privileged Access Management", description: "PAM for clinical and administrative super-users with session monitoring and just-in-time access.", controls: 14, standards: ["NIST SP 800-53 AC-6", "ISO 27001 §9.2", "CIS Control 14"] },
    ],
  },
  {
    id: "risk-compliance",
    title: "Risk Management & Compliance",
    subtitle: "Identify, assess, and mitigate information risks",
    icon: Scale,
    color: "#b8963e",
    bgLight: "#fdf6e3",
    domains: [
      { id: "rc-risk", title: "Information Risk Management", description: "Risk assessment methodology aligned with ISO 31000 with healthcare-specific risk scenarios and controls.", controls: 30, standards: ["ISO 31000", "NIST CSF", "ISO 27005"] },
      { id: "rc-vendor", title: "Third-Party & Vendor Risk", description: "Vendor risk management program covering due diligence, contractual controls, and ongoing monitoring.", controls: 22, standards: ["ISO 27001 §5.19", "NIST SP 800-53 SA-9", "SAMA TPRM"] },
      { id: "rc-bcm", title: "Business Continuity & Disaster Recovery", description: "BCM framework for healthcare operations with IT disaster recovery, pandemic planning, and crisis management.", controls: 28, standards: ["ISO 22301", "NIST SP 800-34", "MOH Emergency Plans"] },
      { id: "rc-compliance", title: "Regulatory Compliance Management", description: "Ongoing compliance monitoring across PDPL, NPHIES, CBAHI, SAMA, and NCA requirements.", controls: 25, standards: ["ISO 37301", "Multiple Regulatory Mappings", "Compliance Dashboard"] },
    ],
  },
  {
    id: "clinical-safety",
    title: "Clinical Safety & Health IT Governance",
    subtitle: "Safe design, deployment, and use of health IT",
    icon: Activity,
    color: "#0d9488",
    bgLight: "#e0f7f5",
    domains: [
      { id: "cs-safety", title: "Clinical Risk Management", description: "Clinical safety risk management for health IT systems following DCB 0129 and DCB 0160 standards.", controls: 26, standards: ["DCB 0129", "DCB 0160", "ISO 80001-1"] },
      { id: "cs-ai", title: "AI Governance & Ethics", description: "Governance framework for AI/ML in clinical settings covering validation, monitoring, bias, and explainability.", controls: 18, standards: ["WHO AI Ethics", "SDAIA AI Principles", "FDA AI/ML Framework"] },
      { id: "cs-telehealth", title: "Telehealth & Remote Care Governance", description: "Governance for virtual care delivery including consent, data security, clinical appropriateness, and quality.", controls: 20, standards: ["MOH Telehealth Policy", "CBAHI TH-1", "HIPAA Telehealth"] },
      { id: "cs-meddev", title: "Medical Device Data Governance", description: "Governance for data generated by connected medical devices, IoMT, and wearable health technologies.", controls: 16, standards: ["ISO 13485", "SFDA Medical Devices", "NIST SP 1800-30C"] },
    ],
  },
];

const COMPLIANCE_REGIMES = [
  { code: "PDPL", name: "Personal Data Protection Law", count: 84 },
  { code: "NPHIES", name: "National Unified Healthcare Identifier & E-Services", count: 36 },
  { code: "CBAHI", name: "Saudi Central Board for Accreditation of Healthcare Institutions", count: 42 },
  { code: "NCA-ECC", name: "National Cybersecurity Authority — Essential Cybersecurity Controls", count: 48 },
  { code: "MOH", name: "Ministry of Health Regulations", count: 56 },
  { code: "ISO 27001", name: "Information Security Management System", count: 52 },
  { code: "SAMA", name: "Saudi Central Bank (for health insurers)", count: 28 },
  { code: "SFDA", name: "Saudi Food & Drug Authority (medical devices)", count: 18 },
];

const FRAMEWORK_STATS = [
  { value: 48, suffix: "", label: "Governance Domains", sub: "Comprehensive coverage" },
  { value: 550, suffix: "+", label: "Control Statements", sub: "Granular control requirements" },
  { value: 8, suffix: "", label: "Regulatory Frameworks", sub: "Integrated compliance mappings" },
  { value: 200, suffix: "+", label: "Policy Templates", sub: "Editable, ready to deploy" },
  { value: 140, suffix: "+", label: "Procedure Documents", sub: "Step-by-step operational guides" },
  { value: 30, suffix: "+", label: "Assessment Tools", sub: "Maturity, gap analysis, checklists" },
  { value: 12, suffix: "", label: "Training Modules", sub: "Staff awareness & competency" },
  { value: "AR/EN", suffix: "", label: "Bilingual", sub: "Arabic & English complete" },
];

function PillarCard({ pillar, active, onToggle }: { pillar: Pillar; active: boolean; onToggle: () => void }) {
  const iconColor = pillar.color;
  return (
    <div className={`rounded-2xl border transition-all duration-300 ${active ? "shadow-xl scale-[1.02]" : "shadow-sm hover:shadow-lg hover:-translate-y-0.5"}`}
      style={{ borderColor: active ? pillar.color : "var(--border)", background: active ? pillar.bgLight : "#ffffff" }}>
      <button onClick={onToggle} className="w-full text-left p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${pillar.color}18` }}>
          <pillar.icon className="w-6 h-6" style={{ color: pillar.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[16px] font-700" style={{ color: pillar.color }}>{pillar.title}</h3>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${active ? "rotate-90" : ""}`} />
          </div>
          <p className="text-[13px] text-gray-500 mt-0.5">{pillar.subtitle}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] font-600 px-2 py-0.5 rounded-full" style={{ background: `${pillar.color}12`, color: pillar.color }}>
              {pillar.domains.length} domains
            </span>
            <span className="text-[11px] text-gray-400">
              {pillar.domains.reduce((a, d) => a + d.controls, 0)} controls
            </span>
          </div>
        </div>
      </button>

      {active && (
        <div className="px-5 pb-5 space-y-3 animate-fade-up">
          <div className="h-px bg-gray-100 my-1" />
          <p className="text-[12.5px] leading-relaxed text-gray-600" style={{ borderLeft: `3px solid ${pillar.color}`, paddingLeft: 12 }}>
            {pillar.domains.length === 4
              ? "Strategic oversight structures, accountability frameworks, and governance architecture for healthcare information management."
              : pillar.domains.length === 6
              ? "Comprehensive data protection program covering PDPL compliance, individual rights, and privacy operations."
              : pillar.domains.length === 4
              ? "Complete identity and access governance with role-based controls across all healthcare systems."
              : "Cross-cutting risk and compliance capabilities integrated with healthcare operations."}
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {pillar.domains.map((d) => (
              <div key={d.id} className="p-3 rounded-xl bg-white border border-[var(--border)] hover:border-[#1a56db]/20 transition-colors">
                <p className="text-[13px] font-600 text-gray-900 leading-tight">{d.title}</p>
                <p className="text-[11.5px] text-gray-500 mt-1 leading-relaxed">{d.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-600 text-[#1a56db] bg-[#e8effd] px-1.5 py-0.5 rounded">{d.controls} controls</span>
                  {d.standards.slice(0, 2).map((s) => (
                    <span key={s} className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ComplianceHeatmap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const intensity = (count: number) => {
    if (count >= 50) return "bg-[#1a56db] text-white";
    if (count >= 30) return "bg-[#1a56db]/80 text-white";
    if (count >= 20) return "bg-[#e8effd] text-[#1a56db]";
    return "bg-gray-50 text-gray-500";
  };
  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
      <h3 className="text-[15px] font-700 text-gray-900 mb-4">Regulatory Compliance Coverage</h3>
      <div className="flex flex-wrap gap-2">
        {COMPLIANCE_REGIMES.map((r) => (
          <div
            key={r.code}
            onMouseEnter={() => setHovered(r.code)}
            onMouseLeave={() => setHovered(null)}
            className={`px-3 py-2 rounded-xl text-[12px] font-600 transition-all cursor-default ${intensity(r.count)} ${hovered === r.code ? "scale-105" : ""}`}
          >
            <span>{r.code}</span>
            {hovered === r.code && (
              <div className="absolute z-10 mt-2 p-3 bg-gray-900 text-white rounded-xl text-[11px] w-48 shadow-xl animate-fade-up">
                <p className="font-700 mb-1">{r.name}</p>
                <p className="text-white/70">{r.count} control mappings</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-4 text-[11px] text-gray-400">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-50 border" /> Minimal</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#e8effd]" /> Moderate</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#1a56db]/80" /> Significant</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#1a56db]" /> Comprehensive</div>
      </div>
    </div>
  );
}

function MaturityModel() {
  const levels = [
    { level: 1, name: "Initial", desc: "Ad-hoc, reactive governance", color: "#ef4444", pct: 15 },
    { level: 2, name: "Repeatable", desc: "Basic policies in place, inconsistent execution", color: "#f59e0b", pct: 25 },
    { level: 3, name: "Defined", desc: "Standardised governance processes across the organisation", color: "#3b82f6", pct: 30 },
    { level: 4, name: "Managed", desc: "Quantitative measurement and proactive governance", color: "#059669", pct: 20 },
    { level: 5, name: "Optimising", desc: "Continuous improvement and innovation in governance", color: "#7c3aed", pct: 10 },
  ];
  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
      <h3 className="text-[15px] font-700 text-gray-900 mb-4">Governance Maturity Model</h3>
      <div className="space-y-3">
        {levels.map((l) => (
          <div key={l.level} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-700" style={{ background: l.color }}>
                  {l.level}
                </span>
                <span className="text-[13px] font-600 text-gray-900">{l.name}</span>
              </div>
              <span className="text-[11px] text-gray-400">{l.pct}% of orgs</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000 group-hover:opacity-80" style={{ width: `${l.pct}%`, background: l.color }} />
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">{l.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GovernanceFrameworkExplorer() {
  const [activePillar, setActivePillar] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FRAMEWORK_STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl px-4 py-3 border border-[var(--border)] text-center hover:shadow-sm transition-shadow">
            <span className="block text-[20px] font-800 text-grad-brand">{s.value}{s.suffix}</span>
            <span className="block text-[11.5px] font-600 text-gray-700 mt-0.5">{s.label}</span>
            <span className="block text-[10px] text-gray-400">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Pillar explorer */}
      <div className="grid gap-4">
        {PILLARS.map((p) => (
          <PillarCard key={p.id} pillar={p} active={activePillar === p.id} onToggle={() => setActivePillar(activePillar === p.id ? null : p.id)} />
        ))}
      </div>

      {/* Compliance & maturity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ComplianceHeatmap />
        <MaturityModel />
      </div>
    </div>
  );
}

export function GovernanceProductShowcase() {
  const products = [
    { id: "framework-complete", name: "Complete Framework Bundle", price: "SAR 45,000", desc: "Full 200+ policy toolkit across all domains", badge: "Enterprise", popular: true },
    { id: "framework-pdpl", name: "PDPL Compliance Toolkit", price: "SAR 18,000", desc: "Article-by-article compliance for healthcare", badge: "Popular" },
    { id: "framework-nphies-data", name: "NPHIES Data Governance", price: "SAR 15,000", desc: "Claims & eligibility data governance", badge: "Specialised" },
    { id: "framework-records", name: "Records Management", price: "SAR 12,000", desc: "MOH-compliant records lifecycle", badge: "Essential" },
    { id: "framework-clinical-safety", name: "Clinical Safety Governance", price: "SAR 16,000", desc: "DCB 0129, AI ethics, telehealth", badge: "Premium" },
    { id: "framework-training", name: "Training Program Bundle", price: "SAR 8,000", desc: "Governance awareness & training kit", badge: "Best Value" },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/sadad?product=${p.id}`}
          className={`group relative rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 ${
            p.popular
              ? "bg-gradient-to-br from-[#0a0c10] to-[#1a1d24] border-white/10 shadow-xl hover:shadow-2xl"
              : "bg-white border-[var(--border)] shadow-sm hover:shadow-lg"
          }`}
        >
          {p.badge && (
            <span className={`absolute top-3 right-3 text-[10px] font-700 px-2 py-0.5 rounded-full ${
              p.popular ? "bg-[#e9c46a] text-[#1a0e00]" : "bg-[#e8effd] text-[#1a56db]"
            }`}>
              {p.badge}
            </span>
          )}
          {p.popular && (
            <div className="absolute -top-3 left-5 bg-[#e9c46a] text-[#1a0e00] text-[10px] font-700 px-2.5 py-1 rounded-full">
              Best Seller ⭐
            </div>
          )}
          <h3 className={`text-[14px] font-700 mb-1.5 ${p.popular ? "text-white" : "text-gray-900"}`}>
            {p.name}
          </h3>
          <p className={`text-[12px] leading-relaxed ${p.popular ? "text-white/60" : "text-gray-500"}`}>
            {p.desc}
          </p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: p.popular ? "rgba(255,255,255,0.08)" : "var(--border)" }}>
            <span className={`text-[18px] font-800 ${p.popular ? "text-white" : "text-gray-900"}`}>
              {p.price}
            </span>
            <span className={`flex items-center gap-1 text-[12px] font-600 ${p.popular ? "text-[#e9c46a]" : "text-[#1a56db]"}`}>
              View details <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

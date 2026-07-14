"use client";

import Link from "next/link";
import { useState, useEffect, useRef, ReactNode } from "react";
import {
  ArrowRight, Search, Shield, Globe, Zap, Users, TrendingUp,
  Award, Lightbulb, BarChart3, Bot, CheckCircle2, ArrowUpRight,
  Building2, GraduationCap, Stethoscope, FlaskConical, Cpu,
  Play, Star, Quote, ChevronRight, BookOpen, FileText, Lock,
  Scale, Layers, Sparkles, Activity, Microscope, Network,
  Server, Cloud, Database, Smartphone,
} from "lucide-react";
import { usePlatformStats } from "@/lib/platform-stats";

/* ─── Intersection observer hook ─── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Animated counter ─── */
function Counter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = end / 60;
    const t = setInterval(() => {
      v = Math.min(v + step, end);
      setN(Math.floor(v));
      if (v >= end) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [inView, end]);
  return <span ref={ref}>{prefix}{n.toLocaleString()}{suffix}</span>;
}

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView(0.08);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO — Saudi Arabia's AI Infrastructure for Healthcare
   ═══════════════════════════════════════════════════════════════ */
const TYPED_PHRASES = [
  "Connect any hospital system in days — not months",
  "Increase first-pass claim approvals by 40%",
  "Reduce admin workload with AI-powered automation",
  "Achieve NPHIES compliance in weeks, not years",
  "Deploy clinical AI across your enterprise",
];

export function Hero() {
  const [typed, setTyped] = useState("");
  const [idx, setIdx]     = useState(0);
  const [del, setDel]     = useState(false);

  useEffect(() => {
    const phrase = TYPED_PHRASES[idx];
    const speed  = del ? 25 : 55;
    const t = setTimeout(() => {
      if (!del) {
        const next = phrase.slice(0, typed.length + 1);
        setTyped(next);
        if (next === phrase) setTimeout(() => setDel(true), 2500);
      } else {
        const next = phrase.slice(0, typed.length - 1);
        setTyped(next);
        if (next === "") { setDel(false); setIdx((i) => (i + 1) % TYPED_PHRASES.length); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [typed, del, idx]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden grad-hero noise">
      <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-[#1a56db]/[0.12] blur-[120px] animate-orb pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#0d9488]/[0.10] blur-[100px] animate-orb pointer-events-none" style={{ animationDelay: "-6s" }} />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#b8963e]/[0.06] blur-[80px] animate-orb pointer-events-none" style={{ animationDelay: "-3s" }} />
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 w-full">
        <div className="max-w-[820px]">

          <div className="animate-fade-up mb-8" style={{ animationDelay: "0.1s" }}>
            <span className="badge badge-dark text-[12px] font-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
              The Operating System for Modern Healthcare
            </span>
          </div>

          <h1
            className="animate-fade-up text-[clamp(2.75rem,7vw,5.25rem)] font-800 leading-[1.05] tracking-[-0.03em] mb-5"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="text-white">Saudi Arabia's AI</span>
            <br />
            <span className="text-grad-gold">Infrastructure for</span>
            <br />
            <span className="text-white">Healthcare.</span>
          </h1>

          <p
            className="animate-fade-up text-[clamp(1.05rem,2vw,1.25rem)] text-white/55 leading-relaxed mb-8 max-w-[580px]"
            style={{ animationDelay: "0.3s" }}
          >
            One platform that connects hospitals, automates revenue cycles, and deploys clinical AI
            — purpose-built for Saudi Arabia and aligned with Vision 2030.
          </p>

          {/* Executive outcome typing bar */}
          <div className="animate-fade-up mb-10" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.06] border border-white/[0.12] backdrop-blur-sm max-w-[620px] group hover:border-white/[0.22] transition-colors">
              <Activity className="w-5 h-5 text-white/30 flex-shrink-0" />
              <div className="flex-1 text-[14px] text-white/40">
                <span className="text-white/60">We help you </span>
                <span className="text-[#e9c46a] font-600">
                  {typed}
                  <span className="inline-block w-0.5 h-4 bg-[#e9c46a] ml-0.5 animate-pulse" />
                </span>
              </div>
            </div>
          </div>

          {/* Single primary CTA */}
          <div className="animate-fade-up flex flex-wrap items-center gap-3 mb-12" style={{ animationDelay: "0.5s" }}>
            <Link href="/marketplace/needs" className="btn btn-gold btn-lg shadow-[0_8px_32px_rgba(233,196,106,0.25)]">
              Request a Demo <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link href="/copilot" className="btn btn-ghost-white btn-lg">
              Try AI Copilot Free
            </Link>
          </div>

          <HeroStats />
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}

function HeroStats() {
  const stats = usePlatformStats();
  const chips = [
    { val: stats.activeListings, suffix: "+", label: "Active Listings" },
    { val: stats.verifiedPartners, suffix: "+", label: "Verified Partners" },
    { val: Math.round(stats.platformMembers / 1000), suffix: "K+", label: "Platform Users" },
    { val: stats.satisfactionRate, suffix: "%", label: "Satisfaction Rate" },
  ];
  return (
    <div className="animate-fade-up flex flex-wrap gap-3" style={{ animationDelay: "0.6s" }}>
      {chips.map((s) => (
        <div key={s.label} className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.09] backdrop-blur-sm">
          <span className="block text-[20px] font-800 text-white leading-none">
            <Counter end={s.val} suffix={s.suffix} />
          </span>
          <span className="block text-[11.5px] text-white/40 mt-0.5">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRUSTED BY — Logos, certifications, real numbers
   ═══════════════════════════════════════════════════════════════ */
const TRUST_METRICS = [
  { value: "2.4M+", label: "Claims Processed" },
  { value: "850K+", label: "API Requests / Day" },
  { value: "120+", label: "Hospitals Connected" },
  { value: "15K+", label: "Healthcare Providers" },
  { value: "48", label: "Active AI Agents" },
  { value: "6.2M+", label: "Clinical Documents Processed" },
];

const CERTIFICATIONS = [
  "PDPL Compliant", "NPHIES Certified", "FHIR R4 Native",
  "ISO 27001", "MOH Registered", "HIPAA Aligned",
  "Cloudflare Security", "SAMA CSF Aligned",
];

const PARTNERS = [
  "Ministry of Health KSA", "NPHIES", "King Fahad Medical City",
  "Seha Digital Health", "KFMC Research Centre", "Saudi Vision 2030",
];

export function TrustedBySection() {
  return (
    <section className="py-20 bg-white border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <p className="text-[11.5px] font-700 text-[#1a56db] uppercase tracking-[0.14em] mb-3">Trusted Across the Kingdom</p>
          <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-800 text-[#0a0c10]">Trusted by healthcare leaders</h2>
        </Reveal>

        {/* Partner names */}
        <Reveal className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PARTNERS.map((p) => (
              <span key={p} className="text-[15px] font-600 text-gray-400 hover:text-gray-600 transition-colors">{p}</span>
            ))}
          </div>
        </Reveal>

        {/* Hard metrics row */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            {TRUST_METRICS.map((m) => (
              <div key={m.label} className="bg-[#f8f9fc] p-5 text-center hover:bg-white transition-colors">
                <p className="text-[clamp(1.25rem,2vw,1.75rem)] font-800 text-grad-brand leading-none mb-1">{m.value}</p>
                <p className="text-[11px] font-500 text-gray-600">{m.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Certification badges */}
        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CERTIFICATIONS.map((c) => (
              <span key={c} className="flex items-center gap-1.5 text-[12px] font-500 text-gray-600 bg-[#f8f9fc] border border-[var(--border)] rounded-full px-3 py-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROBLEMS — Three challenges BrainSAIT solves
   ═══════════════════════════════════════════════════════════════ */
const PROBLEMS = [
  {
    icon: Shield,
    problem: "Disconnected health systems can't share data",
    outcome: "Connect any hospital system in days — not months",
    desc: "FHIR-native platform that unifies EHRs, claims systems, and clinical data across your organisation. No rip-and-replace required.",
    accent: "#1a56db",
  },
  {
    icon: Zap,
    problem: "Manual claims processing drains revenue",
    outcome: "Increase first-pass claim approvals while reducing admin workload",
    desc: "AI-powered NPHIES gateway that automates eligibility checks, claims submission, and denial management — with real-time status tracking.",
    accent: "#0d9488",
  },
  {
    icon: Bot,
    problem: "Clinical AI is powerful but hard to deploy",
    outcome: "Deploy healthcare AI agents across your enterprise in hours",
    desc: "Pre-built AI agents for radiology, clinical documentation, decision support, and patient communication. Deploy on your infrastructure with full compliance.",
    accent: "#7c3aed",
  },
];

export function ProblemsSection() {
  return (
    <section className="py-28 bg-[#f8f9fc] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-light opacity-50 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-[11.5px] font-700 text-[#1a56db] uppercase tracking-[0.14em] mb-3">The Challenge</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-800 text-[#0a0c10] mb-4">
            Three problems. One platform.
          </h2>
          <p className="text-[17px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Saudi healthcare runs on disconnected systems, manual processes, and unrealised AI potential.
            BrainSAIT is the infrastructure layer that connects, automates, and deploys at scale.
          </p>
        </Reveal>

        <div className="space-y-6">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.problem} delay={i * 100}>
              <div className="group bg-white rounded-2xl p-8 border border-[var(--border)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-center gap-4 lg:w-[380px] flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: `${p.accent}15` }}
                    >
                      <p.icon className="w-6 h-6" style={{ color: p.accent }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-600 text-red-500 mb-0.5">Problem</p>
                      <p className="text-[15px] font-700 text-gray-900 leading-snug">{p.problem}</p>
                    </div>
                  </div>
                  <div className="hidden lg:block w-px h-12 bg-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[16px] font-700 text-emerald-600 mb-1 flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4" /> {p.outcome}
                    </p>
                    <p className="text-[14px] text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIX BUSINESS UNITS — Enterprise portfolio
   ═══════════════════════════════════════════════════════════════ */
const BUSINESS_UNITS = [
  {
    icon: Stethoscope,
    title: "BrainSAIT Health",
    tagline: "Clinical AI, RCM & hospital operations",
    desc: "AI-powered revenue cycle management, clinical decision intelligence, and hospital-wide operational automation — purpose-built for Saudi healthcare.",
    features: ["ClaimLinc AI RCM", "ClinicalLinc CDSS", "CodingLinc ICD-10-CPT", "PriorAuthLinc", "PatientLinc Portal", "Basma Health Voice AI"],
    href: "/products/health",
    color: "#1a56db",
    gradient: "from-blue-500/20 to-blue-600/10",
    count: 12,
  },
  {
    icon: Bot,
    title: "BrainSAIT AI",
    tagline: "LINC agents, MCP & agent studio",
    desc: "Enterprise AI agent platform with pre-built healthcare agents, custom agent studio, MCP gateway, and workflow automation for clinical and operational use cases.",
    features: ["MasterLINC Orchestrator", "Agent Studio Builder", "Agent Marketplace", "MCP Gateway", "Prompt Studio", "Workflow Builder"],
    href: "/products/ai",
    color: "#7c3aed",
    gradient: "from-violet-500/20 to-violet-600/10",
    count: 8,
  },
  {
    icon: Cloud,
    title: "BrainSAIT Cloud",
    tagline: "APIs, integration & developer platform",
    desc: "Healthcare interoperability at scale — FHIR, HL7, and proprietary bridges connecting EHRs, ERP systems, and government platforms across the Kingdom.",
    features: ["HealthHub Integration", "NPHIES Gateway", "FHIR R4 Gateway", "Oracle/SAP/Salesforce Bridges", "API Gateway", "Integration Marketplace"],
    href: "/products/cloud",
    color: "#0d9488",
    gradient: "from-teal-500/20 to-teal-600/10",
    count: 10,
  },
  {
    icon: Shield,
    title: "BrainSAIT Trust",
    tagline: "Wathq layer, KYB & compliance",
    desc: "Trust infrastructure for healthcare — identity verification, regulatory compliance, risk intelligence, and credential management aligned with Saudi regulations.",
    features: ["Trust Layer Platform", "KYB & Wathq API", "AI Risk Score Engine", "Credential Verification", "Compliance Monitor", "PDPL Manager"],
    href: "/products/trust",
    color: "#b8963e",
    gradient: "from-amber-500/20 to-amber-600/10",
    count: 10,
  },
  {
    icon: GraduationCap,
    title: "BrainSAIT Academy",
    tagline: "Training, certifications & LMS",
    desc: "Healthcare education platform offering accredited courses, professional certifications, coding bootcamps, and simulation-based learning for the Saudi healthcare workforce.",
    features: ["LMS Platform", "NPHIES Certification", "Coding Academy ICD-10-CPT", "AI Academy", "Simulation Lab", "CME Credit Management"],
    href: "/products/academy",
    color: "#e11d48",
    gradient: "from-rose-500/20 to-rose-600/10",
    count: 8,
  },
  {
    icon: Sparkles,
    title: "BrainSAIT Ventures",
    tagline: "Spark, incubator & accelerator",
    desc: "Startup ecosystem platform combining AI-native tooling, GitHub automation, mentorship, regulatory navigation, and investor access for health-tech founders.",
    features: ["Spark Innovation Engine", "Incubator Program", "Accelerator Bootcamps", "Founder OS Toolkit", "Investor Portal", "Startup Marketplace"],
    href: "/products/ventures",
    color: "#059669",
    gradient: "from-emerald-500/20 to-emerald-600/10",
    count: 9,
  },
];

export function ProductsSection() {
  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-[11.5px] font-700 text-[#1a56db] uppercase tracking-[0.14em] mb-3">Six Business Units</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-800 text-[#0a0c10] mb-4">BrainSAIT Enterprise Cloud</h2>
          <p className="text-[17px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Six interconnected business units spanning clinical AI, agent platforms, cloud integration, trust infrastructure,
            education, and venture building — all purpose-built for Saudi healthcare.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUSINESS_UNITS.map((u, i) => (
            <Reveal key={u.title} delay={i * 60}>
              <Link href={u.href} className="group block bg-white rounded-2xl border border-[var(--border)] p-7 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${u.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <u.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] font-600 text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{u.count} Products</span>
                </div>
                <p className="text-[11px] font-700 uppercase tracking-[0.12em] mb-1" style={{ color: u.color }}>{u.title}</p>
                <h3 className="text-[16px] font-700 text-gray-900 mb-2 leading-snug">{u.tagline}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-5">{u.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {u.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[12.5px] text-gray-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="inline-flex items-center gap-1 text-[12.5px] font-600 text-[#1a56db] group/link">
                  Explore {u.title.split(" ")[1]} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center mt-12">
          <Link href="/products/health" className="btn btn-primary shadow-[0_8px_32px_rgba(26,86,219,0.25)]">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLATFORM ARCHITECTURE — Visual infrastructure diagram
   ═══════════════════════════════════════════════════════════════ */
const ARCH_LAYERS = [
  {
    title: "Application Layer",
    items: ["AI Copilot", "NPHIES Gateway", "Marketplace", "Provider Portal", "Analytics Dashboard"],
    color: "#1a56db",
  },
  {
    title: "API & Integration Layer",
    items: ["FHIR R4 APIs", "HL7 v2/v3", "REST Gateways", "Webhook Engine", "MCP Protocol"],
    color: "#0d9488",
  },
  {
    title: "Data & Intelligence Layer",
    items: ["Clinical Data Lake", "AI/ML Pipeline", "NLP Engine", "Real-time Analytics", "Compliance Engine"],
    color: "#7c3aed",
  },
  {
    title: "Infrastructure & Security",
    items: ["Cloudflare Global Network", "Zero Trust Security", "PDPL Encryption", "ISO 27001", "Multi-region HA"],
    color: "#b8963e",
  },
];

export function ArchitectureSection() {
  return (
    <section className="py-28 bg-[#0a0c10] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-[#1a56db]/[0.05] blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-[11.5px] font-700 text-[#e9c46a] uppercase tracking-[0.14em] mb-3">Architecture</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-800 text-white mb-4">Enterprise infrastructure, purpose-built</h2>
          <p className="text-[17px] text-white/50 max-w-2xl mx-auto leading-relaxed">
            Built from the ground up on Cloudflare's global network with zero-trust security, FHIR-native APIs, and AI at every layer.
          </p>
        </Reveal>

        <div className="space-y-4">
          {ARCH_LAYERS.map((layer, i) => (
            <Reveal key={layer.title} delay={i * 80}>
              <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.06] transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="lg:w-[200px] flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: layer.color }} />
                      <p className="text-[13px] font-700 text-white/80 uppercase tracking-[0.08em]">{layer.title}</p>
                    </div>
                  </div>
                  <div className="hidden lg:block w-px h-8 bg-white/[0.08]" />
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="text-[13px] font-500 text-white/60 bg-white/[0.06] border border-white/[0.08] rounded-full px-3.5 py-1.5 hover:bg-white/[0.10] hover:text-white/80 transition-all"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link href="/marketplace/api" className="inline-flex items-center gap-2 text-[14px] font-600 text-[#e9c46a] hover:text-white transition-colors">
            <Server className="w-4 h-4" /> Explore the full platform architecture <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIVE METRICS — Platform impact (from backend)
   ═══════════════════════════════════════════════════════════════ */
function StatsGrid() {
  const stats = usePlatformStats();
  const rows = [
    { value: stats.activeListings, suffix: "+",  label: "Active Listings",           sub: "Across all marketplace categories"         },
    { value: stats.verifiedPartners, suffix: "+", label: "Verified Partners",         sub: "Hospitals, vendors & consultants"          },
    { value: Math.round(stats.platformMembers / 1000), suffix: "K+", label: "Platform Members", sub: "Clinicians, executives & innovators" },
    { value: Math.round(stats.transactionsFacilitated / 1000), suffix: "K+", label: "Active Engagements", sub: "Needs, offers & projects" },
    { value: stats.satisfactionRate, suffix: "%", label: "Satisfaction Rate",         sub: "Based on post-project surveys"             },
    { value: stats.citiesCovered, suffix: "", label: "Cities Covered",               sub: "Across Saudi Arabia & GCC"                },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-[var(--shadow-md)]">
      {rows.map((s) => (
        <Reveal key={s.label}>
          <div className="bg-white p-8 text-center group hover:bg-[#f8f9fc] transition-colors">
            <p className="text-[clamp(2.5rem,5vw,3.75rem)] font-800 text-grad-brand leading-none mb-1">
              <Counter end={s.value} suffix={s.suffix} />
            </p>
            <p className="text-[15px] font-700 text-gray-900 mb-1">{s.label}</p>
            <p className="text-[12.5px] text-gray-400">{s.sub}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-28 relative overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-[11.5px] font-700 text-[#1a56db] uppercase tracking-[0.14em] mb-3">Live Platform Metrics</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-800 text-[#0a0c10]">Numbers that matter</h2>
          <p className="text-[17px] text-gray-500 max-w-xl mx-auto leading-relaxed mt-3">
            Real-time data from the BrainSAIT Health Exchange ecosystem.
          </p>
        </Reveal>
        <StatsGrid />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOMER STORIES — Testimonials
   ═══════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    quote: "BrainSAIT Health Exchange cut our vendor discovery time from 3 months to 3 weeks. The AI matching is remarkably accurate for clinical requirements.",
    name: "Dr. Ahmed Al-Rashidi",
    role: "Chief Medical Officer",
    org: "King Fahad Medical City",
    avatar: "AK",
  },
  {
    quote: "As a health-tech startup, the platform gave us instant access to hospital procurement teams we'd never have reached through conventional channels.",
    name: "Noura Al-Qahtani",
    role: "CEO",
    org: "Seha Digital Health",
    avatar: "NQ",
  },
  {
    quote: "The NPHIES integration wizard alone saved our team months of integration work. This is what Vision 2030 digital health transformation looks like.",
    name: "Khalid Al-Dossary",
    role: "Director of Digital Transformation",
    org: "Ministry of Health KSA",
    avatar: "KD",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-28 bg-[#0a0c10] relative overflow-hidden">
      <div className="absolute inset-0 bg-dot opacity-100 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-[#0d9488]/[0.07] blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-[11.5px] font-700 text-[#e9c46a] uppercase tracking-[0.14em] mb-3">Customer Stories</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-800 text-white">Trusted by healthcare leaders</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className="card-dark rounded-2xl p-7 h-full flex flex-col group hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1">
                <Quote className="w-6 h-6 text-[#e9c46a]/40 mb-5 flex-shrink-0" />
                <p className="text-[14.5px] text-white/65 leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/[0.07]">
                  <div className="w-10 h-10 rounded-full grad-brand flex items-center justify-center text-white text-[13px] font-700 flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-700 text-white leading-tight">{t.name}</p>
                    <p className="text-[11.5px] text-white/40 mt-0.5">{t.role} &middot; {t.org}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPLIANCE — Regulatory coverage
   ═══════════════════════════════════════════════════════════════ */
const REGULATORY_REGS = [
  { code: "PDPL", name: "Personal Data Protection Law", icon: Shield, desc: "Saudi data privacy law for healthcare" },
  { code: "NPHIES", name: "National Platform for Health Insurance", icon: Globe, desc: "Claims & eligibility gateway" },
  { code: "CBAHI", name: "Saudi Central Board for Accreditation", icon: Award, desc: "Healthcare facility accreditation" },
  { code: "NCA-ECC", name: "National Cybersecurity Authority", icon: Lock, desc: "Essential cybersecurity controls" },
  { code: "MOH", name: "Ministry of Health", icon: FileText, desc: "Saudi healthcare regulations" },
  { code: "ISO 27001", name: "Information Security Management", icon: CheckCircle2, desc: "International security standard" },
  { code: "SAMA", name: "Saudi Central Bank", icon: TrendingUp, desc: "Cybersecurity framework" },
  { code: "SFDA", name: "Food & Drug Authority", icon: Shield, desc: "Medical device & drug regulation" },
];

export function ComplianceSection() {
  return (
    <section className="py-28 bg-[#f8f9fc] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-light opacity-50 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-[11.5px] font-700 text-[#1a56db] uppercase tracking-[0.14em] mb-3">Compliance</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-800 text-[#0a0c10] mb-4">Built for regulated healthcare</h2>
          <p className="text-[17px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Every layer of the platform is designed to meet Saudi Arabia's most stringent regulatory requirements.
            We don't bolt on compliance — we build it in.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {REGULATORY_REGS.map((r) => (
            <Reveal key={r.code}>
              <div className="bg-white rounded-xl p-5 border border-[var(--border)] hover:shadow-md hover:-translate-y-0.5 transition-all text-center group">
                <div className="w-10 h-10 rounded-xl bg-[#e8effd] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <r.icon className="w-5 h-5 text-[#1a56db]" />
                </div>
                <p className="text-[15px] font-800 text-gray-900">{r.code}</p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{r.name}</p>
                <p className="text-[10px] text-gray-400 mt-1">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link href="/governance" className="inline-flex items-center gap-2 text-[14px] font-600 text-[#1a56db] hover:text-gray-900 transition-colors">
            <Scale className="w-4 h-4" /> View our full compliance framework <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI ECOSYSTEM — Agent & intelligence showcase
   ═══════════════════════════════════════════════════════════════ */
const AI_CAPABILITIES = [
  { icon: Bot, title: "AI Copilot", desc: "Healthcare-trained LLM for clinical and operational tasks", active: true },
  { icon: Microscope, title: "Radiology AI", desc: "Automated image analysis and reporting", active: true },
  { icon: FileText, title: "Clinical NLP", desc: "Arabic-capable medical concept extraction", active: true },
  { icon: Zap, title: "Claims AI", desc: "Automated coding, validation, and denial prevention", active: true },
  { icon: Users, title: "Patient Bots", desc: "Multi-language patient communication agents", active: true },
  { icon: BarChart3, title: "Predictive Analytics", desc: "Population health and operational forecasting", active: false },
];

export function EcosystemSection() {
  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <p className="text-[11.5px] font-700 text-[#1a56db] uppercase tracking-[0.14em] mb-3">AI Ecosystem</p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-800 text-[#0a0c10] mb-4">Healthcare AI, deployed at scale</h2>
          <p className="text-[17px] text-gray-500 max-w-2xl mx-auto leading-relaxed">
            A growing ecosystem of AI agents purpose-built for healthcare — from clinical decision support to revenue cycle automation. All deployable on your infrastructure.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_CAPABILITIES.map((a, i) => (
            <Reveal key={a.title} delay={i * 60}>
              <div className={`rounded-xl p-6 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                a.active
                  ? "bg-white border-[var(--border)]"
                  : "bg-gray-50 border-gray-100 opacity-60"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    a.active ? "bg-[#e8effd]" : "bg-gray-100"
                  }`}>
                    <a.icon className={`w-5 h-5 ${a.active ? "text-[#1a56db]" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-700 text-gray-900">{a.title}</h3>
                      {a.active ? (
                        <span className="text-[9px] font-600 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Live</span>
                      ) : (
                        <span className="text-[9px] font-500 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">Coming</span>
                      )}
                    </div>
                    <p className="text-[12.5px] text-gray-500 mt-0.5">{a.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link href="/copilot" className="btn btn-primary">
            <Bot className="w-4 h-4" /> Try AI Copilot Free <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CTA — Single demo conversion
   ═══════════════════════════════════════════════════════════════ */
export function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#b8963e]/[0.06] blur-[100px] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <Sparkles className="w-10 h-10 text-[#e9c46a] mx-auto mb-6" />
          <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-800 text-white mb-4 text-balance">
            Ready to transform your healthcare organisation?
          </h2>
          <p className="text-[17px] text-white/50 max-w-xl mx-auto leading-relaxed mb-10">
            Book a personalised demo with our team. See how BrainSAIT connects your systems,
            automates your revenue cycle, and deploys AI across your enterprise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/marketplace/needs" className="btn btn-gold btn-lg shadow-[0_8px_32px_rgba(233,196,106,0.2)]">
              Book a Demo <ArrowRight className="w-4.5 h-4.5" />
            </Link>
            <Link href="/copilot" className="btn btn-ghost-white btn-lg">
              <Bot className="w-4.5 h-4.5" /> Try AI Copilot Free
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {["PDPL Compliant", "NPHIES Ready", "FHIR R4 Native", "ISO 27001", "Cloudflare Global"].map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-[12.5px] text-white/30 font-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/50" />
                {b}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

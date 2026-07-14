"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, ArrowRight, Sparkles, FileText, Stethoscope, Bot, Cloud, Shield, GraduationCap, Lightbulb, BrainCircuit } from "lucide-react";
import { usePlatformStats } from "@/lib/platform-stats";

const productSections = [
  {
    heading: "BrainSAIT Health",
    icon: Stethoscope,
    href: "/products/health",
    color: "#1a56db",
    items: [
      { label: "ClaimLinc",     desc: "AI Revenue Cycle Management",         href: "/products/health/claimlinc" },
      { label: "ClinicalLinc",  desc: "Clinical Decision Intelligence",      href: "/products/health/clinicallinc" },
      { label: "PatientLinc",   desc: "Patient Engagement Portal",            href: "/products/health/patientlinc" },
      { label: "Basma Health",  desc: "AI Voice Receptionist",               href: "/products/health/basma" },
    ],
  },
  {
    heading: "BrainSAIT AI",
    icon: Bot,
    href: "/products/ai",
    color: "#7c3aed",
    items: [
      { label: "MasterLINC",    desc: "Enterprise AI Orchestrator",           href: "/products/ai/masterlinc" },
      { label: "Agent Studio",  desc: "Custom AI Agent Builder",             href: "/products/ai/agent-studio" },
      { label: "MCP Gateway",   desc: "Model Context Protocol",             href: "/products/ai/mcp-gateway" },
      { label: "Prompt Studio", desc: "Healthcare Prompt Engineering",      href: "/products/ai/prompt-studio" },
    ],
  },
  {
    heading: "BrainSAIT Cloud",
    icon: Cloud,
    href: "/products/cloud",
    color: "#0d9488",
    items: [
      { label: "HealthHub",     desc: "Unified Integration Platform",       href: "/products/cloud/healthhub" },
      { label: "NPHIES Gateway", desc: "National Health Gateway",            href: "/products/cloud/nphies-gateway" },
      { label: "FHIR Gateway",  desc: "FHIR R4 Interoperability",          href: "/products/cloud/fhir-gateway" },
      { label: "API Gateway",   desc: "Healthcare API Management",           href: "/products/cloud/api-gateway" },
    ],
  },
  {
    heading: "BrainSAIT Trust",
    icon: Shield,
    href: "/products/trust",
    color: "#b8963e",
    items: [
      { label: "Trust Layer",   desc: "Healthcare Trust Infrastructure",    href: "/products/trust/trust-layer" },
      { label: "KYB API",       desc: "Business Verification via Wathq",   href: "/products/trust/kyb-api" },
      { label: "Compliance Monitor", desc: "Regulatory Tracking",            href: "/products/trust/compliance-monitor" },
      { label: "PDPL Manager",  desc: "Data Protection Toolkit",            href: "/products/trust/pdpl-manager" },
    ],
  },
  {
    heading: "BrainSAIT Academy",
    icon: GraduationCap,
    href: "/products/academy",
    color: "#e11d48",
    items: [
      { label: "LMS Platform",  desc: "Healthcare Learning Management",       href: "/products/academy/lms" },
      { label: "NPHIES Academy", desc: "NPHIES Certification",               href: "/products/academy/nphies-academy" },
      { label: "Coding Academy", desc: "ICD-10-AM Bootcamp",                href: "/products/academy/coding-academy" },
      { label: "AI Academy",    desc: "Healthcare AI Training",              href: "/products/academy/ai-academy" },
    ],
  },
  {
    heading: "BrainSAIT Ventures",
    icon: Lightbulb,
    href: "/products/ventures",
    color: "#059669",
    items: [
      { label: "Spark",         desc: "AI Innovation Engine",                href: "/products/ventures/spark" },
      { label: "Incubator",     desc: "Health-Tech Incubation",              href: "/products/ventures/incubator" },
      { label: "Accelerator",   desc: "Growth-Stage Program",               href: "/products/ventures/accelerator" },
      { label: "Investor Portal", desc: "Startup Investment",               href: "/products/ventures/investor-portal" },
    ],
  },
];

const marketplaceSections = [
  {
    heading: "Procurement",
    items: [
      { href: "/marketplace/needs",       label: "Post a Need",          desc: "Publish your healthcare challenge",   icon: "🎯" },
      { href: "/marketplace/offers",      label: "Offer a Solution",     desc: "Showcase your capabilities",         icon: "🤝" },
      { href: "/marketplace/procurement", label: "Tenders & RFPs",       desc: "Formal procurement requests",        icon: "📄" },
      { href: "/marketplace/equipment",   label: "Medical Equipment",    desc: "Devices, instruments & supplies",    icon: "🏥" },
    ],
  },
  {
    heading: "Innovation",
    items: [
      { href: "/marketplace/challenges",  label: "Innovation Challenges", desc: "Crowdsourced problem-solving",      icon: "💡" },
      { href: "/marketplace/projects",    label: "Projects",              desc: "Collaborative delivery",            icon: "📋" },
      { href: "/marketplace/research",    label: "Research Hub",          desc: "Clinical & academic research",      icon: "🔬" },
      { href: "/marketplace/ai",          label: "AI Marketplace",        desc: "Ready-made AI models & services",  icon: "🤖" },
    ],
  },
  {
    heading: "Data & Tech",
    items: [
      { href: "/marketplace/api",  label: "API Marketplace",  desc: "FHIR, HL7 & health APIs",          icon: "⚙️" },
      { href: "/marketplace/data", label: "Data Marketplace", desc: "Curated healthcare datasets",       icon: "📊" },
    ],
  },
  {
    heading: "Talent & Learning",
    items: [
      { href: "/marketplace/experts",    label: "Expert Network",  desc: "Top healthcare consultants",        icon: "⭐" },
      { href: "/marketplace/jobs",       label: "Jobs Board",      desc: "Healthcare careers & roles",        icon: "💼" },
      { href: "/marketplace/education",  label: "Education",       desc: "Courses, certifications, CME",      icon: "🎓" },
      { href: "/marketplace/mentorship", label: "Mentorship",      desc: "1-on-1 guidance from leaders",      icon: "👥" },
    ],
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen]          = useState(false);
  const [marketplaceOpen, setMarketplaceOpen]    = useState(false);
  const [productsOpen, setProductsOpen]          = useState(false);
  const [scrolled, setScrolled]              = useState(false);
  const marketplaceRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const stats = usePlatformStats();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (marketplaceRef.current && !marketplaceRef.current.contains(e.target as Node))
        setMarketplaceOpen(false);
      if (productsRef.current && !productsRef.current.contains(e.target as Node))
        setProductsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-black/[0.06] shadow-[0_2px_24px_rgba(0,0,0,0.07)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 grad-brand rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3C6.13 3 3 6.13 3 10s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 2a5 5 0 110 10A5 5 0 0110 5z" fill="white" fillOpacity=".3"/>
                    <path d="M7 10h2V8a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H7a1 1 0 010-2z" fill="white"/>
                  </svg>
                </div>
              </div>
              <div>
                <span className="block text-[15px] font-800 tracking-tight leading-none text-gray-900">
                  BrainSAIT
                </span>
                <span className="block text-[10px] font-500 text-gray-400 tracking-widest uppercase leading-none mt-0.5">
                  Health Exchange
                </span>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {/* Products mega menu trigger */}
              <div className="relative" ref={productsRef}>
                <button
                  onClick={() => { setProductsOpen(!productsOpen); setMarketplaceOpen(false); }}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[14px] font-600 rounded-lg transition-all ${
                    productsOpen
                      ? "text-[#1a56db] bg-[#1a56db]/[0.07]"
                      : "text-gray-700 hover:text-gray-900 hover:bg-black/[0.04]"
                  }`}
                >
                  Products
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Marketplace mega menu trigger */}
              <div className="relative" ref={marketplaceRef}>
                <button
                  onClick={() => { setMarketplaceOpen(!marketplaceOpen); setProductsOpen(false); }}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[14px] font-600 rounded-lg transition-all ${
                    marketplaceOpen
                      ? "text-[#1a56db] bg-[#1a56db]/[0.07]"
                      : "text-gray-700 hover:text-gray-900 hover:bg-black/[0.04]"
                  }`}
                >
                  Marketplace
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${marketplaceOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {[
                { href: "/match",      label: "Match" },
                { href: "/copilot",    label: "AI Copilot" },
                { href: "/clinical-intelligence", label: "Clinical", icon: BrainCircuit },
                { href: "/governance", label: "Governance" },
                { href: "/sadad",      label: "Store" },
                { href: "/community",  label: "Community" },
              ].map((l) => {
                const Icon = l.icon;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3.5 py-2 text-[14px] font-500 text-gray-700 hover:text-gray-900 hover:bg-black/[0.04] rounded-lg transition-all inline-flex items-center gap-1.5"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {l.label}
                  </Link>
                );
              })}
            </div>

            {/* ── Right CTA ── */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link href="/marketplace/templates" className="flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-600 text-[#1a56db] hover:bg-[#1a56db]/[0.07] rounded-lg transition-all">
                <FileText className="w-3.5 h-3.5" />
                Templates
              </Link>
              <Link
                href="/marketplace/needs"
                className="btn btn-primary btn-sm shadow-[0_4px_16px_rgba(26,86,219,0.25)]"
              >
                Post a Need <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* ── Mobile burger ── */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-black/[0.05] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Products mega menu dropdown ── */}
      {productsOpen && (
        <div
          className="fixed top-[70px] inset-x-0 z-40 animate-fade-in"
          onClick={() => setProductsOpen(false)}
        >
          <div
            className="max-w-7xl mx-auto mt-1 mx-4 sm:mx-6 lg:mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass border border-black/[0.06] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.13)] p-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {productSections.map((unit) => (
                  <div key={unit.heading}>
                    <Link
                      href={unit.href}
                      onClick={() => setProductsOpen(false)}
                      className="flex items-center gap-2 mb-3 group"
                    >
                      <unit.icon className="w-4 h-4" style={{ color: unit.color }} />
                      <p className="text-[11px] font-700 uppercase tracking-[0.12em]" style={{ color: unit.color }}>
                        {unit.heading}
                      </p>
                    </Link>
                    <div className="space-y-0.5">
                      {unit.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setProductsOpen(false)}
                          className="group flex items-start gap-2 p-2 rounded-xl hover:bg-[#1a56db]/[0.05] transition-colors"
                        >
                          <div>
                            <p className="text-[13px] font-600 text-gray-900 group-hover:text-[#1a56db] transition-colors leading-tight">
                              {item.label}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider my-5" />

              <div className="flex items-center justify-between">
                <p className="text-[13px] text-gray-500">
                  <span className="font-600 text-gray-700">57+</span> products across 6 business units
                </p>
                <Link
                  href="/products/health"
                  onClick={() => setProductsOpen(false)}
                  className="flex items-center gap-1.5 text-[13px] font-600 text-[#1a56db] hover:underline"
                >
                  Browse all products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Marketplace mega menu dropdown ── */}
      {marketplaceOpen && (
        <div
          className="fixed top-[70px] inset-x-0 z-40 animate-fade-in"
          onClick={() => setMarketplaceOpen(false)}
        >
          <div
            className="max-w-7xl mx-auto mt-1 mx-4 sm:mx-6 lg:mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass border border-black/[0.06] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.13)] p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {marketplaceSections.map((section) => (
                  <div key={section.heading}>
                    <p className="text-[11px] font-700 text-gray-400 uppercase tracking-[0.12em] mb-3">
                      {section.heading}
                    </p>
                    <div className="space-y-0.5">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMarketplaceOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#1a56db]/[0.05] transition-colors"
                        >
                          <span className="text-xl leading-none mt-0.5">{item.icon}</span>
                          <div>
                            <p className="text-[13.5px] font-600 text-gray-900 group-hover:text-[#1a56db] transition-colors leading-tight">
                              {item.label}
                            </p>
                            <p className="text-[12px] text-gray-400 mt-0.5 leading-snug">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider my-5" />

              <div className="flex items-center justify-between">
                <p className="text-[13px] text-gray-500">
                  <span className="font-600 text-gray-700">{stats.activeListings.toLocaleString()}+</span> active listings across Saudi Arabia & MENA
                </p>
                <Link
                  href="/marketplace"
                  onClick={() => setMarketplaceOpen(false)}
                  className="flex items-center gap-1.5 text-[13px] font-600 text-[#1a56db] hover:underline"
                >
                  Browse all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-700 text-gray-900">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {/* Product families */}
            <p className="text-[10px] font-700 text-gray-400 uppercase tracking-[0.12em] px-3 mb-2">Products</p>
            {[
              { href: "/products/health",   label: "BrainSAIT Health",   icon: "🏥" },
              { href: "/products/ai",       label: "BrainSAIT AI",       icon: "🤖" },
              { href: "/products/cloud",    label: "BrainSAIT Cloud",    icon: "☁️" },
              { href: "/products/trust",    label: "BrainSAIT Trust",    icon: "🛡️" },
              { href: "/products/academy",  label: "BrainSAIT Academy",  icon: "🎓" },
              { href: "/products/ventures", label: "BrainSAIT Ventures", icon: "💡" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">{l.icon}</span>
                <div>
                  <span className="text-[14px] font-500 text-gray-800">{l.label}</span>
                </div>
              </Link>
            ))}
            <div className="divider my-2" />
            {/* Marketplace categories */}
            <p className="text-[10px] font-700 text-gray-400 uppercase tracking-[0.12em] px-3 mb-2">Marketplace</p>
            {marketplaceSections.flatMap((s) => s.items).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[14px] font-500 text-gray-800">{item.label}</span>
              </Link>
            ))}
            <div className="divider my-2" />
            {[
              { href: "/match",      label: "AI Match",        icon: "🎯" },
              { href: "/copilot",    label: "AI Copilot",      icon: "🤖" },
              { href: "/clinical-intelligence", label: "Clinical Intelligence", icon: "🧠" },
              { href: "/governance", label: "Governance",      icon: "🛡️" },
              { href: "/sadad",      label: "Product Store",   icon: "🛒" },
              { href: "/community",  label: "Community",       icon: "👥" },
              { href: "/government", label: "Government",      icon: "🏛️" },
              { href: "/investors",  label: "Investors",       icon: "📈" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg">{l.icon}</span>
                <span className="text-[14px] font-500 text-gray-800">{l.label}</span>
              </Link>
            ))}
          </div>

          <div className="px-4 pb-6 pt-2 space-y-2 border-t border-gray-100">
            <Link
              href="/marketplace/needs"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary w-full justify-center"
            >
              Post a Need <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

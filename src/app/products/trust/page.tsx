"use client";

import Link from "next/link";
import { ArrowRight, Shield, Lock, Scale, BadgeCheck, Search, Eye, FileCheck, Building2, AlertTriangle, GraduationCap } from "lucide-react";

const PRODUCTS = [
  { icon: Shield, name: "Trust Layer", tagline: "Healthcare Trust Infrastructure", desc: "Zero-trust security layer for healthcare — identity verification, access control, audit logging, and data encryption across all touchpoints.", status: "Live" },
  { icon: Building2, name: "KYB API", tagline: "Know Your Business Verification", desc: "Automated business verification via Wathq integration — license validation, ownership structure, compliance status, and risk scoring.", status: "Live" },
  { icon: AlertTriangle, name: "AI Risk Score", tagline: "Vendor & Partner Risk Intelligence", desc: "AI-driven risk scoring for healthcare vendors, contractors, and partners — financial, operational, and compliance risks.", status: "Live" },
  { icon: Search, name: "Vendor Verification", tagline: "Healthcare Vendor Due Diligence", desc: "End-to-end vendor verification — license checks, certification validation, performance history, and regulatory compliance.", status: "Live" },
  { icon: BadgeCheck, name: "Credential Verification", tagline: "Healthcare Credentialing", desc: "Automated credential verification for healthcare professionals — licenses, certifications, specialisations, and disciplinary history.", status: "Live" },
  { icon: FileCheck, name: "Provider Registry", tagline: "Healthcare Provider Directory", desc: "Centralised provider registry with verified credentials, specialties, locations, and real-time availability across Saudi Arabia.", status: "Live" },
  { icon: Eye, name: "Digital Certificates", tagline: "Blockchain-Verified Credentials", desc: "Issuance and verification of digital certificates for healthcare professionals using blockchain-anchored trust.", status: "Beta" },
  { icon: Scale, name: "Compliance Monitor", tagline: "Regulatory Compliance Tracking", desc: "Continuous monitoring across PDPL, NPHIES, CBAHI, NCA-ECC, MOH, ISO 27001, SAMA, and SFDA regulations.", status: "Live" },
  { icon: Lock, name: "Audit Center", tagline: "Healthcare Audit Management", desc: "Centralised audit trail for all platform activities — access logs, data changes, consent records, and compliance evidence.", status: "Live" },
  { icon: GraduationCap, name: "PDPL Manager", tagline: "Personal Data Protection Toolkit", desc: "End-to-end PDPL compliance toolkit — consent management, data mapping, breach notifications, and subject rights requests.", status: "Live" },
];

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-[#b8963e]/[0.08] blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#b8963e]" />
            </div>
            <span className="text-[11px] font-700 text-[#b8963e] uppercase tracking-[0.12em]">Business Unit</span>
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-4">BrainSAIT Trust</h1>
          <p className="text-[18px] text-white/50 leading-relaxed max-w-2xl">
            Trust infrastructure for healthcare — identity verification, regulatory compliance, risk intelligence, and credential management aligned with Saudi regulations.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/governance" className="btn btn-gold">Governance Framework</Link>
            <Link href="/sadad" className="btn btn-ghost-white">Browse Trust Products</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => (
            <Link key={p.name} href="/governance" className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <p.icon className="w-5 h-5 text-white/70" />
                </div>
                <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full ${
                  p.status === "Live" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                }`}>{p.status}</span>
              </div>
              <h3 className="text-[16px] font-700 text-white mb-1">{p.name}</h3>
              <p className="text-[12px] text-[#e9c46a] font-500 mb-2">{p.tagline}</p>
              <p className="text-[13px] text-white/40 leading-relaxed">{p.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[12.5px] font-600 text-[#e9c46a] opacity-0 group-hover:opacity-100 transition-all">
                Learn more <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

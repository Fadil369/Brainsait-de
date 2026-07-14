"use client";

import Link from "next/link";
import { ArrowRight, Globe, Server, Database, Cloud, Share2, GitBranch, Network, Code, ShoppingBag, Workflow } from "lucide-react";

const PRODUCTS = [
  { icon: Share2, name: "HealthHub", tagline: "Unified Integration Platform", desc: "Central healthcare integration hub connecting EHRs, labs, pharmacies, and government systems through a single pane of glass.", status: "Live" },
  { icon: Database, name: "Oracle Bridge", tagline: "Oracle Health Integration", desc: "Native bridge to Oracle Health (Cerner) — bi-directional FHIR/HL7 sync for clinical and administrative data.", status: "Live" },
  { icon: Globe, name: "SAP Bridge", tagline: "SAP Healthcare Integration", desc: "Connect SAP ERP and healthcare modules to BrainSAIT platform for unified financial and clinical workflows.", status: "Beta" },
  { icon: Cloud, name: "Dynamics Bridge", tagline: "Microsoft Dynamics Integration", desc: "Seamless integration with Microsoft Dynamics 365 for CRM, finance, and healthcare operations.", status: "Beta" },
  { icon: Network, name: "Salesforce Bridge", tagline: "Salesforce Health Cloud Sync", desc: "Bi-directional sync between Salesforce Health Cloud and BrainSAIT for patient engagement and CRM.", status: "Beta" },
  { icon: Server, name: "NPHIES Gateway", tagline: "National Health Insurance Gateway", desc: "Direct integration with NPHIES for claims submission, eligibility, prior authorization, and real-time status.", status: "Live" },
  { icon: GitBranch, name: "FHIR Gateway", tagline: "FHIR R4 Interoperability Hub", desc: "Enterprise FHIR R4 server with SMART-on-FHIR, bulk data export, and subscription-based event notifications.", status: "Live" },
  { icon: Workflow, name: "HL7 Gateway", tagline: "HL7 v2/v3 Message Engine", desc: "Full HL7 v2.x and v3 message processing, transformation, routing, and validation engine.", status: "Live" },
  { icon: Code, name: "API Gateway", tagline: "Healthcare API Management", desc: "Unified API gateway with rate limiting, authentication, monitoring, and developer portal for healthcare APIs.", status: "Live" },
  { icon: ShoppingBag, name: "Integration Marketplace", tagline: "Pre-built Connector Store", desc: "Browse and deploy pre-built integrations and connectors for the most common healthcare and ERP systems.", status: "Live" },
];

export default function CloudPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-[#0d9488]/[0.10] blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#0d9488]" />
            </div>
            <span className="text-[11px] font-700 text-[#0d9488] uppercase tracking-[0.12em]">Business Unit</span>
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-4">BrainSAIT Cloud</h1>
          <p className="text-[18px] text-white/50 leading-relaxed max-w-2xl">
            Healthcare interoperability at scale — FHIR, HL7, and proprietary bridges connecting EHRs, ERP systems, and government platforms across the Kingdom.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/marketplace/api" className="btn btn-gold">Explore APIs</Link>
            <Link href="/sadad" className="btn btn-ghost-white">Browse Cloud Products</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => (
            <Link key={p.name} href="/marketplace/api" className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <p.icon className="w-5 h-5 text-white/70" />
                </div>
                <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full ${
                  p.status === "Live" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                }`}>{p.status}</span>
              </div>
              <h3 className="text-[16px] font-700 text-white mb-1">{p.name}</h3>
              <p className="text-[12px] text-[#0d9488] font-500 mb-2">{p.tagline}</p>
              <p className="text-[13px] text-white/40 leading-relaxed">{p.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[12.5px] font-600 text-teal-400 opacity-0 group-hover:opacity-100 transition-all">
                Learn more <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

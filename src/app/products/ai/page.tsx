"use client";

import Link from "next/link";
import { ArrowRight, Bot, Cpu, ShoppingBag, BarChart3, Eye, FileText, Workflow, Globe, Sparkles } from "lucide-react";

const PRODUCTS = [
  { icon: Bot, name: "MasterLINC", tagline: "Enterprise AI Orchestrator", desc: "Central AI agent orchestrator that routes tasks across specialised LINC agents — clinical, operational, administrative — with full audit trail.", status: "Live" },
  { icon: Cpu, name: "Agent Studio", tagline: "Custom AI Agent Builder", desc: "No-code agent builder for healthcare. Design, train, and deploy custom AI agents with drag-and-drop simplicity.", status: "Beta" },
  { icon: ShoppingBag, name: "Agent Marketplace", tagline: "Pre-built AI Agent Store", desc: "Browse and deploy pre-built healthcare AI agents — radiology, coding, compliance, patient communication, and more.", status: "Live" },
  { icon: BarChart3, name: "Agent Analytics", tagline: "AI Performance Dashboard", desc: "Real-time analytics on agent performance, cost per task, accuracy rates, and ROI tracking across all deployed agents.", status: "Live" },
  { icon: Eye, name: "Agent Monitor", tagline: "AI Agent Observability", desc: "Production monitoring for AI agents — latency, error rates, hallucination detection, and human-in-the-loop oversight.", status: "Beta" },
  { icon: FileText, name: "Prompt Studio", tagline: "Healthcare Prompt Engineering", desc: "Design, test, and version-control prompts optimised for medical use cases with built-in safety guardrails.", status: "Live" },
  { icon: Workflow, name: "Workflow Builder", tagline: "AI Workflow Automation", desc: "Visual workflow builder connecting AI agents, APIs, and human tasks into automated healthcare processes.", status: "Beta" },
  { icon: Globe, name: "MCP Gateway", tagline: "Model Context Protocol Gateway", desc: "Standardised interface for connecting AI agents to healthcare data sources via the MCP protocol — FHIR, HL7, EHRs.", status: "Live" },
];

export default function AIPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-[#7c3aed]/[0.10] blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-[#7c3aed]" />
            </div>
            <span className="text-[11px] font-700 text-[#7c3aed] uppercase tracking-[0.12em]">Business Unit</span>
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-4">BrainSAIT AI</h1>
          <p className="text-[18px] text-white/50 leading-relaxed max-w-2xl">
            Enterprise AI agent platform — build, deploy, and monitor healthcare AI agents at scale with MasterLINC orchestration, MCP connectivity, and full observability.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/copilot" className="btn btn-gold">Try AI Copilot Free</Link>
            <Link href="/sadad" className="btn btn-ghost-white">Browse AI Products</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => (
            <div key={p.name} className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <p.icon className="w-5 h-5 text-white/70" />
                </div>
                <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full ${
                  p.status === "Live" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                }`}>{p.status}</span>
              </div>
              <h3 className="text-[16px] font-700 text-white mb-1">{p.name}</h3>
              <p className="text-[12px] text-[#a78bfa] font-500 mb-2">{p.tagline}</p>
              <p className="text-[13px] text-white/40 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

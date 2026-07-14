"use client";

import { useState } from "react";
import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Search, Star, CheckCircle2, ArrowRight, Sparkles,
  Cpu, Eye, Heart, DollarSign, Monitor,
} from "lucide-react";

const categories = [
  { icon: Cpu, label: "Clinical NLP" },
  { icon: Eye, label: "Radiology Vision" },
  { icon: Monitor, label: "Surgical Assistants" },
  { icon: DollarSign, label: "RCM Automation" },
  { icon: Heart, label: "Drug Discovery" },
];

const topAgents = [
  { name: "PulseCheck Analytics", desc: "Real-time cardiac monitoring and predictive risk scoring.", rating: 4.9, price: "$899/mo", badge: "Clinical NLP" },
  { name: "ScribePro Agent", desc: "Automated medical transcription for all specialties.", rating: 4.8, price: "$499/mo", badge: "RCM Automation" },
  { name: "PharmAssist GPT", desc: "Medication interaction checker with Saudi formulary.", rating: 5.0, price: "$1,200/mo", badge: "Drug Discovery" },
];

export default function StitchAIAgentStore() {
  const [search, setSearch] = useState("");

  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">Health Exchange</h1>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-clinical-primary cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-clinical-primary-container/10 flex items-center justify-center border border-clinical-primary/20">
            <User className="w-4 h-4 text-clinical-primary" />
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 space-y-8">
        <section>
          <h2 className="text-3xl font-semibold text-clinical-on-surface mb-2">AI Agent Store</h2>
          <p className="text-base text-clinical-on-surface-variant mb-6">Deploy intelligent agents for every healthcare workflow.</p>
          <div className="flex gap-4 items-center">
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-primary" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-white border border-clinical-outline-variant rounded-full text-base focus:ring-2 focus:ring-clinical-secondary/50 outline-none"
                placeholder="Search agents by capability or specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-4 bg-clinical-secondary text-white rounded-full text-sm font-semibold hover:-translate-y-0.5 transition-transform stitch-active-scale shadow-lg">
              <Sparkles className="w-4 h-4" /> AI Recommend
            </button>
          </div>
        </section>

        <section>
          <div className="flex gap-4 overflow-x-auto pb-2 stitch-scrollbar-hide">
            {categories.map((c) => (
              <button key={c.label} className="flex items-center gap-3 px-5 py-3 bg-white border border-clinical-outline-variant/30 rounded-full hover:border-clinical-primary/40 hover:bg-clinical-primary-container/10 transition-all whitespace-nowrap stitch-active-scale">
                <c.icon className="w-5 h-5 text-clinical-primary" />
                <span className="text-sm font-semibold">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-clinical-surface-bright via-white to-clinical-secondary/5 rounded-2xl p-6 md:p-10 border border-clinical-outline-variant/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-clinical-secondary" />
            <span className="text-sm font-semibold text-clinical-secondary uppercase tracking-widest">Agent of the Month</span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-clinical-on-surface mb-3">MediCodex AI</h3>
              <p className="text-base text-clinical-on-surface-variant mb-4">Autonomous medical coding agent that reduces denial rates by 34% with real-time FHIR integration. Supports Saudi ICD-10-AM and NPHIES claim schemas.</p>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold">4.9</span>
                </div>
                <span className="text-sm text-clinical-on-surface-variant">2,300+ deployments</span>
                <span className="text-sm text-clinical-on-surface-variant">HIPAA compliant</span>
              </div>
              <button className="px-6 py-3 bg-clinical-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-all stitch-active-scale">
                Deploy Agent
              </button>
            </div>
            <div className="w-full md:w-64 h-40 rounded-xl bg-clinical-primary-container/10 flex items-center justify-center border border-clinical-primary/20">
              <Bot className="w-16 h-16 text-clinical-primary" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-clinical-on-surface mb-4">Top-Rated Agents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topAgents.map((a) => (
              <div key={a.name} className="bg-white rounded-xl border border-clinical-outline-variant/30 overflow-hidden shadow-sm stitch-card-lift">
                <div className="h-36 bg-clinical-surface-container-high flex items-center justify-center">
                  <Bot className="w-12 h-12 text-clinical-primary/40" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-clinical-secondary uppercase">{a.badge}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-semibold">{a.rating}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold">{a.name}</h4>
                  <p className="text-sm text-clinical-on-surface-variant">{a.desc}</p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-bold text-clinical-primary">{a.price}</span>
                    <button className="px-4 py-2 border border-clinical-primary text-clinical-primary rounded-lg text-xs font-semibold hover:bg-clinical-primary hover:text-white transition-colors">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-clinical-surface-container-low rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Build Your Own Agent</h3>
          <p className="text-sm text-clinical-on-surface-variant mb-4">Use our Agent Studio to create custom AI agents trained on your data.</p>
          <button className="px-6 py-3 bg-clinical-secondary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-all stitch-active-scale">
            <Sparkles className="w-4 h-4 inline mr-2" />Launch Agent Studio
          </button>
        </section>
      </main>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 2 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "Home", "Market", "Agents", "Projects", "Profile" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

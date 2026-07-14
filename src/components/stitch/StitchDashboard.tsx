"use client";

import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  PlusSquare, Search, Star, Clock, DollarSign, ArrowRight,
  CheckCircle2, Network, Shield, Database,
} from "lucide-react";

const matches = [
  {
    name: "BioTech Integrations",
    desc: "Specializing in HL7 & FHIR",
    rating: 4.9,
    badge: "12 Recent Projects",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
  },
  {
    name: "NPHIES Solutions Ltd",
    desc: "Claims & Regulatory Experts",
    rating: 4.8,
    badge: "45 Active Needs",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
  },
  {
    name: "SecureHealth AI",
    desc: "HIPAA Compliant Agents",
    rating: 5.0,
    badge: "New Partner",
    img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=250&fit=crop",
  },
];

const needs = [
  {
    icon: Network,
    title: "I need NPHIES Integration",
    desc: "Urgent requirement for a dental clinic group seeking Saudi Arabia regulatory compliance.",
    time: "2h ago",
    price: "$5,000 - $8,000",
  },
  {
    icon: Shield,
    title: "Security Audit for Telehealth App",
    desc: "Looking for a verified provider to conduct a full penetration test and HIPAA compliance check.",
    time: "5h ago",
    price: "Fixed Price",
  },
  {
    icon: Database,
    title: "Legacy Data Migration to Cloud",
    desc: "Mid-sized hospital requires assistance moving 10 years of patient records to AWS HealthLake.",
    time: "Yesterday",
    price: "TBD",
  },
];

export default function StitchDashboard() {
  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">Health Exchange</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-clinical-primary-container/20 transition-colors">
            <Bell className="w-5 h-5 text-clinical-on-surface-variant" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-clinical-primary/20 bg-clinical-primary-container/10 flex items-center justify-center">
            <User className="w-5 h-5 text-clinical-primary" />
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-6 space-y-8">
        <section className="relative overflow-hidden rounded-2xl p-8 stitch-glass text-center">
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <h2 className="text-3xl font-semibold text-clinical-on-surface tracking-tight">How can I help you today?</h2>
            <p className="text-base text-clinical-on-surface-variant max-w-2xl">
              Ask our AI Copilot to compare procurement costs, find verified providers, or analyze integration requirements.
            </p>
            <div className="w-full max-w-3xl stitch-ai-border p-1 mt-4">
              <div className="flex items-center bg-white px-6 py-3 rounded-full">
                <Bot className="w-5 h-5 text-clinical-primary mr-3 shrink-0" />
                <input
                  className="w-full bg-transparent border-none focus:outline-none text-base text-clinical-on-surface placeholder:text-clinical-outline"
                  placeholder="Ask AI to compare procurement costs..."
                  type="text"
                />
                <button className="bg-clinical-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all stitch-active-scale shrink-0">
                  Analyze
                </button>
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-clinical-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-clinical-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: PlusSquare, color: "bg-clinical-primary-container/10 text-clinical-primary", title: "Post a Need", desc: "Request specific medical services" },
            { icon: Store, color: "bg-clinical-secondary-container/10 text-clinical-secondary", title: "Browse Marketplace", desc: "Explore FDA-approved products" },
            { icon: Search, color: "bg-clinical-tertiary-container/10 text-clinical-tertiary", title: "Search Experts", desc: "Find verified healthcare specialists" },
          ].map((action) => (
            <button
              key={action.title}
              className="flex items-center gap-4 p-4 bg-white border border-clinical-outline-variant/30 rounded-xl shadow-sm hover:shadow-md transition-all group stitch-active-scale text-left"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-clinical-on-surface">{action.title}</h3>
                <p className="text-sm text-clinical-on-surface-variant">{action.desc}</p>
              </div>
            </button>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-semibold text-clinical-on-surface">Personalized Matches</h2>
              <p className="text-base text-clinical-on-surface-variant">Top-rated providers aligned with your profile.</p>
            </div>
            <button className="text-clinical-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 stitch-scrollbar-hide">
            {matches.map((m) => (
              <div key={m.name} className="min-w-[300px] bg-white rounded-xl border border-clinical-outline-variant/30 overflow-hidden shadow-sm stitch-card-lift">
                <div className="h-32 bg-clinical-surface-container-high relative">
                  <img className="w-full h-full object-cover" src={m.img} alt={m.name} />
                  <div className="absolute top-2 right-2 stitch-verified-badge text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="font-medium">VERIFIED</span>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="text-lg font-bold text-clinical-on-surface">{m.name}</h4>
                  <p className="text-sm text-clinical-on-surface-variant">{m.desc}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-clinical-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{m.rating}</span>
                    </div>
                    <span className="text-xs font-semibold bg-clinical-surface-variant px-2 py-1 rounded">{m.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-clinical-on-surface">Active Needs</h2>
            <div className="flex gap-2">
              <span className="bg-clinical-primary-container/10 text-clinical-primary text-sm font-semibold px-3 py-1 rounded-full">Integration</span>
              <span className="bg-clinical-surface-container-high text-clinical-on-surface-variant text-sm font-semibold px-3 py-1 rounded-full">Regulatory</span>
            </div>
          </div>
          <div className="bg-white border border-clinical-outline-variant/30 rounded-xl overflow-hidden divide-y divide-clinical-outline-variant/20 shadow-sm">
            {needs.map((need) => (
              <div key={need.title} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-clinical-surface-container-low transition-colors cursor-pointer group">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-clinical-primary/5 rounded-full flex items-center justify-center shrink-0">
                    <need.icon className="w-5 h-5 text-clinical-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold group-hover:text-clinical-primary transition-colors">{need.title}</h4>
                    <p className="text-sm text-clinical-on-surface-variant">{need.desc}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs flex items-center gap-1 text-clinical-on-surface-variant">
                        <Clock className="w-3.5 h-3.5" /> {need.time}
                      </span>
                      <span className="text-xs flex items-center gap-1 text-clinical-tertiary font-bold">
                        <DollarSign className="w-3.5 h-3.5" /> {need.price}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-clinical-primary-container text-white px-6 py-2 rounded-lg text-sm font-semibold hover:brightness-110 stitch-active-scale self-start md:self-center">
                  Submit Proposal
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex justify-around items-center px-4 pt-2 pb-6 h-20">
        {[
          { icon: Home, label: "Home", active: true },
          { icon: Store, label: "Market", active: false },
          { icon: Bot, label: "Copilot", active: false },
          { icon: ClipboardList, label: "Projects", active: false },
          { icon: User, label: "Profile", active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all stitch-active-scale ${
              tab.active
                ? "bg-clinical-primary-container text-white rounded-full"
                : "text-clinical-on-surface-variant hover:bg-clinical-surface-container-high rounded-full"
            }`}
          >
            <tab.icon className={`w-5 h-5 ${tab.active ? "" : ""}`} />
            <span className="text-xs font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

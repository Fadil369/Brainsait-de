"use client";

import { useState } from "react";
import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Star, CheckCircle2, MapPin, Globe, Shield, Mail, Phone,
  Building2, Users, Award, BookOpen, FileText, ArrowRight,
} from "lucide-react";

const services = [
  { icon: Shield, title: "FHIR Implementation", desc: "End-to-end HL7 FHIR R4 integration for hospitals." },
  { icon: Award, title: "NPHIES Compliance", desc: "Saudi national insurance claims and eligibility." },
  { icon: Bot, title: "Clinical AI Agents", desc: "Deploy HIPAA-compliant AI agents for workflows." },
  { icon: BookOpen, title: "Health Tech Training", desc: "CME-accredited programs for healthcare IT teams." },
];

const projects = [
  { name: "NEHR Integration — Phase 2", client: "Ministry of Health", budget: "SAR 2.8M", status: "In Progress" },
  { name: "AI Triage System", client: "King Faisal Hospital", budget: "SAR 1.2M", status: "Completed" },
  { name: "NPHIES Claims Gateway", client: "Dental Clinic Group", budget: "SAR 450K", status: "Completed" },
];

export default function StitchOrganizationProfile() {
  const [tab, setTab] = useState("about");

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

      <div className="relative h-48 bg-gradient-to-r from-clinical-primary to-clinical-secondary">
        <div className="absolute -bottom-16 left-6 md:left-16 flex items-end gap-4">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center">
            <Building2 className="w-10 h-10 md:w-16 md:h-16 text-clinical-primary" />
          </div>
          <div className="pb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">General Hospital Corp</h2>
              <CheckCircle2 className="w-6 h-6 text-clinical-tertiary" />
            </div>
            <p className="text-white/80 text-sm">Verified Healthcare Institution</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-8 px-6 md:px-16 pt-20 pb-4">
        {[
          { icon: Star, label: "1,284", sub: "Projects" },
          { icon: Users, label: "12.5K", sub: "Followers" },
          { icon: Award, label: "4.9", sub: "Rating" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-xl font-bold">{s.label}</p>
            <p className="text-xs text-clinical-on-surface-variant">{s.sub}</p>
          </div>
        ))}
      </div>

      <main className="max-w-[1280px] mx-auto px-4 md:px-16">
        <div className="flex gap-2 mb-6 border-b border-clinical-outline-variant/20 pb-2 overflow-x-auto">
          {["about", "services", "projects", "portfolio"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${tab === t ? "border-clinical-primary text-clinical-primary" : "border-transparent text-clinical-on-surface-variant hover:text-clinical-primary"}`}>{t}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {tab === "about" && (
              <>
                <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-3">About</h3>
                  <p className="text-sm text-clinical-on-surface-variant leading-relaxed">General Hospital Corp is a Saudi-based healthcare technology group specializing in digital transformation for hospitals and clinics. With over 200 successful implementations across the Gulf region, we provide end-to-end FHIR integration, NPHIES compliance, AI-powered clinical workflows, and healthcare workforce training.</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-clinical-on-surface-variant">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Riyadh, Saudi Arabia</span>
                    <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> ghc.sa</span>
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> info@ghc.sa</span>
                  </div>
                </section>
                <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Verification & Certifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Saudi Commission for Health Specialties", status: "Verified" },
                      { label: "ZATCA E-Invoicing", status: "Compliant" },
                      { label: "ISO 27001:2022", status: "Certified" },
                      { label: "NPHIES Registered Partner", status: "Active" },
                    ].map((cert) => (
                      <div key={cert.label} className="flex items-center justify-between p-3 bg-clinical-surface-container-low rounded-lg">
                        <span className="text-sm">{cert.label}</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-clinical-tertiary"><CheckCircle2 className="w-3 h-3" /> {cert.status}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {tab === "services" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div key={s.title} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-clinical-primary/10 flex items-center justify-center mb-3"><s.icon className="w-5 h-5 text-clinical-primary" /></div>
                    <h4 className="font-bold mb-1">{s.title}</h4>
                    <p className="text-sm text-clinical-on-surface-variant">{s.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "projects" && (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.name} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{p.name}</h4>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.status === "In Progress" ? "bg-clinical-primary/10 text-clinical-primary" : "bg-clinical-tertiary/10 text-clinical-tertiary"}`}>{p.status}</span>
                    </div>
                    <p className="text-sm text-clinical-on-surface-variant">{p.client}</p>
                    <p className="text-sm font-bold text-clinical-primary mt-1">{p.budget}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
              <h4 className="font-bold mb-3">Active Needs</h4>
              <div className="space-y-3">
                {["NPHIES Integration for Dental Group", "Security Audit — Telehealth App"].map((need) => (
                  <div key={need} className="p-3 bg-clinical-surface-container-low rounded-lg">
                    <p className="text-sm font-semibold">{need}</p>
                    <button className="text-xs text-clinical-primary font-semibold mt-2 flex items-center gap-1 hover:underline">Propose Solution <ArrowRight className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-clinical-secondary/5 rounded-xl border border-clinical-secondary/20 p-5">
              <h4 className="font-bold mb-2 flex items-center gap-2"><Bot className="w-4 h-4 text-clinical-secondary" /> AI Market Insight</h4>
              <p className="text-xs text-clinical-on-surface-variant mb-3">Based on your profile, you are a top match for 3 new NPHIES integration projects in the Eastern Province.</p>
              <button className="w-full py-2 bg-clinical-secondary text-white rounded-full text-xs font-semibold hover:opacity-90 transition-all">View Matches</button>
            </div>
          </aside>
        </div>
      </main>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 4 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "Home", "Market", "Copilot", "Research", "Profile" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

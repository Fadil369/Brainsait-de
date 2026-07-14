"use client";

import { useState } from "react";
import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Search, Star, Download, BookOpen, FlaskConical, Database,
  ArrowRight, DollarSign, Clock, TrendingUp, FileText,
} from "lucide-react";

const trials = [
  { title: "AI-Assisted Diabetic Retinopathy Screening", phase: "Phase III", status: "Recruiting", site: "King Faisal Specialist Hospital", patients: 2400 },
  { title: "NLP for Arabic Clinical Notes", phase: "Phase II", status: "Active", site: "King Saud University Medical City", patients: 850 },
  { title: "Mobile Health for Maternal Care", phase: "Phase II", status: "Recruiting", site: "Ministry of Health — Eastern Province", patients: 1200 },
  { title: "FHIR-Based Multi-Hospital Interoperability", phase: "Phase III", status: "Completed", site: "National Guard Health Affairs", patients: 3200 },
];

const pubs = [
  { title: "Machine Learning for Early Sepsis Detection in ICU", journal: "Nature Digital Medicine", date: "Jun 2026", citations: 24 },
  { title: "Blockchain for Healthcare Data Integrity in KSA", journal: "JMIR Medical Informatics", date: "May 2026", citations: 18 },
  { title: "Telemedicine Adoption Post-COVID in Gulf Region", journal: "The Lancet Digital Health", date: "Apr 2026", citations: 42 },
];

const grants = [
  { title: "NEHR AI Innovation Grant", amount: "SAR 2.5M", deadline: "Aug 15, 2026" },
  { title: "SDAIA Health Data Research Fund", amount: "SAR 5M", deadline: "Sep 30, 2026" },
  { title: "WHO Digital Health Accelerator", amount: "$250K", deadline: "Oct 1, 2026" },
];

export default function StitchResearchHub() {
  const [tab, setTab] = useState<"trials" | "publications" | "datasets">("trials");

  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">Research Hub</h1>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-clinical-primary cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-clinical-primary-container/10 flex items-center justify-center border border-clinical-primary/20">
            <User className="w-4 h-4 text-clinical-primary" />
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 space-y-8">
        <section className="bg-gradient-to-br from-clinical-primary/5 to-clinical-secondary/5 rounded-2xl p-8 border">
          <h2 className="text-3xl font-semibold mb-2">Explore Clinical Research</h2>
          <p className="text-base text-clinical-on-surface-variant mb-6">Search clinical trials, publications, and datasets across the healthcare ecosystem.</p>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-primary" />
            <input className="w-full pl-12 pr-4 py-4 bg-white border border-clinical-outline-variant rounded-full text-base focus:ring-2 focus:ring-clinical-secondary/50 outline-none" placeholder="Search trials, publications, datasets..." />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: FlaskConical, label: "Active Trials", value: "1,248", color: "text-clinical-primary bg-clinical-primary/10" },
            { icon: BookOpen, label: "Publications", value: "42.5K", color: "text-clinical-secondary bg-clinical-secondary/10" },
            { icon: Database, label: "Datasets", value: "812", color: "text-clinical-tertiary bg-clinical-tertiary/10" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                <span className="text-sm text-clinical-on-surface-variant">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="flex gap-2 mb-4">
            {(["trials", "publications", "datasets"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize ${tab === t ? "bg-clinical-primary text-white" : "bg-white border border-clinical-outline-variant text-clinical-on-surface-variant hover:border-clinical-primary"}`}>{t}</button>
            ))}
          </div>

          {tab === "trials" && (
            <div className="space-y-3">
              {trials.map((t) => (
                <div key={t.title} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{t.title}</h4>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${t.status === "Recruiting" ? "bg-clinical-tertiary/10 text-clinical-tertiary" : t.status === "Active" ? "bg-clinical-primary/10 text-clinical-primary" : "bg-clinical-surface-container-high text-clinical-on-surface-variant"}`}>{t.status}</span>
                  </div>
                  <p className="text-sm text-clinical-on-surface-variant mb-2">{t.site}</p>
                  <div className="flex items-center gap-4 text-xs text-clinical-on-surface-variant">
                    <span>{t.phase}</span>
                    <span>{t.patients.toLocaleString()} patients</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "publications" && (
            <div className="space-y-3">
              {pubs.map((p) => (
                <div key={p.title} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{p.title}</h4>
                      <p className="text-xs text-clinical-on-surface-variant mt-1">{p.journal} · {p.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-clinical-secondary/10 text-clinical-secondary px-2 py-1 rounded-full">{p.citations} citations</span>
                      <Download className="w-4 h-4 text-clinical-primary cursor-pointer" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "datasets" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Cardiology EHR Dataset", records: "50K patients", format: "FHIR R4", size: "12 GB" },
                { name: "Chest X-Ray Archive", records: "112K images", format: "DICOM", size: "45 GB" },
                { name: "Arabic Clinical Notes Corpus", records: "2M notes", format: "JSON", size: "8 GB" },
              ].map((d) => (
                <div key={d.name} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-5 h-5 text-clinical-primary" />
                    <h4 className="font-bold">{d.name}</h4>
                  </div>
                  <div className="flex gap-4 text-xs text-clinical-on-surface-variant">
                    <span>{d.records}</span>
                    <span>{d.format}</span>
                    <span>{d.size}</span>
                  </div>
                  <button className="mt-3 text-sm text-clinical-primary font-semibold flex items-center gap-1 hover:underline">Access Dataset <ArrowRight className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-clinical-primary" /> Funding Opportunities</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 stitch-scrollbar-hide">
            {grants.map((g) => (
              <div key={g.title} className="min-w-[280px] bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
                <h4 className="font-bold text-sm mb-2">{g.title}</h4>
                <p className="text-lg font-bold text-clinical-primary mb-1">{g.amount}</p>
                <div className="flex items-center gap-1 text-xs text-clinical-on-surface-variant mb-3"><Clock className="w-3 h-3" /> Deadline: {g.deadline}</div>
                <button className="w-full py-2 bg-clinical-primary text-white rounded-full text-xs font-semibold hover:opacity-90 transition-all">Apply Now</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 0 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "Home", "Market", "Copilot", "Research", "Profile" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

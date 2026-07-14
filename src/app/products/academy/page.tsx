"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, BookOpen, Award, Code, Globe, Cpu, Users, Monitor } from "lucide-react";

const PRODUCTS = [
  { icon: GraduationCap, name: "Academy", tagline: "BrainSAIT Learning Platform", desc: "Central healthcare education hub — accredited courses, professional development, and continuous medical education for the Saudi workforce.", status: "Live" },
  { icon: Monitor, name: "LMS", tagline: "Healthcare Learning Management", desc: "Enterprise LMS with Arabic support — course authoring, assessments, progress tracking, and certification management.", status: "Live" },
  { icon: Award, name: "Certification", tagline: "Healthcare Professional Certification", desc: "Industry-recognised certifications in NPHIES, ICD-10-AM coding, healthcare AI, and compliance management.", status: "Live" },
  { icon: Code, name: "Coding Academy", tagline: "ICD-10-AM & CPT Bootcamp", desc: "Intensive medical coding bootcamp with hands-on practice, real-world cases, and NPHIES-compliant coding certification.", status: "Live" },
  { icon: Globe, name: "NPHIES Academy", tagline: "NPHIES Certification Program", desc: "Comprehensive NPHIES training — claims submission, eligibility, prior auth, and compliance for providers and payers.", status: "Live" },
  { icon: Cpu, name: "AI Academy", tagline: "Healthcare AI Training", desc: "Practical AI training for healthcare professionals — clinical AI, prompt engineering, LLM safety, and deployment best practices.", status: "Live" },
  { icon: BookOpen, name: "Developer Academy", tagline: "Health-Tech Developer Training", desc: "Technical training for healthcare developers — FHIR, HL7, SMART-on-FHIR, healthcare API development, and MCP protocol.", status: "Beta" },
  { icon: Users, name: "Simulation Lab", tagline: "Virtual Healthcare Simulation", desc: "AI-powered clinical simulation environment for training doctors, nurses, and administrators in realistic scenarios.", status: "Beta" },
];

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-[#e11d48]/[0.08] blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#e11d48]" />
            </div>
            <span className="text-[11px] font-700 text-[#e11d48] uppercase tracking-[0.12em]">Business Unit</span>
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-4">BrainSAIT Academy</h1>
          <p className="text-[18px] text-white/50 leading-relaxed max-w-2xl">
            Healthcare education platform offering accredited courses, professional certifications, coding bootcamps, and simulation-based learning for the Saudi healthcare workforce.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/marketplace/education" className="btn btn-gold">Browse Courses</Link>
            <Link href="/sadad" className="btn btn-ghost-white">View Pricing</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => (
            <Link key={p.name} href="/marketplace/education" className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <p.icon className="w-5 h-5 text-white/70" />
                </div>
                <span className={`text-[10px] font-600 px-2 py-0.5 rounded-full ${
                  p.status === "Live" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                }`}>{p.status}</span>
              </div>
              <h3 className="text-[16px] font-700 text-white mb-1">{p.name}</h3>
              <p className="text-[12px] text-[#fb7185] font-500 mb-2">{p.tagline}</p>
              <p className="text-[13px] text-white/40 leading-relaxed">{p.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[12.5px] font-600 text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                Learn more <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

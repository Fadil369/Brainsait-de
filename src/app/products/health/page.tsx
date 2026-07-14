"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Stethoscope, Bot, FileText, Shield, Calendar, Smartphone, Microscope, FlaskConical, Pill, Network, Activity } from "lucide-react";

const PRODUCTS = [
  { icon: Activity, name: "ClaimLinc", tagline: "AI Revenue Cycle Management", desc: "End-to-end RCM automation — eligibility, claims submission, denial management, and payment reconciliation via NPHIES Direct Gateway.", status: "Live", href: "/marketplace/api" },
  { icon: Bot, name: "ClinicalLinc", tagline: "Clinical Decision Intelligence", desc: "AI-powered clinical decision support with Arabic-capable NLP, drug interaction checks, and evidence-based recommendations.", status: "Live", href: "/copilot" },
  { icon: FileText, name: "CodingLinc", tagline: "ICD-10-AM & CPT Coding Assistant", desc: "Automated medical coding with AI — ICD-10-AM, CPT, and Saudi procedure codes with real-time validation.", status: "Live", href: "/marketplace/api" },
  { icon: Shield, name: "PriorAuthLinc", tagline: "Automated Prior Authorization", desc: "Intelligent prior authorization with NPHIES integration — auto-checks medical necessity, policy rules, and eligibility.", status: "Live", href: "/marketplace/api" },
  { icon: Network, name: "ComplianceLinc", tagline: "NPHIES & Regulatory Compliance", desc: "Automated compliance monitoring across PDPL, CBAHI, NCA-ECC, MOH, and NPHIES standards.", status: "Live", href: "/governance" },
  { icon: Microscope, name: "RadioLinc", tagline: "Radiology AI Workflow", desc: "AI-assisted radiology workflow — image analysis, automated reporting, and PACS integration.", status: "Live", href: "/copilot" },
  { icon: FlaskConical, name: "LabLinc", tagline: "Laboratory Workflow Automation", desc: "End-to-end lab workflow from order entry to result delivery with AI-driven quality checks.", status: "Beta", href: "/marketplace" },
  { icon: Pill, name: "PharmacyLinc", tagline: "Medication Management", desc: "AI-powered pharmacy management — drug interaction checks, inventory, dispensing, and patient counseling.", status: "Beta", href: "/marketplace" },
  { icon: Calendar, name: "AppointmentLinc", tagline: "Scheduling Platform", desc: "Smart patient scheduling with AI-optimised slot allocation, automated reminders, and multi-channel booking.", status: "Live", href: "/marketplace" },
  { icon: Smartphone, name: "PatientLinc", tagline: "Patient Engagement Portal", desc: "Omnichannel patient portal — appointments, lab results, billing, telemedicine, and health records.", status: "Live", href: "/marketplace" },
  { icon: Smartphone, name: "ReferralLinc", tagline: "Smart Referral Management", desc: "Digital referral network connecting primary care to specialists with automated prior auth and status tracking.", status: "Beta", href: "/marketplace" },
  { icon: Activity, name: "Basma Health", tagline: "AI Receptionist & Voice Secretary", desc: "Voice AI receptionist handling appointments, inquiries, and triage in Arabic and English — 24/7.", status: "Live", href: "/sadad" },
];

export default function HealthPage() {
  return (
    <main className="min-h-screen bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-[#1a56db]/[0.10] blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-[#1a56db]" />
            </div>
            <span className="text-[11px] font-700 text-[#1a56db] uppercase tracking-[0.12em]">Business Unit</span>
          </div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-4">BrainSAIT Health</h1>
          <p className="text-[18px] text-white/50 leading-relaxed max-w-2xl">
            AI-powered clinical intelligence, revenue cycle automation, and hospital-wide operational systems — purpose-built for Saudi healthcare.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/sadad" className="btn btn-gold">Browse Health Products</Link>
            <Link href="/marketplace/needs" className="btn btn-ghost-white">Book a Demo</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.map((p) => (
            <Link key={p.name} href={p.href} className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all hover:-translate-y-0.5">
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

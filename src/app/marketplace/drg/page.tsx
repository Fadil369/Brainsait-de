"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  Globe,
  Languages,
  Layers,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/UI";

const EXAMPLE_NOTES = [
  "Patient with sukari symptoms, ضغط دم مرتفع controlled with medication.",
  "مريض يعاني من التهاب رئوي بكتيري وكسر في الساق اليسرى.",
  "Patient has pneumonia and a fracture.",
];

export default function DRGProductPage() {
  const [note, setNote] = useState(EXAMPLE_NOTES[0]);
  const [age, setAge] = useState<string>("55");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/drg/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinical_note: note,
          age: Number(age) || undefined,
          encounter_type: "INPATIENT",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0c10] py-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#1a56db]/[0.08] blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.10] mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#e9c46a]" />
                <span className="text-[12px] font-600 text-white/60">Ready to deploy — NPHIES-aligned</span>
              </div>
              <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-800 text-white leading-[1.05] mb-5">
                BrainSAIT DRG Suite
                <br />
                <span className="text-grad-gold">Bilingual Saudi DRG automation</span>
              </h1>
              <p className="text-[17px] text-white/50 leading-relaxed mb-8">
                APR-DRG / EAPG grouping, Arabic/English code-switching NLP, CDI nudges,
                and NPHIES claim submission — in one SOC-2-ready product.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn btn-gold btn-lg"
                >
                  <Play className="w-4 h-4" /> Live Demo
                </button>
                <Link href="/marketplace/needs/new" className="btn btn-ghost-white btn-lg">
                  Request Pricing <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/40 text-sm">Product SKU</span>
                <Badge variant="success">Live</Badge>
              </div>
              <p className="text-2xl font-bold text-white mb-1">DRG-SUITE-SA-2026</p>
              <p className="text-white/50 text-sm mb-6">Bilingual AR/EN clinical coding & grouping engine</p>
              <div className="space-y-3">
                {[
                  { label: "Deployment", value: "Cloud / On-premise / Hybrid" },
                  { label: "Compliance", value: "SOC 2, PDPL, NPHIES-ready" },
                  { label: "Languages", value: "Arabic + English (code-switching)" },
                  { label: "Starting at", value: "SAR 4,500 / bed / month" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm border-b border-white/5 pb-2">
                    <span className="text-white/40">{row.label}</span>
                    <span className="text-white/80">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">What you get</h2>
            <p className="text-gray-500 mt-2">Everything a Saudi provider needs to automate DRG-based reimbursement.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Languages, title: "Code-switching NLP", desc: "Understands mixed Arabic/English clinical notes in a single pass." },
              { icon: Activity, title: "APR-DRG / EAPG", desc: "Explainable SOI, ROM, relative weight and Case Mix Index." },
              { icon: Stethoscope, title: "CDI Nudges", desc: "Bilingual documentation prompts quantified in SOI points." },
              { icon: Globe, title: "NPHIES Connector", desc: "OAuth, TLS 1.2, FHIR validation and claims submission." },
              { icon: ShieldCheck, title: "Audit & Compliance", desc: "Immutable BOS audit log for every coding decision." },
              { icon: Layers, title: "3 Automation Phases", desc: "CAC → Semi-autonomous → Autonomous based on confidence." },
              { icon: FileText, title: "Field Mapping", desc: "Bilingual BrainSAIT ↔ nphies/Etimad mapping console." },
              { icon: Upload, title: "Easy Integration", desc: "REST API, FHIR gateway, and EHR connector ready." },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl gradient-health flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section id="demo" className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="primary">Interactive Demo</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mt-3">Try the coding engine live</h2>
            <p className="text-gray-500 mt-2">Paste an Arabic, English, or mixed clinical note and see ICD-10 codes, DRG, SOI and ROM.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Clinical note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-32 px-4 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div className="flex gap-2">
                {EXAMPLE_NOTES.map((n, i) => (
                  <button
                    key={i}
                    onClick={() => setNote(n)}
                    className="px-3 py-2 text-xs font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    Example {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={analyze}
              disabled={loading}
              className="btn btn-primary btn-lg w-full justify-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Analyze Note"}
            </button>

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
            )}

            {result && (
              <div className="mt-8 space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
                    <p className="text-xs text-primary-600 uppercase font-semibold">DRG Family</p>
                    <p className="text-xl font-bold text-primary-900">{result.drg?.code}</p>
                    <p className="text-xs text-primary-700 mt-1">{result.drg?.title_en}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <p className="text-xs text-emerald-600 uppercase font-semibold">SOI / ROM</p>
                    <p className="text-xl font-bold text-emerald-900">{result.drg?.soi} / {result.drg?.rom}</p>
                    <p className="text-xs text-emerald-700 mt-1">Severity / Risk of Mortality</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-xs text-amber-600 uppercase font-semibold">Relative Weight</p>
                    <p className="text-xl font-bold text-amber-900">{result.drg?.relative_weight}</p>
                    <p className="text-xs text-amber-700 mt-1">{result.phase} phase</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Suggested Codes</h3>
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                    {result.suggested_codes?.map((code: any) => (
                      <div key={code.code} className="flex items-start justify-between p-4 hover:bg-gray-50">
                        <div>
                          <p className="font-semibold text-gray-900">{code.code} {code.is_principal && <Badge variant="primary">Principal</Badge>}</p>
                          <p className="text-sm text-gray-600">{code.desc}</p>
                          <p className="text-sm text-gray-500" dir="rtl">{code.desc_ar}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{(code.confidence * 100).toFixed(0)}%</p>
                          <p className="text-xs text-gray-400">confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Detected language:</strong> {result.detected_language}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Automation phase:</strong> {result.phase} ({result.status})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing & CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Provider Edition</h3>
              <p className="text-gray-500 mb-6">For hospitals and clinics ready to automate DRG-based reimbursement.</p>
              <p className="text-3xl font-bold text-primary-700 mb-6">SAR 4,500 <span className="text-base font-normal text-gray-500">/ bed / month</span></p>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited notes & claims",
                  "Bilingual CDI nudges",
                  "NPHIES submission module",
                  "Standard SLA & support",
                  "BOS audit integration",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-health-green" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/marketplace/needs/new" className="btn btn-primary btn-lg w-full justify-center">
                Request Quote
              </Link>
            </div>
            <div className="bg-[#0a0c10] rounded-2xl border border-white/10 p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Enterprise Edition</h3>
              <p className="text-white/50 mb-6">For payers, hospital groups, and government deployments at scale.</p>
              <p className="text-3xl font-bold text-[#e9c46a] mb-6">Custom</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Multi-facility CMI analytics",
                  "Custom DRG calibration",
                  "Private cloud / on-premise",
                  "Dedicated TAM & 24/7 SLA",
                  "SOC 2 / NPHIES certification support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-[#e9c46a]" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-gold btn-lg w-full justify-center">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

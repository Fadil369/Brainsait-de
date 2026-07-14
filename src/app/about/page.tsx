"use client";

import Link from "next/link";
import { ArrowRight, Shield, Globe, Cpu, Users, TrendingUp } from "lucide-react";

const TEAM = [
  { name: "Dr. Abdullah Al-Rashidi", role: "Chief Executive Officer", bio: "Former MOH digital transformation lead. 15+ years in healthcare IT across GCC.", initials: "AA" },
  { name: "Noura Al-Qahtani", role: "Chief Technology Officer", bio: "AI researcher and healthcare system architect. PhD Computer Science, KAUST.", initials: "NQ" },
  { name: "Khalid Al-Dossary", role: "Chief Operating Officer", bio: "Healthcare operations expert. Built and scaled 3 health-tech ventures in MENA.", initials: "KD" },
  { name: "Sara Al-Mutairi", role: "VP Product", bio: "Product leader with experience at Oracle Health and Siemens Healthineers.", initials: "SM" },
];

const VALUES = [
  { icon: Shield, title: "Trust & Transparency", desc: "Every provider verified. Every transaction auditable. Built on Saudi regulatory standards." },
  { icon: Globe, title: "Vision 2030 Alignment", desc: "Purpose-built for Saudi Arabia's healthcare transformation. NPHIES-native from day one." },
  { icon: Cpu, title: "AI-First", desc: "Intelligence at every layer — matching, compliance, automation, and clinical decision support." },
  { icon: Users, title: "Ecosystem Approach", desc: "We don't compete with healthcare companies — we connect them, amplify them, and grow together." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-[#0a0c10] py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#1a56db]/[0.08] blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-5">
            Saudi Arabia's AI Infrastructure
            <br />
            <span className="text-grad-gold">for Healthcare</span>
          </h1>
          <p className="text-[17px] text-white/50 max-w-2xl mx-auto leading-relaxed">
            BrainSAIT builds the intelligent marketplace and enterprise platform that connects hospitals,
            automates revenue cycles, and deploys clinical AI across the Kingdom — aligned with Vision 2030.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <p className="text-[11px] font-700 text-[#1a56db] uppercase tracking-[0.14em] mb-3">Our Mission</p>
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-800 text-gray-900 mb-5">
                Connect every healthcare organisation to the intelligence, partners, and tools it needs to thrive.
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed">
                Saudi Arabia's healthcare system is undergoing the most ambitious digital transformation in its history.
                BrainSAIT exists to make that transformation faster, smarter, and more inclusive — connecting
                multinational hospitals to local AI startups, academic medical centres to government regulators,
                and every healthcare professional to the training they need to succeed.
              </p>
            </div>
            <div className="space-y-6">
              {VALUES.map((v) => (
                <div key={v.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1a56db]/[0.08] flex items-center justify-center flex-shrink-0">
                    <v.icon className="w-5 h-5 text-[#1a56db]" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-700 text-gray-900 mb-0.5">{v.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-[#f8f9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-700 text-[#1a56db] uppercase tracking-[0.14em] mb-3">Leadership</p>
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-800 text-gray-900">Built by healthcare and technology leaders</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-lg transition-all">
                <div className="w-16 h-16 rounded-full grad-brand flex items-center justify-center text-white text-[18px] font-700 mx-auto mb-4">
                  {m.initials}
                </div>
                <h3 className="text-[15px] font-700 text-gray-900 mb-0.5">{m.name}</h3>
                <p className="text-[12px] text-[#1a56db] font-500 mb-3">{m.role}</p>
                <p className="text-[12.5px] text-gray-500 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0a0c10] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[2rem] font-800 text-white mb-4">Join the ecosystem</h2>
          <p className="text-[16px] text-white/50 mb-8">Whether you need solutions, offer them, or want to build on our platform — there's a place for you.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/marketplace/needs" className="btn btn-gold btn-lg">Post a Need</Link>
            <Link href="/marketplace/offers/new" className="btn btn-ghost-white btn-lg">Offer a Solution</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { Shield, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-[#0a0c10] py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-[#e9c46a]" />
            <span className="text-[11px] font-700 text-[#e9c46a] uppercase tracking-[0.12em]">Legal</span>
          </div>
          <h1 className="text-[2.5rem] font-800 text-white">Privacy Policy</h1>
          <p className="text-[14px] text-white/40 mt-3">Last updated: January 1, 2026 · BrainSAIT GmbH</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">1. Introduction</h2>
            <p className="text-[14px] text-gray-600 leading-relaxed">BrainSAIT GmbH ("BrainSAIT") operates brainsait.de. We protect your personal data in accordance with Saudi Arabia's Personal Data Protection Law (PDPL) and ISO 27001.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">2. Data We Collect</h2>
            <p className="text-[14px] text-gray-600 leading-relaxed mb-3">We collect: Identity Data (name, email, phone, job title); Technical Data (IP, device identifiers); Healthcare-Related Data (organisational data, treated with highest security); Communications (messages, proposals).</p>
          </div>
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">3. Your PDPL Rights</h2>
            <div className="bg-gray-50 rounded-xl p-5 space-y-2">
              {["Right to access your personal data", "Right to correct inaccurate data", "Right to delete your data", "Right to object to processing", "Right to data portability", "Right to withdraw consent"].map((r) => (
                <div key={r} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-[13px] text-gray-700">{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">4. Contact</h2>
            <p className="text-[14px] text-gray-600">Privacy inquiries: <strong>privacy@brainsait.de</strong></p>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-[#0a0c10] py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-[#e9c46a]" />
            <span className="text-[11px] font-700 text-[#e9c46a] uppercase tracking-[0.12em]">Legal</span>
          </div>
          <h1 className="text-[2.5rem] font-800 text-white">Terms of Service</h1>
          <p className="text-[14px] text-white/40 mt-3">Last updated: January 1, 2026 · BrainSAIT GmbH</p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">1. Acceptance</h2>
            <p className="text-[14px] text-gray-600 leading-relaxed">By accessing brainsait.de, you agree to be bound by these Terms. If you do not agree, do not use the Platform.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">2. Platform</h2>
            <p className="text-[14px] text-gray-600 leading-relaxed">BrainSAIT Health Exchange is a marketplace connecting healthcare organisations with AI solutions, technology providers, and consultants.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">3. SADAD Payments</h2>
            <p className="text-[14px] text-gray-600 leading-relaxed">Payments via SADAD (stc pay), biller code 207. Minimum SAR 5,000. BrainSAIT is an intermediary — not a party to direct buyer-provider transactions.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">4. Compliance</h2>
            <p className="text-[14px] text-gray-600 leading-relaxed">All users must comply with PDPL, NPHIES, CBAHI, MOH, and NCA-ECC controls. BrainSAIT may suspend accounts for regulatory violations.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">5. Governing Law</h2>
            <p className="text-[14px] text-gray-600 leading-relaxed">Laws of Saudi Arabia. Exclusive jurisdiction of Riyadh courts.</p>
          </div>
          <div>
            <h2 className="text-[18px] font-700 text-gray-900 mb-3">6. Contact</h2>
            <p className="text-[14px] text-gray-600">Questions: <strong>legal@brainsait.de</strong></p>
          </div>
        </div>
      </section>
    </main>
  );
}

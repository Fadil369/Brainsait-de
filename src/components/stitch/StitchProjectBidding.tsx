"use client";

import { useState } from "react";
import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  DollarSign, Clock, CheckCircle2, Shield, Users, FileText,
  Send, MessageSquare, Star, AlertCircle, ArrowRight, TrendingUp,
} from "lucide-react";

const requirements = [
  "FHIR R4 Patient & Observation resources",
  "NPHIES Eligibility & Claims schema mapping",
  "Arabic/English bilingual interface",
  "HIPAA & SDAIA compliance",
  "Real-time sync with existing EHR",
];

export default function StitchProjectBidding() {
  const [bidAmount, setBidAmount] = useState("");
  const [timeline, setTimeline] = useState("");

  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-32">
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

      <div className="relative h-48 bg-gradient-to-br from-clinical-primary to-clinical-secondary flex items-end">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 w-full pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs bg-clinical-tertiary text-white px-3 py-1 rounded-full font-semibold">Open for Proposals</span>
            <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full font-semibold">NPHIES</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">NPHIES Integration for Multi-Specialty Dental Group</h2>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-3">Project Overview</h3>
              <p className="text-sm text-clinical-on-surface-variant leading-relaxed mb-4">A dental clinic group with 12 branches across Riyadh and Jeddah requires a full NPHIES integration solution. The project includes connecting their existing EHR system to the Saudi National Health Insurance system for eligibility verification, claims submission, and prior authorization workflows.</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-clinical-on-surface-variant">Category</span>
                  <p className="font-semibold">Integration</p>
                </div>
                <div>
                  <span className="text-clinical-on-surface-variant">Posted</span>
                  <p className="font-semibold">2 days ago</p>
                </div>
                <div>
                  <span className="text-clinical-on-surface-variant">Proposals</span>
                  <p className="font-semibold">7</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Requirements</h3>
              <div className="space-y-3">
                {requirements.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-clinical-tertiary" />
                    <span className="text-sm">{r}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Current Bids</h3>
                <span className="text-xs text-clinical-on-surface-variant">Anonymized until you submit</span>
              </div>
              <div className="space-y-3">
                {[
                  { initials: "TC", amount: "$4,500 - $6,000", time: "2d left" },
                  { initials: "DX", amount: "$6,000 - $8,000", time: "2d left" },
                  { initials: "AI", amount: "$3,500 - $5,000", time: "2d left" },
                ].map((bid) => (
                  <div key={bid.initials} className="flex items-center justify-between p-4 bg-clinical-surface-container-low rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-clinical-primary/10 flex items-center justify-center text-sm font-bold text-clinical-primary">{bid.initials}</div>
                      <div>
                        <p className="text-sm font-semibold filter blur-sm">Provider Name</p>
                        <p className="text-sm font-bold text-clinical-primary">{bid.amount}</p>
                      </div>
                    </div>
                    <span className="text-xs text-clinical-on-surface-variant flex items-center gap-1"><Clock className="w-3 h-3" /> {bid.time}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Draft Your Proposal</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block">Bid Amount (USD)</label>
                  <input className="w-full p-3 border border-clinical-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-clinical-primary/30 outline-none" placeholder="$5,000 - $8,000" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Estimated Timeline</label>
                  <input className="w-full p-3 border border-clinical-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-clinical-primary/30 outline-none" placeholder="e.g. 6-8 weeks" value={timeline} onChange={(e) => setTimeline(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Cover Letter</label>
                  <textarea className="w-full p-3 border border-clinical-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-clinical-primary/30 outline-none min-h-[120px]" placeholder="Describe your approach, relevant experience, and why you're the best fit..." />
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
              <h4 className="text-lg font-bold mb-1">Budget</h4>
              <p className="text-3xl font-bold text-clinical-primary">$5,000 <span className="text-base text-clinical-on-surface-variant">- $8,000</span></p>
              <p className="text-xs text-clinical-on-surface-variant mt-1">Fixed price · Full payment on completion</p>
            </div>

            <div className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
              <h4 className="font-bold mb-3">Client</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-clinical-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-clinical-primary" /></div>
                <div>
                  <p className="font-bold text-sm">General Hospital Corp</p>
                  <div className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> 4.9 · 128 projects</div>
                </div>
              </div>
              <div className="text-xs text-clinical-on-surface-variant space-y-1">
                <p>Member since 2024</p>
                <p className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-clinical-tertiary" /> Verified Institution</p>
                <p className="flex items-center gap-1"><Shield className="w-3 h-3 text-clinical-tertiary" /> Payment Verified</p>
              </div>
            </div>

            <div className="bg-clinical-secondary/5 rounded-xl border border-clinical-secondary/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-clinical-secondary" />
                <span className="text-sm font-bold">AI Market Insight</span>
              </div>
              <p className="text-xs text-clinical-on-surface-variant mb-3">This project matches your NPHIES expertise. Your profile ranks in the top 3 for this category.</p>
              <div className="flex items-center gap-1 text-xs text-clinical-secondary font-semibold">
                <TrendingUp className="w-3 h-3" /> 85% match score
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-clinical-outline-variant/20 p-4 z-50">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <p className="text-sm text-clinical-on-surface-variant">Proposals close in <span className="font-bold">2 days</span></p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 border border-clinical-primary text-clinical-primary rounded-full text-sm font-semibold hover:bg-clinical-primary/5 transition-all stitch-active-scale flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Ask Question
            </button>
            <button className="px-6 py-2.5 bg-clinical-primary text-white rounded-full text-sm font-bold hover:opacity-90 transition-all stitch-active-scale flex items-center gap-2">
              <Send className="w-4 h-4" /> Submit Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

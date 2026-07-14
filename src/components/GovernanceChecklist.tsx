"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ClipboardList, Download, Share2, RotateCcw, TrendingUp } from "lucide-react";

interface ChecklistItem {
  id: string;
  domain: string;
  area: string;
  question: string;
  weight: number;
}

const CHECKLIST: ChecklistItem[] = [
  { id: "g1", domain: "Leadership", area: "Governance Structure", question: "Is there a board-approved information governance policy framework?", weight: 5 },
  { id: "g2", domain: "Leadership", area: "Governance Structure", question: "Has a Senior Information Risk Owner (SIRO) been appointed?", weight: 4 },
  { id: "g3", domain: "Leadership", area: "Accountability", question: "Are information asset owners assigned for all critical data assets?", weight: 4 },
  { id: "g4", domain: "Leadership", area: "Committees", question: "Does an information governance steering committee meet quarterly?", weight: 3 },
  { id: "d1", domain: "Data Protection", area: "PDPL Compliance", question: "Is there a documented PDPL compliance program with article-by-article mapping?", weight: 5 },
  { id: "d2", domain: "Data Protection", area: "PDPL Compliance", question: "Are Data Protection Impact Assessments (DPIAs) conducted for high-risk processing?", weight: 4 },
  { id: "d3", domain: "Data Protection", area: "Consent", question: "Is a bilingual (Arabic/English) consent management system in place?", weight: 4 },
  { id: "d4", domain: "Data Protection", area: "Data Subject Rights", question: "Are there operational procedures for handling data subject access requests?", weight: 4 },
  { id: "d5", domain: "Data Protection", area: "Breach Response", question: "Is a data breach response plan tested at least annually?", weight: 5 },
  { id: "d6", domain: "Data Protection", area: "Cross-Border Transfer", question: "Are cross-border data transfer mechanisms documented and lawful?", weight: 3 },
  { id: "r1", domain: "Records", area: "Retention", question: "Is a MOH-compliant records retention schedule in effect?", weight: 5 },
  { id: "r2", domain: "Records", area: "Classification", question: "Are documents classified according to a formal classification scheme?", weight: 3 },
  { id: "r3", domain: "Records", area: "Disposal", question: "Are secure disposal procedures documented and audited?", weight: 3 },
  { id: "a1", domain: "Access", area: "RBAC", question: "Is role-based access control (RBAC) implemented across all clinical systems?", weight: 5 },
  { id: "a2", domain: "Access", area: "Authentication", question: "Is multi-factor authentication enforced for privileged access?", weight: 4 },
  { id: "a3", domain: "Access", area: "Lifecycle", question: "Are user accounts provisioned and de-provisioned within 24 hours of HR events?", weight: 4 },
  { id: "a4", domain: "Access", area: "Audit", question: "Are access logs reviewed monthly for anomalous activity?", weight: 3 },
  { id: "rc1", domain: "Risk", area: "Risk Assessment", question: "Is an organisation-wide information risk assessment conducted annually?", weight: 5 },
  { id: "rc2", domain: "Risk", area: "Vendor Risk", question: "Is there a vendor risk management program covering all critical third parties?", weight: 4 },
  { id: "rc3", domain: "Risk", area: "BCM", question: "Is there a tested business continuity plan that includes IT disaster recovery?", weight: 5 },
  { id: "rc4", domain: "Risk", area: "Compliance", question: "Is regulatory compliance monitored through a formal compliance management system?", weight: 4 },
  { id: "cs1", domain: "Clinical Safety", area: "Clinical Risk", question: "Are clinical safety risk assessments conducted for all health IT deployments?", weight: 5 },
  { id: "cs2", domain: "Clinical Safety", area: "AI Governance", question: "Is there an AI governance framework for clinical decision support systems?", weight: 4 },
  { id: "cs3", domain: "Clinical Safety", area: "Telehealth", question: "Are telehealth services governed by a documented clinical safety policy?", weight: 3 },
  { id: "cs4", domain: "Clinical Safety", area: "Medical Devices", question: "Is data from connected medical devices governed by data quality standards?", weight: 3 },
];

const DOMAIN_COLORS: Record<string, string> = {
  Leadership: "#1a56db",
  "Data Protection": "#059669",
  Records: "#7c3aed",
  Access: "#dc2626",
  Risk: "#b8963e",
  "Clinical Safety": "#0d9488",
};

function scoreToLevel(score: number, max: number): { label: string; color: string; pct: number } {
  const pct = (score / max) * 100;
  if (pct >= 85) return { label: "Advanced", color: "#059669", pct };
  if (pct >= 65) return { label: "Established", color: "#3b82f6", pct };
  if (pct >= 40) return { label: "Developing", color: "#f59e0b", pct };
  if (pct >= 20) return { label: "Initial", color: "#ef4444", pct };
  return { label: "Not Started", color: "#9ca3af", pct };
}

export function GovernanceChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalWeight = CHECKLIST.reduce((a, i) => a + i.weight, 0);
  const scoredWeight = CHECKLIST.filter((i) => checked.has(i.id)).reduce((a, i) => a + i.weight, 0);
  const result = scoreToLevel(scoredWeight, totalWeight);

  const domainScores = [...new Set(CHECKLIST.map((i) => i.domain))].map((domain) => {
    const items = CHECKLIST.filter((i) => i.domain === domain);
    const domainTotal = items.reduce((a, i) => a + i.weight, 0);
    const domainScored = items.filter((i) => checked.has(i.id)).reduce((a, i) => a + i.weight, 0);
    return { domain, total: domainTotal, scored: domainScored, pct: Math.round((domainScored / domainTotal) * 100) };
  });

  const resetAll = () => { setChecked(new Set()); setShowResults(false); };

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-[#0a0c10] to-[#1a1d24]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-[#e9c46a]" />
            <div>
              <h3 className="text-[15px] font-700 text-white">Governance Maturity Self-Assessment</h3>
              <p className="text-[11px] text-white/40">Evaluate your organisation against 25 key governance controls</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {checked.size > 0 && (
              <button onClick={resetAll} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.08] text-[12px] text-white/60 hover:bg-white/[0.12] transition-colors">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results bar */}
      {showResults && (
        <div className="px-6 py-4 bg-[#f8f9fc] border-b border-[var(--border)] animate-fade-up">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[14px] font-700 text-gray-900">Your Governance Maturity</h4>
            <span className="text-[11px] text-gray-400">{scoredWeight}/{totalWeight} weighted score</span>
          </div>
          <div className="h-3 rounded-full bg-gray-100 overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${result.pct}%`, background: result.color }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-800" style={{ color: result.color }}>{result.label}</span>
              <span className="text-[12px] text-gray-400">({Math.round(result.pct)}% maturity)</span>
            </div>
            <div className="flex items-center gap-3 text-[12px] text-gray-500">
              <TrendingUp className="w-3.5 h-3.5" />
              {result.pct >= 65 ? "Strong governance posture" : "Improvement opportunities identified"}
            </div>
          </div>

          {/* Domain breakdown */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-[var(--border)]">
            {domainScores.map((d) => (
              <div key={d.domain} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: DOMAIN_COLORS[d.domain] || "#999" }} />
                  <span className="text-[9px] text-gray-500 uppercase tracking-wider">{d.domain}</span>
                </div>
                <span className="block text-[16px] font-800 text-gray-900">{d.pct}%</span>
                <div className="h-1 rounded-full bg-gray-100 mt-1">
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: DOMAIN_COLORS[d.domain] || "#999" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="divide-y divide-[var(--border)] max-h-[400px] overflow-y-auto">
        {CHECKLIST.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-start gap-3 px-6 py-3 text-left transition-colors hover:bg-[#f8f9fc] ${
                isChecked ? "bg-[#f0fdf4]" : ""
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isChecked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-600 px-1.5 py-0.5 rounded" style={{ background: `${DOMAIN_COLORS[item.domain]}12`, color: DOMAIN_COLORS[item.domain] }}>
                    {item.domain}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.area}</span>
                  <span className="text-[10px] text-gray-300 ml-auto">w:{item.weight}</span>
                </div>
                <p className={`text-[13px] leading-snug ${isChecked ? "text-gray-600" : "text-gray-900"}`}>
                  {item.question}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[var(--border)] bg-[#f8f9fc] flex items-center justify-between">
        <span className="text-[12px] text-gray-500">
          {checked.size}/{CHECKLIST.length} controls implemented
        </span>
        <button
          onClick={() => setShowResults(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1a56db] text-white text-[12px] font-600 rounded-xl hover:bg-[#1241a8] transition-colors disabled:opacity-50"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {showResults ? "Update Score" : "Calculate Maturity Score"}
        </button>
      </div>
    </div>
  );
}

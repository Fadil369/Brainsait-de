"use client";

import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Shield, CheckCircle2, AlertTriangle, FileText, Server,
  Globe, Lock, BookOpen,
} from "lucide-react";

const regs = [
  { name: "HIPAA", status: "compliant", score: 98 },
  { name: "GDPR", status: "compliant", score: 95 },
  { name: "SDAIA / NDMO", status: "compliant", score: 92 },
  { name: "ISO 27001", status: "in-progress", score: 68 },
];

const scans = [
  { name: "Vulnerability Scan", date: "2026-07-13", status: "passed", findings: 0 },
  { name: "Penetration Test", date: "2026-07-12", status: "passed", findings: 2 },
  { name: "Data Residency Audit", date: "2026-07-10", status: "passed", findings: 0 },
];

const logs = [
  { event: "Access permission modified", user: "admin@brainsait.de", time: "2h ago", severity: "info" },
  { event: "New FHIR endpoint approved", user: "compliance@brainsait.de", time: "5h ago", severity: "info" },
  { event: "Unusual API access pattern detected", user: "system", time: "1d ago", severity: "warning" },
  { event: "Encryption key rotated", user: "security@brainsait.de", time: "2d ago", severity: "info" },
];

export default function StitchComplianceCenter() {
  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">Compliance</h1>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-clinical-primary cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-clinical-primary-container/10 flex items-center justify-center border border-clinical-primary/20">
            <User className="w-4 h-4 text-clinical-primary" />
          </div>
        </div>
      </header>

      <div className="flex max-w-[1280px] mx-auto">
        <aside className="hidden md:flex flex-col w-60 border-r border-clinical-outline-variant/20 min-h-[calc(100vh-4rem)] p-4 space-y-1">
          {[
            { icon: Shield, label: "Compliance Score", active: true },
            { icon: BookOpen, label: "Regulations" },
            { icon: Server, label: "Data Residency" },
            { icon: Lock, label: "Security" },
            { icon: FileText, label: "Audit Log" },
          ].map((item) => (
            <button key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${item.active ? "bg-clinical-primary-container/10 text-clinical-primary" : "text-clinical-on-surface-variant hover:bg-clinical-surface-container-high"}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 px-4 md:px-8 py-6 space-y-8">
          <section className="flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm flex flex-col items-center w-full md:w-64">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5eeff" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#003d9b" strokeWidth="8" strokeDasharray={`${94 * 2.83} 283`} transform="rotate(-90, 50, 50)" strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-clinical-primary">94%</span>
              </div>
              <h3 className="text-lg font-bold">Compliance Score</h3>
              <p className="text-sm text-clinical-on-surface-variant">Overall rating</p>
              <div className="flex items-center gap-1 mt-2 text-clinical-tertiary text-sm">
                <CheckCircle2 className="w-4 h-4" /> All checks passing
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {regs.map((r) => (
                <div key={r.name} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">{r.name}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.status === "compliant" ? "bg-clinical-tertiary/10 text-clinical-tertiary" : "bg-yellow-100 text-yellow-700"}`}>{r.status}</span>
                  </div>
                  <div className="h-2 bg-clinical-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-clinical-tertiary rounded-full" style={{ width: `${r.score}%` }} />
                  </div>
                  <span className="text-xs text-clinical-on-surface-variant mt-1 block">{r.score}% compliant</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-clinical-primary" /> Security Scans</h3>
            <div className="space-y-3">
              {scans.map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 bg-clinical-surface-container-low rounded-lg">
                  <div>
                    <span className="text-sm font-semibold">{s.name}</span>
                    <p className="text-xs text-clinical-on-surface-variant">{s.date} · {s.findings} findings</p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${s.status === "passed" ? "text-clinical-tertiary" : "text-clinical-error"}`}>
                    <CheckCircle2 className="w-3 h-3" /> {s.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-clinical-outline-variant/30 overflow-hidden shadow-sm">
            <div className="p-6 pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-clinical-primary" /> Compliance Events</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-clinical-surface-container-low">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase">Event</th>
                  <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase hidden md:table-cell">User</th>
                  <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clinical-outline-variant/20">
                {logs.map((l) => (
                  <tr key={l.event} className="stitch-table-row">
                    <td className="px-6 py-3 flex items-center gap-2">
                      {l.severity === "warning" ? <AlertTriangle className="w-4 h-4 text-yellow-500" /> : <CheckCircle2 className="w-4 h-4 text-clinical-tertiary" />}
                      <span className="text-sm">{l.event}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-clinical-on-surface-variant hidden md:table-cell">{l.user}</td>
                    <td className="px-6 py-3 text-sm text-clinical-on-surface-variant">{l.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="bg-clinical-surface-container-low rounded-xl p-6 border border-clinical-tertiary/20 flex flex-col md:flex-row items-center gap-4">
            <Globe className="w-12 h-12 text-clinical-tertiary" />
            <div className="flex-1">
              <h4 className="font-bold">Data Residency — Saudi Arabia</h4>
              <p className="text-sm text-clinical-on-surface-variant">All health data is stored in KSA-based servers (Jeddah, Dammam) compliant with SDAIA/NDMO regulations.</p>
            </div>
            <button className="px-5 py-2.5 bg-clinical-tertiary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-all stitch-active-scale shrink-0">View Regions</button>
          </section>
        </main>
      </div>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 0 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "Home", "Market", "Copilot", "Compliance", "Profile" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

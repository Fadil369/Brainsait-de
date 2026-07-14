"use client";

import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  CheckCircle2, XCircle, AlertTriangle, Key, RefreshCw,
  Webhook, Plus, ArrowRight, ExternalLink,
} from "lucide-react";

const systems = [
  { name: "Epic Systems", status: "connected", desc: "EHR Integration · Last sync 2m ago", version: "Epic 2024" },
  { name: "Oracle Cerner", status: "disconnected", desc: "EHR Integration · Reconnect required", version: "Cerner Millennium" },
  { name: "Meditech Expanse", status: "connecting", desc: "EHR Integration · Setup in progress", version: "Meditech 6.2" },
];

const webhooks = [
  { event: "patient.created", endpoint: "https://api.ghc.sa/webhook/patients", status: "active" },
  { event: "claim.updated", endpoint: "https://api.ghc.sa/webhook/claims", status: "active" },
  { event: "agent.deployed", endpoint: "https://api.ghc.sa/webhook/agents", status: "inactive" },
];

export default function StitchIntegrationSettings() {
  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">Integrations</h1>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-clinical-primary cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-clinical-primary-container/10 flex items-center justify-center border border-clinical-primary/20">
            <User className="w-4 h-4 text-clinical-primary" />
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 space-y-8">
        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-clinical-tertiary" />
              <h3 className="text-lg font-bold">Sync Health</h3>
            </div>
            <span className="text-xs text-clinical-tertiary bg-clinical-tertiary/10 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All systems operational
            </span>
          </div>
          <div className="space-y-3">
            {systems.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-4 rounded-xl border border-clinical-outline-variant/20 hover:bg-clinical-surface-container-low transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    s.status === "connected" ? "bg-clinical-tertiary/10" :
                    s.status === "disconnected" ? "bg-clinical-error/10" :
                    "bg-yellow-100"
                  }`}>
                    {s.status === "connected" ? <CheckCircle2 className="w-5 h-5 text-clinical-tertiary" /> :
                     s.status === "disconnected" ? <XCircle className="w-5 h-5 text-clinical-error" /> :
                     <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{s.name}</p>
                    <p className="text-xs text-clinical-on-surface-variant">{s.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    s.status === "connected" ? "bg-clinical-tertiary/10 text-clinical-tertiary" :
                    s.status === "disconnected" ? "bg-clinical-error/10 text-clinical-error" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {s.status === "connected" ? "متصل" : s.status === "disconnected" ? "منفصل" : "جاري الاتصال"}
                  </span>
                  <p className="text-xs text-clinical-on-surface-variant mt-1">{s.version}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1 text-sm text-clinical-primary font-semibold hover:underline">
            <Plus className="w-4 h-4" /> Add New Integration
          </button>
        </section>

        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Webhook className="w-5 h-5 text-clinical-primary" /> Webhooks</h3>
          <div className="space-y-2">
            {webhooks.map((w) => (
              <div key={w.event} className="flex items-center justify-between p-3 hover:bg-clinical-surface-container-low rounded-lg transition-colors">
                <div>
                  <span className="text-sm font-semibold">{w.event}</span>
                  <p className="text-xs text-clinical-on-surface-variant font-mono">{w.endpoint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${w.status === "active" ? "bg-clinical-tertiary justify-end" : "bg-clinical-outline-variant justify-start"}`}>
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-clinical-on-surface-variant hover:text-clinical-primary cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-clinical-primary font-semibold flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Add Webhook Endpoint
          </button>
        </section>

        <section className="bg-clinical-secondary/5 rounded-xl border border-clinical-secondary/20 p-6">
          <div className="flex items-start gap-4">
            <Bot className="w-10 h-10 text-clinical-secondary shrink-0" />
            <div>
              <h4 className="font-bold mb-1">AI Optimization Tip</h4>
              <p className="text-sm text-clinical-on-surface-variant mb-3">Connect your Epic FHIR server to enable real-time clinical data access for your AI agents. This can reduce manual data entry by up to 60%.</p>
              <button className="px-5 py-2 bg-clinical-secondary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-all">Connect Epic FHIR</button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2"><Key className="w-5 h-5 text-clinical-primary" /> Developer API Access</h3>
            <span className="text-xs bg-clinical-primary/10 text-clinical-primary px-3 py-1 rounded-full font-semibold">Enterprise</span>
          </div>
          <p className="text-sm text-clinical-on-surface-variant mb-4">Use our REST API to build custom integrations. All endpoints are documented via OpenAPI.</p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-clinical-primary text-white rounded-full text-sm font-semibold hover:opacity-90 stitch-active-scale">View API Docs</button>
            <button className="px-5 py-2.5 border border-clinical-primary text-clinical-primary rounded-full text-sm font-semibold hover:bg-clinical-primary/5 stitch-active-scale flex items-center gap-2">
              <Key className="w-4 h-4" /> Generate API Key
            </button>
          </div>
        </section>
      </main>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 3 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "Home", "Market", "Copilot", "Settings", "Profile" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

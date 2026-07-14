"use client";

import { useState } from "react";
import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Key, Shield, Code, Settings, Copy, CheckCircle2, Eye, EyeOff,
  Sliders, Activity, AlertTriangle, DollarSign,
} from "lucide-react";

const apiKeys = [
  { label: "Production Key", key: "hx_prod_a8f3...2b1c", status: "active" },
  { label: "Sandbox Key", key: "hx_sand_7d2e...9f4a", status: "active" },
];

const quotas = [
  { label: "API Calls / Day", used: 12400, total: 25000 },
  { label: "Agents Deployed", used: 4, total: 10 },
  { label: "Data Storage", used: 2.4, total: 10, unit: "GB" },
];

const endpoints = [
  { name: "FHIR R4 Patient API", desc: "/fhir/r4/Patient", status: true },
  { name: "Marketplace Webhook", desc: "/webhook/marketplace/events", status: true },
  { name: "LINC Agent Orchestrator", desc: "/api/linc/orchestrate", status: false },
  { name: "NPHIES Claims Proxy", desc: "/api/nphies/eligibility", status: true },
];

const recentAlerts = [
  { severity: "high", message: "Rate limit approaching (85% of quota)", time: "2m ago" },
  { severity: "medium", message: "Sandbox key rotated automatically", time: "1h ago" },
  { severity: "low", message: "New FHIR R4 endpoint deployed", time: "3h ago" },
];

export default function StitchDeveloperConsole() {
  const [showKeys, setShowKeys] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">DevConsole</h1>
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
            { icon: Activity, label: "Dashboard", active: true },
            { icon: Bot, label: "My Agents" },
            { icon: Shield, label: "Compliance" },
            { icon: Code, label: "API Logs" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${item.active ? "bg-clinical-primary-container/10 text-clinical-primary" : "text-clinical-on-surface-variant hover:bg-clinical-surface-container-high"}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 px-4 md:px-8 py-6 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Revenue", value: "$42.5k", icon: DollarSign, color: "text-clinical-primary bg-clinical-primary/10" },
              { label: "Active Agents", value: "8", icon: Bot, color: "text-clinical-secondary bg-clinical-secondary/10" },
              { label: "API Uptime", value: "99.9%", icon: Activity, color: "text-clinical-tertiary bg-clinical-tertiary/10" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-clinical-on-surface-variant">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold text-clinical-on-surface">{kpi.value}</p>
              </div>
            ))}
          </section>

          <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Key className="w-5 h-5 text-clinical-primary" /> API Keys</h3>
              <button onClick={() => setShowKeys(!showKeys)} className="text-sm text-clinical-primary flex items-center gap-1 hover:underline">
                {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} {showKeys ? "Hide" : "Show"}
              </button>
            </div>
            <div className="space-y-3">
              {apiKeys.map((k) => (
                <div key={k.label} className="flex items-center justify-between p-3 bg-clinical-surface-container-low rounded-lg">
                  <div>
                    <span className="text-sm font-semibold">{k.label}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-white px-2 py-1 rounded border font-mono">{showKeys ? k.key : "••••••••••••••••"}</code>
                      <button onClick={() => navigator.clipboard?.writeText(k.key)}><Copy className="w-4 h-4 text-clinical-on-surface-variant hover:text-clinical-primary cursor-pointer" /></button>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-clinical-tertiary"><CheckCircle2 className="w-3 h-3" /> Active</span>
                </div>
              ))}
            </div>
            <button className="mt-4 text-sm text-clinical-primary font-semibold hover:underline">+ Generate New Key</button>
          </section>

          <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sliders className="w-5 h-5 text-clinical-primary" /> Usage Quotas</h3>
            <div className="space-y-4">
              {quotas.map((q) => (
                <div key={q.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-clinical-on-surface-variant">{q.label}</span>
                    <span className="font-semibold">{q.used}{q.unit || ""} / {q.total}{q.unit || ""}</span>
                  </div>
                  <div className="h-2 bg-clinical-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-clinical-primary rounded-full transition-all" style={{ width: `${(q.used / q.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-clinical-primary" /> Endpoints & Webhooks</h3>
            <div className="space-y-2">
              {endpoints.map((ep) => (
                <div key={ep.name} className="flex items-center justify-between p-3 hover:bg-clinical-surface-container-low rounded-lg transition-colors">
                  <div>
                    <span className="text-sm font-semibold">{ep.name}</span>
                    <p className="text-xs text-clinical-on-surface-variant font-mono">{ep.desc}</p>
                  </div>
                  <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${ep.status ? "bg-clinical-tertiary justify-end" : "bg-clinical-outline-variant justify-start"}`}>
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-4">Recent Alerts</h3>
            <div className="space-y-2">
              {recentAlerts.map((a) => (
                <div key={a.message} className={`p-4 rounded-xl border-l-4 flex justify-between items-center ${a.severity === "high" ? "border-l-clinical-error bg-clinical-error-container/10" : a.severity === "medium" ? "border-l-yellow-500 bg-yellow-50" : "border-l-clinical-outline bg-clinical-surface-container-low"}`}>
                  <div className="flex items-center gap-3">
                    {a.severity === "high" && <AlertTriangle className="w-5 h-5 text-clinical-error" />}
                    <span className="text-sm">{a.message}</span>
                  </div>
                  <span className="text-xs text-clinical-on-surface-variant">{a.time}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 0 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "Home", "Market", "Copilot", "Dev", "Profile" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

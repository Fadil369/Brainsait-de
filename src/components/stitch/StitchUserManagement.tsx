"use client";

import { useState } from "react";
import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Shield, Search, CheckCircle2, XCircle, Key, Lock,
  Users, Activity, AlertTriangle, Plus,
  MoreHorizontal, Building2,
} from "lucide-react";

const roles = [
  { name: "Institutional Administrator", users: 12, permissions: 24, color: "bg-clinical-primary" },
  { name: "Clinical Practitioner", users: 48, permissions: 16, color: "bg-clinical-secondary" },
  { name: "Data Auditor", users: 6, permissions: 8, color: "bg-clinical-tertiary" },
];

const securitySettings = [
  { label: "Two-Factor Authentication (2FA)", enabled: true },
  { label: "Biometric Authentication", enabled: true },
  { label: "mTLS for API Access", enabled: false },
  { label: "Session Timeout (15 min)", enabled: true },
  { label: "IP Whitelisting", enabled: false },
];

const accessLog = [
  { user: "admin@ghc.sa", action: "Modified role permissions", ip: "46.62.128.198", time: "2m ago", status: "granted" },
  { user: "dr.ahmed@ghc.sa", action: "Accessed Patient Records (FHIR)", ip: "46.62.128.198", time: "15m ago", status: "granted" },
  { user: "auditor@ghc.sa", action: "Exported compliance report", ip: "10.0.1.45", time: "1h ago", status: "granted" },
  { user: "unknown@blocked.com", action: "Failed login attempt", ip: "185.220.101.42", time: "3h ago", status: "denied" },
];

export default function StitchUserManagement() {
  const [search, setSearch] = useState("");

  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">User Management</h1>
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
            { icon: Users, label: "Users", active: true },
            { icon: Shield, label: "Roles & Permissions" },
            { icon: Lock, label: "Security" },
            { icon: Activity, label: "Access Logs" },
            { icon: Building2, label: "Institutions" },
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
              { label: "Managed Users", value: "1,284", icon: Users, color: "text-clinical-primary bg-clinical-primary/10" },
              { label: "Active Sessions", value: "342", icon: Activity, color: "text-clinical-tertiary bg-clinical-tertiary/10" },
              { label: "Pending Invites", value: "18", icon: Plus, color: "text-clinical-secondary bg-clinical-secondary/10" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}><kpi.icon className="w-5 h-5" /></div>
                  <span className="text-sm text-clinical-on-surface-variant">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            ))}
          </section>

          <section>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clinical-outline" />
                <input className="w-full pl-10 pr-4 py-2.5 bg-white border border-clinical-outline-variant rounded-full text-sm focus:ring-2 focus:ring-clinical-secondary/30 outline-none" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-clinical-primary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-all stitch-active-scale">
                <Plus className="w-4 h-4" /> Invite User
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((r) => (
                <div key={r.name} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${r.color}`} />
                    <h4 className="font-bold text-sm">{r.name}</h4>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-clinical-on-surface-variant">{r.users} users</span>
                    <span className="font-semibold">{r.permissions} permissions</span>
                  </div>
                  <div className="mt-3 flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-clinical-primary-container/20 border-2 border-white flex items-center justify-center text-[10px] font-bold">{["AD", "SA", "AK", "MA"][i - 1]}</div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-clinical-surface-container-high border-2 border-white flex items-center justify-center text-[10px] font-bold text-clinical-on-surface-variant">+{r.users - 4}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-clinical-primary" /> Security Protocols</h3>
              {securitySettings.some(s => !s.enabled) && (
                <span className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full font-semibold">
                  <AlertTriangle className="w-3 h-3" /> 2 protocols inactive
                </span>
              )}
            </div>
            <div className="space-y-2">
              {securitySettings.map((s) => (
                <div key={s.label} className="flex items-center justify-between p-3 hover:bg-clinical-surface-container-low rounded-lg transition-colors">
                  <span className="text-sm">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors cursor-pointer ${s.enabled ? "bg-clinical-tertiary justify-end" : "bg-clinical-outline-variant justify-start"}`}>
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-clinical-outline-variant/30 overflow-hidden shadow-sm">
            <div className="p-6 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-clinical-primary" /> Active Access Log</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-clinical-surface-container-low">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase">User</th>
                  <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase hidden md:table-cell">Action</th>
                  <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase hidden lg:table-cell">IP</th>
                  <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clinical-outline-variant/20">
                {accessLog.map((log) => (
                  <tr key={`${log.user}-${log.time}`} className="stitch-table-row">
                    <td className="px-6 py-4 text-sm font-semibold">{log.user}</td>
                    <td className="px-6 py-4 text-sm text-clinical-on-surface-variant hidden md:table-cell">{log.action}</td>
                    <td className="px-6 py-4 text-xs text-clinical-on-surface-variant font-mono hidden lg:table-cell">{log.ip}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 text-xs font-semibold ${log.status === "granted" ? "text-clinical-tertiary" : "text-clinical-error"}`}>
                        {log.status === "granted" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 4 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "Home", "Market", "Copilot", "Admin", "Profile" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

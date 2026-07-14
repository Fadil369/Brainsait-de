"use client";

import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  DollarSign, TrendingUp, TrendingDown, ArrowUpRight,
  CheckCircle2, Clock, Filter,
} from "lucide-react";

const agentRevenue = [
  { name: "MediCodex AI", share: 67, revenue: "$28,475", trend: "up" },
  { name: "ScribePro Agent", share: 24, revenue: "$10,200", trend: "up" },
  { name: "PulseCheck Analytics", share: 9, revenue: "$3,825", trend: "down" },
];

const transactions = [
  { id: "#INV-2026-0712", client: "King Faisal Hospital", amount: "$4,200", status: "completed", date: "Jul 12" },
  { id: "#INV-2026-0711", client: "Ministry of Health", amount: "$12,000", status: "completed", date: "Jul 11" },
  { id: "#INV-2026-0710", client: "Dental Clinic Group", amount: "$2,800", status: "pending", date: "Jul 10" },
  { id: "#INV-2026-0709", client: "BioTech Integrations", amount: "$8,500", status: "processing", date: "Jul 9" },
];

export default function StitchRevenueAnalytics() {
  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">Revenue</h1>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-clinical-primary cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-clinical-primary-container/10 flex items-center justify-center border border-clinical-primary/20">
            <User className="w-4 h-4 text-clinical-primary" />
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Revenue", value: "$42,500", icon: DollarSign, change: "+14.2%", color: "text-clinical-primary bg-clinical-primary/10", trend: "up" },
            { label: "Available for Payout", value: "$12,800", icon: TrendingUp, change: "", color: "text-clinical-tertiary bg-clinical-tertiary/10", trend: "up" },
            { label: "Next Payout", value: "Mar 15", icon: Clock, change: "In 3 days", color: "text-clinical-secondary bg-clinical-secondary/10", trend: "" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}><kpi.icon className="w-5 h-5" /></div>
                {kpi.change && (
                  <span className={`flex items-center gap-1 text-xs font-semibold ${kpi.trend === "up" ? "text-clinical-tertiary" : "text-clinical-error"}`}>
                    {kpi.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                )}
              </div>
              <p className="text-sm text-clinical-on-surface-variant">{kpi.label}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Revenue Trend</h3>
            <div className="flex items-center gap-2 text-sm text-clinical-on-surface-variant">
              <Filter className="w-4 h-4" /> Last 30 days
            </div>
          </div>
          <div className="h-48 bg-gradient-to-b from-clinical-primary/5 to-transparent rounded-xl border border-clinical-outline-variant/20 flex items-center justify-center">
            <div className="flex items-end gap-2 h-32 w-full px-4">
              {[40, 55, 45, 70, 60, 80, 75, 90, 85, 100, 95, 110, 105, 120].map((h, i) => (
                <div key={i} className="flex-1 bg-clinical-primary/30 rounded-t-md hover:bg-clinical-primary/60 transition-all" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Revenue by Agent</h3>
          <div className="space-y-4">
            {agentRevenue.map((a) => (
              <div key={a.name}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{a.name}</span>
                    <span className={`text-xs ${a.trend === "up" ? "text-clinical-tertiary" : "text-clinical-error"}`}>
                      {a.trend === "up" ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold">{a.revenue}</span>
                    <span className="text-xs text-clinical-on-surface-variant ml-2">{a.share}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-clinical-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${a.share > 50 ? "bg-clinical-primary" : a.share > 20 ? "bg-clinical-secondary" : "bg-clinical-tertiary"}`} style={{ width: `${a.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 overflow-hidden shadow-sm">
          <div className="p-6 pb-3">
            <h3 className="text-lg font-bold">Recent Transactions</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-clinical-surface-container-low">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase">Invoice</th>
                <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase hidden md:table-cell">Client</th>
                <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clinical-outline-variant/20">
              {transactions.map((t) => (
                <tr key={t.id} className="stitch-table-row">
                  <td className="px-6 py-4 text-sm font-semibold">{t.id}</td>
                  <td className="px-6 py-4 text-sm text-clinical-on-surface-variant hidden md:table-cell">{t.client}</td>
                  <td className="px-6 py-4 text-sm font-bold">{t.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 w-fit ${
                      t.status === "completed" ? "bg-clinical-tertiary/10 text-clinical-tertiary" :
                      t.status === "processing" ? "bg-clinical-primary/10 text-clinical-primary" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {t.status === "completed" && <CheckCircle2 className="w-3 h-3" />}
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 0 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "Home", "Market", "Copilot", "Finance", "Profile" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

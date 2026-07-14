import Link from "next/link";
import { CheckCircle2, XCircle, Clock, DollarSign, Users, TrendingUp, ArrowRight, Loader2 } from "lucide-react";

const MOCK_METRICS = [
  { label: "Pending Orders", value: "3", icon: Clock, color: "#f59e0b", href: "/admin/orders?filter=pending" },
  { label: "Verified Today", value: "2", icon: CheckCircle2, color: "#10b981", href: "/admin/orders?filter=verified" },
  { label: "Rejected", value: "1", icon: XCircle, color: "#ef4444", href: "/admin/orders?filter=rejected" },
  { label: "SADAD Revenue", value: "SAR 258K", icon: DollarSign, color: "#e9c46a", href: "/admin/orders" },
];

const RECENT_ACTIVITY = [
  { id: "ord_006", action: "Payment submitted", customer: "Riyadh Care Hospital", amount: 62000, time: "2 hours ago", type: "pending" },
  { id: "ord_004", action: "Payment submitted", customer: "Noura Al-Qahtani", amount: 96000, time: "5 hours ago", type: "pending" },
  { id: "ord_003", action: "Payment verified", customer: "Dr. Abdullah Al-Rashidi", amount: 18000, time: "Yesterday", type: "verified" },
  { id: "ord_005", action: "Order rejected", customer: "Khalid Al-Dossary", amount: 25000, time: "2 days ago", type: "rejected" },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-800 text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">BrainSAIT Health Exchange — Operations Center</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {MOCK_METRICS.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.label}
                href={m.href}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: m.color }} />
                  </div>
                  <span className="text-[12px] font-600 text-gray-500 uppercase tracking-wide">{m.label}</span>
                </div>
                <p className="text-[28px] font-800 text-gray-900 leading-none">{m.value}</p>
              </Link>
            );
          })}
        </div>

        {/* Quick links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/orders" className="bg-[#0a0c10] rounded-2xl p-6 hover:opacity-90 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-700 text-white">Order Verification</h3>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed">Review and verify SADAD payments. Approve or reject pending orders.</p>
          </Link>
          <Link href="/marketplace/needs" className="bg-[#0a0c10] rounded-2xl p-6 hover:opacity-90 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-700 text-white">Marketplace</h3>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed">Browse all marketplace listings across needs, offers, projects, and more.</p>
          </Link>
          <Link href="/" className="bg-[#0a0c10] rounded-2xl p-6 hover:opacity-90 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-700 text-white">Public Site</h3>
              <ArrowRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed">Return to the public BrainSAIT Health Exchange homepage.</p>
          </Link>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-[15px] font-700 text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.type === "pending" ? "bg-amber-400" : item.type === "verified" ? "bg-emerald-400" : "bg-red-400"}`} />
                  <div>
                    <p className="text-[13px] font-600 text-gray-900">{item.action}</p>
                    <p className="text-[12px] text-gray-400">{item.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-700 text-gray-900">SAR {item.amount.toLocaleString()}</p>
                  <p className="text-[11px] text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform health */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-[14px] font-700 text-gray-900 mb-4">Platform Health</h3>
            <div className="space-y-3">
              {[
                { label: "Gateway (LINC)", status: "Operational", ok: true },
                { label: "Marketplace API", status: "Operational", ok: true },
                { label: "IRIS Database", status: "Degraded", ok: false },
                { label: "PostgreSQL", status: "Degraded", ok: false },
                { label: "Redis Cache", status: "Operational", ok: true },
                { label: "Mail Service", status: "Mock Mode", ok: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-600">{s.label}</span>
                  <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${s.ok ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-[14px] font-700 text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Active Marketplace Listings", value: "29" },
                { label: "Collections Indexed", value: "11" },
                { label: "Product Catalog Entries", value: "57+" },
                { label: "Integration Services", value: "9" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-600">{s.label}</span>
                  <span className="text-[14px] font-700 text-gray-900">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

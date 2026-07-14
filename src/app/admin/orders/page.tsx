"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, Clock, Loader2, Eye, RefreshCw, ArrowRight } from "lucide-react";

type OrderStatus = "pending" | "verified" | "rejected";

interface Order {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  amount: number;
  sadadReference?: string;
  status: OrderStatus;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

// Mock data — in production this comes from the gateway database
const MOCK_ORDERS: Order[] = [
  { id: "ord_001", invoiceNumber: "INV-2026-412830", customerName: "King Fahad Medical City", customerEmail: "procurement@kfmc.med.sa", productName: "ClaimLinc Annual License", amount: 45000, sadadReference: "8847291035", status: "pending", createdAt: "2026-07-10T09:15:00Z" },
  { id: "ord_002", invoiceNumber: "INV-2026-388201", customerName: "Seha Digital Health", customerEmail: "ops@sehadigital.sa", productName: "NPHIES Gateway Integration", amount: 85000, sadadReference: "7729182034", status: "pending", createdAt: "2026-07-09T14:32:00Z" },
  { id: "ord_003", invoiceNumber: "INV-2026-371900", customerName: "Dr. Abdullah Al-Rashidi", customerEmail: "abdullah@clinic.sa", productName: "PDPL Compliance Toolkit", amount: 18000, sadadReference: "6610045829", status: "verified", createdAt: "2026-07-08T11:00:00Z", verifiedAt: "2026-07-08T16:45:00Z", verifiedBy: "ops@brainsait.de" },
  { id: "ord_004", invoiceNumber: "INV-2026-358112", customerName: "Noura Al-Qahtani", customerEmail: "noura@healthtech.sa", productName: "AI Copilot Enterprise Subscription", amount: 96000, status: "pending", createdAt: "2026-07-07T08:00:00Z" },
  { id: "ord_005", invoiceNumber: "INV-2026-341887", customerName: "Khalid Al-Dossary", customerEmail: "khalid@hospital.sa", productName: "Healthcare Document Templates Suite", amount: 25000, sadadReference: "5503384710", status: "rejected", createdAt: "2026-07-06T13:20:00Z", verifiedAt: "2026-07-07T09:00:00Z", verifiedBy: "ops@brainsait.de" },
  { id: "ord_006", invoiceNumber: "INV-2026-330112", customerName: "Riyadh Care Hospital", customerEmail: "finance@riyadhcare.sa", productName: "FHIR Gateway (Annual)", amount: 62000, sadadReference: "4402291837", status: "pending", createdAt: "2026-07-11T07:45:00Z" },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending:  { label: "Pending Verification", color: "text-amber-600",    bg: "bg-amber-50",    icon: Clock },
  verified: { label: "Verified",             color: "text-emerald-600", bg: "bg-emerald-50",  icon: CheckCircle2 },
  rejected: { label: "Rejected",             color: "text-red-600",     bg: "bg-red-50",      icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.invoiceNumber.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.sadadReference?.includes(q))
      );
    }
    return true;
  });

  async function verifyOrder(orderId: string, action: "verify" | "reject") {
    setActionLoading(orderId);
    const order = orders.find((o) => o.id === orderId);
    try {
      if (action === "verify") {
        const res = await fetch("/api/sadad/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceId: orderId,
            sadadReference: order?.sadadReference,
            amount: order?.amount,
            customerEmail: order?.customerEmail,
            customerName: order?.customerName,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: "verified", verifiedAt: new Date().toISOString(), verifiedBy: "ops@brainsait.de" }
              : o
          )
        );
      } else {
        const res = await fetch("/api/sadad/reject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceId: orderId, reason: "Rejected by administrator" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Rejection failed");
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: "rejected", verifiedAt: new Date().toISOString(), verifiedBy: "ops@brainsait.de" }
              : o
          )
        );
      }
      setSelected(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    }
    setActionLoading(null);
  }

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    verified: orders.filter((o) => o.status === "verified").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-800 text-gray-900">Order Verification</h1>
              <p className="text-sm text-gray-500 mt-1">SADAD payment verification and order management</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Admin</a>
              <button onClick={() => {}} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-500 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(["all", "pending", "verified", "rejected"] as const).map((f) => {
            const cfg = f === "all" ? { label: "All Orders", color: "text-gray-700", bg: "bg-gray-100", icon: Eye } : STATUS_CONFIG[f];
            const Icon = cfg.icon;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-left p-4 rounded-2xl border transition-all ${filter === f ? "border-[#1a56db] shadow-md" : "border-gray-100 hover:border-gray-200"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                  <span className="text-[11px] font-600 text-gray-400 uppercase tracking-wide">{cfg.label}</span>
                </div>
                <p className={`text-[28px] font-800 ${cfg.color} leading-none`}>{counts[f]}</p>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, invoice, product, or SADAD reference..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all"
          />
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3.5 text-[11px] font-700 text-gray-400 uppercase tracking-wider">Invoice / Customer</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-700 text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-700 text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="text-center px-5 py-3.5 text-[11px] font-700 text-gray-400 uppercase tracking-wider">SADAD Ref</th>
                <th className="text-center px-5 py-3.5 text-[11px] font-700 text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-center px-5 py-3.5 text-[11px] font-700 text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status];
                const Icon = cfg.icon;
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-[13px] font-600 text-gray-900">{order.customerName}</p>
                        <p className="text-[11.5px] text-gray-400">{order.invoiceNumber}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] text-gray-700">{order.productName}</p>
                      <p className="text-[11px] text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[14px] font-700 text-gray-900">SAR {order.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {order.sadadReference ? (
                        <span className="font-mono text-[12px] text-gray-600 bg-gray-100 px-2 py-1 rounded">{order.sadadReference}</span>
                      ) : (
                        <span className="text-[11px] text-amber-500 italic">No reference yet</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-600 px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-[12px] text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-GB")}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelected(order)}
                        className="inline-flex items-center gap-1 text-[12px] font-600 text-[#1a56db] hover:underline"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-400">
                    No orders match your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-[16px] font-700 text-gray-900">Order Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                <XCircle className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] text-gray-400 font-500 uppercase tracking-wider mb-1">Invoice</p>
                  <p className="text-[14px] font-600 text-gray-900">{selected.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 font-500 uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-[16px] font-800 text-gray-900">SAR {selected.amount.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-500 uppercase tracking-wider mb-1">Customer</p>
                <p className="text-[14px] font-600 text-gray-900">{selected.customerName}</p>
                <p className="text-[12px] text-gray-400">{selected.customerEmail}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-500 uppercase tracking-wider mb-1">Product</p>
                <p className="text-[14px] text-gray-700">{selected.productName}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-500 uppercase tracking-wider mb-1">SADAD Reference</p>
                {selected.sadadReference ? (
                  <p className="font-mono text-[14px] text-gray-900 bg-gray-100 px-3 py-2 rounded-xl inline-block">{selected.sadadReference}</p>
                ) : (
                  <p className="text-[13px] text-amber-500 italic">Customer has not submitted a SADAD reference yet</p>
                )}
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-500 uppercase tracking-wider mb-1">Submitted</p>
                <p className="text-[13px] text-gray-600">{new Date(selected.createdAt).toLocaleString("en-GB")}</p>
              </div>
              {selected.verifiedAt && (
                <div>
                  <p className="text-[11px] text-gray-400 font-500 uppercase tracking-wider mb-1">Verified / Rejected</p>
                  <p className="text-[13px] text-gray-600">{new Date(selected.verifiedAt).toLocaleString("en-GB")} by {selected.verifiedBy}</p>
                </div>
              )}
            </div>

            {selected.status === "pending" && (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => verifyOrder(selected.id, "verify")}
                  disabled={!!actionLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[14px] font-semibold transition-colors disabled:opacity-60"
                >
                  {actionLoading === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Verify Payment
                </button>
                <button
                  onClick={() => verifyOrder(selected.id, "reject")}
                  disabled={!!actionLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[14px] font-semibold transition-colors border border-red-200 disabled:opacity-60"
                >
                  {actionLoading === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Reject
                </button>
              </div>
            )}
            {selected.status !== "pending" && (
              <div className="px-6 pb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-600 ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].color}`}>
                  {selected.status === "verified" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  Payment {selected.status === "verified" ? "verified" : "rejected"} on {new Date(selected.verifiedAt!).toLocaleDateString("en-GB")}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

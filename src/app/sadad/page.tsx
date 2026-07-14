"use client";

import { useState } from "react";
import { CreditCard, BookOpen, FileText, GraduationCap, Users, Star, Search, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { ALL_PRODUCTS, PRODUCTS_BY_CATEGORY, formatSAR, ProductCategory, SADAD_INFO } from "@/lib/sadad-pricing";
import { SadadPaymentModal } from "@/components/SadadPayment";

const CATEGORY_META: Record<ProductCategory, { label: string; icon: any; desc: string }> = {
  course:         { label: "Courses",            icon: GraduationCap, desc: "Professional certification & CME" },
  template:       { label: "Templates",          icon: FileText,      desc: "Ready-to-use workflow templates" },
  book:           { label: "Books & Guides",     icon: BookOpen,      desc: "Healthcare reference & handbooks" },
  document:       { label: "Documents",          icon: FileText,      desc: "Technical specs & compliance docs" },
  consultation:   { label: "Consultations",      icon: Users,         desc: "1-on-1 expert sessions" },
  subscription:   { label: "Subscriptions",      icon: CreditCard,    desc: "API access & monthly services" },
  framework:      { label: "Governance Frameworks", icon: Shield,     desc: "Information governance & compliance" },
  tool:           { label: "Tools",              icon: Star,          desc: "Digital healthcare tools" },
  certification:  { label: "Certifications",     icon: Shield,        desc: "Professional credentials" },
};

export default function SadadPage() {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [paymentProduct, setPaymentProduct] = useState<{ id?: string; name: string; priceSAR: number } | null>(null);

  const filtered = category === "all"
    ? ALL_PRODUCTS
    : PRODUCTS_BY_CATEGORY[category] || [];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Hero */}
      <div className="relative overflow-hidden grad-hero noise">
        <div className="absolute top-[-20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#0d9488]/[0.10] blur-[100px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center mx-auto mb-5">
            <CreditCard className="w-8 h-8 text-emerald-400" />
          </div>
          <span className="badge badge-dark mb-4">Secure · SADAD Powered</span>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-800 text-white leading-tight mb-3">
            BrainSAIT Product Store
          </h1>
          <p className="text-[17px] text-white/60 max-w-2xl mx-auto leading-relaxed">
            Premium healthcare courses, templates, books, documents, and services — pay securely via SADAD (stc pay).
            <br />All prices in <strong className="text-white/80">Saudi Riyal (SAR)</strong>.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { key: "all" as const, label: "All Products" },
            ...Object.entries(CATEGORY_META).map(([k, v]) => ({ key: k as ProductCategory, label: v.label })),
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-[13px] font-600 transition-all ${
                category === cat.key
                  ? "bg-[#1a56db] text-white shadow-[var(--shadow-brand)]"
                  : "bg-white border border-[var(--border)] text-gray-600 hover:border-[#1a56db]/30 hover:text-[#1a56db]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => {
            const meta = CATEGORY_META[product.category];
            return (
              <div key={product.id} className="card-premium p-6 flex flex-col group hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f8f9fc] border border-[var(--border)] flex items-center justify-center">
                    <meta.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  {product.badge && (
                    <span className="badge badge-gold text-[10px]">{product.badge}</span>
                  )}
                </div>

                <h3 className="text-[15px] font-700 text-gray-900 mb-1.5 group-hover:text-[#1a56db] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-4 flex-1">
                  {product.description}
                </p>

                {/* Features */}
                <div className="space-y-1.5 mb-5">
                  {product.features.slice(0, 4).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[12px] text-gray-500">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                  {product.features.length > 4 && (
                    <p className="text-[11px] text-gray-400 pl-5">+{product.features.length - 4} more</p>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-[24px] font-800 text-gray-900">{formatSAR(product.priceSAR)}</span>
                    {product.originalPriceSAR && (
                      <span className="text-[14px] text-gray-400 line-through mb-1">{formatSAR(product.originalPriceSAR)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => setPaymentProduct(product)}
                    className="btn btn-primary w-full justify-center"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay with SADAD
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">No products in this category yet.</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentProduct && (
        <SadadPaymentModal
          amount={paymentProduct.priceSAR}
          productName={paymentProduct.name}
          productId={paymentProduct.id}
          onClose={() => setPaymentProduct(null)}
        />
      )}
    </div>
  );
}

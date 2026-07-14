"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, Loader2 } from "lucide-react";

interface FormField {
  label: string;
  key: string;
  type: "text" | "textarea" | "select" | "email" | "url";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface NewPageProps {
  title: string;
  description: string;
  fields: FormField[];
  submitLabel: string;
  backHref: string;
  collection: "needs" | "offers" | "projects" | "challenges" | "experts" | "ai" | "jobs" | "education" | "equipment" | "data" | "apis";
  badge?: string;
  badgeColor?: string;
}

export default function NewMarketplaceForm({
  title, description, fields, submitLabel, backHref, collection, badge, badgeColor = "#1a56db"
}: NewPageProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/marketplace/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection,
          data: {
            title: values.title,
            description: values.description,
            category: values.category,
            ...values,
          },
          sendInvoice: true,
          customerEmail: values.email,
          customerName: values.org || values.name || "Anonymous",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(err.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0c10]">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to marketplace
        </Link>

        <div className="mb-8">
          {badge && (
            <span className="text-[10px] font-700 uppercase tracking-[0.12em] px-2.5 py-1 rounded-full text-white mb-3 inline-block" style={{ background: badgeColor }}>
              {badge}
            </span>
          )}
          <h1 className="text-[2.5rem] font-800 text-white leading-[1.05] mb-3">{title}</h1>
          <p className="text-[15px] text-white/50 leading-relaxed">{description}</p>
        </div>

        {submitted ? (
          <div className="text-center py-16 bg-white/[0.03] border border-white/[0.08] rounded-3xl">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-5" />
            <h2 className="text-[22px] font-700 text-white mb-3">Successfully submitted!</h2>
            <p className="text-[14px] text-white/40 mb-8 max-w-sm mx-auto">Your submission is being reviewed. You&apos;ll receive a confirmation and updates via email.</p>
            <Link href={backHref} className="inline-flex items-center gap-2 px-5 py-2.5 gradient-health text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
              Back to Marketplace <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-[12px] font-600 text-white/60 mb-1.5 uppercase tracking-[0.08em]">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    required={field.required}
                    value={values[field.key] || ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.10] rounded-xl text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[#1a56db]/50 focus:bg-white/[0.08] transition-all resize-none"
                  />
                ) : field.type === "select" ? (
                  <select
                    required={field.required}
                    value={values[field.key] || ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.10] rounded-xl text-[14px] text-white focus:outline-none focus:border-[#1a56db]/50 transition-all"
                  >
                    <option value="" className="bg-[#0a0c10]">Select {field.label.toLowerCase()}...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0a0c10]">{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    required={field.required}
                    type={field.type}
                    value={values[field.key] || ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-white/[0.06] border border-white/[0.10] rounded-xl text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[#1a56db]/50 focus:bg-white/[0.08] transition-all"
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[13px]">
                {error}
              </div>
            )}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 gradient-health text-white rounded-xl text-[14px] font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-60"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Send className="w-4 h-4" /> {submitLabel}</>}
              </button>
              <p className="text-[11px] text-white/20 text-center mt-3">Your submission will be reviewed within 24 hours before being published.</p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

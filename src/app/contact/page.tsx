"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, Clock, CheckCircle2, Loader2 } from "lucide-react";

const CONTACTS = [
  { icon: Mail, label: "Email", value: "hello@brainsait.de", href: "mailto:hello@brainsait.de" },
  { icon: Phone, label: "Phone", value: "+966 11 234 5678", href: "tel:+966112345678" },
  { icon: MapPin, label: "Address", value: "Riyadh, Kingdom of Saudi Arabia", href: "#" },
  { icon: Clock, label: "Response Time", value: "Within 24 hours", href: null },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-[#0a0c10] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-4">
            Get in touch
          </h1>
          <p className="text-[17px] text-white/50">
            Questions, partnerships, or just want to say hello? We respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-[20px] font-700 text-gray-900 mb-6">Contact information</h2>
              <div className="space-y-5">
                {CONTACTS.map((c) => (
                  <a key={c.label} href={c.href || "#"} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[#1a56db]/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a56db]/[0.15] transition-colors">
                      <c.icon className="w-5 h-5 text-[#1a56db]" />
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-400 font-500 mb-0.5">{c.label}</p>
                      <p className="text-[14px] font-600 text-gray-900">{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-[20px] font-700 text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-[14px] text-gray-500">We&apos;ll get back to you within 24 hours. Thank you for reaching out.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-600 text-gray-700 mb-1.5">Full name *</label>
                      <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all" placeholder="Dr. Ahmed Al-Rashidi" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-600 text-gray-700 mb-1.5">Work email *</label>
                      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all" placeholder="ahmed@hospital.sa" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-600 text-gray-700 mb-1.5">Company / Organisation</label>
                      <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all" placeholder="King Fahad Medical City" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-600 text-gray-700 mb-1.5">Subject *</label>
                      <input required type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all" placeholder="Partnership inquiry" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-600 text-gray-700 mb-1.5">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all resize-none" placeholder="Tell us how we can help..." />
                  </div>
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600">
                      {error}
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-60">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

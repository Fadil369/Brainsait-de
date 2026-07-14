"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const POSTS = [
  { title: "How NPHIES is Transforming Healthcare Billing in Saudi Arabia", excerpt: "A deep dive into the National Health Insurance Platform and how to prepare your systems for compliance.", category: "NPHIES", date: "July 8, 2026", readTime: "8 min read", color: "#1a56db" },
  { title: "The Business Case for AI-Powered Revenue Cycle Management", excerpt: "Hospitals using AI for claims processing see 40% fewer denials and 25% faster reimbursement.", category: "AI & RCM", date: "June 24, 2026", readTime: "6 min read", color: "#0d9488" },
  { title: "PDPL Compliance for Healthcare: A Practical Guide", excerpt: "Saudi Arabia's Personal Data Protection Law is now in effect. What healthcare organisations need to do.", category: "Compliance", date: "June 10, 2026", readTime: "10 min read", color: "#b8963e" },
  { title: "Building a Health-Tech Startup in Saudi Arabia: 2026 Update", excerpt: "The regulatory landscape, funding opportunities, and how the BrainSAIT Incubator can accelerate your journey.", category: "Startups", date: "May 28, 2026", readTime: "7 min read", color: "#059669" },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-[#0a0c10] py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-800 text-white leading-[1.05] mb-4">Insights & Research</h1>
          <p className="text-[17px] text-white/50">Analysis on healthcare AI, Saudi regulation, and health technology business.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {POSTS.map((post) => (
              <article key={post.title} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <div className="h-1.5" style={{ background: post.color }} />
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-700 uppercase tracking-[0.10em] px-2 py-0.5 rounded-full text-white" style={{ background: post.color }}>{post.category}</span>
                    <span className="text-[11px] text-gray-400">{post.date} · {post.readTime}</span>
                  </div>
                  <h2 className="text-[16px] font-700 text-gray-900 mb-2 leading-snug group-hover:text-[#1a56db] transition-colors">{post.title}</h2>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
                  <Link href="#" className="inline-flex items-center gap-1 text-[12px] font-600 text-[#1a56db]">Read article <ArrowRight className="w-3 h-3" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

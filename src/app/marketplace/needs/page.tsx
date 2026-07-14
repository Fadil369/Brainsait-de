"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Clock,
  DollarSign,
  MessageSquare,
  ArrowRight,
  AlertTriangle,
  Zap,
  Plus,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { mockNeeds } from "@/lib/data";
import { Badge, UserAvatar, FilterTabs } from "@/components/UI";
import Link from "next/link";
import { AIMatchWidget } from "@/components/AIMatchWidget";

const categories = ["All", "Clinical AI", "Integration", "Patient Engagement", "Revenue Cycle", "Interoperability"];
const urgencies = ["All", "Critical", "High", "Medium", "Low"];

interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  deadline: string;
  postedBy: { name: string; avatar: string; verified: boolean; location: string };
  postedAt: string;
  proposals: number;
  urgency: "low" | "medium" | "high" | "critical";
  tags: string[];
}

export default function NeedsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeUrgency, setActiveUrgency] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAIMatch, setShowAIMatch] = useState(false);

  useEffect(() => {
    fetch("/api/marketplace/needs")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setNeeds(data.data);
        else setNeeds(mockNeeds as Need[]);
      })
      .catch(() => setNeeds(mockNeeds as Need[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = needs.filter((n) => {
    if (activeCategory !== "All" && n.category !== activeCategory) return false;
    if (activeUrgency !== "All" && n.urgency !== activeUrgency.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)) ||
        n.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">I Need</h1>
              <p className="text-lg text-gray-600">Publish your healthcare challenge. Get matched with solutions.</p>
            </div>
            <Link href="/marketplace/needs/new" className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <Plus className="w-5 h-5" /> Post a Need
            </Link>
          </div>

          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What healthcare problem are you trying to solve?"
                  className="w-full pl-11 pr-36 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
                <button
                  onClick={() => setShowAIMatch(true)}
                  className="absolute right-1.5 top-1.5 flex items-center gap-1.5 px-3.5 py-2 gradient-health rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Match
                </button>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-28 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {searchQuery ? "Filtering by text search" : "Or use AI to find the right products for your need"}
            </p>
          </div>
        </div>
      </div>

      {/* AI Match modal */}
      {showAIMatch && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAIMatch(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1a56db]" />
                <span className="text-[14px] font-700 text-gray-900">AI Need Matcher</span>
              </div>
              <button onClick={() => setShowAIMatch(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <AIMatchWidget
              placeholder="Describe your need in plain language..."
              embedded
            />
            <p className="mt-3 text-[11px] text-gray-400 text-center">
              The AI analyzes your need and recommends the right BrainSAIT products, services, and verified providers.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</p>
            <FilterTabs tabs={categories} active={activeCategory} onChange={setActiveCategory} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Urgency</p>
            <FilterTabs tabs={urgencies} active={activeUrgency} onChange={setActiveUrgency} />
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {loading ? "Loading needs..." : `${filtered.length} need${filtered.length !== 1 ? "s" : ""} found`}
            {searchQuery && <span className="ml-2 text-[#1a56db]">for &ldquo;{searchQuery}&rdquo;</span>}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((need) => (
            <div key={need.id} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover group">
              <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors cursor-pointer">
                      {need.title}
                    </h3>
                    {need.urgency === "critical" && (
                      <Badge variant="danger"><AlertTriangle className="w-3 h-3 mr-1" /> Critical</Badge>
                    )}
                    {need.urgency === "high" && (
                      <Badge variant="warning"><Zap className="w-3 h-3 mr-1" /> High</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{need.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {need.tags.map((tag) => <Badge key={tag} variant="default">{tag}</Badge>)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {need.budget}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Deadline: {need.deadline}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {need.proposals} proposals</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <UserAvatar name={need.postedBy.name} avatar={need.postedBy.avatar} size="sm" verified={need.postedBy.verified} />
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{need.postedBy.name}</div>
                      <div className="text-xs text-gray-500">{need.postedBy.location}</div>
                    </div>
                  </div>
                  <Link href={`/marketplace/needs/${need.id}`} className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all">
                    View & Propose <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No needs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search term.</p>
            <button
              onClick={() => setShowAIMatch(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 gradient-health text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Try AI Matching
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

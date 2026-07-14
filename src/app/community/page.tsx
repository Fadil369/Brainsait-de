"use client";

import {
  MessageSquare,
  Users,
  Hash,
  TrendingUp,
  ArrowRight,
  Search,
  Plus,
  Heart,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/UI";
import Link from "next/link";

const communities = [
  { id: "com1", name: "Saudi Healthcare AI", members: 3420, posts: 890, icon: "🤖", description: "Discussing AI applications in Saudi healthcare" },
  { id: "com2", name: "NPHIES Integration", members: 2150, posts: 567, icon: "🔗", description: "NPHIES implementation tips, updates, and troubleshooting" },
  { id: "com3", name: "FHIR Developers", members: 4800, posts: 1234, icon: "⚙️", description: "FHIR R4 development, implementation guides, and best practices" },
  { id: "com4", name: "Medical Coding", members: 6700, posts: 2345, icon: "📋", description: "ICD-10, CPT, and medical coding discussions" },
  { id: "com5", name: "Hospital CIO Network", members: 890, posts: 234, icon: "🏥", description: "Private network for hospital CIOs and IT directors" },
  { id: "com6", name: "Digital Health", members: 5600, posts: 1567, icon: "📱", description: "Digital health innovation, mHealth, and patient engagement" },
  { id: "com7", name: "Revenue Cycle Pros", members: 3200, posts: 890, icon: "💰", description: "Revenue cycle optimization, denial management, and coding" },
  { id: "com8", name: "Clinical Research", members: 2800, posts: 678, icon: "🔬", description: "Clinical research methods, ethics, and collaboration" },
];

const discussions = [
  { id: "d1", title: "Best practices for NPHIES prior auth integration?", community: "NPHIES Integration", author: "Dr. Ahmed", replies: 23, views: 456, time: "2h ago" },
  { id: "d2", title: "GPT-4 vs Claude for Arabic clinical notes — benchmarks?", community: "Saudi Healthcare AI", author: "Noura M.", replies: 45, views: 890, time: "4h ago" },
  { id: "d3", title: "ICD-10-AM coding guidelines for diabetes complications", community: "Medical Coding", author: "Sarah A.", replies: 12, views: 234, time: "6h ago" },
  { id: "d4", title: "FHIR Questionnaire resource for Saudi health surveys", community: "FHIR Developers", author: "Mohammed K.", replies: 18, views: 345, time: "8h ago" },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Community</h1>
          <p className="text-lg text-gray-600 mb-8">Join clinical, technical, and professional communities.</p>
          <div className="max-w-2xl relative">
            <input type="text" placeholder="Search communities and discussions..." className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Communities */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Communities</h2>
              <button className="text-sm text-primary-600 font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {communities.map((c) => (
                <div key={c.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-primary-200 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.members.toLocaleString()} members · {c.posts.toLocaleString()} posts</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discussions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Trending Discussions</h2>
              <button className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90">
                <Plus className="w-4 h-4" /> New Discussion
              </button>
            </div>
            <div className="space-y-3">
              {discussions.map((d) => (
                <div key={d.id} className="bg-white rounded-xl p-5 border border-gray-100 card-hover cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary">{d.community}</Badge>
                    <span className="text-xs text-gray-400">{d.time}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{d.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>by {d.author}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{d.replies}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{d.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

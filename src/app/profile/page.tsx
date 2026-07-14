"use client";

import {
  User,
  MapPin,
  Building2,
  Star,
  Award,
  CheckCircle2,
  Edit3,
  Briefcase,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Shield,
  Calendar,
} from "lucide-react";
import { Badge, StarRating } from "@/components/UI";

const profile = {
  name: "King Fahad Medical City",
  type: "Hospital / Health System",
  location: "Riyadh, Saudi Arabia",
  verified: true,
  reputation: 98,
  joined: "January 2024",
  bio: "Leading tertiary care center and research hospital in Saudi Arabia. Committed to digital health innovation and AI adoption in clinical practice.",
  stats: {
    projectsCompleted: 24,
    livesImpacted: "150K+",
    hospitalsServed: 3,
    researchPublished: 12,
    satisfactionScore: 4.8,
    complianceScore: 98,
  },
  specialties: ["Tertiary Care", "Research", "AI", "Digital Health", "FHIR", "NPHIES"],
  recentActivity: [
    { type: "project", title: "Prior Authorization AI System", status: "In Progress", date: "2025-01-20" },
    { type: "need", title: "Arabic Clinical NLP Model", status: "8 proposals", date: "2025-01-18" },
    { type: "challenge", title: "ED Wait Time Reduction", status: "Submitted", date: "2025-01-15" },
    { type: "research", title: "AI Sepsis Detection Study", status: "Recruiting", date: "2025-01-10" },
  ],
  badges: [
    { name: "Early Adopter", icon: Star, color: "text-amber-500" },
    { name: "10+ Projects", icon: Briefcase, color: "text-primary-600" },
    { name: "Verified Hospital", icon: CheckCircle2, color: "text-health-green" },
    { name: "Research Partner", icon: BookOpen, color: "text-health-purple" },
  ],
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-20 h-20 gradient-health rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              KF
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <CheckCircle2 className="w-6 h-6 text-health-green" />
                )}
              </div>
              <p className="text-gray-600 mb-3">{profile.type} · {profile.location}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {profile.specialties.map((s) => (
                  <Badge key={s} variant="primary">{s}</Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600 max-w-2xl">{profile.bio}</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-primary-300">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Reputation */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-600" /> Impact Reputation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Projects Completed", value: profile.stats.projectsCompleted, icon: Briefcase, color: "text-primary-600" },
              { label: "Lives Impacted", value: profile.stats.livesImpacted, icon: TrendingUp, color: "text-health-green" },
              { label: "Hospitals Served", value: profile.stats.hospitalsServed, icon: Building2, color: "text-health-teal" },
              { label: "Research Published", value: profile.stats.researchPublished, icon: BookOpen, color: "text-health-purple" },
              { label: "Satisfaction", value: profile.stats.satisfactionScore + "/5", icon: Star, color: "text-amber-500" },
              { label: "Compliance Score", value: profile.stats.complianceScore + "%", icon: Shield, color: "text-health-blue" },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-gray-50 rounded-xl">
                <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {profile.recentActivity.map((a, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    a.type === "project" ? "bg-primary-50" :
                    a.type === "need" ? "bg-emerald-50" :
                    a.type === "challenge" ? "bg-amber-50" : "bg-pink-50"
                  }`}>
                    {a.type === "project" ? <Briefcase className="w-5 h-5 text-primary-600" /> :
                     a.type === "need" ? <MessageSquare className="w-5 h-5 text-emerald-600" /> :
                     a.type === "challenge" ? <Award className="w-5 h-5 text-amber-600" /> :
                     <BookOpen className="w-5 h-5 text-pink-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{a.title}</div>
                    <div className="text-xs text-gray-500">{a.status} · {a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Badges</h3>
              <div className="space-y-3">
                {profile.badges.map((b) => (
                  <div key={b.name} className="flex items-center gap-3">
                    <b.icon className={`w-5 h-5 ${b.color}`} />
                    <span className="text-sm font-medium text-gray-700">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" /> {profile.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4" /> {profile.type}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" /> Joined {profile.joined}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

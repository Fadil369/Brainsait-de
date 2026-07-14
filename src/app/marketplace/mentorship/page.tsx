"use client";

import { useState } from "react";
import {
  Users,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Stethoscope,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Badge, StarRating, UserAvatar, SearchBar, FilterTabs } from "@/components/UI";
import Link from "next/link";

const roles = ["All", "Medical Students", "Residents", "Startup Founders", "Executives", "Researchers"];

const mentors = [
  { id: "m1", name: "Dr. Abdullah Al-Rashid", role: "CMO", org: "King Fahad Hospital", avatar: "AR", specialties: ["Clinical Leadership", "Digital Health", "Hospital Management"], rating: 4.9, mentees: 12, available: true, type: "Executives" },
  { id: "m2", name: "Noura Al-Harbi", role: "CEO", org: "MedAI Solutions", avatar: "NH", specialties: ["HealthTech Startups", "AI Commercialization", "Fundraising"], rating: 4.8, mentees: 8, available: true, type: "Startup Founders" },
  { id: "m3", name: "Dr. Sara Al-Qahtani", role: "Attending Physician", org: "KAMC", avatar: "SQ", specialties: ["Residency", "Cardiology", "Research"], rating: 4.9, mentees: 15, available: true, type: "Residents" },
  { id: "m4", name: "Prof. Mohammed Al-Saud", role: "Professor", org: "King Saud University", avatar: "MS", specialties: ["Medical School", "Research Methods", "Publishing"], rating: 4.7, mentees: 20, available: false, type: "Medical Students" },
  { id: "m5", name: "Fatima Al-Otaibi", role: "VP Engineering", org: "HealthTech Corp", avatar: "FO", specialties: ["Engineering Leadership", "Product Development", "Scaling"], rating: 4.8, mentees: 6, available: true, type: "Startup Founders" },
  { id: "m6", name: "Dr. Khalid bin Fahad", role: "Research Director", org: "KFMC Research Center", avatar: "KF", specialties: ["Clinical Research", "Grant Writing", "Ethics"], rating: 4.9, mentees: 10, available: true, type: "Researchers" },
];

export default function MentorshipPage() {
  const [activeRole, setActiveRole] = useState("All");
  const filtered = mentors.filter((m) => activeRole === "All" || m.type === activeRole);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Mentorship Network
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Medical students, residents, founders, and executives matched intelligently for growth.
          </p>
          <div className="max-w-2xl">
            <SearchBar placeholder="Find a mentor by specialty, role, or name..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* How it works */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Users, title: "Smart Matching", desc: "AI matches mentors and mentees based on goals, specialty, and experience" },
            { icon: Calendar, title: "Flexible Scheduling", desc: "Book sessions that fit your schedule — video, chat, or in-person" },
            { icon: CheckCircle2, title: "Track Progress", desc: "Set goals, track milestones, and measure growth over time" },
          ].map((s) => (
            <div key={s.title} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
              <s.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-xs text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <FilterTabs tabs={roles} active={activeRole} onChange={setActiveRole} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover text-center">
              <div className="relative inline-block mb-4">
                <UserAvatar name={mentor.name} avatar={mentor.avatar} size="lg" verified />
                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${mentor.available ? "bg-health-green" : "bg-gray-300"}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-0.5">{mentor.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{mentor.role} · {mentor.org}</p>
              <div className="flex justify-center mb-3">
                <StarRating rating={mentor.rating} reviews={mentor.mentees} />
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                {mentor.specialties.map((s) => <Badge key={s} variant="primary">{s}</Badge>)}
              </div>
              <p className="text-xs text-gray-500 mb-4">{mentor.mentees} mentees · {mentor.available ? "Accepting new mentees" : "Currently full"}</p>
              <button
                disabled={!mentor.available}
                className="w-full inline-flex items-center justify-center gap-1 px-4 py-2.5 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Mentorship <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Loader2,
} from "lucide-react";
import { mockExperts } from "@/lib/data";
import { Badge, StarRating, UserAvatar, SearchBar, FilterTabs } from "@/components/UI";
import Link from "next/link";
import type { Expert } from "@/lib/data";

const specialties = ["All", "FHIR", "Revenue Cycle", "Clinical AI", "Integration", "PDPL"];

export default function ExpertsPage() {
  const [activeSpec, setActiveSpec] = useState("All");
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/experts")
      .then((r) => r.json())
      .then((data: { data?: Expert[] }) => {
        if (data.data) setExperts(data.data);
        else setExperts(mockExperts as Expert[]);
      })
      .catch(() => setExperts(mockExperts as Expert[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = experts.filter(
    (e) =>
      activeSpec === "All" ||
      e.specialties.some((s) => s.toLowerCase().includes(activeSpec.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Expert Network
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Book verified healthcare experts for instant consultations.
          </p>
          <div className="max-w-2xl">
            <SearchBar placeholder="Search experts by specialty, skill, or name..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <FilterTabs tabs={specialties} active={activeSpec} onChange={setActiveSpec} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600">Check back later for new expert profiles.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {!loading && filtered.map((expert) => (
            <div
              key={expert.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 card-hover text-center"
            >
              <div className="relative inline-block mb-4">
                <UserAvatar
                  name={expert.user.name}
                  avatar={expert.user.avatar}
                  size="lg"
                  verified={expert.user.verified}
                />
                <span
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    expert.availability === "available"
                      ? "bg-health-green"
                      : expert.availability === "busy"
                      ? "bg-amber-400"
                      : "bg-gray-300"
                  }`}
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {expert.user.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {expert.user.organization} · {expert.user.location}
              </p>

              <div className="flex justify-center mb-3">
                <StarRating rating={expert.rating} reviews={expert.consultations} />
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                {expert.specialties.slice(0, 3).map((s) => (
                  <Badge key={s} variant="primary">
                    {s}
                  </Badge>
                ))}
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <span className="font-semibold text-gray-900">
                  {expert.hourlyRate}
                </span>
                <span className="text-gray-400 mx-2">·</span>
                {expert.consultations} consultations
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> Video
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Same-day
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-health-green" /> Verified
                </span>
              </div>

              <Link href="/contact" className="w-full inline-flex items-center justify-center gap-1 px-4 py-2.5 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90">
                <Calendar className="w-4 h-4" />
                Book Consultation
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

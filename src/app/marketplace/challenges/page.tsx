"use client";

import { useState, useEffect } from "react";
import {
  Lightbulb,
  Trophy,
  Clock,
  Users,
  ArrowRight,
  Plus,
  Flame,
  Loader2,
} from "lucide-react";
import { mockChallenges } from "@/lib/data";
import { Badge, SearchBar, FilterTabs } from "@/components/UI";
import Link from "next/link";
import type { Challenge } from "@/lib/data";

const statuses = ["All", "Open", "Judging", "Completed"];

export default function ChallengesPage() {
  const [activeStatus, setActiveStatus] = useState("All");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/challenges")
      .then((r) => r.json())
      .then((data: { data?: Challenge[] }) => {
        if (data.data) setChallenges(data.data);
        else setChallenges(mockChallenges as Challenge[]);
      })
      .catch(() => setChallenges(mockChallenges as Challenge[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = challenges.filter(
    (c) =>
      activeStatus === "All" ||
      c.status === activeStatus.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Innovation Challenges
              </h1>
              <p className="text-lg text-gray-600">
                Hospitals post problems. Innovators compete with solutions.
              </p>
            </div>
            <Link
              href="/marketplace/challenges/new"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Launch Challenge
            </Link>
          </div>
          <div className="mt-8 max-w-2xl">
            <SearchBar placeholder="Search innovation challenges..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <FilterTabs tabs={statuses} active={activeStatus} onChange={setActiveStatus} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-600">Launch a challenge to crowdsource healthcare innovation.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {!loading && filtered.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover"
            >
              <div className="h-2 gradient-health" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant={
                      challenge.status === "open"
                        ? "success"
                        : challenge.status === "judging"
                        ? "warning"
                        : "default"
                    }
                  >
                    {challenge.status === "open" && (
                      <Flame className="w-3 h-3 mr-1" />
                    )}
                    {challenge.status.charAt(0).toUpperCase() +
                      challenge.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {challenge.submissions} submissions
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {challenge.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {challenge.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {challenge.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 mb-5">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />{" "}
                    {challenge.prize}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Due: {challenge.deadline}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    Sponsored by{" "}
                    <span className="font-semibold text-gray-900">
                      {challenge.sponsor}
                    </span>
                  </span>
                  <Link
                    href={`/marketplace/challenges/${challenge.id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90"
                  >
                    Submit Solution <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

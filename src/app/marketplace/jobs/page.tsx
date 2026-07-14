"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Zap,
  Plus,
  Building2,
  Globe,
  Loader2,
} from "lucide-react";
import { mockJobs } from "@/lib/data";
import { Badge, UserAvatar, SearchBar, FilterTabs } from "@/components/UI";
import Link from "next/link";
import type { Job, User } from "@/lib/data";

const types = ["All", "Full-time", "Part-time", "Freelance", "Remote", "Contract"];

interface GatewayJob {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: string;
  salary: string;
  postedAt: string;
  postedBy: { name: string; avatar: string; organization: string; verified: boolean; reputation: number };
  skills: string[];
  urgent: boolean;
}

export default function JobsPage() {
  const [activeType, setActiveType] = useState("All");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/jobs")
      .then((r) => r.json())
      .then((data: { data?: GatewayJob[] }) => {
        if (data.data) {
          setJobs(data.data.map((j) => ({
            id: j.id,
            title: j.title,
            organization: j.organization || (j.postedBy as unknown as { organization?: string })?.organization || "Unknown",
            location: j.location,
            type: j.type as Job["type"],
            salary: j.salary,
            postedAt: j.postedAt,
            postedBy: j.postedBy as unknown as User,
            skills: j.skills || [],
            urgent: j.urgent || false,
          })));
        } else {
          setJobs(mockJobs as Job[]);
        }
      })
      .catch(() => setJobs(mockJobs as Job[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(
    (j) =>
      activeType === "All" ||
      j.type === activeType.toLowerCase().replace("-", "")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Healthcare Jobs
              </h1>
              <p className="text-lg text-gray-600">
                Specialized healthcare recruitment. Remote, freelance, full-time.
              </p>
            </div>
            <Link
              href="/marketplace/jobs/new"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Post a Job
            </Link>
          </div>
          <div className="mt-8 max-w-2xl">
            <SearchBar placeholder="Search healthcare jobs..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <FilterTabs tabs={types} active={activeType} onChange={setActiveType} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or check back later.</p>
          </div>
        )}

        <div className="space-y-4">
          {!loading && filtered.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 card-hover"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                      {job.title}
                    </h3>
                    {job.urgent && (
                      <Badge variant="danger">
                        <Zap className="w-3 h-3 mr-1" /> Urgent
                      </Badge>
                    )}
                    <Badge variant="info">{job.type}</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" /> {job.organization}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" /> {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {job.postedAt}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/marketplace/jobs/${job.id}`}
                  className="inline-flex items-center gap-1 px-5 py-2.5 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90 whitespace-nowrap"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Clock,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Plus,
  Users,
  Loader2,
} from "lucide-react";
import { mockProjects } from "@/lib/data";
import { Badge, UserAvatar, SearchBar, FilterTabs } from "@/components/UI";
import Link from "next/link";
import type { Project } from "@/lib/data";

const statuses = ["All", "Open", "In Progress", "Completed"];

export default function ProjectsPage() {
  const [activeStatus, setActiveStatus] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/projects")
      .then((r) => r.json())
      .then((data: { data?: Project[] }) => {
        if (data.data) setProjects(data.data);
        else setProjects(mockProjects as Project[]);
      })
      .catch(() => setProjects(mockProjects as Project[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(
    (p) =>
      activeStatus === "All" ||
      p.status === activeStatus.toLowerCase().replace(" ", "-")
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Projects Marketplace
              </h1>
              <p className="text-lg text-gray-600">
                Healthcare-specific project marketplace. Like Upwork, built for health.
              </p>
            </div>
            <Link
              href="/marketplace/projects/new"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Post a Project
            </Link>
          </div>
          <div className="mt-8 max-w-2xl">
            <SearchBar placeholder="Search healthcare projects..." />
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
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filters or post a new project.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {!loading && filtered.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge
                  variant={
                    project.status === "open"
                      ? "success"
                      : project.status === "in-progress"
                      ? "info"
                      : "default"
                  }
                >
                  {project.status === "in-progress"
                    ? "In Progress"
                    : project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                </Badge>
                <span className="text-xs text-gray-400">{project.postedAt}</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> {project.budget}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {project.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {project.proposals} proposals
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <UserAvatar
                    name={project.postedBy.name}
                    avatar={project.postedBy.avatar}
                    size="sm"
                    verified={project.postedBy.verified}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {project.postedBy.name}
                  </span>
                </div>
                <Link
                  href={`/marketplace/projects/${project.id}`}
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90"
                >
                  Submit Proposal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

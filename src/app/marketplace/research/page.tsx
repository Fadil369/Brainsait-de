"use client";

import { FlaskConical, Users, MapPin, Clock, ArrowRight, Plus } from "lucide-react";
import { Badge, SearchBar } from "@/components/UI";
import Link from "next/link";

const studies = [
  { id: "r1", title: "AI-Driven Early Sepsis Detection in ICUs", institution: "King Fahad Medical City", type: "Clinical Trial", participants: "500 needed", status: "recruiting", phase: "Phase II", location: "Riyadh" },
  { id: "r2", title: "Arabic NLP for Clinical Documentation Quality", institution: "King Saud University", type: "Observational", participants: "200 needed", status: "recruiting", phase: "N/A", location: "Riyadh" },
  { id: "r3", title: "Telemedicine Outcomes in Rural Saudi Arabia", institution: "Ministry of Health", type: "Cohort Study", participants: "1,000 needed", status: "recruiting", phase: "N/A", location: "Multiple" },
  { id: "r4", title: "FHIR-Based Interoperability Impact Assessment", institution: "Saudi Health Council", type: "Research", participants: "30 hospitals", status: "seeking partners", phase: "N/A", location: "National" },
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Clinical Research Hub</h1>
              <p className="text-lg text-gray-600">Find participants, collaborators, hospitals, and data partners.</p>
            </div>
            <Link href="/marketplace/research/new" className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 shadow-lg">
              <Plus className="w-5 h-5" /> Publish Study
            </Link>
          </div>
          <div className="mt-8 max-w-2xl"><SearchBar placeholder="Search clinical studies and research..." /></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {studies.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-7 h-7 text-pink-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary">{s.type}</Badge>
                    <Badge variant={s.status === "recruiting" ? "success" : "warning"}>{s.status}</Badge>
                    {s.phase !== "N/A" && <Badge variant="default">{s.phase}</Badge>}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{s.institution}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{s.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{s.participants}</span>
                  </div>
                </div>
                <Link href="/marketplace/research/new" className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90 whitespace-nowrap">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

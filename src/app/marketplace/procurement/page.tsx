"use client";

import { FileText, Clock, ArrowRight, Plus, Building2 } from "lucide-react";
import { Badge, SearchBar, FilterTabs } from "@/components/UI";
import Link from "next/link";
import { useState } from "react";

const types = ["All", "RFP", "RFQ", "Tender", "Pilot"];

const procurements = [
  { id: "pr1", type: "RFP", title: "Hospital Information System Replacement", org: "National Guard Health Affairs", budget: "SAR 15,000,000", deadline: "2025-04-30", responses: 8, category: "HIS" },
  { id: "pr2", type: "Tender", title: "Medical Equipment Procurement — ICU Monitors", org: "Ministry of Health", budget: "SAR 5,000,000", deadline: "2025-03-15", responses: 14, category: "Equipment" },
  { id: "pr3", type: "Pilot", title: "AI-Powered Triage System Pilot", org: "King Fahad Medical City", budget: "SAR 500,000", deadline: "2025-05-01", responses: 6, category: "AI" },
  { id: "pr4", type: "RFQ", title: "FHIR Integration Platform Quote", org: "Dr. Sulaiman Al-Habib Medical Group", budget: "SAR 800,000", deadline: "2025-03-20", responses: 10, category: "Integration" },
];

export default function ProcurementPage() {
  const [activeType, setActiveType] = useState("All");
  const filtered = procurements.filter((p) => activeType === "All" || p.type === activeType);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Procurement</h1>
              <p className="text-lg text-gray-600">RFPs, RFQs, tenders, and pilot projects.</p>
            </div>
            <Link href="/marketplace/procurement/new" className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 shadow-lg">
              <Plus className="w-5 h-5" /> Publish RFP/Tender
            </Link>
          </div>
          <div className="mt-8 max-w-2xl"><SearchBar placeholder="Search procurement opportunities..." /></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8"><FilterTabs tabs={types} active={activeType} onChange={setActiveType} /></div>
        <div className="space-y-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-7 h-7 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={p.type === "Tender" ? "warning" : p.type === "Pilot" ? "success" : "primary"}>{p.type}</Badge>
                    <Badge variant="default">{p.category}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{p.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{p.org}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />Due: {p.deadline}</span>
                    <span>{p.responses} responses</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-bold text-gray-900">{p.budget}</span>
                  <Link href="/marketplace/procurement/new" className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90">
                    View & Respond <ArrowRight className="w-4 h-4" />
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

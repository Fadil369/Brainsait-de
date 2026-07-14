"use client";

import {
  Shield,
  FileText,
  DollarSign,
  TrendingUp,
  Bell,
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/UI";
import Link from "next/link";

const priorities = [
  { title: "AI in Healthcare", desc: "Accelerate AI adoption across all health sectors", status: "active", funding: "SAR 500M" },
  { title: "NPHIES Full Adoption", desc: "100% NPHIES integration by 2026", status: "active", funding: "SAR 200M" },
  { title: "Interoperability Standards", desc: "FHIR R4 as national health data standard", status: "active", funding: "SAR 150M" },
  { title: "Digital Health Literacy", desc: "Train 100,000 healthcare professionals", status: "upcoming", funding: "SAR 100M" },
];

const regulations = [
  { title: "PDPL Health Data Guidelines v2.0", date: "2025-01-15", type: "Updated", desc: "Updated guidelines for health data processing under PDPL" },
  { title: "NPHIES Technical Standards 3.1", date: "2025-01-10", type: "New", desc: "New technical standards for NPHIES integration" },
  { title: "AI in Clinical Decision Support", date: "2024-12-20", type: "Guidance", desc: "Regulatory guidance for AI-based clinical decision support" },
  { title: "Telemedicine Licensing Requirements", date: "2024-12-15", type: "Updated", desc: "Updated licensing requirements for telemedicine services" },
];

const funding = [
  { name: "Health Innovation Fund", amount: "SAR 1,000,000,000", deadline: "Rolling", eligibility: "Startups, SMEs", focus: "AI, Digital Health" },
  { name: "NPHIES Integration Grant", amount: "SAR 500,000,000", deadline: "2025-06-30", eligibility: "Hospitals, Vendors", focus: "NPHIES, Interoperability" },
  { name: "Clinical Research Fund", amount: "SAR 300,000,000", deadline: "2025-09-01", eligibility: "Universities, Hospitals", focus: "Research, Clinical Trials" },
  { name: "Digital Transformation Grant", amount: "SAR 2,000,000,000", deadline: "2025-12-31", eligibility: "Health Systems", focus: "Infrastructure, EHR" },
];

export default function GovernmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 gradient-health rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Government Layer</h1>
              <p className="text-gray-600">Ministry of Health — Vision 2030 Health Transformation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Innovation Priorities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" /> Innovation Priorities
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {priorities.map((p) => (
                  <div key={p.title} className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={p.status === "active" ? "success" : "warning"}>
                        {p.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{p.funding}</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{p.title}</h3>
                    <p className="text-sm text-gray-600">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-health-green" /> Available Funding
              </h2>
              <div className="space-y-3">
                {funding.map((f) => (
                  <div key={f.name} className="bg-white rounded-xl p-5 border border-gray-100 card-hover">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{f.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="primary">{f.focus}</Badge>
                          <Badge variant="default">{f.eligibility}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-health-green">{f.amount}</div>
                        <div className="text-xs text-gray-500">Due: {f.deadline}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Regulations */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-600" /> Regulatory Updates
              </h3>
              <div className="space-y-3">
                {regulations.map((r) => (
                  <div key={r.title} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={r.type === "New" ? "success" : r.type === "Updated" ? "info" : "warning"}>
                        {r.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{r.title}</div>
                    <div className="text-xs text-gray-500">{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                {["NPHIES Portal", "PDPL Guidelines", "MOH Innovation", "SDAIA Health", "Vision 2030 Health"].map((link) => (
                  <Link key={link} href="#" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                    <ArrowRight className="w-3.5 h-3.5" /> {link}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  ArrowRight,
  Star,
  BarChart3,
  Globe,
} from "lucide-react";
import { Badge, StarRating } from "@/components/UI";
import Link from "next/link";

const startups = [
  { id: "s1", name: "MedAI Solutions", stage: "Series A", funding: "SAR 15M raised", ask: "SAR 50M", valuation: "SAR 200M", traction: "45 hospitals, 3 AI products", pilots: ["KFMC", "KAMC"], rating: 4.8, category: "Clinical AI", location: "Jeddah" },
  { id: "s2", name: "NphiesConnect", stage: "Seed", funding: "SAR 3M raised", ask: "SAR 10M", valuation: "SAR 40M", traction: "120 clinics, 50K claims/month", pilots: ["Dr. Sulaiman Al-Habib"], rating: 4.6, category: "Integration", location: "Riyadh" },
  { id: "s3", name: "HealthScribe", stage: "Pre-Seed", funding: "SAR 500K raised", ask: "SAR 5M", valuation: "SAR 20M", traction: "10 hospitals, 60% documentation reduction", pilots: ["MOH Hospitals"], rating: 4.5, category: "NLP/AI", location: "Riyadh" },
  { id: "s4", name: "TeleDoc Arabia", stage: "Series B", funding: "SAR 40M raised", ask: "SAR 100M", valuation: "SAR 500M", traction: "500K consultations, 200 physicians", pilots: ["National Guard"], rating: 4.7, category: "Telemedicine", location: "Dubai/Riyadh" },
];

const investors = [
  { name: "Saudi Health Ventures", focus: "HealthTech, Digital Health", aum: "SAR 2B", investments: 45 },
  { name: "STV Health", focus: "AI, MedTech", aum: "SAR 1.5B", investments: 32 },
  { name: "Jada Fund of Funds", focus: "Healthcare, Biotech", aum: "SAR 4B", investments: 78 },
  { name: "RAED Ventures", focus: "Early-stage Health", aum: "SAR 800M", investments: 56 },
];

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Investor Portal</h1>
          <p className="text-lg text-gray-600">Discover healthcare startups, track traction, and invest in the future.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Startups", value: "300+", icon: Building2 },
            { label: "Active Investors", value: "100+", icon: Users },
            { label: "Total Funding", value: "SAR 2B+", icon: DollarSign },
            { label: "Successful Exits", value: "12", icon: TrendingUp },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 text-center">
              <s.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Startups */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Startups</h2>
            <div className="space-y-4">
              {startups.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{s.name}</h3>
                        <Badge variant="primary">{s.stage}</Badge>
                        <Badge variant="default">{s.category}</Badge>
                      </div>
                      <div className="text-sm text-gray-500">{s.location}</div>
                    </div>
                    <StarRating rating={s.rating} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Raised</div>
                      <div className="text-sm font-semibold text-gray-900">{s.funding}</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Asking</div>
                      <div className="text-sm font-semibold text-primary-600">{s.ask}</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Valuation</div>
                      <div className="text-sm font-semibold text-gray-900">{s.valuation}</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-center">
                      <div className="text-xs text-gray-500">Pilot Hospitals</div>
                      <div className="text-sm font-semibold text-gray-900">{s.pilots.length}</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{s.traction}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {s.pilots.map((p) => (
                      <Badge key={p} variant="success">{p}</Badge>
                    ))}
                  </div>

                  <button className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                    View Pitch Deck <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Investor Directory */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Investors</h2>
            <div className="space-y-3">
              {investors.map((inv) => (
                <div key={inv.name} className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="w-10 h-10 gradient-health rounded-lg flex items-center justify-center text-white font-bold text-sm mb-3">
                    {inv.name[0]}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{inv.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{inv.focus}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>AUM: {inv.aum}</span>
                    <span>{inv.investments} investments</span>
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

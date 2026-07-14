"use client";

import { Server, Activity, Clock, ArrowRight, Plus, Zap } from "lucide-react";
import { mockAPIs } from "@/lib/data";
import { Badge, SearchBar } from "@/components/UI";
import Link from "next/link";

export default function APIMarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">API Marketplace</h1>
              <p className="text-lg text-gray-600">FHIR, NPHIES, scheduling, lab, and insurance APIs.</p>
            </div>
            <Link href="/marketplace/api/new" className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 shadow-lg">
              <Plus className="w-5 h-5" /> Publish API
            </Link>
          </div>
          <div className="mt-8 max-w-2xl"><SearchBar placeholder="Search healthcare APIs..." /></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAPIs.map((api) => (
            <div key={api.id} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <Server className="w-6 h-6 text-cyan-600" />
                </div>
                <Badge variant="primary">{api.category}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{api.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{api.description}</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Uptime</div>
                  <div className="text-sm font-semibold text-health-green">{api.uptime}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Latency</div>
                  <div className="text-sm font-semibold text-gray-900">{api.latency}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Version</div>
                  <div className="text-sm font-semibold text-gray-900">{api.version}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-900">{api.price}</span>
                <Link href="/sadad" className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

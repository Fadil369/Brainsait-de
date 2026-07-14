"use client";

import { useEffect, useState } from "react";
import { Database, Download, Shield, ArrowRight, Plus, Loader2, ExternalLink } from "lucide-react";
import { mockDatasets } from "@/lib/data";
import { Badge, SearchBar } from "@/components/UI";
import Link from "next/link";

interface Dataset {
  id: string;
  name: string;
  description: string;
  size: string;
  format: string;
  compliance: string[];
  price: string;
  provider: { name: string };
  downloads: number;
  viewUrl?: string;
}

export default function DataMarketplacePage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/data")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setDatasets(data.data);
        else setDatasets(mockDatasets as Dataset[]);
      })
      .catch(() => setDatasets(mockDatasets as Dataset[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Data Marketplace</h1>
              <p className="text-lg text-gray-600">PDPL-compliant datasets, frameworks, and knowledge assets for research and AI training.</p>
            </div>
            <Link href="/marketplace/data/new" className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 shadow-lg">
              <Plus className="w-5 h-5" /> Share Dataset
            </Link>
          </div>
          <div className="mt-8 max-w-2xl"><SearchBar placeholder="Search datasets..." /></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        )}
        <div className="space-y-4">
          {datasets.map((ds) => (
            <div key={ds.id} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Database className="w-7 h-7 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{ds.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{ds.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {ds.compliance.map((c) => (
                      <Badge key={c} variant="success"><Shield className="w-3 h-3 mr-1" />{c}</Badge>
                    ))}
                    <Badge variant="default">{ds.format}</Badge>
                    <Badge variant="default">{ds.size}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Download className="w-4 h-4" />{ds.downloads} downloads</span>
                    <span>by {ds.provider.name}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-bold text-gray-900">{ds.price}</span>
                  {ds.viewUrl ? (
                    <Link href={ds.viewUrl} className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90">
                      View <ExternalLink className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link href="/contact" className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90">
                      Request Access <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Wrench, MapPin, ArrowRight, Plus, Tag, Loader2 } from "lucide-react";
import { mockEquipment } from "@/lib/data";
import { Badge, SearchBar } from "@/components/UI";
import Link from "next/link";
import type { Equipment } from "@/lib/data";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/equipment")
      .then((r) => r.json())
      .then((data: { data?: Equipment[] }) => {
        if (data.data) setEquipment(data.data);
        else setEquipment(mockEquipment as Equipment[]);
      })
      .catch(() => setEquipment(mockEquipment as Equipment[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Equipment Marketplace</h1>
              <p className="text-lg text-gray-600">Buy, sell, lease, or donate medical equipment.</p>
            </div>
            <Link href="/marketplace/equipment/new" className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 shadow-lg">
              <Plus className="w-5 h-5" /> List Equipment
            </Link>
          </div>
          <div className="mt-8 max-w-2xl"><SearchBar placeholder="Search medical equipment..." /></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        )}

        {!loading && equipment.length === 0 && (
          <div className="text-center py-16">
            <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No equipment listed</h3>
            <p className="text-gray-600">Be the first to list medical equipment.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && equipment.map((eq) => (
            <div key={eq.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover">
              <div className="h-44 bg-gray-100 flex items-center justify-center">
                <Wrench className="w-16 h-16 text-gray-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary">{eq.category}</Badge>
                  <Badge variant={eq.condition === "new" ? "success" : eq.condition === "refurbished" ? "warning" : "default"}>
                    {eq.condition}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{eq.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" /> {eq.location}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-lg font-bold text-gray-900">{eq.price}</span>
                  <Link href={`/marketplace/equipment/${eq.id}`} className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90">
                    View Details <ArrowRight className="w-4 h-4" />
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

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Star,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Handshake,
  Plus,
  Loader2,
} from "lucide-react";
import { mockOffers } from "@/lib/data";
import { Badge, StarRating, UserAvatar, SearchBar, FilterTabs } from "@/components/UI";
import Link from "next/link";
import type { Offer } from "@/lib/data";

const categories = ["All", "Analytics", "Revenue Cycle", "Integration", "Clinical AI", "Education"];

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/offers")
      .then((r) => r.json())
      .then((data: { data?: Offer[] }) => {
        if (data.data) setOffers(data.data);
        else setOffers(mockOffers as Offer[]);
      })
      .catch(() => setOffers(mockOffers as Offer[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = offers.filter(
    (o) => activeCategory === "All" || o.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                I Can Help
              </h1>
              <p className="text-lg text-gray-600">
                Showcase your capabilities. Reach the right healthcare buyers.
              </p>
            </div>
            <Link
              href="/marketplace/offers/new"
              className="inline-flex items-center gap-2 px-6 py-3 gradient-health text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              <Plus className="w-5 h-5" />
              List Your Service
            </Link>
          </div>
          <div className="mt-8 max-w-2xl">
            <SearchBar placeholder="Search healthcare solutions and services..." />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <FilterTabs tabs={categories} active={activeCategory} onChange={setActiveCategory} />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No offers found</h3>
            <p className="text-gray-600">Be the first to post a solution in this category.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && filtered.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 card-hover flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge variant="primary">{offer.category}</Badge>
                {offer.verified && (
                  <span className="flex items-center gap-1 text-xs text-health-green font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                {offer.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
                {offer.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {offer.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <UserAvatar
                    name={offer.postedBy.name}
                    avatar={offer.postedBy.avatar}
                    size="sm"
                    verified={offer.postedBy.verified}
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {offer.postedBy.name}
                  </span>
                </div>
                <StarRating rating={offer.rating} reviews={offer.reviews} />
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-900">
                  {offer.price}
                </span>
                <Link
                  href={`/marketplace/offers/${offer.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

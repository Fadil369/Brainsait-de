"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Star,
  Play,
  ArrowRight,
  Zap,
  Shield,
  Server,
  Loader2,
} from "lucide-react";
import { mockAIProducts } from "@/lib/data";
import { Badge, StarRating, UserAvatar, SearchBar, FilterTabs } from "@/components/UI";
import Link from "next/link";
import type { AIProduct } from "@/lib/data";

const categories = ["All", "Imaging AI", "NLP", "Clinical Decision Support", "Revenue Cycle"];

export default function AIMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<AIProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/ai")
      .then((r) => r.json())
      .then((data: { data?: AIProduct[] }) => {
        if (data.data) setProducts(data.data);
        else setProducts(mockAIProducts as AIProduct[]);
      })
      .catch(() => setProducts(mockAIProducts as AIProduct[]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="gradient-health-light border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            AI Marketplace
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover, deploy, and scale healthcare AI solutions.
          </p>
          <div className="max-w-2xl">
            <SearchBar placeholder="Search AI agents, copilots, models, and workflows..." />
          </div>
        </div>
      </div>

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
            <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No AI products found</h3>
            <p className="text-gray-600">Check back soon for new AI solutions.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover"
            >
              <div className="h-32 gradient-health flex items-center justify-center">
                <Bot className="w-16 h-16 text-white/30" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="primary">{product.category}</Badge>
                  {product.demo && (
                    <span className="flex items-center gap-1 text-xs text-health-green font-medium">
                      <Play className="w-3 h-3" /> Live Demo
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <StarRating rating={product.rating} />
                  <span>{product.deployments} deployments</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      name={product.vendor.name}
                      avatar={product.vendor.avatar}
                      size="sm"
                      verified
                    />
                    <span className="text-sm text-gray-700">
                      {product.vendor.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {product.price}
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link href="/products/ai" className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100">
                    <Play className="w-4 h-4" /> Try Demo
                  </Link>
                  <Link href="/products/ai" className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-white gradient-health rounded-lg hover:opacity-90">
                    Deploy <ArrowRight className="w-4 h-4" />
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

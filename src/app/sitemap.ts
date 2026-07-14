import { MetadataRoute } from "next";

const BASE = "https://brainsait.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "", "/copilot", "/community", "/government", "/investors",
    "/profile", "/status", "/match",
  ];

  const contentRoutes = [
    "/about", "/blog", "/contact", "/privacy", "/terms",
  ];

  const productRoutes = [
    "/products/health", "/products/ai", "/products/cloud",
    "/products/trust", "/products/academy", "/products/ventures",
  ];

  const marketplace = [
    "/marketplace",
    "/marketplace/needs", "/marketplace/needs/new",
    "/marketplace/offers", "/marketplace/offers/new",
    "/marketplace/projects", "/marketplace/projects/new",
    "/marketplace/challenges", "/marketplace/challenges/new",
    "/marketplace/experts", "/marketplace/ai",
    "/marketplace/api", "/marketplace/api/new",
    "/marketplace/data", "/marketplace/data/new",
    "/marketplace/jobs", "/marketplace/jobs/new",
    "/marketplace/education", "/marketplace/equipment", "/marketplace/equipment/new",
    "/marketplace/mentorship", "/marketplace/research", "/marketplace/research/new",
    "/marketplace/procurement", "/marketplace/procurement/new",
    "/marketplace/templates",
  ];

  const allRoutes = [...staticRoutes, ...contentRoutes, ...productRoutes, ...marketplace];

  return allRoutes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "hourly" as const : "weekly" as const,
    priority: route === "" ? 1 : route.startsWith("/products") ? 0.9 : route.startsWith("/marketplace") ? 0.8 : 0.6,
  }));
}

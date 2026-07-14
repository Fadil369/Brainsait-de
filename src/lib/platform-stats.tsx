"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PlatformStats {
  activeListings: number;
  verifiedPartners: number;
  platformMembers: number;
  transactionsFacilitated: number;
  satisfactionRate: number;
  citiesCovered: number;
  collections: Record<string, number>;
  timestamp: string;
}

const FALLBACK: PlatformStats = {
  activeListings: 400,
  verifiedPartners: 180,
  platformMembers: 12000,
  transactionsFacilitated: 3200,
  satisfactionRate: 98,
  citiesCovered: 21,
  collections: {},
  timestamp: new Date().toISOString(),
};

const StatsContext = createContext<PlatformStats>(FALLBACK);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<PlatformStats>(FALLBACK);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setStats((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // fallback to defaults
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 300_000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>;
}

export function usePlatformStats() {
  return useContext(StatsContext);
}

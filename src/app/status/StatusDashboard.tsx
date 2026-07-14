"use client";

import { useEffect, useState, useCallback } from "react";

interface ServiceCheck {
  name: string;
  ok: boolean;
  status: number;
  ms?: number;
}

interface HealthSnapshot {
  ts: number;
  services: ServiceCheck[];
}

const SERVICE_META: Record<string, { label: string; desc: string; icon: string }> = {
  gateway:  { label: "API Gateway",      desc: "Fastify unified gateway",           icon: "⚡" },
  frontend: { label: "Health Exchange",  desc: "Next.js marketplace frontend",      icon: "🌐" },
  iris:     { label: "IRIS Portal",      desc: "InterSystems IRIS Health 2026.1",   icon: "🏥" },
  fhir:     { label: "FHIR R4",          desc: "FHIR REST endpoint",                icon: "📋" },
  grafana:  { label: "Grafana",          desc: "Monitoring & dashboards",           icon: "📊" },
};

const STATIC_SERVICES = [
  { name: "Health Exchange",  url: "https://brainsait.de",                    desc: "Next.js frontend",       icon: "🌐" },
  { name: "API Gateway",      url: "https://api.brainsait.de/health",         desc: "Fastify gateway",        icon: "⚡" },
  { name: "IRIS Health",      url: "https://iris.brainsait.de/csp/sys/UtilHome.csp", desc: "IRIS portal",   icon: "🏥" },
  { name: "FHIR R4",          url: "https://fhir.brainsait.de/metadata",      desc: "FHIR REST API",          icon: "📋" },
  { name: "Grafana",          url: "https://grafana.brainsait.de/api/health", desc: "Monitoring",             icon: "📊" },
  { name: "NPHIES Mirror",    url: "https://nphies.brainsait.de",             desc: "Saudi claims proxy",     icon: "🛡️" },
  { name: "Status Page",      url: "https://status.brainsait.de",            desc: "This page",              icon: "✅" },
];

async function checkStatic(): Promise<Array<ServiceCheck & { icon: string; desc: string; url: string }>> {
  return Promise.all(
    STATIC_SERVICES.map(async (s) => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 8000);
        const start = Date.now();
        const res = await fetch(s.url, { cache: "no-store", signal: ctrl.signal });
        clearTimeout(t);
        return { name: s.name, ok: res.ok || res.status === 404, status: res.status, ms: Date.now() - start, icon: s.icon, desc: s.desc, url: s.url };
      } catch {
        return { name: s.name, ok: false, status: 0, ms: 0, icon: s.icon, desc: s.desc, url: s.url };
      }
    })
  );
}

export function StatusDashboard() {
  const [checks, setChecks] = useState<Array<ServiceCheck & { icon: string; desc: string; url: string }>>([]);
  const [liveServices, setLiveServices] = useState<ServiceCheck[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sseConnected, setSseConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial static check (server-reachable from browser)
  const refresh = useCallback(async () => {
    const results = await checkStatic();
    setChecks(results);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    // SSE for internal service health via gateway
    const GATEWAY = process.env.NEXT_PUBLIC_SITE_URL
      ? `https://api.${new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname}`
      : "https://api.brainsait.de";

    const es = new EventSource(`${GATEWAY}/events/health`);
    es.onopen = () => setSseConnected(true);
    es.onerror = () => setSseConnected(false);
    es.onmessage = (evt) => {
      try {
        const data: HealthSnapshot = JSON.parse(evt.data);
        setLiveServices(data.services);
        setLastUpdated(new Date(data.ts));
      } catch {}
    };

    // Fallback poll every 30s
    const poll = setInterval(refresh, 30000);
    return () => { es.close(); clearInterval(poll); };
  }, [refresh]);

  const healthy = checks.filter((c) => c.ok).length;
  const allOk = healthy === checks.length && checks.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">BrainSAIT System Status</h1>
          <p className="text-gray-500 text-lg">Real-time health of all services on <span className="font-semibold text-gray-800">brainsait.de</span></p>

          {/* Overall badge */}
          <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm border"
            style={{ background: allOk ? "#d1fae5" : "#fee2e2", borderColor: allOk ? "#6ee7b7" : "#fca5a5", color: allOk ? "#065f46" : "#991b1b" }}>
            <span className={`h-2.5 w-2.5 rounded-full ${allOk ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            {loading ? "Checking services…" : allOk ? `All ${healthy} Services Operational` : `Partial Outage — ${healthy}/${checks.length} OK`}
          </div>

          {/* SSE live indicator */}
          <div className="mt-3 flex justify-center items-center gap-1.5 text-xs text-gray-400">
            <span className={`h-1.5 w-1.5 rounded-full ${sseConnected ? "bg-green-400 animate-pulse" : "bg-gray-300"}`} />
            {sseConnected ? "Live internal monitoring active" : "Live monitoring connecting…"}
            {lastUpdated && <span className="ml-2">· Last updated {lastUpdated.toLocaleTimeString()}</span>}
          </div>
        </div>

        {/* External (browser-reachable) service cards */}
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Public Endpoints</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {(loading ? STATIC_SERVICES.map(s => ({ ...s, ok: false, status: 0, ms: 0 })) : checks).map((svc) => (
            <a key={svc.name} href={svc.url} target="_blank" rel="noopener noreferrer"
              className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{svc.icon}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  loading ? "bg-gray-100 text-gray-400" :
                  svc.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {loading ? "…" : svc.ok ? "Operational" : "Down"}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{svc.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{svc.desc}</p>
              {!loading && (
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 font-mono">
                  <span>HTTP {svc.status || "—"}</span>
                  {svc.ok && svc.ms != null && <span>{svc.ms} ms</span>}
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Internal SSE services */}
        {liveServices.length > 0 && (
          <>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Internal Services <span className="text-green-500 font-normal normal-case">(live)</span>
            </h2>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100 mb-10">
              {liveServices.map((svc) => {
                const meta = SERVICE_META[svc.name] || { label: svc.name, desc: "", icon: "🔧" };
                return (
                  <div key={svc.name} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{meta.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{meta.label}</p>
                        <p className="text-xs text-gray-400">{meta.desc}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      svc.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {svc.ok ? `OK · ${svc.status}` : `DOWN · ${svc.status || "timeout"}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <p>Auto-refreshes every 30 seconds · Powered by BrainSAIT Ecosystem v2.0</p>
          <p>
            Incidents & maintenance:{" "}
            <a href="mailto:ops@brainsait.de" className="underline hover:text-gray-600">ops@brainsait.de</a>
          </p>
        </div>
      </div>
    </div>
  );
}

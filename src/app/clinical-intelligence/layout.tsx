"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";
import { stitchViews } from "./components";

export default function ClinicalIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentView = pathname.split("/").pop();
  const isHub = pathname === "/clinical-intelligence";

  return (
    <div className="min-h-screen stitch-bg stitch-body">
      <div className="flex h-screen pt-[70px]">
        <aside className="hidden lg:flex flex-col w-64 border-r border-[#e2e8f0] bg-white/80 backdrop-blur-xl shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-[#e2e8f0]">
            <Link
              href="/clinical-intelligence"
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0052cc] to-[#7000ff] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0b1c30] leading-tight">Clinical Intelligence</p>
                <p className="text-[10px] text-[#64748b] tracking-wider uppercase">Stitch Design System</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {stitchViews.map((view) => {
              const active = currentView === view.id && !isHub;
              return (
                <Link
                  key={view.id}
                  href={`/clinical-intelligence/${view.id}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    active
                      ? "bg-[#0052cc]/10 text-[#0052cc] font-semibold stitch-nav-active"
                      : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0b1c30]"
                  }`}
                >
                  <view.icon className="w-4 h-4 shrink-0" style={{ color: active ? view.color : undefined }} />
                  <span className="truncate">{view.label}</span>
                  {active && <div className="w-1.5 h-1.5 rounded-full ml-auto" style={{ backgroundColor: view.color }} />}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#e2e8f0]">
            <Link
              href="/clinical-intelligence"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isHub ? "text-[#0052cc] bg-[#0052cc]/5" : "text-[#64748b] hover:text-[#0b1c30] hover:bg-[#f1f5f9]"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              All Views
            </Link>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

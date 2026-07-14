"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { viewMap, stitchViews } from "../components";

export default function StitchViewPage() {
  const params = useParams();
  const viewId = params.viewId as string;
  const view = viewMap[viewId];

  if (!view) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8">
        <div className="text-center max-w-md">
          <p className="text-6xl font-extrabold text-[#e2e8f0] mb-4">?</p>
          <h2 className="text-xl font-bold text-[#0b1c30] mb-2">Unknown View</h2>
          <p className="text-sm text-[#64748b] mb-6">
            &quot;{viewId}&quot; is not a recognized Clinical Intelligence view.
          </p>
          <Link
            href="/clinical-intelligence"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0052cc] text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
          >
            <Home className="w-4 h-4" /> Back to Hub
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = stitchViews.findIndex((v) => v.id === viewId);
  const prev = currentIndex > 0 ? stitchViews[currentIndex - 1] : null;
  const next = currentIndex < stitchViews.length - 1 ? stitchViews[currentIndex + 1] : null;

  return (
    <div className="min-h-full flex flex-col">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#e2e8f0] px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/clinical-intelligence"
            className="flex items-center gap-1.5 text-xs font-medium text-[#64748b] hover:text-[#0b1c30] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Hub
          </Link>
          <div className="w-px h-4 bg-[#e2e8f0]" />
          <div className="flex items-center gap-2">
            <view.icon className="w-4 h-4" style={{ color: view.color }} />
            <span className="text-sm font-bold text-[#0b1c30]">{view.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {prev && (
            <Link
              href={`/clinical-intelligence/${prev.id}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0b1c30] transition-all"
            >
              <ArrowLeft className="w-3 h-3" /> {prev.label}
            </Link>
          )}
          {next && (
            <Link
              href={`/clinical-intelligence/${next.id}`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0b1c30] transition-all"
            >
              {next.label} <ArrowLeft className="w-3 h-3 rotate-180" />
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1">
        <view.component />
      </div>
    </div>
  );
}

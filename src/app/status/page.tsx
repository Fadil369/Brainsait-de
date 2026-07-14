import { Metadata } from "next";
import { StatusDashboard } from "./StatusDashboard";
import { NphiesDashboard } from "@/components/NphiesDashboard";

export const metadata: Metadata = {
  title: "System Status — BrainSAIT",
  description: "Real-time health of the BrainSAIT Health Exchange ecosystem on brainsait.de.",
};

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] pt-[70px]">
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
        <StatusDashboard />
        <NphiesDashboard />
      </div>
    </div>
  );
}

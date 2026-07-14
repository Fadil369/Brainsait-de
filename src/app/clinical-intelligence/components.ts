import {
  LayoutDashboard, Bot, Store, Cpu, Code2, MessageSquare,
  ShieldCheck, Server, FileSearch, Building2, TrendingUp,
  Wallet, ClipboardCheck, Puzzle, Users, type LucideIcon,
} from "lucide-react";

import {
  StitchDashboard,
  StitchCopilot,
  StitchMarketplace,
  StitchAIAgentStore,
  StitchDeveloperConsole,
  StitchMessagingHub,
  StitchComplianceCenter,
  StitchDataResidencyHub,
  StitchResearchHub,
  StitchOrganizationProfile,
  StitchRevenueAnalytics,
  StitchPayoutConfig,
  StitchProjectBidding,
  StitchIntegrationSettings,
  StitchUserManagement,
} from "@/components/stitch";

export interface StitchView {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  component: React.ComponentType;
  color: string;
}

export const stitchViews: StitchView[] = [
  { id: "dashboard",          label: "Dashboard",          desc: "AI-powered health exchange home with personalized matches",      icon: LayoutDashboard, component: StitchDashboard,          color: "#0052cc" },
  { id: "copilot",            label: "AI Copilot",         desc: "Conversational healthcare AI with tool integration",             icon: Bot,             component: StitchCopilot,            color: "#7000ff" },
  { id: "marketplace",        label: "Marketplace",        desc: "Browse products, services, and healthcare solutions",             icon: Store,           component: StitchMarketplace,        color: "#0d9488" },
  { id: "ai-agent-store",     label: "AI Agent Store",     desc: "Discover and deploy healthcare AI agents",                        icon: Cpu,             component: StitchAIAgentStore,       color: "#7000ff" },
  { id: "developer-console",  label: "Developer Console",  desc: "API management, keys, quotas, and endpoint monitoring",           icon: Code2,           component: StitchDeveloperConsole,   color: "#059669" },
  { id: "messaging-hub",      label: "Messaging Hub",      desc: "Unified inbox for providers, support, and system alerts",          icon: MessageSquare,   component: StitchMessagingHub,       color: "#2563eb" },
  { id: "compliance-center",  label: "Compliance Center",  desc: "Regulatory dashboard with audit trails and security scores",      icon: ShieldCheck,     component: StitchComplianceCenter,   color: "#b8963e" },
  { id: "data-residency",     label: "Data Residency",     desc: "Regional server health and data sovereignty monitoring (RTL)",    icon: Server,          component: StitchDataResidencyHub,   color: "#0891b2" },
  { id: "research-hub",       label: "Research Hub",       desc: "Clinical trials, publications, and grant discovery",               icon: FileSearch,      component: StitchResearchHub,        color: "#6366f1" },
  { id: "organization",       label: "Organization",       desc: "Healthcare provider profiles and credential management",          icon: Building2,       component: StitchOrganizationProfile,color: "#0d9488" },
  { id: "revenue-analytics",  label: "Revenue Analytics",  desc: "Revenue tracking, payouts, and financial trends",                 icon: TrendingUp,      component: StitchRevenueAnalytics,   color: "#059669" },
  { id: "payout-config",      label: "Payout Config",      desc: "Wallet, payout schedules, and bank account management (RTL)",     icon: Wallet,          component: StitchPayoutConfig,       color: "#ca8a04" },
  { id: "project-bidding",    label: "Project Bidding",    desc: "Submit proposals and manage healthcare project bids",             icon: ClipboardCheck,  component: StitchProjectBidding,     color: "#dc2626" },
  { id: "integrations",       label: "Integrations",       desc: "EHR/EMR connections, webhooks, and system sync status",          icon: Puzzle,          component: StitchIntegrationSettings,color: "#7c3aed" },
  { id: "user-management",    label: "User Management",    desc: "Role-based access control, sessions, and security policies",      icon: Users,           component: StitchUserManagement,     color: "#2563eb" },
];

export const viewMap = Object.fromEntries(
  stitchViews.map((v) => [v.id, v])
) as Record<string, StitchView>;

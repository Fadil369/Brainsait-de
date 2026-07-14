import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "Challenge Title", key: "title", type: "text" as const, placeholder: "e.g. Reducing patient no-show rates in outpatient clinics", required: true },
  { label: "Challenge Description", key: "description", type: "textarea" as const, placeholder: "Describe the problem, the context, constraints, and what a successful solution would achieve.", required: true },
  { label: "Category", key: "category", type: "select" as const, options: ["Clinical Operations", "Patient Experience", "Revenue Cycle", "AI & Automation", "Compliance", "Workforce", "Data & Analytics", "Other"], required: true },
  { label: "Prize / Reward", key: "prize", type: "text" as const, placeholder: "e.g. SAR 50,000 + implementation contract", required: false },
  { label: "Deadline", key: "deadline", type: "text" as const, placeholder: "e.g. September 30, 2026", required: true },
  { label: "Organisation", key: "org", type: "text" as const, placeholder: "Your organisation name", required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "innovation@hospital.sa", required: true },
];

export default function NewChallengePage() {
  return (
    <NewMarketplaceForm
      title="Post an Innovation Challenge"
      description="Crowdsource solutions to your toughest healthcare problems. Engage AI startups, researchers, and innovators across Saudi Arabia."
      fields={FIELDS}
      submitLabel="Publish Challenge"
      backHref="/marketplace/challenges"
      badge="New Challenge"
      badgeColor="#7c3aed"
      collection="challenges"
    />
  );
}

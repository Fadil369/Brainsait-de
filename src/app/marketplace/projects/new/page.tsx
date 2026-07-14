import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "Project Title", key: "title", type: "text" as const, placeholder: "e.g. NPHIES Gateway Integration for 5 Hospital Network", required: true },
  { label: "Project Description", key: "description", type: "textarea" as const, placeholder: "Describe the project scope, deliverables, timeline, and team composition.", required: true },
  { label: "Project Type", key: "type", type: "select" as const, options: ["Implementation", "Consulting", "Development", "Training", "Auditing", "Research", "Other"], required: true },
  { label: "Budget (SAR)", key: "budget", type: "select" as const, options: ["Under SAR 50,000", "SAR 50,000 – 200,000", "SAR 200,000 – 1M", "SAR 1M+", "To be discussed"], required: true },
  { label: "Timeline", key: "timeline", type: "text" as const, placeholder: "e.g. 3 months from contract signing", required: true },
  { label: "Organisation", key: "org", type: "text" as const, placeholder: "Client organisation name", required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "pm@company.sa", required: true },
];

export default function NewProjectPage() {
  return (
    <NewMarketplaceForm
      title="Post a Project"
      description="Collaborative healthcare delivery projects. Connect with implementation partners, consultants, and technology providers."
      fields={FIELDS}
      submitLabel="Post Project"
      backHref="/marketplace/projects"
      badge="New Project"
      badgeColor="#0d9488"
      collection="projects"
    />
  );
}

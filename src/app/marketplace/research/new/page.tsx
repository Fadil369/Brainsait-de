import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "Research Title", key: "title", type: "text" as const, placeholder: "e.g. AI-assisted radiology diagnosis in Saudi hospitals", required: true },
  { label: "Research Description", key: "description", type: "textarea" as const, placeholder: "Describe the research scope, objectives, methodology, and expected outcomes.", required: true },
  { label: "Research Type", key: "type", type: "select" as const, options: ["Clinical Trial", "Observational Study", "Technology Validation", "Public Health Research", "AI/ML Research", "Policy Research", "Other"], required: true },
  { label: "Institution", key: "org", type: "text" as const, placeholder: "University or research institution name", required: true },
  { label: "IRB/Ethics Approval", key: "ethics", type: "select" as const, options: ["Approved", "Pending", "Not yet submitted", "Not required"], required: true },
  { label: "Collaboration Needed", key: "collab", type: "select" as const, options: ["Clinical partners", "Data access", "Technical expertise", "Funding", "All of the above", "Other"], required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "pi@university.edu.sa", required: true },
];

export default function NewResearchPage() {
  return (
    <NewMarketplaceForm
      title="Publish Research"
      description="Share your clinical or academic research and connect with collaboration partners, data providers, and funding bodies across Saudi healthcare."
      fields={FIELDS}
      submitLabel="Submit Research"
      backHref="/marketplace/research"
      badge="New Research"
      badgeColor="#7c3aed"
      collection="projects"
    />
  );
}

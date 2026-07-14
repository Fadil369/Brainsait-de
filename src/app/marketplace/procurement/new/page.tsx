import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "Tender / RFP Title", key: "title", type: "text" as const, placeholder: "e.g. Hospital Information System Replacement", required: true },
  { label: "Tender Description", key: "description", type: "textarea" as const, placeholder: "Describe the scope of procurement, technical requirements, and evaluation criteria.", required: true },
  { label: "Category", key: "category", type: "select" as const, options: ["EHR / HIS", "Medical Devices", "IT Infrastructure", "Cybersecurity", "AI & Analytics", "Integration Services", "Consulting", "Other"], required: true },
  { label: "Procurement Value", key: "value", type: "select" as const, options: ["Under SAR 1M", "SAR 1M – 10M", "SAR 10M – 50M", "SAR 50M – 100M", "SAR 100M+"], required: true },
  { label: "Submission Deadline", key: "deadline", type: "text" as const, placeholder: "e.g. August 30, 2026", required: true },
  { label: "Organisation", key: "org", type: "text" as const, placeholder: "Issuing organisation name", required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "procurement@hospital.sa", required: true },
];

export default function NewProcurementPage() {
  return (
    <NewMarketplaceForm
      title="Publish Tender / RFP"
      description="Formal procurement requests from Saudi healthcare organisations. Reach verified vendors pre-qualified in healthcare technology."
      fields={FIELDS}
      submitLabel="Publish Tender"
      backHref="/marketplace/procurement"
      badge="New Tender"
      badgeColor="#b8963e"
      collection="projects"
    />
  );
}

import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "API Product Name", key: "title", type: "text" as const, placeholder: "e.g. NPHIES Eligibility Check API", required: true },
  { label: "API Description", key: "description", type: "textarea" as const, placeholder: "Describe what the API does, the endpoints available, data formats, and use cases.", required: true },
  { label: "API Standard", key: "standard", type: "select" as const, options: ["FHIR R4", "FHIR STU3", "HL7 v2", "HL7 v3", "REST (Custom)", "GraphQL", "Other"], required: true },
  { label: "Category", key: "category", type: "select" as const, options: ["Eligibility", "Claims", "Prior Authorization", "Clinical Data", "Scheduling", "Billing", "Provider Directory", "Other"], required: true },
  { label: "Documentation URL", key: "docs", type: "url" as const, placeholder: "https://api.example.com/docs", required: false },
  { label: "Organisation", key: "org", type: "text" as const, placeholder: "Your company name", required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "api@company.sa", required: true },
];

export default function NewAPIProductPage() {
  return (
    <NewMarketplaceForm
      title="List an API Product"
      description="Share your FHIR, HL7, or REST healthcare APIs with thousands of developers and integration teams across Saudi Arabia."
      fields={FIELDS}
      submitLabel="List API"
      backHref="/marketplace/api"
      badge="New API"
      badgeColor="#0d9488"
      collection="apis"
    />
  );
}

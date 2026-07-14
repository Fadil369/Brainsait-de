import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "Dataset Name", key: "title", type: "text" as const, placeholder: "e.g. Saudi ICU Patient Outcomes Dataset (2019-2024)", required: true },
  { label: "Dataset Description", key: "description", type: "textarea" as const, placeholder: "Describe the dataset — source, size, schema, time period, and intended use cases.", required: true },
  { label: "Data Category", key: "category", type: "select" as const, options: ["Clinical Outcomes", "Claims & Billing", "Imaging", "Genomic", "Drug & Pharmacy", "Operations", "Public Health", "Synthetic / Anonymized", "Other"], required: true },
  { label: "Data Format", key: "format", type: "select" as const, options: ["FHIR Bundle", "HL7 Message", "CSV / Excel", "JSON", "Parquet", "Other"], required: true },
  { label: "Compliance", key: "compliance", type: "select" as const, options: ["PDPL Compliant", "HIPAA Compliant", "SFDA Approved", "De-identified Only", "Synthetic Data", "Uncertain"], required: true },
  { label: "Access Type", key: "access", type: "select" as const, options: ["Free", "Subscription", "Per-query", "Application required", "Partnership only"], required: true },
  { label: "Organisation", key: "org", type: "text" as const, placeholder: "Data provider / curator name", required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "data@research-centre.sa", required: true },
];

export default function NewDataPage() {
  return (
    <NewMarketplaceForm
      title="List a Dataset"
      description="Share or access curated healthcare datasets for AI training, clinical research, and analytics — all compliant with Saudi data protection regulations."
      fields={FIELDS}
      submitLabel="List Dataset"
      backHref="/marketplace/data"
      badge="New Dataset"
      badgeColor="#b8963e"
      collection="data"
    />
  );
}

import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "Job Title", key: "title", type: "text" as const, placeholder: "e.g. Senior Healthcare AI Engineer", required: true },
  { label: "Job Description", key: "description", type: "textarea" as const, placeholder: "Describe the role responsibilities, required skills, and team context.", required: true },
  { label: "Employment Type", key: "type", type: "select" as const, options: ["Full-time", "Part-time", "Contract", "Internship", "Remote", "Hybrid"], required: true },
  { label: "Specialty", key: "category", type: "select" as const, options: ["Clinical AI", "Healthcare IT", "Revenue Cycle", "Integration / FHIR", "DevOps / Cloud", "Data Science", "Product Management", "Sales", "Other"], required: true },
  { label: "Location", key: "location", type: "text" as const, placeholder: "e.g. Riyadh, Saudi Arabia", required: true },
  { label: "Salary Range (SAR)", key: "salary", type: "text" as const, placeholder: "e.g. SAR 25,000 – 35,000 / month", required: false },
  { label: "Organisation", key: "org", type: "text" as const, placeholder: "Hiring organisation name", required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "hr@company.sa", required: true },
];

export default function NewJobPage() {
  return (
    <NewMarketplaceForm
      title="Post a Job"
      description="Reach Saudi Arabia's healthcare technology talent pool — from AI engineers and FHIR developers to clinical informatics specialists."
      fields={FIELDS}
      submitLabel="Post Job"
      backHref="/marketplace/jobs"
      badge="New Job"
      badgeColor="#059669"
      collection="jobs"
    />
  );
}

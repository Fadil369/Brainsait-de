import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "Need Title", key: "title", type: "text" as const, placeholder: "e.g. AI chatbot for patient appointment scheduling", required: true },
  { label: "Healthcare Challenge", key: "description", type: "textarea" as const, placeholder: "Describe the problem in detail — what are you trying to solve, what have you tried, what are the constraints?", required: true },
  { label: "Category", key: "category", type: "select" as const, options: ["Clinical AI", "Revenue Cycle", "Integration", "Patient Engagement", "Compliance", "Data & Analytics", "Telemedicine", "Cybersecurity", "Other"], required: true },
  { label: "Estimated Budget (SAR)", key: "budget", type: "select" as const, options: ["SAR 5,000 – 25,000", "SAR 25,000 – 100,000", "SAR 100,000 – 500,000", "SAR 500,000 – 1M", "SAR 1M+", "To be discussed"], required: true },
  { label: "Deadline", key: "deadline", type: "select" as const, options: ["ASAP", "Within 1 month", "Within 3 months", "Within 6 months", "Flexible"], required: true },
  { label: "Urgency", key: "urgency", type: "select" as const, options: ["Low", "Medium", "High", "Critical"], required: true },
  { label: "Organisation", key: "org", type: "text" as const, placeholder: "Your organisation name", required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "your@hospital.sa", required: true },
];

export default function NewNeedPage() {
  return (
    <NewMarketplaceForm
      title="Post a Need"
      description="Describe your healthcare challenge and receive proposals from verified AI companies, consultants, and technology providers within 24 hours."
      fields={FIELDS}
      submitLabel="Publish Need"
      backHref="/marketplace/needs"
      badge="New Need"
      badgeColor="#1a56db"
      collection="needs"
    />
  );
}

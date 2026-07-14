import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "Solution Title", key: "title", type: "text" as const, placeholder: "e.g. NPHIES Direct Gateway Integration", required: true },
  { label: "Description", key: "description", type: "textarea" as const, placeholder: "Describe your product, service, or capability — what problems does it solve and for whom?", required: true },
  { label: "Category", key: "category", type: "select" as const, options: ["Clinical AI", "Revenue Cycle", "Integration", "Patient Engagement", "Compliance", "Data & Analytics", "Telemedicine", "Cybersecurity", "Education", "Consulting", "Other"], required: true },
  { label: "Target Market", key: "market", type: "select" as const, options: ["Hospitals (Large)", "Hospitals (Medium)", "Clinics", "Laboratories", "Pharmacies", "Insurance", "Government", "Startups", "All Healthcare"], required: true },
  { label: "Pricing Model", key: "pricing", type: "select" as const, options: ["Per transaction", "Monthly subscription", "Annual license", "One-time license", "Freemium", "To be discussed"], required: true },
  { label: "Organisation", key: "org", type: "text" as const, placeholder: "Your company name", required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "sales@company.sa", required: true },
];

export default function NewOfferPage() {
  return (
    <NewMarketplaceForm
      title="Offer a Solution"
      description="Showcase your products, services, or capabilities to thousands of verified healthcare buyers across Saudi Arabia."
      fields={FIELDS}
      submitLabel="Publish Offer"
      backHref="/marketplace/offers"
      badge="New Offer"
      badgeColor="#0d9488"
      collection="offers"
    />
  );
}

import NewMarketplaceForm from "@/components/NewMarketplaceForm";

const FIELDS = [
  { label: "Equipment Name", key: "title", type: "text" as const, placeholder: "e.g. Siemens SOMATOM CT Scanner", required: true },
  { label: "Description", key: "description", type: "textarea" as const, placeholder: "Describe the equipment specifications, condition, year, and included accessories.", required: true },
  { label: "Category", key: "category", type: "select" as const, options: ["Imaging (CT/MRI/X-Ray)", "Laboratory", "Surgical", "Patient Monitoring", "ICU", "Dental", "Pharmacy", "IT Hardware", "Other"], required: true },
  { label: "Condition", key: "condition", type: "select" as const, options: ["New", "Like New", "Used - Good", "Used - Fair", "Refurbished", "For Parts"], required: true },
  { label: "Price (SAR)", key: "price", type: "text" as const, placeholder: "e.g. 450,000 or Negotiable", required: true },
  { label: "Organisation", key: "org", type: "text" as const, placeholder: "Seller / supplier name", required: true },
  { label: "Contact Email", key: "email", type: "email" as const, placeholder: "sales@supplier.sa", required: true },
];

export default function NewEquipmentPage() {
  return (
    <NewMarketplaceForm
      title="List Medical Equipment"
      description="Buy and sell medical equipment across Saudi Arabia's healthcare network. Connect with verified hospitals, clinics, and suppliers."
      fields={FIELDS}
      submitLabel="List Equipment"
      backHref="/marketplace/equipment"
      badge="New Equipment"
      badgeColor="#1a56db"
      collection="equipment"
    />
  );
}

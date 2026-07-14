"use client";

import {
  Hero,
  TrustedBySection,
  ProblemsSection,
  ProductsSection,
  ArchitectureSection,
  StatsSection,
  TestimonialsSection,
  ComplianceSection,
  EcosystemSection,
  CTASection,
} from "@/components/Sections";

export default function HomePage() {
  return (
    <>
      {/* 1. Cinematic dark hero */}
      <Hero />

      {/* 2. Trust metrics & certifications */}
      <TrustedBySection />

      {/* 3. Three challenges → outcomes */}
      <ProblemsSection />

      {/* 4. Six business unit portfolio */}
      <ProductsSection />

      {/* 5. Enterprise architecture diagram */}
      <ArchitectureSection />

      {/* 6. Live platform impact metrics */}
      <StatsSection />

      {/* 7. Customer testimonials (dark) */}
      <TestimonialsSection />

      {/* 8. Regulatory compliance coverage */}
      <ComplianceSection />

      {/* 9. AI agent ecosystem */}
      <EcosystemSection />

      {/* 10. Single demo conversion CTA */}
      <CTASection />
    </>
  );
}

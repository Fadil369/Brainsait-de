import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CopilotWidget } from "@/components/CopilotWidget";
import { AIMatchButton } from "@/components/AIMatchWidget";
import { StatsProvider } from "@/lib/platform-stats";

export const viewport: Viewport = {
  themeColor: "#0a0c10",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://brainsait.de"),
  title: {
    default: "BrainSAIT Health Exchange — Healthcare Intelligence Platform",
    template: "%s | BrainSAIT Health Exchange",
  },
  description:
    "The premium healthcare operating marketplace for Saudi Arabia and MENA. Hospitals, innovators, government, and health-tech companies connect, procure, and collaborate — powered by AI and aligned with Saudi Vision 2030.",
  keywords: [
    "healthcare marketplace", "Saudi Arabia health tech", "NPHIES integration",
    "FHIR R4", "health procurement", "Vision 2030", "AI healthcare",
    "medical equipment", "health innovation", "BrainSAIT",
    "health exchange", "MENA healthcare", "digital health KSA",
    "سوق الرعاية الصحية", "التقنية الصحية السعودية", "تكامل نفيس",
  ],
  authors: [{ name: "BrainSAIT GmbH", url: "https://brainsait.de" }],
  creator: "BrainSAIT GmbH",
  publisher: "BrainSAIT GmbH",
  openGraph: {
    title: "BrainSAIT Health Exchange — Healthcare Intelligence Platform",
    description: "The premium healthcare operating marketplace for Saudi Arabia and MENA. Post needs, find solutions, connect with verified partners — powered by AI.",
    url: "https://brainsait.de",
    siteName: "BrainSAIT Health Exchange",
    locale: "en_SA",
    alternateLocale: ["ar_SA", "en_US"],
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "BrainSAIT Health Exchange",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrainSAIT Health Exchange",
    description: "The premium healthcare marketplace for Saudi Arabia and MENA. Post needs, find solutions, connect with verified partners.",
    creator: "@brainsait",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "google-site-verification": "",
    "fb:app_id": "",
  },
  alternates: {
    languages: {
      en: "https://brainsait.de",
      "ar-SA": "https://brainsait.de/ar",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BrainSAIT Health Exchange",
  url: "https://brainsait.de",
  description:
    "The premium healthcare operating marketplace for Saudi Arabia and MENA. Hospitals, innovators, government, and health-tech companies connect, procure, and collaborate — powered by AI.",
  inLanguage: ["en", "ar"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://brainsait.de/marketplace/needs?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "BrainSAIT GmbH",
    url: "https://brainsait.de",
    logo: "https://brainsait.de/favicon.ico",
    sameAs: [
      "https://twitter.com/brainsait",
      "https://linkedin.com/company/brainsait",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://api.brainsait.de" />
        <link rel="dns-prefetch" href="https://api.brainsait.de" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <StatsProvider>
          <Navbar />
          <main className="flex-1 pt-[70px]">{children}</main>
          <Footer />
          <CopilotWidget />
          <AIMatchButton />
        </StatsProvider>
      </body>
    </html>
  );
}

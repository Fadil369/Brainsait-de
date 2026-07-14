import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BrainSAIT Health Exchange",
    short_name: "BrainSAIT",
    description: "The Healthcare Operating Marketplace for Saudi Arabia and MENA",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0c10",
    theme_color: "#0a0c10",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}

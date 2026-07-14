/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Production output settings
  output: "standalone",

  // Increase build worker timeout for large pages
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  // Environment variable whitelisting for client-side
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://brainsait.de",
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",       value: "nosniff" },
          { key: "X-Frame-Options",              value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",             value: "1; mode=block" },
          { key: "Referrer-Policy",              value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",           value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security",    value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Content-Security-Policy",      value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.brainsait.de http://127.0.0.1:58443; frame-ancestors 'self';" },
        ],
      },
    ];
  },

  async rewrites() {
    const gatewayUrl = process.env.BRAINSAIT_GATEWAY_URL || "http://localhost:58443";
    return [
      {
        source: "/api/gateway/:path*",
        destination: `${gatewayUrl}/:path*`,
      },
      {
        source: "/api/fhir/:path*",
        destination: `${process.env.FHIR_GATEWAY_URL || "http://localhost:58080"}/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/health-exchange",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

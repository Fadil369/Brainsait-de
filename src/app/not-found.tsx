import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: "5rem", fontWeight: 800, lineHeight: 1, marginBottom: "1rem", background: "linear-gradient(135deg,#1a56db,#0d9488)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem", color: "#0a0c10" }}>Page not found</h1>
        <p style={{ color: "#6b7280", lineHeight: 1.6, marginBottom: "2rem" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: "linear-gradient(135deg,#1a56db,#1241a8)", color: "white", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none" }}
          >
            ← Back to Home
          </Link>
          <Link
            href="/marketplace"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", border: "1.5px solid #e5e7eb", color: "#374151", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none" }}
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}

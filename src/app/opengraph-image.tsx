import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BrainSAIT Health Exchange";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          background: "linear-gradient(145deg, #0a0c10 0%, #0f172a 40%, #0c1a2e 70%, #0a0f1e 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(26,86,219,0.15)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "-50px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(13,148,136,0.12)",
            filter: "blur(70px)",
          }}
        />
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #1a56db, #0d9488, #b8963e)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#e9c46a", letterSpacing: "0.14em", marginBottom: 16 }}>
            BRAINSAIT HEALTH EXCHANGE
          </p>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
              marginBottom: 16,
            }}
          >
            Where Healthcare
            <br />
            <span style={{ background: "linear-gradient(135deg, #b8963e, #e9c46a, #b8963e)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
              Problems Meet
            </span>
            <br />
            Solutions.
          </h1>
          <p style={{ fontSize: 22, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0, maxWidth: 650 }}>
            The premium healthcare operating marketplace for Saudi Arabia and MENA. Powered by AI. Aligned with Vision 2030.
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 80,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {["NPHIES", "FHIR R4", "PDPL", "ISO 27001"].map((badge) => (
            <span
              key={badge}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 9999,
                padding: "4px 12px",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

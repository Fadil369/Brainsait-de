import Link from "next/link";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type Enrollment = {
  course_id: string;
  course_title: string | null;
  buyer_email: string | null;
  amount: number | null;
  currency: string | null;
  charge_id: string;
  enrolled_at: string;
};

// The access token maps 1:1 to a paid enrollment. The course viewer lives at
// /marketplace/education/<shortId>; enrollment course ids are prefixed "ecourse-".
const courseHref = (courseId: string) => `/marketplace/education/${courseId.replace(/^ecourse-/, "")}`;

async function lookup(token: string): Promise<Enrollment | null> {
  if (!/^[a-f0-9]{20,64}$/.test(token)) return null; // cheap sanity gate
  try {
    const rows = await query<Enrollment>(
      `SELECT course_id, course_title, buyer_email, amount, currency, charge_id, enrolled_at
         FROM course_enrollments WHERE access_token = $1 AND status = 'active'`,
      [token]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export default async function LearnPage({ params }: { params: { token: string } }) {
  const enrollment = await lookup(params.token);

  const shell = (children: React.ReactNode) => (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "linear-gradient(160deg, #0a0c10 0%, #10131b 55%, #171205 100%)",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#e8eaf0",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>{children}</div>
    </main>
  );

  if (!enrollment) {
    return shell(
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 16,
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 42, marginBottom: 12 }}>🔒</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>This access link isn&apos;t valid</h1>
        <p style={{ color: "#9aa0b0", fontSize: 15, lineHeight: 1.6 }}>
          The link may have expired or been mistyped. If you completed a purchase, reopen the confirmation
          message from <strong style={{ color: "#c9a84c" }}>@brainsait_bot</strong>, or contact{" "}
          <a href="mailto:support@brainsait.de" style={{ color: "#c9a84c" }}>support@brainsait.de</a>.
        </p>
      </div>
    );
  }

  const price =
    enrollment.amount != null
      ? `${enrollment.currency ?? "SAR"} ${(enrollment.amount / 100).toLocaleString("en-US")}`
      : null;
  const enrolledDate = new Date(enrollment.enrolled_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return shell(
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(201,168,76,0.28)",
        borderRadius: 18,
        padding: "40px 34px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#c9a84c",
          fontWeight: 700,
          marginBottom: 22,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0d7a7a" }} />
        Enrollment confirmed
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
        {enrollment.course_title ?? "Your course"}
      </h1>
      <p style={{ color: "#9aa0b0", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
        You have lifetime access. Pick up where you left off any time from this link.
      </p>

      <Link
        href={courseHref(enrollment.course_id)}
        style={{
          display: "block",
          textAlign: "center",
          background: "linear-gradient(180deg, #d4b968 0%, #c9a84c 100%)",
          color: "#1a1405",
          fontWeight: 800,
          fontSize: 16,
          padding: "15px 20px",
          borderRadius: 12,
          textDecoration: "none",
          marginBottom: 24,
        }}
      >
        Start learning →
      </Link>

      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "10px 18px",
          fontSize: 13.5,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 20,
          margin: 0,
        }}
      >
        <dt style={{ color: "#767c8c" }}>Enrolled</dt>
        <dd style={{ margin: 0, textAlign: "right" }}>{enrolledDate}</dd>
        {price && (
          <>
            <dt style={{ color: "#767c8c" }}>Paid</dt>
            <dd style={{ margin: 0, textAlign: "right" }}>{price}</dd>
          </>
        )}
        {enrollment.buyer_email && (
          <>
            <dt style={{ color: "#767c8c" }}>Receipt to</dt>
            <dd style={{ margin: 0, textAlign: "right" }}>{enrollment.buyer_email}</dd>
          </>
        )}
        <dt style={{ color: "#767c8c" }}>Order</dt>
        <dd style={{ margin: 0, textAlign: "right", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#9aa0b0" }}>
          {enrollment.charge_id}
        </dd>
      </dl>
    </div>
  );
}

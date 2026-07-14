import { Pool } from "pg";

// Single shared pool for the process. DATABASE_URL is injected via systemd
// EnvironmentFile (never committed). Fulfillment features (course_enrollments)
// use this; if it's unset the features degrade gracefully rather than crash.
let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  pool = new Pool({ connectionString, max: 4, connectionTimeoutMillis: 5000 });
  return pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const p = getPool();
  if (!p) throw new Error("DATABASE_URL not configured");
  const res = await p.query(text, params);
  return res.rows as T[];
}

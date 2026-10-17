export const State = {
  LIVE: 'LIVE',
  STALE: 'STALE',
  UNVERIFIED: 'UNVERIFIED',
};

const SLOT_STATES = {
  empty: { label: 'empty', tone: 'idle' },
  requested: { label: 'requested', tone: 'warn' },
  invoiced: { label: 'invoiced', tone: 'warn' },
  verifying: { label: 'verifying', tone: 'warn' },
  live: { label: 'live', tone: 'live' },
};

const REQUEST_STATES = {
  requested: { label: 'requested', tone: 'warn' },
  approved: { label: 'approved', tone: 'ok' },
  rejected: { label: 'rejected', tone: 'warn' },
  provisioned: { label: 'provisioned', tone: 'ok' },
};

// Hiring states (bpr-hiring service). A job stays open until a hire fills it;
// an application walks applied -> hired. Rejected and withdrawn are terminal.
const JOB_STATES = {
  open: { label: 'open', tone: 'ok' },
  closed: { label: 'closed', tone: 'idle' },
  filled: { label: 'filled', tone: 'live' },
  expired: { label: 'expired', tone: 'warn' },
};

const APPLICATION_STATES = {
  applied: { label: 'applied', tone: 'idle' },
  reviewing: { label: 'reviewing', tone: 'warn' },
  interview: { label: 'interview', tone: 'warn' },
  assessment: { label: 'assessment', tone: 'warn' },
  offer: { label: 'offer', tone: 'warn' },
  hired: { label: 'hired', tone: 'live' },
  rejected: { label: 'rejected', tone: 'err' },
  withdrawn: { label: 'withdrawn', tone: 'idle' },
};

const ENTITY_TABLES = {
  slot: SLOT_STATES,
  request: REQUEST_STATES,
  job: JOB_STATES,
  application: APPLICATION_STATES,
};

const VERIFICATION_KEYS = [
  'verified',
  'credentials_verified',
  'verification_state',
  'verification_rung',
  'verification_max_rung',
  'verification_label',
];

const DEFAULT_TIMEOUT_MS = 6000;

export function stateChip(entityClass, value) {
  const table = Object.prototype.hasOwnProperty.call(ENTITY_TABLES, entityClass)
    ? ENTITY_TABLES[entityClass]
    : null;
  if (!table) return null;
  const entry = Object.prototype.hasOwnProperty.call(table, value) ? table[value] : null;
  if (!entry) return null;
  return { label: entry.label, tone: entry.tone };
}

export async function getJSON(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    });
    if (!res.ok) {
      return { state: State.STALE, data: null, fetchedAt: null, error: `http_${res.status}` };
    }
    let data;
    try {
      data = await res.json();
    } catch {
      return { state: State.STALE, data: null, fetchedAt: null, error: 'invalid_json' };
    }
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      return { state: State.STALE, data: null, fetchedAt: null, error: 'unexpected_payload' };
    }
    const verifiedAxis = VERIFICATION_KEYS.some((key) =>
      Object.prototype.hasOwnProperty.call(data, key));
    return {
      state: verifiedAxis ? State.LIVE : State.UNVERIFIED,
      data,
      fetchedAt: new Date().toISOString(),
      error: null,
    };
  } catch (err) {
    const timedOut = err && err.name === 'AbortError';
    return {
      state: State.STALE,
      data: null,
      fetchedAt: null,
      error: timedOut ? 'timeout' : 'network_error',
    };
  } finally {
    clearTimeout(timer);
  }
}

export function slotStates(all) {
  const slots = Array.isArray(all) ? all : [];
  const parents = slots.filter((s) => s && s.parent_slot === null);
  const childrenByParent = new Map(parents.map((p) => [p.id, []]));
  for (const slot of slots) {
    if (!slot || slot.parent_slot === null) continue;
    const key = typeof slot.parent_slot === 'string' ? slot.parent_slot : '';
    if (!childrenByParent.has(key)) continue;
    childrenByParent.get(key).push(slot);
  }
  return parents.map((parent) => ({
    parent,
    children: childrenByParent.get(parent.id),
  }));
}
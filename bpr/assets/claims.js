const DEFAULT_MAX_RUNG = 5;

const RUNGS = [
  { rung: 0, label: 'Listed only' },
  { rung: 1, label: 'Registered, unverified' },
  { rung: 2, label: 'Identity bound' },
  { rung: 3, label: 'Licence verified' },
  { rung: 4, label: 'Institution attested' },
  { rung: 5, label: 'Signed & published' },
];

const PUBLISHING_CONSENT = new Set(['subject_acknowledged']);

function integerOr(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

function isWithheld(record) {
  return Boolean(record.subject_identity_withheld) || Boolean(record.identity_withheld);
}

// A positive consent signal, and the only one there is. A record that carries no
// consent field at all has not consented — which is not the same statement as
// having been withheld, and must not be read as permission. Absence of a signal
// is silence, and silence is not consent to publish a person.
function isPublishable(record) {
  if (isWithheld(record)) return false;
  if (record.public_profile === true) return true;
  return PUBLISHING_CONSENT.has(record.consent_source);
}

function labelFor(rung, maxRung) {
  const step = RUNGS.find((r) => r.rung === rung);
  return step ? step.label : `Rung ${rung} of ${maxRung}`;
}

export function assertClaimCeiling(record) {
  if (record === null || typeof record !== 'object') {
    throw new TypeError('assertClaimCeiling: record must be an object');
  }

  const maxRung = Math.max(integerOr(record.verification_max_rung, DEFAULT_MAX_RUNG), 0);
  const rung = Math.min(Math.max(integerOr(record.verification_rung, 0), 0), maxRung);

  // A withheld identity can never carry a verified badge, at any rung.
  const verified = maxRung > 0 && rung === maxRung && !isWithheld(record);

  let badge = 'none';
  if (verified) badge = 'verified';
  else if (rung >= 1 && isPublishable(record)) badge = 'registered';

  return {
    rung,
    maxRung,
    label: labelFor(rung, maxRung),
    verified,
    badge,
    // Fail closed, and this is the axis the whole site reads a name through.
    //
    // `granted` has to be earned by a positive consent signal; it is never the
    // fallback for a payload that merely forgot to say. GET /slots/:id/chain
    // and GET /network answer with a populated name and no consent field at
    // all, so a default of "granted" published, on those two screens alone,
    // every name the registry withholds on the other nine.
    consent: isPublishable(record) ? 'granted' : 'pending',
  };
}
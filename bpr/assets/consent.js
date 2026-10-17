// consent.js — what withholding actually took, read off the response.
//
// The load-bearing decision here is that the field list is DERIVED, never
// authored. The registry's withholdIdentity() nulls a field by matching a name
// pattern, so any list written by hand in this file would be a snapshot of one
// afternoon: the first time the worker learns a new field, that field goes dark
// on the public page while the registry keeps hiding it, and the consent screen
// would quietly under-report what a member has agreed to publish.
//
// So describeWithheld() walks whatever the registry actually returned and asks
// one question per key: is this null, and is it something the registry publishes
// regardless of consent? If yes, it is withheld — even if nobody here has heard
// of it.

import { assertClaimCeiling } from './claims.js';

// The redaction family the worker uses. Kept character-for-character in step
// with withholdIdentity() so the page's description of what is hidden matches
// what the registry will actually take. This is a description, not a filter:
// membership in this family is reported, never used to decide membership.
export const REDACTION_FAMILY =
  /name|email|phone|first|last|business|statement|note|address|city|logo|photo|bio/i;

// Fields the registry publishes whatever the subject decided. These are the
// pointer to a record, not the record's identity: an SPID is how a reader asks
// the question, and an OID is how the answer is anchored. Withholding them
// would make the record unreachable rather than private.
const SURVIVING = new Set([
  // identity of the record
  'spid', 'member_spid', 'org_spid', 'holder_spid', 'to_spid', 'from_spid',
  'oid', 'oidUrn', 'buid', 'canonical', 'arc', 'class', 'jurisdiction', 'root',
  // the consent flags themselves
  'subject_identity_withheld', 'identity_withheld', 'withheld_reason',
  'consent_source', 'public_profile',
  // verification state, which is a claim about evidence and not about a person
  'verification_rung', 'verification_max_rung', 'verification_state',
  'verification_label', 'verified', 'credentials_verified',
  'credential_verified_at',
  // lifecycle
  'status', 'trust_level', 'state', 'created_at', 'registered_at',
  'updated_at', 'expires_at', 'plan_type', 'order_id', 'membership_active',
  // bookkeeping
  'id', 'parent_slot', 'slot_id', 'withheld_count', 'total',
]);

// `subject_identity_withheld` is true when the identity is gone. It is not
// itself a hidden field — it is the flag saying so — which is why the walk
// below tests the keys and never the flag.
function survives(key) {
  return SURVIVING.has(key);
}

export function isRedactedName(key) {
  return REDACTION_FAMILY.test(String(key));
}

// Walks the response and returns the dotted path of every key whose value is
// null and which is not on the surviving list. Nested objects and objects inside
// arrays are walked too, because /partner nests the member and its slots under
// the top level and hides identity in each of them.
function collectWithheld(node, prefix, out, seen) {
  if (node === null || typeof node !== 'object') return;
  if (seen.has(node)) return;
  seen.add(node);

  if (Array.isArray(node)) {
    node.forEach((item, index) => collectWithheld(item, `${prefix}[${index}]`, out, seen));
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value === null) {
      if (!survives(key)) out.push(path);
    } else if (typeof value === 'object') {
      collectWithheld(value, path, out, seen);
    }
  }
}

// The words "why is this blank" come from the registry when it offers them, and
// are labelled by the page when it does not. `reasonSource` tells the page
// which it is holding, so it never prints a fallback sentence as though the
// registry had said it.
const DEFAULT_REASON = 'Consent has not been recorded for publication.';

export function describeWithheld(record) {
  const fields = [];
  const source = record && typeof record === 'object' ? record : {};

  collectWithheld(source, '', fields, new Set());

  const said = typeof source.withheld_reason === 'string' && source.withheld_reason.trim()
    ? source.withheld_reason.trim()
    : null;

  return {
    fields,
    reason: said || DEFAULT_REASON,
    reasonSource: said ? 'registry' : 'default',
  };
}

// One read for the whole capture screen: what is hidden, whether anything is,
// and the badge the claim ceiling allows. `withheld` comes from claims.js, the
// same call the rest of the site makes, so this screen can never disagree with
// the directory about whether a name is publishable.
export function consentState(record) {
  const source = record && typeof record === 'object' ? record : {};
  const ceiling = assertClaimCeiling(source);
  const { fields, reason, reasonSource } = describeWithheld(source);

  return {
    spid: source.spid || source.member_spid || null,
    withheld: ceiling.consent === 'pending',
    fields,
    fieldCount: fields.length,
    reason,
    reasonSource,
    consentSource: source.consent_source || null,
    publicProfile: source.public_profile === true,
    badge: ceiling.badge,
    rung: ceiling.rung,
    maxRung: ceiling.maxRung,
    // A field the redaction family would take is described as redacted; a field
    // that is merely unpopulated is not, and conflating the two would tell a
    // member their record is being hidden when it simply was never filled in.
    redacted: fields.filter((path) => isRedactedName(lastSegment(path))),
  };
}

function lastSegment(path) {
  const dot = String(path).lastIndexOf('.');
  return dot < 0 ? String(path) : String(path).slice(dot + 1);
}

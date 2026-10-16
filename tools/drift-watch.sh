#!/usr/bin/env bash
# drift-watch.sh — cron wrapper around check-drift.sh.
#
# Follows the same discipline as ops/security/verify_containment.py:
#   • always writes a status file + log
#   • alerts ONLY on a state change, so a persistently clean stack stays quiet
#   • alerts through the same local hub path auto-heal.sh uses (127.0.0.1:9600/alert)
#   • read-only with respect to the stack itself
#
# Exit 0 always (a drift is reported, not raised as a cron failure).

STACK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="$HOME/.local/state"
STATUS="$STATE_DIR/bpr-drift.json"
LOG="$STATE_DIR/bpr-drift.log"
HUB="${BPR_DRIFT_HUB:-http://127.0.0.1:9600}"

# The hub's /alert requires X-Hub-Key; without it the call 401s and the alert is
# silently dropped. Read the key from the secrets env without echoing it.
HUB_KEY=""
for envf in "$HOME/.hermes/.env" "$HOME/.hetzner.env"; do
  [ -r "$envf" ] || continue
  v=$(grep -m1 '^BRAINSAIT_HUB_KEY=' "$envf" 2>/dev/null | cut -d= -f2- | tr -d '"'"'"' \r')
  [ -n "$v" ] && HUB_KEY="$v" && break
done

mkdir -p "$STATE_DIR"

STAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
OUTPUT="$("$STACK_DIR/tools/check-drift.sh" 2>&1)"
RC=$?

# "clean" or "drift" — the value we compare against the previous run.
STATE=$([ "$RC" -eq 0 ] && echo clean || echo drift)
PREV=$(python3 - "$STATUS" <<'PY' 2>/dev/null || echo unknown
import json, sys
try:
    with open(sys.argv[1]) as fh:
        print(json.load(fh).get("state", "unknown"))
except Exception:
    print("unknown")
PY
)

{
  echo "[${STAMP}] state=${STATE} rc=${RC} prev=${PREV}"
  printf '%s\n' "$OUTPUT" | sed 's/^/    /'
} >>"$LOG"

python3 - "$STATUS" <<PY
import json, sys
json.dump({"state": "$STATE", "rc": $RC, "prev": "$PREV", "checked_at": "$STAMP"},
          open(sys.argv[1], "w"), indent=2)
PY

# Alert only on transition (first run counts as a transition, so drift is seen once).
if [ "$STATE" != "$PREV" ]; then
  SUMMARY=$(printf '%s\n' "$OUTPUT" | grep -E 'DRIFT|SKIP' | head -12)
  [ -z "$SUMMARY" ] && SUMMARY="all checks passed"
  if [ -n "$HUB_KEY" ]; then
    BODY=$(python3 - "$STATE" "$SUMMARY" <<'PY'
import json, sys
sev = "warn" if sys.argv[1] == "drift" else "info"
print(json.dumps({
    "text": f"[{sev}] bpr-stack drift: {sys.argv[1]}\n{sys.argv[2][:1000]}",
}))
PY
)
    curl -s -m 10 -X POST "${HUB}/alert" \
      -H 'Content-Type: application/json' \
      -H "X-Hub-Key: ${HUB_KEY}" \
      -d "$BODY" >/dev/null 2>&1 || true
  else
    echo "[${STAMP}] WARN: no BRAINSAIT_HUB_KEY found — alert suppressed" >>"$LOG"
  fi
fi

# Keep the log bounded.
[ -f "$LOG" ] && [ "$(wc -l <"$LOG")" -gt 2000 ] && tail -n 1000 "$LOG" >"$LOG.tmp" && mv "$LOG.tmp" "$LOG"

exit 0
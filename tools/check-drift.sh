#!/usr/bin/env bash
# check-drift.sh — read-only drift + health check for bpr-stack.
#
# Answers four questions:
#   1. Does on-disk source match what is running inside each container?
#   2. Do the ~/brainsait/ops/ copies still differ ONLY by the bind address?
#   3. Does the Coolify-generated compose still match this repo in substance?
#   4. Are all four services healthy?
#
# Makes NO changes. Exit 0 = no drift, 1 = drift or failed health check.
#
# Overridable env:
#   OPS_DIR           default $HOME/brainsait/ops
#   COOLIFY_COMPOSE   default /data/coolify/services/<uuid>/docker-compose.yml
#   COOLIFY_PROJECT   default the Coolify resource UUID (container-name suffix)

set -uo pipefail

STACK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OPS_DIR="${OPS_DIR:-$HOME/brainsait/ops}"
COOLIFY_PROJECT="${COOLIFY_PROJECT:-iqjjmcak1uqxkwpfy2wiity3}"
COOLIFY_COMPOSE="${COOLIFY_COMPOSE:-/data/coolify/services/$COOLIFY_PROJECT/docker-compose.yml}"

SERVICES=(hiring partner registry-local linkedin)
declare -A PORT=([hiring]=9640 [partner]=9641 [registry-local]=9642 [linkedin]=9643)

rc=0
ok()   { printf '  \033[32mOK\033[0m    %s\n' "$*"; }
warn() { printf '  \033[33mSKIP\033[0m  %s\n' "$*"; }
bad()  { printf '  \033[31mDRIFT\033[0m %s\n' "$*"; rc=1; }

echo "bpr-stack drift check"
echo "  stack    : $STACK_DIR"
echo "  ops      : $OPS_DIR"
echo "  coolify  : $COOLIFY_COMPOSE"
echo

# ── 1. on-disk vs running container ────────────────────────────────────────
echo "1) on-disk source vs running container"
for s in "${SERVICES[@]}"; do
  file="$STACK_DIR/services/bpr-$s.py"
  ctr="bpr-$s-$COOLIFY_PROJECT"
  [[ -f "$file" ]] || { bad "bpr-$s.py missing on disk"; continue; }
  disk=$(sha256sum "$file" | cut -c1-12)
  live=$(docker exec "$ctr" sha256sum "/app/services/bpr-$s.py" 2>/dev/null | cut -c1-12)
  if [[ -z "$live" ]]; then
    warn "bpr-$s container '$ctr' not running (disk=$disk)"
  elif [[ "$disk" == "$live" ]]; then
    ok "bpr-$s.py $disk"
  else
    bad "bpr-$s.py disk=$disk container=$live — edit here, then redeploy via Coolify"
  fi
done
echo

# ── 2. ops/ copies must differ only by bind address ────────────────────────
echo "2) ops/ copies vs this stack (bind-address-only difference expected)"
for s in "${SERVICES[@]}"; do
  mine="$STACK_DIR/services/bpr-$s.py"
  theirs="$OPS_DIR/bpr-$s/service.py"
  [[ -f "$mine" && -f "$theirs" ]] || { warn "bpr-$s: no ops copy to compare"; continue; }
  if diff -q <(sed 's/("0\.0\.0\.0", PORT)/("127.0.0.1", PORT)/' "$mine") "$theirs" >/dev/null; then
    ok "bpr-$s: ops copy differs only by bind address"
  elif diff -q "$mine" "$theirs" >/dev/null; then
    ok "bpr-$s: ops copy byte-identical"
  else
    bad "bpr-$s: ops copy has real divergence — inspect: diff $theirs $mine"
  fi
done
echo

# ── 3. Coolify compose vs this repo's compose (semantic) ────────────────────
echo "3) Coolify-generated compose vs docker-compose.yml (substance)"
# /data/coolify/services is mode 700 owned by another uid, so plain reads fail;
# fall back to a sudo -n copy (read-only, into a temp file we clean up).
CMP_SRC="$COOLIFY_COMPOSE"
CMP_TMP=""
cleanup() { [[ -n "$CMP_TMP" && -f "$CMP_TMP" ]] && rm -f "$CMP_TMP"; }
trap cleanup EXIT

if [[ ! -r "$COOLIFY_COMPOSE" ]]; then
  if CMP_TMP="$(mktemp -t bpr-coolify-compose.XXXXXX)" \
     && sudo -n cat "$COOLIFY_COMPOSE" >"$CMP_TMP" 2>/dev/null && [[ -s "$CMP_TMP" ]]; then
    CMP_SRC="$CMP_TMP"
  else
    cleanup
    warn "coolify compose not readable: $COOLIFY_COMPOSE"
  fi
fi

if [[ -n "$CMP_SRC" && -s "$CMP_SRC" ]] && ! python3 -c 'import yaml' 2>/dev/null; then
  warn "PyYAML unavailable — skipping semantic compose comparison"
elif [[ -n "$CMP_SRC" && -s "$CMP_SRC" ]]; then
  cd "$STACK_DIR" || exit 1
  COOLIFY_COMPOSE="$CMP_SRC" python3 - <<'PY'
import os, sys, yaml

MINE = "docker-compose.yml"
THEIRS = os.environ["COOLIFY_COMPOSE"]

def load(p):
    with open(p) as fh:
        return yaml.safe_load(fh) or {}

def norm(svc):
    """Reduce a service to what actually matters, dropping Coolify's additions."""
    env = {k: v for k, v in (svc.get("environment") or {}).items()
           if not k.startswith("COOLIFY_") and not k.startswith("SERVICE_NAME_")}
    return {
        "image": svc.get("image"),
        "restart": svc.get("restart"),
        "command": svc.get("command"),
        "ports": svc.get("ports"),
        "network_mode": svc.get("network_mode"),
        "environment": env,
        "healthcheck_test": (svc.get("healthcheck") or {}).get("test"),
    }

a, b = load(MINE), load(THEIRS)
bad = 0
for name in sorted(set(a.get("services", {})) | set(b.get("services", {}))):
    sa, sb = a.get("services", {}).get(name), b.get("services", {})
    sb = sb.get(name)
    if sa is None or sb is None:
        print(f"  \033[31mDRIFT\033[0m {name}: present in only one compose file")
        bad = 1
        continue
    if norm(sa) != norm(sb):
        print(f"  \033[31mDRIFT\033[0m {name}: substance differs")
        for k in norm(sa):
            if norm(sa)[k] != norm(sb).get(k):
                print(f"         {k}: repo={norm(sa)[k]!r} coolify={norm(sb).get(k)!r}")
        bad = 1
    else:
        print(f"  \033[32mOK\033[0m    {name}: substantively identical")

# Both must still attach to the braincore network (DB + n8n by name).
for name, doc in (("repo", a), ("coolify", b)):
    if "bpr" not in (doc.get("networks") or {}):
        print(f"  \033[31mDRIFT\033[0m {name}: 'bpr' network missing")
        bad = 1
sys.exit(bad)
PY
  [[ $? -ne 0 ]] && rc=1
fi
echo

# ── 4. health ──────────────────────────────────────────────────────────────
echo "4) service health (loopback GET /health)"
for s in "${SERVICES[@]}"; do
  p="${PORT[$s]}"
  if body=$(curl -fsS --max-time 5 "http://127.0.0.1:$p/health" 2>/dev/null); then
    printf '  \033[32mOK\033[0m    %-18s :%s  %s\n' "bpr-$s" "$p" "${body:0:60}"
  else
    bad "bpr-$s :$p /health unreachable"
  fi
done

echo
if [[ $rc -eq 0 ]]; then
  echo "RESULT: no drift"
else
  echo "RESULT: drift or failed health check (see DRIFT lines above)"
fi
exit $rc
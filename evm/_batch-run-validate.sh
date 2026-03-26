#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
CH_URL="${CLICKHOUSE_URL:-http://localhost:8123}"
CH_USER="${CLICKHOUSE_USER:-default}"
CH_PASS="${CLICKHOUSE_PASSWORD-}" 
SYNC_SEC="${SYNC_SEC:-480}"

chq() {
  curl -sS "${CH_URL}/?user=${CH_USER}&password=${CH_PASS}" --data-binary "$1"
}

sync_indexer() {
  local dir="$1"
  local sec="$2"
  python3 - "$dir" "$sec" <<'PY'
import os, signal, subprocess, sys, time
d, sec = sys.argv[1], int(sys.argv[2])
p = subprocess.Popen(["npm", "start"], cwd=d, stdin=subprocess.DEVNULL,
    stdout=None, stderr=None, start_new_session=True)
time.sleep(sec)
try:
    os.killpg(p.pid, signal.SIGTERM)
except (ProcessLookupError, PermissionError):
    pass
try:
    p.wait(timeout=15)
except subprocess.TimeoutExpired:
    try:
        os.killpg(p.pid, signal.SIGKILL)
    except (ProcessLookupError, PermissionError):
        pass
PY
}

run_one() {
  local dir="$1"
  local slug
  slug="$(basename "$dir")"
  [[ "$slug" =~ ^(005-morpho-v1|006-maple|man-001-uniswap-liquidity-events|001-aave-v3)$ ]] && return 0

  local dc="${dir}/docker-compose.yml"
  [[ -f "$dc" ]] || { echo "SKIP $slug: no docker-compose"; return 0; }
  local db
  db="$(grep -m1 'CLICKHOUSE_DB:' "$dc" | sed 's/.*CLICKHOUSE_DB: *//' | tr -d '\r')"
  [[ -n "$db" ]] || { echo "FAIL $slug: no CLICKHOUSE_DB"; return 1; }

  echo "======== $slug → DB=$db ========"
  cat > "${dir}/.env" <<EOF
CLICKHOUSE_URL=${CH_URL}
CLICKHOUSE_DATABASE=${db}
CLICKHOUSE_USER=${CH_USER}
CLICKHOUSE_PASSWORD=${CH_PASS}
EOF

  chq "DROP DATABASE IF EXISTS ${db}"
  chq "CREATE DATABASE IF NOT EXISTS ${db}"

  ( cd "$dir" && npm install --silent )
  echo "SYNC ${slug} (${SYNC_SEC}s cap)..."
  sync_indexer "$dir" "${SYNC_SEC}"

  ( cd "$dir" && npx tsx validate.ts )
  local vr=$?
  if [[ $vr -ne 0 ]]; then echo "VALIDATE_FAIL $slug exit=$vr"; return $vr; fi
  echo "OK $slug"
  return 0
}

export SYNC_SEC
if [[ $# -gt 0 ]]; then
  dirs=()
  for x in "$@"; do
    if [[ -d "$x" ]]; then dirs+=("$x")
    elif [[ -d "${ROOT}/${x}" ]]; then dirs+=("${ROOT}/${x}")
    else echo "Missing dir: $x"; fi
  done
else
  dirs=("${ROOT}"/[0-9]*-*)
fi
for d in "${dirs[@]}"; do
  [[ -d "$d" ]] || continue
  run_one "$d" || echo "Batch continued after failure: $d"
done

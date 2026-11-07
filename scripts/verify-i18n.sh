#!/usr/bin/env bash
# Acceptance checks for the sv/en routing. Run against a production build:
#   npm run build && npm run start &
#   bash scripts/verify-i18n.sh
# Exits non-zero on the first failing check.
set -euo pipefail

BASE=${BASE:-http://localhost:3000}
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
PASSED=0

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

ok() {
  PASSED=$((PASSED + 1))
  echo "ok   $*"
}

# Fetch a path once per run and cache body + status.
fetch() {
  local path=$1 key
  key=$(printf '%s' "$path" | shasum | cut -c1-16)
  if [ ! -f "$TMP/$key.code" ]; then
    curl -s -o "$TMP/$key.body" -w '%{http_code}' "$BASE$path" > "$TMP/$key.code"
  fi
  echo "$TMP/$key"
}

status() {
  local path=$1 want=$2 f
  f=$(fetch "$path")
  [ "$(cat "$f.code")" = "$want" ] || fail "$path → $(cat "$f.code"), want $want"
  ok "$path → $want"
}

contains() {
  local path=$1 regex=$2 f
  f=$(fetch "$path")
  grep -Eq -- "$regex" "$f.body" || fail "$path does not contain /$regex/"
  ok "$path contains /$regex/"
}

lacks() {
  local path=$1 regex=$2 f
  f=$(fetch "$path")
  if grep -Eq -- "$regex" "$f.body"; then fail "$path contains /$regex/"; fi
  ok "$path lacks /$regex/"
}

redirects() {
  local path=$1 want=$2 headers code location
  headers=$(curl -s -o /dev/null -D - "$BASE$path")
  code=$(printf '%s' "$headers" | head -1 | awk '{print $2}')
  location=$(printf '%s' "$headers" | grep -i '^location:' | head -1 | sed 's/^[Ll]ocation: *//' | tr -d '\r')
  location=${location#"$BASE"}
  [ "$code" = "308" ] || fail "$path → $code, want 308"
  [ "$location" = "$want" ] || fail "$path → Location $location, want $want"
  ok "$path → 308 $want"
}

h1_is() {
  local path=$1 want=$2 f got
  f=$(fetch "$path")
  got=$(perl -0ne 'if (/<h1[^>]*>(.*?)<\/h1>/s) { $t = $1; $t =~ s/<[^>]+>//g; $t =~ s/<!-- -->//g; $t =~ s/\s+/ /g; $t =~ s/^ | $//g; print $t }' "$f.body")
  [ "$got" = "$want" ] || fail "$path h1 is '$got', want '$want'"
  ok "$path h1 is '$want'"
}

post_status() {
  local path=$1 body=$2 want=$3 code
  code=$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -d "$body" "$BASE$path")
  [ "$code" = "$want" ] || fail "POST $path → $code, want $want"
  ok "POST $path → $want"
}

# --- Routing (Task 4) ---
status / 200
contains / '<html lang="sv"'
status '/?utm_source=google' 200
status /en 200
contains /en '<html lang="en"'
redirects /sv /
redirects /sv/x /x
redirects '/sv?x=1' '/?x=1'
for p in /finns-inte /a/b /en/finns-inte /en/a/b /hemsida /svenska /english /EN; do
  status "$p" 404
done
status /favicon.ico 200
post_status /api/contact '{}' 400

# --- Header, hero, about, work (Task 5) ---
h1_is / 'Hemsidor, webshoppar och systemen bakom. Från Göteborg.'
contains / 'om mig'
contains / 'Anlita mig'
for s in 'Hire me' 'Start a project' 'SELECTED WORK' 'No projects in this category'; do
  lacks / "$s"
done
contains /en 'Software that'
contains /en 'Hire me'

echo "All $PASSED checks passed."

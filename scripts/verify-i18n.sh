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

# --- Experience, skills, services (Task 6) ---
contains / 'Bröllopshemsida'
contains / 'Integrationer'
lacks / 'Dev advisory'
contains /en 'Dev advisory'

# --- Contact, footer, theme (Task 7) ---
contains / 'instagram\.com/_monkeysolutions'
contains / 'Göteborg, Sverige'
lacks / 'xxxxxx-xxxx'
contains /en 'Gothenburg, Sweden'
contains /en 'instagram\.com/_monkeysolutions'
# A valid body sends a real email when RESEND_API_KEY is set, so it only runs on request.
if [ "${VERIFY_SEND_EMAIL:-}" = "1" ]; then
  code=$(curl -s -o "$TMP/contact.json" -w '%{http_code}' -X POST -H 'Content-Type: application/json' \
    -d '{"name":"Verify","email":"verify@example.com","budget":"","project":"verify-i18n","lang":"sv"}' "$BASE/api/contact")
  if [ "$code" = "400" ]; then fail "POST /api/contact with valid body → 400"; fi
  if [ "$code" = "500" ] && ! grep -q 'Email service not configured' "$TMP/contact.json"; then
    fail "POST /api/contact → 500 $(cat "$TMP/contact.json")"
  fi
  ok "POST /api/contact valid body → $code"
else
  echo "skip POST /api/contact valid body (set VERIFY_SEND_EMAIL=1; sends a real email if RESEND_API_KEY is set)"
fi

# --- SEO (Task 10) ---
contains / 'rel="canonical" href="https://monkeysolutions\.se/?"'
contains /en 'rel="canonical" href="https://monkeysolutions\.se/en"'
for p in / /en; do
  contains "$p" 'hrefLang="sv-SE" href="https://monkeysolutions\.se/?"'
  contains "$p" 'hrefLang="en" href="https://monkeysolutions\.se/en"'
  contains "$p" 'hrefLang="x-default" href="https://monkeysolutions\.se/?"'
done
contains / 'property="og:locale" content="sv_SE"'
contains /en 'property="og:locale" content="en_GB"'
contains / '<title>Webbutvecklare i Göteborg – hemsidor &amp; webshoppar \| Monkey Solutions</title>'
contains / '"@type":"ProfessionalService"'
contains /sitemap.xml 'xhtml:link'
lacks /sitemap.xml 'monkeysolutions\.se/sv'
contains /robots.txt 'Sitemap: https://monkeysolutions\.se/sitemap\.xml'
og_type=$(curl -s -o /dev/null -w '%{http_code} %{content_type}' "$BASE/api/og/sv")
[ "$og_type" = "200 image/png" ] || fail "/api/og/sv → $og_type, want 200 image/png"
ok "/api/og/sv → 200 image/png"

# --- Language switch and revalidation (Task 11) ---
contains / '<a [^>]*href="/en"[^>]*hrefLang="en"[^>]*>English</a>'
contains /en '<a [^>]*href="/"[^>]*hrefLang="sv-SE"[^>]*>Svenska</a>'
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/revalidate")
[ "$code" = "401" ] || fail "POST /api/revalidate without auth → $code, want 401"
ok "POST /api/revalidate without auth → 401"
if [ -n "${CRON_SECRET:-}" ]; then
  code=$(curl -s -o /dev/null -w '%{http_code}' -X POST -H "Authorization: Bearer $CRON_SECRET" "$BASE/api/revalidate")
  [ "$code" = "200" ] || fail "POST /api/revalidate with auth → $code, want 200"
  ok "POST /api/revalidate with auth → 200"
  # Regenerated pages must still render (dynamicParams = false on [lang] turned them into cached 404s).
  for p in / /en / /en; do
    code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$p")
    [ "$code" = "200" ] || fail "$p after revalidate → $code, want 200"
  done
  ok "/ and /en still 200 after revalidate"
else
  echo "skip POST /api/revalidate with auth (CRON_SECRET not set in this shell)"
fi

# --- Swedish Sanity content (Task 9, after the migration has run) ---
if [ "${VERIFY_SV_CONTENT:-}" = "1" ]; then
  contains / 'Jag heter Daniel'
  lacks / 'Gothenburg, Sweden'
  contains / 'FULLSTACKUTVECKLARE'
  contains /en 'Gothenburg-based'
  lacks /en 'Jag heter Daniel'
else
  echo "skip Swedish Sanity content checks (set VERIFY_SV_CONTENT=1 after the translate-to-swedish migration)"
fi

echo "All $PASSED checks passed."

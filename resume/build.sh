#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$(cd "$DIR/../public" && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

render() {
  local name="$1"
  local html="$DIR/${name}.html"
  local pdf="$OUT/${name}.pdf"
  local profile
  profile="$(mktemp -d)"

  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --no-sandbox \
    --user-data-dir="$profile" \
    --no-pdf-header-footer \
    --virtual-time-budget=10000 \
    --print-to-pdf="$pdf" \
    "file://$html"

  rm -rf "$profile"
  echo "wrote $pdf"
}

render resume_en
render resume_sv

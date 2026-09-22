#!/usr/bin/env bash
# Régénère les PNG de la marque depuis scripts/logo/mark.svg (Chrome headless,
# fond transparent). Usage : bash scripts/logo/render.sh
set -e
cd "$(dirname "$0")/../.."
for spec in "48 public/images/favicon-48.png" "180 public/apple-touch-icon.png" "512 public/images/logo-uplyo-512.png"; do
  set -- $spec
  tmp=$(mktemp --suffix=.html)
  echo "<html><body style='margin:0;background:transparent'><img src='file://$PWD/scripts/logo/mark.svg' width=$1 height=$1 style='display:block'></body></html>" > "$tmp"
  google-chrome --headless=new --disable-gpu --hide-scrollbars --default-background-color=00000000 \
    --allow-file-access-from-files --window-size=$1,$1 --screenshot="$2" "file://$tmp" >/dev/null 2>&1
  rm -f "$tmp"
done

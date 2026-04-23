#!/usr/bin/env python3
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
"""
PIXELNAUTS — Validator
======================
Checks all generated metadata + images before upload to IPFS.

  python validate.py              # validates all 5,000
  python validate.py --count 20  # spot-check first 20
"""

import argparse
import json
import os
import sys
import hashlib
from pathlib import Path

from config import TOTAL_SUPPLY, IMAGES_DIR, METADATA_DIR, COLLECTION_NAME

PASS = "\033[92m✔\033[0m"
FAIL = "\033[91m✘\033[0m"
WARN = "\033[93m⚠\033[0m"

errors = []
warnings = []


def check(cond: bool, msg: str, warn: bool = False) -> bool:
    if not cond:
        (warnings if warn else errors).append(msg)
    return cond


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--count", type=int, default=TOTAL_SUPPLY)
    args = p.parse_args()
    n = min(args.count, TOTAL_SUPPLY)

    print("\n" + "-"*54)
    print(f"  {COLLECTION_NAME} - Validator  (checking {n} tokens)")
    print("-"*54 + "\n")

    hashes = {}   # image_hash → token_id  (duplicate detection)
    tier_counts = {}
    pixel_counts = []

    for token_id in range(1, n + 1):
        img_path  = os.path.join(IMAGES_DIR,   f"{token_id}.png")
        meta_path = os.path.join(METADATA_DIR, f"{token_id}.json")

        # ── File existence ────────────────────────────────────────────────────
        img_ok  = check(Path(img_path).exists(),  f"#{token_id}: missing image")
        meta_ok = check(Path(meta_path).exists(), f"#{token_id}: missing metadata")

        if not meta_ok:
            continue

        # ── JSON structure ────────────────────────────────────────────────────
        try:
            with open(meta_path) as f:
                meta = json.load(f)
        except json.JSONDecodeError as e:
            errors.append(f"#{token_id}: invalid JSON — {e}")
            continue

        check("name"        in meta, f"#{token_id}: missing 'name'")
        check("description" in meta, f"#{token_id}: missing 'description'")
        check("image"       in meta, f"#{token_id}: missing 'image'")
        check("attributes"  in meta, f"#{token_id}: missing 'attributes'")

        # ── Attributes ────────────────────────────────────────────────────────
        attrs = {a["trait_type"]: a["value"] for a in meta.get("attributes", [])}
        check("Pixel Count"   in attrs, f"#{token_id}: missing Pixel Count attribute")
        check("Pixel Density" in attrs, f"#{token_id}: missing Pixel Density attribute")
        check("Rarity"        in attrs, f"#{token_id}: missing Rarity attribute")

        px = attrs.get("Pixel Count", 0)
        check(isinstance(px, int) and 0 < px <= 4096,
              f"#{token_id}: Pixel Count out of range ({px})", warn=True)
        pixel_counts.append(px)

        tier = attrs.get("Rarity", "")
        tier_counts[tier] = tier_counts.get(tier, 0) + 1

        # ── Image integrity ───────────────────────────────────────────────────
        if img_ok:
            with open(img_path, "rb") as f:
                h = hashlib.md5(f.read()).hexdigest()
            if h in hashes:
                errors.append(f"#{token_id}: DUPLICATE of #{hashes[h]}")
            else:
                hashes[h] = token_id

        # Progress
        sys.stdout.write(f"\r  Checked {token_id}/{n} ...")
        sys.stdout.flush()

    print(f"\n\n{'━'*54}")

    # ── Summary ───────────────────────────────────────────────────────────────
    if pixel_counts:
        print(f"  Pixel Count  min={min(pixel_counts)}  max={max(pixel_counts)}  "
              f"avg={sum(pixel_counts)//len(pixel_counts)}")

    print(f"\n  Tier distribution:")
    for tier, cnt in sorted(tier_counts.items()):
        print(f"    {tier:<12} {cnt:>6}  ({cnt/n*100:.1f}%)")

    print(f"  Errors  : {len(errors)}")
    print(f"  Warnings: {len(warnings)}")

    if errors:
        print(f"\n{FAIL} ERRORS:")
        for e in errors[:20]:
            print(f"    {e}")
        if len(errors) > 20:
            print(f"    … and {len(errors)-20} more")

    if warnings:
        print(f"\n{WARN} WARNINGS:")
        for w in warnings[:10]:
            print(f"    {w}")

    print(f"\n{'━'*54}")
    if not errors:
        print(f"  {PASS}  All checks passed!\n")
        sys.exit(0)
    else:
        print(f"  {FAIL}  {len(errors)} error(s) found — fix before uploading.\n")
        sys.exit(1)


if __name__ == "__main__":
    main()

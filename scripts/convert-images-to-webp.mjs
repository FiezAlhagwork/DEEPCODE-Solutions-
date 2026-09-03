#!/usr/bin/env node
// scripts/convert-images-to-webp.mjs
//
// Converts raster images in /public to sibling .webp files with sharp,
// resizing oversized sources down to display-driven caps, and prints a
// before/after size report. Idempotent — safe to re-run when new images
// are added later (skips files whose .webp sibling already exists unless
// --force is passed).
//
// Usage:
//   node scripts/convert-images-to-webp.mjs             # convert + report
//   node scripts/convert-images-to-webp.mjs --dry-run    # report only, write nothing
//   node scripts/convert-images-to-webp.mjs --force      # re-encode even if .webp exists

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");

// Favicon / apple-touch-icon sources — NEVER convert these. WebP support for
// <link rel="icon"> / apple-touch-icon is inconsistent on older Safari/iOS,
// and these files are already tiny, so there's nothing to gain.
const EXCLUDE = new Set([
  "photo_2026-05-24_12-23-18.jpg",
  "icon-dark-32x32.png",
  "icon-light-32x32.png",
]);

// Per-file-pattern resize cap + webp encode settings, most-specific first.
// maxWidth is a ceiling only: `fit: "inside"` + `withoutEnlargement: true`
// means smaller sources are never upscaled and aspect ratio is preserved.
const RULES = [
  {
    name: "team-photo", // full-bleed portrait cutouts, rendered at ~250-900px CSS width max
    test: (f) => /^(eegweg|egwegg4|gegrgeg|rgrrhrh)\.png$/i.test(f),
    maxWidth: 1000,
    webp: { quality: 82, alphaQuality: 95, effort: 6 },
  },
  {
    name: "project-showcase", // landscape cards, object-cover fill, ~1200px physical max
    test: (f) => /^Gemini_Generated_Image_.*\.png$/i.test(f),
    maxWidth: 1200,
    webp: { quality: 82, alphaQuality: 90, effort: 6 },
  },
  {
    name: "decorative-ellipse", // CSS blur(80-100px) glow shapes, already small
    test: (f) => /^Ellipse\d+\.png$/i.test(f),
    maxWidth: 640,
    webp: { quality: 85, alphaQuality: 100, effort: 6 },
  },
  {
    name: "about-icon", // rendered at 220-280px CSS, source already 300x300
    test: (f) => /^mingcute_safety-certificate-line\.png$/i.test(f),
    maxWidth: 320,
    webp: { quality: 90, alphaQuality: 100, effort: 6 },
  },
  {
    name: "grid-pattern",
    test: (f) => /^grid-pattern\.png$/i.test(f),
    maxWidth: 512,
    webp: { quality: 88, alphaQuality: 100, effort: 6 },
  },
  {
    // catch-all: shadcn placeholder boilerplate + any future unclassified raster
    name: "default",
    test: () => true,
    maxWidth: 800,
    webp: { quality: 82, alphaQuality: 90, effort: 6 },
  },
];

const pickRule = (fileName) => RULES.find((r) => r.test(fileName));
const fmtKB = (bytes) => (bytes / 1024).toFixed(1) + "KB";

async function convertOne(fileName, { dryRun, force }) {
  const srcPath = path.join(PUBLIC_DIR, fileName);
  const destName = fileName.replace(/\.(png|jpe?g)$/i, ".webp");
  const destPath = path.join(PUBLIC_DIR, destName);

  if (!force) {
    try {
      await stat(destPath);
      return { fileName, skipped: true, reason: "webp already exists (use --force to re-encode)" };
    } catch {
      /* doesn't exist yet — proceed */
    }
  }

  const rule = pickRule(fileName);
  const srcStat = await stat(srcPath);
  const meta = await sharp(srcPath).metadata();

  const pipeline = sharp(srcPath)
    .resize({ width: rule.maxWidth, withoutEnlargement: true, fit: "inside" })
    .webp(rule.webp);

  const info = dryRun
    ? (await pipeline.toBuffer({ resolveWithObject: true })).info
    : await pipeline.toFile(destPath);

  return {
    fileName,
    rule: rule.name,
    srcBytes: srcStat.size,
    outBytes: info.size,
    srcDims: `${meta.width}x${meta.height}`,
    outDims: `${info.width}x${info.height}`,
    skipped: false,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  const entries = await readdir(PUBLIC_DIR);
  const targets = entries.filter((f) => /\.(png|jpe?g)$/i.test(f) && !EXCLUDE.has(f));

  if (targets.length === 0) {
    console.log("No convertible raster images found in /public.");
    return;
  }

  console.log(`Converting ${targets.length} image(s)${dryRun ? " (dry run)" : ""}...\n`);

  let totalSrc = 0;
  let totalOut = 0;

  for (const file of targets) {
    const r = await convertOne(file, { dryRun, force });
    if (r.skipped) {
      console.log(`SKIP  ${r.fileName} - ${r.reason}`);
      continue;
    }
    totalSrc += r.srcBytes;
    totalOut += r.outBytes;
    const saved = (100 * (1 - r.outBytes / r.srcBytes)).toFixed(1);
    console.log(
      `${r.fileName.padEnd(45)} [${r.rule}]  ${r.srcDims} ${fmtKB(r.srcBytes)} -> ${r.outDims} ${fmtKB(r.outBytes)}  (-${saved}%)`
    );
  }

  console.log("\n----------------------------------------");
  console.log(`Total before: ${fmtKB(totalSrc)}`);
  console.log(`Total after:  ${fmtKB(totalOut)}`);
  console.log(`Total saved:  ${fmtKB(totalSrc - totalOut)} (${(100 * (1 - totalOut / totalSrc)).toFixed(1)}%)`);
  if (dryRun) console.log("\n(dry run - no files were written)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

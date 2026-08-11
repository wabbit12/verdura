#!/usr/bin/env node
/**
 * Resize + convert plant cutouts and hero background to WebP variants.
 * Usage: node scripts/optimize-images.mjs
 *
 * Plants (from PNG with alpha):
 *   {name}.webp        max 960w  (display / 2x)
 *   {name}-480.webp    480w
 *   {name}-thumb.webp  144w
 *   {name}.png         recompressed max 960w fallback
 *
 * Hero background:
 *   hero-bg.webp       1600w
 *   hero-bg-800.webp   800w
 *   hero-bg.jpg        recompressed 1600w fallback
 */

import { readdir, mkdir, access, rename, unlink } from "node:fs/promises";
import { join, resolve, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

async function writeReplace(pipeline, dest) {
  const tmp = `${dest}.tmp${extname(dest)}`;
  const info = await pipeline.toFile(tmp);
  try {
    await unlink(dest);
  } catch {
    /* dest may not exist yet */
  }
  await rename(tmp, dest);
  return info;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dirname, "../public/assets");
const PLANTS = join(ASSETS, "plants");
const PLANT_MAX = 960;
const PLANT_SM = 480;
const PLANT_THUMB = 144;
const HERO_MAX = 1600;
const HERO_SM = 800;

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function optimizePlant(file) {
  const name = basename(file, extname(file));
  const src = join(PLANTS, file);
  // Buffer first so we can safely overwrite the source PNG afterward
  const buffer = await sharp(src).rotate().ensureAlpha().toBuffer();
  const meta = await sharp(buffer).metadata();
  const width = meta.width ?? PLANT_MAX;
  const base = () => sharp(buffer);

  const webp960 = await base()
    .resize({ width: Math.min(width, PLANT_MAX), withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(join(PLANTS, `${name}.webp`));

  const webp480 = await base()
    .resize({ width: Math.min(width, PLANT_SM), withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(join(PLANTS, `${name}-480.webp`));

  const thumb = await base()
    .resize({ width: Math.min(width, PLANT_THUMB), withoutEnlargement: true })
    .webp({ quality: 75, alphaQuality: 85, effort: 6 })
    .toFile(join(PLANTS, `${name}-thumb.webp`));

  const png = await writeReplace(
    base()
      .resize({ width: Math.min(width, PLANT_MAX), withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: false }),
    join(PLANTS, `${name}.png`),
  );

  console.log(
    `✓ plants/${name}: webp ${fmtKb(webp960.size)} / ${fmtKb(webp480.size)} / thumb ${fmtKb(thumb.size)} | png ${fmtKb(png.size)}`,
  );
}

async function optimizeHeroBg() {
  const src = join(ASSETS, "hero-bg.jpg");
  if (!(await exists(src))) {
    console.warn("skip hero-bg.jpg (missing)");
    return;
  }

  const buffer = await sharp(src).rotate().toBuffer();
  const meta = await sharp(buffer).metadata();
  const width = meta.width ?? HERO_MAX;
  const base = () => sharp(buffer);

  const webp1600 = await base()
    .resize({ width: Math.min(width, HERO_MAX), withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toFile(join(ASSETS, "hero-bg.webp"));

  const webp800 = await base()
    .resize({ width: Math.min(width, HERO_SM), withoutEnlargement: true })
    .webp({ quality: 70, effort: 6 })
    .toFile(join(ASSETS, "hero-bg-800.webp"));

  const jpg = await writeReplace(
    base()
      .resize({ width: Math.min(width, HERO_MAX), withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true }),
    join(ASSETS, "hero-bg.jpg"),
  );

  console.log(
    `✓ hero-bg: webp ${fmtKb(webp1600.size)} / ${fmtKb(webp800.size)} | jpg ${fmtKb(jpg.size)}`,
  );
}

async function main() {
  await mkdir(PLANTS, { recursive: true });

  const plants = (await readdir(PLANTS)).filter(
    (f) => f.endsWith(".png") && !f.includes("_with-bg"),
  );

  console.log(`Optimizing ${plants.length} plant PNGs…\n`);
  for (const file of plants) {
    await optimizePlant(file);
  }

  console.log("");
  await optimizeHeroBg();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

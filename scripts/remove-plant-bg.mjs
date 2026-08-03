#!/usr/bin/env node
/**
 * Remove dark/black studio backgrounds from plants in public/assets/plants.
 * Usage: node scripts/remove-plant-bg.mjs
 */

import { mkdir, access, copyFile, readdir } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLANTS = resolve(__dirname, "../public/assets/plants");
const BACKUP = resolve(__dirname, "../public/assets/plants/_with-bg");

function alphaForPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const sat = max === 0 ? 0 : (max - min) / max;

  if (lum < 28) return 0;
  if (lum < 48 && sat < 0.45) return 0;
  if (lum < 62 && g >= r - 8 && g >= b - 8 && sat < 0.55) {
    return Math.round(((lum - 48) / 14) * 255);
  }
  if (lum < 78 && sat < 0.35) {
    return Math.round(Math.max(0, ((lum - 55) / 23) * 220));
  }
  return 255;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function processFile(name) {
  const src = join(PLANTS, name);
  const backupPath = join(BACKUP, name);

  if (!(await exists(backupPath))) {
    await copyFile(src, backupPath);
  }

  const { data, info } = await sharp(backupPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    out[i + 3] = Math.min(
      out[i + 3],
      alphaForPixel(out[i], out[i + 1], out[i + 2]),
    );
  }

  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(src);

  console.log(`✓ plants/${name}`);
}

async function main() {
  await mkdir(BACKUP, { recursive: true });
  const files = (await readdir(PLANTS)).filter((f) => f.endsWith(".png"));
  for (const name of files) await processFile(name);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

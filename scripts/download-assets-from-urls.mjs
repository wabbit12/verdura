#!/usr/bin/env node
/**
 * Bootstrap download using short-lived Figma MCP asset URLs.
 * Prefer `download-assets.mjs` with FIGMA_TOKEN for a durable re-fetch.
 *
 * Usage:
 *   node scripts/download-assets-from-urls.mjs
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/assets");
const URLS_PATH = resolve(__dirname, "mcp-asset-urls.json");

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

async function main() {
  const entries = JSON.parse(await readFile(URLS_PATH, "utf8"));
  await mkdir(OUT_DIR, { recursive: true });
  const index = {};

  for (const { name, url, ext } of entries) {
    const filename = `${name}.${ext}`;
    const dest = join(OUT_DIR, filename);
    try {
      const bytes = await downloadFile(url, dest);
      index[name] = `/assets/${filename}`;
      console.log(`✓ ${filename} (${(bytes / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.warn(`⚠ ${filename}: ${err.message}`);
    }
  }

  await writeFile(
    join(OUT_DIR, "index.json"),
    JSON.stringify(index, null, 2) + "\n",
  );
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

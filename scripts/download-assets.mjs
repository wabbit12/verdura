#!/usr/bin/env node
/**
 * Download Figma assets for the Planto portfolio locally.
 *
 * Usage:
 *   FIGMA_TOKEN=figd_xxx node scripts/download-assets.mjs
 *   # or with a .env / PowerShell:
 *   $env:FIGMA_TOKEN="figd_xxx"; node scripts/download-assets.mjs
 *
 * Optional:
 *   OUT_DIR=public/assets   (default)
 *   MANIFEST=scripts/assets-manifest.json
 *
 * Get a personal access token: https://www.figma.com/developers/api#access-tokens
 */

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TOKEN = process.env.FIGMA_TOKEN || process.env.FIGMA_ACCESS_TOKEN;
const OUT_DIR = resolve(ROOT, process.env.OUT_DIR || "public/assets");
const MANIFEST_PATH = resolve(
  ROOT,
  process.env.MANIFEST || "scripts/assets-manifest.json",
);

if (!TOKEN) {
  console.error(
    "Missing FIGMA_TOKEN. Create one at https://www.figma.com/developers/api#access-tokens",
  );
  process.exit(1);
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText} — ${body}`);
  }
  return res.json();
}

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function exportBatch(fileKey, assets) {
  // Group by format+scale so we can batch API calls
  const groups = new Map();
  for (const asset of assets) {
    const key = `${asset.format}|${asset.scale ?? 1}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(asset);
  }

  const urlMap = new Map();

  for (const [key, group] of groups) {
    const [format, scale] = key.split("|");
    for (const batch of chunk(group, 20)) {
      const ids = batch.map((a) => a.id).join(",");
      const api = new URL(`https://api.figma.com/v1/images/${fileKey}`);
      api.searchParams.set("ids", ids);
      api.searchParams.set("format", format);
      api.searchParams.set("scale", scale);
      console.log(`Requesting ${batch.length} ${format}@${scale}x exports…`);
      const data = await fetchJson(api.toString());
      if (data.err) throw new Error(String(data.err));
      for (const [id, url] of Object.entries(data.images || {})) {
        urlMap.set(id, url);
      }
    }
  }

  return urlMap;
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  const { fileKey, assets } = manifest;

  await mkdir(OUT_DIR, { recursive: true });
  console.log(`File: ${fileKey}`);
  console.log(`Output: ${OUT_DIR}`);
  console.log(`Assets: ${assets.length}\n`);

  const urlMap = await exportBatch(fileKey, assets);
  const index = {};

  for (const asset of assets) {
    const url = urlMap.get(asset.id);
    if (!url) {
      console.warn(`⚠ No export URL for ${asset.name} (${asset.id})`);
      continue;
    }
    const ext = asset.format === "jpg" ? "jpg" : asset.format;
    const filename = `${asset.name}.${ext}`;
    const dest = join(OUT_DIR, filename);
    const bytes = await downloadFile(url, dest);
    index[asset.name] = `/assets/${filename}`;
    console.log(`✓ ${filename} (${(bytes / 1024).toFixed(1)} KB)`);
  }

  const indexPath = join(OUT_DIR, "index.json");
  await writeFile(indexPath, JSON.stringify(index, null, 2) + "\n");
  console.log(`\nWrote ${indexPath}`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

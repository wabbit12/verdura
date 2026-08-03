# Verdura. — House Plants

Interactive recreation of the [Figma Interactive Portfolio Website](https://www.figma.com/design/dSsS4Xy7WwHyRXsaA3bdo0/Interactive-Portfolio-Website--Figma-UI-Design-Tutorial-for-Beginners-%7C-Step-by-Step-Guide--Community-?node-id=3-2) community file.

## Stack

- Vite + React + TypeScript
- Framer Motion (section reveals, cart drawer, O2 carousel)
- Local Figma-exported assets in `public/assets`

## Run

```bash
npm install
npm run dev
```

## Download assets from Figma

Assets are already in `public/assets`. To re-export from Figma with a durable API token:

1. Create a token at https://www.figma.com/developers/api#access-tokens
2. Export node IDs listed in `scripts/assets-manifest.json`:

```bash
# PowerShell
$env:FIGMA_TOKEN="figd_xxx"
npm run assets:download
```

```bash
# bash
FIGMA_TOKEN=figd_xxx npm run assets:download
```

Optional bootstrap (short-lived MCP URLs in `scripts/mcp-asset-urls.json`):

```bash
npm run assets:from-urls
```

## Interactions

- Sticky header with Plants Type dropdown + mobile menu
- Search modal (filters catalog, add to cart)
- Shopping bag drawer with qty controls
- Buy Now / bag buttons add products to cart
- Our Best O2 carousel with prev/next + dots
- Newsletter subscribe validation
- Smooth section anchors and hover motion

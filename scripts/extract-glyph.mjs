// Script to download Noto Sans Tamil and extract the "அ" glyph path
// Run: node scripts/extract-glyph.mjs

import { readFileSync, writeFileSync } from "fs";
import { createWriteStream } from "fs";
import { get } from "https";
import opentype from "opentype.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Noto Sans Tamil - Regular - direct Google Fonts static URL
const FONT_URL =
  "https://fonts.gstatic.com/s/notosanstamil/v30/ieVc2YhhAh6JzQNZmAWR4CQNZM4vOGxvEd4JhFE.woff2";
const FONT_PATH = join(__dirname, "NotoSansTamil-Regular.ttf");

async function downloadFont(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const request = (u, redirects = 0) => {
      if (redirects > 5) { reject(new Error("Too many redirects")); return; }
      get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          request(res.headers.location, redirects + 1);
          return;
        }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      }).on("error", reject);
    };
    request(url);
  });
}

// Direct TTF from Noto fonts GitHub (raw)
const TTF_URL =
  "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSansTamil/NotoSansTamil-Regular.ttf";

async function main() {
  console.log("Downloading Noto Sans Tamil font…");
  await downloadFont(TTF_URL, FONT_PATH);
  console.log("Font downloaded. Extracting glyph…");

  const fontBuffer = readFileSync(FONT_PATH);
  const font = opentype.parse(fontBuffer.buffer);
  const unitsPerEm = font.unitsPerEm;

  // Get the glyph for அ (U+0B85)
  const glyph = font.charToGlyph("\u0B85");
  if (!glyph || glyph.index === 0) {
    console.error("Glyph not found! The font may not support Tamil.");
    process.exit(1);
  }

  // Render at 200px size, flip Y (SVG coordinate system)
  const fontSize = 200;
  const scale = fontSize / unitsPerEm;
  const ascender = font.ascender * scale;

  const path = glyph.getPath(0, ascender, fontSize);
  const svgPath = path.toSVG(2);

  // Extract the d="..." attribute value
  const match = svgPath.match(/d="([^"]+)"/);
  if (!match) {
    console.error("Could not extract path data.");
    process.exit(1);
  }

  const pathData = match[1];
  console.log("\n=== SVG path for அ ===\n");
  console.log(pathData);
  console.log("\n=====================\n");

  writeFileSync(join(__dirname, "glyph-a.txt"), pathData, "utf8");
  console.log("Path saved to scripts/glyph-a.txt");
}

main().catch(console.error);

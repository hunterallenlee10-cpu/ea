/**
 * Tiny blurred previews for every photo in content/photos.ts (next/image placeholder="blur").
 * Each is a ~16px-wide JPEG as a data URL, well under 1 KB, so the page shows the photo's colours
 * instantly instead of a blank box while the full image loads.
 * Output: content/photo-blur.json. Run after adding photos: npx tsx scripts/photo-blur.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { PHOTOS } from "../content/photos";

(async () => {
  const out: Record<string, string> = {};
  for (const p of PHOTOS) {
    const buf = await sharp(path.join("public", p.src)).resize(16).blur(0.6).jpeg({ quality: 50 }).toBuffer();
    out[p.id] = `data:image/jpeg;base64,${buf.toString("base64")}`;
  }
  fs.writeFileSync("content/photo-blur.json", JSON.stringify(out, null, 1) + "\n");
  const sizes = Object.values(out).map((s) => s.length);
  console.log(`${sizes.length} previews, largest ${Math.max(...sizes)} chars, total ${Math.round(sizes.reduce((a, b) => a + b, 0) / 1024)} KB`);
})();

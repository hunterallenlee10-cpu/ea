/**
 * Phase 1: download the original images from the live site's Duda CDN.
 * Duda serves resized copies like .../multi/opt/NAME-1920w.jpeg; the original lives at .../multi/NAME.jpeg.
 * Output: audit/images-original/* (git-ignored) and audit/images.json (manifest, committed).
 * Run: npx tsx scripts/audit/download-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const inv = JSON.parse(fs.readFileSync("audit/inventory.json", "utf8")) as Record<string, any>;
const OUT = "audit/images-original";
fs.mkdirSync(OUT, { recursive: true });

const toOriginal = (u: string) => {
  const url = new URL(u.replace(/^\/\//, "https://"));
  url.hostname = url.hostname.replace(/^l?irp\./, "irp.");
  url.pathname = url.pathname.replace("/opt/", "/").replace(/-\d+[wh](\.\w+)$/, "$1");
  url.search = "";
  return url.href;
};

type Entry = { original: string; seenAs: Set<string>; pages: Set<string>; alts: Set<string> };
const all = new Map<string, Entry>();
const add = (src: string, page: string, alt?: string | null) => {
  if (!/cdn-website\.com\/d29ca128/.test(src)) return;
  const o = toOriginal(src);
  if (!all.has(o)) all.set(o, { original: o, seenAs: new Set(), pages: new Set(), alts: new Set() });
  const e = all.get(o)!;
  e.seenAs.add(src);
  e.pages.add(page);
  if (alt) e.alts.add(alt);
};

for (const [p, d] of Object.entries(inv)) {
  for (const i of d.images ?? []) {
    add(i.src, p, i.alt);
    for (const s of (i.srcset ?? "").split(",")) if (s.trim()) add(new URL(s.trim().split(/\s+/)[0], d.url).href, p, i.alt);
  }
  for (const b of d.bgImages ?? []) add(b, p);
  if (d.og?.["og:image"]) add(d.og["og:image"], p);
}

async function get(url: string) {
  const r = await fetch(url);
  if (!r.ok) return null;
  return Buffer.from(await r.arrayBuffer());
}

async function main() {
  const manifest: any[] = [];
  for (const e of all.values()) {
    const name = decodeURIComponent(e.original.split("/").pop()!).replace(/[^\w.\-()]+/g, "_");
    const file = path.join(OUT, name);
    let source = e.original;
    let buf: Buffer | null = fs.existsSync(file) ? fs.readFileSync(file) : await get(e.original);
    if (!buf) {
      // Fall back to the largest copy we saw.
      const fallback = [...e.seenAs].sort((a, b) => (parseInt(b.match(/-(\d+)w\./)?.[1] ?? "0") - parseInt(a.match(/-(\d+)w\./)?.[1] ?? "0")))[0];
      source = fallback.replace(/^\/\//, "https://");
      buf = await get(source);
    }
    if (!buf) {
      manifest.push({ original: e.original, error: "not downloadable", pages: [...e.pages] });
      continue;
    }
    fs.writeFileSync(file, buf);
    let meta: { width?: number; height?: number; format?: string } = {};
    try {
      meta = await sharp(buf).metadata();
    } catch {}
    manifest.push({
      file: name,
      original: e.original,
      downloadedFrom: source,
      bytes: buf.length,
      width: meta.width,
      height: meta.height,
      format: meta.format,
      pages: [...e.pages].sort(),
      alts: [...e.alts],
    });
    process.stdout.write(".");
  }
  manifest.sort((a, b) => (b.pages?.length ?? 0) - (a.pages?.length ?? 0));
  fs.writeFileSync("audit/images.json", JSON.stringify(manifest, null, 2));
  console.log(`\n${manifest.length} images, ${manifest.filter((m) => m.error).length} failed`);
}
main();

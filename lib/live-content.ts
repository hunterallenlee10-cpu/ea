import fs from "node:fs";
import path from "node:path";

// Reads the live page content captured in Phase 1 (content/live/*.json). Server-only.
export type Block =
  | { t: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; text: string }
  | { t: "p"; text: string; html: string }
  | { t: "li"; text: string; html: string }
  | { t: "button"; text: string; href: string | null }
  | { t: "img"; src: string; alt: string | null }
  | { t: "faq"; q: string; a: { text: string; html: string }[] };

const slugFor = (p: string) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "__"));

export function liveBlocks(livePath: string): Block[] {
  const file = path.join(process.cwd(), "content/live", `${slugFor(livePath)}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8")).blocks as Block[];
}

const level = (b: Block) => (/^h[1-6]$/.test(b.t) ? Number(b.t[1]) : 99);
const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

/** Blocks after the heading that starts with `heading`, up to the next heading of the same or higher level. */
export function sectionAfter(blocks: Block[], heading: string): Block[] {
  const i = blocks.findIndex((b) => "text" in b && level(b) < 99 && norm(b.text).startsWith(norm(heading)));
  if (i < 0) throw new Error(`Heading not found in live content: ${heading}`);
  const lv = level(blocks[i]);
  const out: Block[] = [];
  for (const b of blocks.slice(i + 1)) {
    if (level(b) <= lv) break;
    out.push(b);
  }
  return out;
}

export const paragraphs = (bs: Block[]) => bs.filter((b): b is Extract<Block, { t: "p" }> => b.t === "p");
export const listItems = (bs: Block[]) => bs.filter((b): b is Extract<Block, { t: "li" }> => b.t === "li");
export const faqs = (bs: Block[]) => bs.filter((b): b is Extract<Block, { t: "faq" }> => b.t === "faq");
export const headingText = (bs: Block[], t: "h1" | "h2" | "h3") =>
  bs.filter((b) => b.t === t).map((b) => (b as { text: string }).text);

/** Live process steps ("Step 1: …" h3 + following paragraph). */
export function processSteps(blocks: Block[]) {
  const steps: { title: string; body: string }[] = [];
  blocks.forEach((b, i) => {
    if (b.t === "h3" && /^Step \d/.test(b.text)) {
      const next = blocks[i + 1];
      steps.push({ title: b.text.replace(/^Step \d+:\s*/, ""), body: next?.t === "p" ? next.text : "" });
    }
  });
  return steps;
}

/** Live testimonials: an h3 name followed by a quoted paragraph. */
export function liveTestimonials(blocks: Block[]) {
  const out: { name: string; text: string }[] = [];
  blocks.forEach((b, i) => {
    const next = blocks[i + 1];
    if (b.t === "h3" && next?.t === "p" && /^[“"]/.test(next.text)) {
      out.push({ name: b.text, text: next.text.replace(/^[“"]|[”"]$/g, "") });
    }
  });
  return out;
}

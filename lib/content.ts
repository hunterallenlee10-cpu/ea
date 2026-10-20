import fs from "node:fs";
import path from "node:path";
import type { Node, PageContent } from "./content-types";
import { POST_PATHS } from "./live-urls";

// Server-only loaders for the typed content files built by scripts/build-content.ts.
const ROOT = path.join(process.cwd(), "content");
const folderFor = (p: string) =>
  ["pages", "services", "cities", "posts"].find((f) => fs.existsSync(path.join(ROOT, f, `${slugFor(p)}.json`)));
const slugFor = (p: string) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "__"));
const cache = new Map<string, PageContent>();

export function getPage(p: string): PageContent {
  if (cache.has(p)) return cache.get(p)!;
  const folder = folderFor(p);
  if (!folder) throw new Error(`No content for ${p}`);
  const c = JSON.parse(fs.readFileSync(path.join(ROOT, folder, `${slugFor(p)}.json`), "utf8")) as PageContent;
  cache.set(p, c);
  return c;
}

/** Posts, newest first (live publish dates). */
export function getPosts(): PageContent[] {
  return POST_PATHS.map((p) => getPage(p)).sort((a, b) => (b.post!.published > a.post!.published ? 1 : -1));
}

export const POSTS_PER_PAGE = 9;
export const blogPageCount = () => Math.ceil(POST_PATHS.length / POSTS_PER_PAGE);

/** Nodes before the first h2: the page's intro. */
export function splitIntro(nodes: Node[]) {
  const i = nodes.findIndex((n) => n.t === "h2");
  return i < 0 ? { intro: nodes, rest: [] as Node[] } : { intro: nodes.slice(0, i), rest: nodes.slice(i) };
}

/** Group nodes into sections, one per h2. */
export function sections(nodes: Node[]) {
  const out: { heading: string | null; nodes: Node[] }[] = [];
  for (const n of nodes) {
    if (n.t === "h2") out.push({ heading: n.text, nodes: [] });
    else {
      if (!out.length) out.push({ heading: null, nodes: [] });
      out[out.length - 1].nodes.push(n);
    }
  }
  return out;
}

/** Plain text of the first paragraph (for excerpts). */
export const firstText = (nodes: Node[]) => (nodes.find((n) => n.t === "p") as { text: string } | undefined)?.text ?? "";

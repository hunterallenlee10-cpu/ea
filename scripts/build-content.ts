/**
 * Phase 3: turn the captured live pages (content/live/*.json + audit/inventory.json) into typed,
 * cleaned content files. Text stays word for word except for the fixes KICKSTART section 6 asks for;
 * every fix applied to a page is listed in its `fixes` array so it can be reviewed.
 *
 * Output: content/{pages,services,cities,posts}/<slug>.json
 * Run:    npx tsx scripts/build-content.ts
 */
import fs from "node:fs";
import path from "node:path";
import type { Block } from "../lib/live-content";
import type { Inline, Kind, Node, PageContent } from "../lib/content-types";
import { ALL_LIVE_PATHS, CITY_PATHS, CORE_PATHS, LEGACY_REDIRECTS, POST_PATHS, SERVICE_SLUGS, SITE_ORIGIN } from "../lib/live-urls";
import { PHOTOS } from "../content/photos";

const inv = JSON.parse(fs.readFileSync("audit/inventory.json", "utf8")) as Record<string, any>;
const sitemapXml = fs.readFileSync("audit/live-sitemap.xml", "utf8");
const lastmods = new Map<string, string>();
for (const m of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>/g)) {
  lastmods.set(m[1].replace(SITE_ORIGIN, "") || "/", m[2]);
}

const slugFor = (p: string) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "__"));
const kindOf = (p: string): Kind =>
  (CORE_PATHS as readonly string[]).includes(p)
    ? "core"
    : SERVICE_SLUGS.some((s) => `/${s}` === p)
      ? "service"
      : CITY_PATHS.includes(p)
        ? "city"
        : (POST_PATHS as readonly string[]).includes(p)
          ? "post"
          : "other";
const folder: Record<Kind, string> = { core: "pages", other: "pages", service: "services", city: "cities", post: "posts" };

const POST_TITLES = new Set<string>();
for (const p of POST_PATHS) {
  const lines = (inv[p].innerText as string).split("\n").map((s) => s.trim()).filter(Boolean);
  POST_TITLES.add(lines[lines.indexOf("Call") + 1]);
}

// --- text fixes (section 6 "Fix site-wide" + rule-3 business name) ---------------------------------
function fixText(s: string, fixes: Set<string>): string {
  let out = s;
  const rules: [RegExp, string, string][] = [
    [/\bSnohmish\b/g, "Snohomish", 'Typo "Snohmish" → "Snohomish"'],
    [/keep the Eastside of colorful/g, "keep the Eastside colorful", '"keep the Eastside of colorful" → "keep the Eastside colorful"'],
    [/\bE&(?:amp;)?A Pro Painters\b/g, "EA Pro Painters", 'Business name "E&A Pro Painters" → "EA Pro Painters"'],
    [/\bE&(?:amp;)?A Pro Painting\b/g, "EA Pro Painters", 'Business name "E&A Pro Painting" → "EA Pro Painters"'],
    [/\bEA Pro Painting\b(?! (?:llc|LLC))/g, "EA Pro Painters", 'Business name "EA Pro Painting" → "EA Pro Painters"'],
  ];
  for (const [re, rep, note] of rules) {
    if (re.test(out)) {
      out = out.replace(re, rep);
      fixes.add(note);
    }
  }
  return out;
}

// --- links ------------------------------------------------------------------------------------------
function fixHref(href: string, fixes: Set<string>): string | null {
  const h = href.trim();
  if (!h || h === "#" || h.startsWith("javascript:")) return null;
  if (/my\.duda\.co/i.test(h)) {
    fixes.add("Removed broken my.duda.co link (text kept)");
    return null;
  }
  if (/^(tel|mailto):/i.test(h)) return h;
  let url: URL;
  try {
    url = new URL(h, SITE_ORIGIN);
  } catch {
    return null;
  }
  if (!/(^|\.)eapropainters\.com$/i.test(url.hostname)) return h; // external, unchanged
  let p = url.pathname.replace(/\/+$/, "") || "/";
  const lower = p.toLowerCase();
  const final = LEGACY_REDIRECTS[lower] ?? lower;
  if (final !== p) fixes.add(`Internal link ${p} → ${final} (skips a redirect)`);
  return final + url.search + url.hash;
}

function fixHtml(html: string, fixes: Set<string>): string {
  const withLinks = html.replace(/<a href="([^"]*)">([\s\S]*?)<\/a>/g, (_, href, inner) => {
    const f = fixHref(href.replace(/&amp;/g, "&"), fixes);
    return f ? `<a href="${f}">${inner}</a>` : inner;
  });
  return fixText(withLinks, fixes);
}

// --- photos -----------------------------------------------------------------------------------------
const photoFor = (src: string) => {
  const base = decodeURIComponent(src.split("/").pop() ?? "")
    .replace(/-\d+[wh](\.\w+)$/, "$1")
    .replace(/[^\w.\-()]+/g, "_");
  return PHOTOS.find((p) => p.liveFile === base)?.id ?? null;
};

const isEstimateLabel = (s: string) => /estimate|quote/i.test(s);

// --- main transform ---------------------------------------------------------------------------------
function build(p: string): PageContent {
  const d = inv[p];
  const kind = kindOf(p);
  const fixes = new Set<string>();
  let blocks: Block[] = JSON.parse(fs.readFileSync(`content/live/${slugFor(p)}.json`, "utf8")).blocks;

  // 1. Footer copied into the content area on some pages (Kirkland): cut at the footer's "Contact" heading.
  const footIdx = blocks.findIndex(
    (b, i) => b.t === "h3" && b.text === "Contact" && blocks.slice(i, i + 12).some((x) => "text" in x && x.text === "Areas We Serve"),
  );
  if (footIdx > 0) blocks = blocks.slice(0, footIdx);

  // 2. Review-widget leftovers (we show real reviews as our own section instead).
  const reviewSummaryIdx = blocks.findIndex((b) => b.t === "h5" && b.text === "Reviews Summary");
  blocks = blocks.filter((b, i) => {
    if ("text" in b && /^Reviews from our customers$/.test(b.text)) return false;
    if (b.t === "button" && /read more reviews/i.test(b.text)) return false;
    if (b.t === "p" && /^Hire a Company You Can Trust$/i.test(b.text)) return false;
    if (reviewSummaryIdx >= 0 && i >= reviewSummaryIdx && i <= reviewSummaryIdx + 3 && (b.t === "h5" || b.t === "li")) return false;
    if (b.t === "img" && !/cdn-website\.com\/d29ca128/.test(b.src)) return false;
    if (b.t === "p" && /^[⭐️\s*]+$/u.test(b.text)) return false;
    if (b.t === "button" && /^(button)?$/i.test(b.text.trim())) {
      fixes.add('Removed buttons labeled only "Button"');
      return false;
    }
    if (b.t === "button" && /^call$/i.test(b.text.trim())) return false;
    return true;
  });

  // 3. Posts: drop the related-posts widget at the end (titles of other posts as h3s).
  if (kind === "post") {
    while (blocks.length && blocks[blocks.length - 1].t === "h3" && POST_TITLES.has((blocks[blocks.length - 1] as { text: string }).text)) {
      blocks.pop();
    }
  }

  // 4. H1: exactly one.
  const lines = ((d.innerText ?? d.bodyText) as string).split("\n").map((s: string) => s.trim()).filter(Boolean);
  const postTitle = kind === "post" ? lines[lines.indexOf("Call") + 1] : null;
  let h1: string;
  const h1s = blocks.filter((b) => b.t === "h1") as { t: "h1"; text: string }[];
  if (postTitle) {
    h1 = postTitle;
    if (h1s.length === 0) fixes.add("Added the post title as the H1 (live post had none)");
    // Any live H1 inside the post body becomes an H2.
    blocks = blocks.map((b) => (b.t === "h1" ? { t: "h2", text: b.text } : b));
    if (h1s.length) fixes.add("Post body H1 demoted to H2; post title is the H1");
  } else if (h1s.length >= 1) {
    h1 = h1s[0].text;
    let seen = false;
    blocks = blocks.flatMap((b) => {
      if (b.t !== "h1") return [b];
      if (!seen) {
        seen = true;
        return [];
      }
      fixes.add("Second H1 demoted to H2");
      return [{ t: "h2", text: b.text } as Block];
    });
  } else {
    const firstH2 = blocks.findIndex((b) => b.t === "h2");
    h1 = (blocks[firstH2] as { text: string }).text;
    blocks.splice(firstH2, 1);
    fixes.add("Live H1 was the review widget heading; the page's first heading is now the H1");
  }
  h1 = fixText(h1, fixes);

  // 5. Convert blocks to nodes.
  const nodes: Node[] = [];
  const push = (n: Node) => nodes.push(n);
  const last = () => nodes[nodes.length - 1];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const next = blocks[i + 1];
    switch (b.t) {
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        // Testimonial: name heading + quoted paragraph.
        if (next?.t === "p" && /^[“"]/.test(next.text) && b.text.length < 40) {
          const item = { name: b.text.replace(/\s*-\s*\*\s*$/, "").trim(), text: next.text.replace(/^[“"]\s*|\s*[”"]$/g, "") };
          const l = last();
          if (l?.t === "testimonials") l.items.push(item);
          else push({ t: "testimonials", items: [item] });
          i++;
          break;
        }
        // Process step: "Step N: Title" + following paragraphs.
        const step = b.text.match(/^Step\s*\d+\s*[:.\-–]\s*(.+)$/i);
        if (step) {
          const body: Inline[] = [];
          while (blocks[i + 1]?.t === "p") {
            const pb = blocks[++i] as Extract<Block, { t: "p" }>;
            body.push({ text: fixText(pb.text, fixes), html: fixHtml(pb.html, fixes) });
          }
          const l = last();
          const item = { title: fixText(step[1].trim(), fixes), body };
          if (l?.t === "steps") l.items.push(item);
          else push({ t: "steps", items: [item] });
          break;
        }
        const t = b.t === "h5" || b.t === "h6" ? "h4" : b.t;
        push({ t, text: fixText(b.text, fixes) });
        break;
      }
      case "p":
        push({ t: "p", text: fixText(b.text, fixes), html: fixHtml(b.html, fixes) });
        break;
      case "li": {
        const item = { text: fixText(b.text, fixes), html: fixHtml(b.html, fixes) };
        const l = last();
        if (l?.t === "list") l.items.push(item);
        else push({ t: "list", items: [item] });
        break;
      }
      case "faq": {
        const item = { q: fixText(b.q, fixes), a: b.a.map((a) => ({ text: fixText(a.text, fixes), html: fixHtml(a.html, fixes) })) };
        const l = last();
        if (l?.t === "faqs") l.items.push(item);
        else push({ t: "faqs", items: [item] });
        break;
      }
      case "button": {
        const label = isEstimateLabel(b.text) ? "Get a Free Estimate" : b.text.trim();
        let href = b.href ? fixHref(b.href, fixes) : null;
        if (isEstimateLabel(b.text)) href = "/estimate";
        if (!href) break;
        // Never two CTAs in a row.
        const l = last();
        if (l?.t === "cta" && l.href === href) break;
        push({ t: "cta", label, href });
        break;
      }
      case "img": {
        const id = photoFor(b.src);
        if (id) {
          if (!nodes.some((n) => n.t === "photo" && n.id === id)) push({ t: "photo", id });
        } else if (/unsplash|pexels|istock|freepik|front-view|outdoor-wooden|what-is-eggshell|How-To-Clean|industrial-park|road-city|rimage|valspar|deep-green-house|drywal|CP_Office|d94046217|INTERIOR-PAINTING[13]|margarida|todd-kent|theme-photos|cameron-smith|zac-gudakov/i.test(b.src)) {
          fixes.add("Dropped stock photos (rule 7)");
        }
        break;
      }
    }
  }

  // /faqs: the live accordion is a list whose items read "Question? Answer". Split them into FAQs.
  if (p === "/faqs") {
    const out: Node[] = [];
    for (const n of nodes) {
      if (n.t === "list") {
        const items = n.items.map((it) => {
          const m = it.text.match(/^(.+?\?)\s+([\s\S]+)$/);
          return m ? { q: m[1], a: [{ text: m[2], html: it.html.replace(/^[\s\S]*?\?\s*/, "") }] } : { q: it.text, a: [] };
        });
        out.push({ t: "faqs", items });
      } else if (n.t === "h3" && out.some((o) => o.t === "faqs" && o.items.some((q) => q.q === n.text))) {
        continue; // duplicate question headings
      } else out.push(n);
    }
    nodes.splice(0, nodes.length, ...out);
  }

  // Merge neighbouring FAQ groups.
  for (let i = nodes.length - 1; i > 0; i--) {
    const a = nodes[i - 1], b = nodes[i];
    if (a.t === "faqs" && b.t === "faqs") {
      a.items.push(...b.items);
      nodes.splice(i, 1);
    }
  }

  // Drop empty headings left at the very end and trailing CTAs (the template adds its own closing CTA).
  while (nodes.length && (nodes[nodes.length - 1].t === "cta" || /^h[234]$/.test(nodes[nodes.length - 1].t))) nodes.pop();

  // --- metadata ------------------------------------------------------------------------------------
  const title: string = d.title;
  let description: string = d.metaDescription ?? "";
  let descriptionIsNew = false;
  if (!description) {
    const firstP = nodes.find((n) => n.t === "p") as { text: string } | undefined;
    const s = (firstP?.text ?? h1).replace(/\s+/g, " ");
    description = s.length <= 155 ? s : s.slice(0, s.lastIndexOf(" ", 152)) + "…";
    descriptionIsNew = true;
    fixes.add("Meta description was missing on the live page; new one written from the first paragraph");
  }
  const liveOg = d.og["og:image"] as string | undefined;
  const ogPhoto = liveOg ? photoFor(liveOg) : null;
  const fallback = PHOTOS.find((x) => x.id === "navy-home-exterior-red-front-door")!;
  const ogImage = ogPhoto ? PHOTOS.find((x) => x.id === ogPhoto)!.src : fallback.src;

  const published = d.og["article:published_time"] as string | undefined;
  return {
    path: p,
    kind,
    slug: slugFor(p),
    title,
    description,
    ...(descriptionIsNew ? { descriptionIsNew } : {}),
    og: {
      title: d.og["og:title"] ?? title,
      description: d.og["og:description"] ?? description,
      type: d.og["og:type"] ?? "website",
      image: ogImage,
      imageIsReplacement: !ogPhoto,
    },
    twitter: {
      card: d.twitter["twitter:card"] ?? "summary",
      title: d.twitter["twitter:title"] ?? title,
      description: d.twitter["twitter:description"] ?? description,
    },
    h1,
    nodes,
    ...(postTitle && published
      ? { post: { published, publishedDisplay: lines[lines.indexOf("Call") + 2] } }
      : {}),
    lastmod: lastmods.get(p) ?? null,
    fixes: [...fixes],
  };
}

for (const k of new Set(Object.values(folder))) fs.mkdirSync(path.join("content", k), { recursive: true });
const summary: Record<string, string[]> = {};
for (const p of ALL_LIVE_PATHS) {
  const c = build(p);
  const file = path.join("content", folder[c.kind], `${c.slug}.json`);
  fs.writeFileSync(file, JSON.stringify(c, null, 1) + "\n");
  summary[p] = c.fixes;
}
fs.writeFileSync("content/fixes-applied.json", JSON.stringify(summary, null, 1) + "\n");
console.log(`Built ${ALL_LIVE_PATHS.length} content files.`);

/**
 * Phase 1: read-only capture of the live Duda site.
 *
 * - Renders every section 4 URL in Chromium (Alli AI may inject SEO changes with JS).
 * - Blocks analytics/ads/conversion hosts so no real conversion ever fires (KICKSTART 2.10).
 * - /success and /welcome are fetched with plain HTTP only, never in a browser.
 * - Never submits a form, never clicks anything that sends data.
 *
 * Output: audit/inventory.json, audit/html/*.html (rendered), audit/frames/*.txt (iframe text)
 * Run:    npx tsx scripts/audit/crawl-live.ts
 */
import { chromium, type Page, type Route } from "playwright";
import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";
import { ALL_LIVE_PATHS, NOINDEX_PATHS, SITE_ORIGIN } from "../../lib/live-urls";

const OUT = path.join(process.cwd(), "audit");
fs.mkdirSync(path.join(OUT, "html"), { recursive: true });
fs.mkdirSync(path.join(OUT, "frames"), { recursive: true });

// Requests to any of these are aborted before they leave the browser.
const BLOCKED = [
  /googleadservices\.com/i,
  /googleads\.g\.doubleclick\.net/i,
  /doubleclick\.net/i,
  /google\.com\/pagead/i,
  /google\.[a-z.]+\/pagead/i,
  /google-analytics\.com/i,
  /analytics\.google\.com/i,
  /googletagmanager\.com/i,
  /clarity\.ms/i,
  /track\.hubspot\.com/i,
  /hs-analytics\.net/i,
  /hs-scripts\.com/i,
  /hs-banner\.com/i,
  /hubspot\.com\/__ptq/i,
  /facebook\.com\/tr/i,
  /connect\.facebook\.net/i,
  /bat\.bing\.com/i,
  /hsforms\.com\/submissions/i,
  /forms\.hubspot\.com\/uploads/i,
];

export const slugFor = (p: string) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "__"));

type Inventory = Record<string, unknown>;

function extract(html: string, url: string) {
  const $ = cheerio.load(html);
  const meta = (sel: string) => $(sel).attr("content") ?? null;
  const metaAll: Record<string, string> = {};
  $("meta").each((_, el) => {
    const k = $(el).attr("name") || $(el).attr("property") || $(el).attr("http-equiv");
    const v = $(el).attr("content");
    if (k && v != null) metaAll[k] = v;
  });
  const verification: Record<string, string> = {};
  for (const [k, v] of Object.entries(metaAll)) {
    if (/verif|validate|p:domain|facebook-domain|yandex|norton|msvalidate|ahrefs|pinterest/i.test(k)) verification[k] = v;
  }
  const og: Record<string, string> = {};
  const twitter: Record<string, string> = {};
  for (const [k, v] of Object.entries(metaAll)) {
    if (k.startsWith("og:") || k.startsWith("article:")) og[k] = v;
    if (k.startsWith("twitter:")) twitter[k] = v;
  }
  const jsonld: unknown[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const t = $(el).text();
    try {
      jsonld.push(JSON.parse(t));
    } catch {
      jsonld.push({ __unparsed: t });
    }
  });
  const headings = (tag: string) =>
    $(tag)
      .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
      .get()
      .filter(Boolean);

  const images: { src: string; alt: string | null; srcset?: string }[] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (!src) return;
    images.push({ src: new URL(src, url).href, alt: $(el).attr("alt") ?? null, srcset: $(el).attr("srcset") });
  });
  // Duda puts many photos in background-image styles.
  const bgImages = new Set<string>();
  $("[style*='background-image'], [data-bg]").each((_, el) => {
    const s = ($(el).attr("style") || "") + " " + ($(el).attr("data-bg") || "");
    for (const m of s.matchAll(/url\((['"]?)([^'")]+)\1\)/g)) bgImages.add(new URL(m[2], url).href);
  });

  const links: { href: string; text: string }[] = [];
  $("a[href]").each((_, el) => {
    links.push({ href: $(el).attr("href")!, text: $(el).text().replace(/\s+/g, " ").trim() });
  });
  const internalLinks = links.filter((l) => {
    try {
      const u = new URL(l.href, url);
      return u.hostname.endsWith("eapropainters.com");
    } catch {
      return false;
    }
  });

  const thirdParty = new Set<string>();
  $("script[src], iframe[src], link[href]").each((_, el) => {
    const s = $(el).attr("src") || $(el).attr("href");
    if (!s) return;
    try {
      const h = new URL(s, url).hostname;
      if (!h.endsWith("eapropainters.com")) thirdParty.add(h);
    } catch {}
  });

  // Body text without scripts/styles.
  const $body = cheerio.load(html);
  $body("script, style, noscript, svg").remove();
  const bodyText = $body("body").text().replace(/[ \t]+/g, " ").replace(/\n\s*\n+/g, "\n").trim();

  return {
    title: $("title").first().text().trim() || null,
    titleCount: $("title").length,
    metaDescription: meta('meta[name="description"]'),
    canonical: $('link[rel="canonical"]').attr("href") ?? null,
    metaRobots: meta('meta[name="robots"]'),
    h1: headings("h1"),
    h2: headings("h2"),
    h3: headings("h3"),
    og,
    twitter,
    verification,
    metaAll,
    jsonld,
    images,
    bgImages: [...bgImages],
    internalLinks,
    externalLinks: links.filter((l) => !internalLinks.includes(l)),
    thirdPartyHostsInHtml: [...thirdParty],
    bodyText,
    wordCount: bodyText.split(/\s+/).filter(Boolean).length,
  };
}

async function headInfo(url: string) {
  const r = await fetch(url, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 (EA audit; read-only)" } });
  return {
    status: r.status,
    location: r.headers.get("location"),
    xRobotsTag: r.headers.get("x-robots-tag"),
    html: r.status === 200 ? await r.text() : "",
  };
}

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
}

async function main() {
  const only = process.argv.slice(2);
  const paths = only.length ? only : ALL_LIVE_PATHS;
  const invPath = path.join(OUT, "inventory.json");
  const inventory: Inventory = fs.existsSync(invPath) ? JSON.parse(fs.readFileSync(invPath, "utf8")) : {};

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
  });
  const blockedLog = new Set<string>();

  for (const p of paths) {
    const url = SITE_ORIGIN + p;
    const slug = slugFor(p);
    process.stdout.write(`${p} ... `);
    const head = await headInfo(url);

    if ((NOINDEX_PATHS as readonly string[]).includes(p)) {
      // Plain HTTP only.
      fs.writeFileSync(path.join(OUT, "html", `${slug}.raw.html`), head.html);
      inventory[p] = { path: p, url, fetchedWith: "http", status: head.status, location: head.location, xRobotsTag: head.xRobotsTag, ...extract(head.html, url) };
      console.log(head.status);
      continue;
    }

    fs.writeFileSync(path.join(OUT, "html", `${slug}.raw.html`), head.html);
    const page = await ctx.newPage();
    const requestedHosts = new Set<string>();
    await page.route("**/*", (route: Route) => {
      const u = route.request().url();
      try {
        requestedHosts.add(new URL(u).hostname);
      } catch {}
      if (BLOCKED.some((re) => re.test(u))) {
        blockedLog.add(new URL(u).hostname);
        return route.abort();
      }
      return route.continue();
    });
    let status = 0;
    try {
      const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      status = resp?.status() ?? 0;
    } catch (e) {
      console.log("goto error", (e as Error).message);
    }
    await autoScroll(page).catch(() => {});
    await page.waitForTimeout(2500);

    const rendered = await page.content();
    fs.writeFileSync(path.join(OUT, "html", `${slug}.html`), rendered);

    // Text inside iframes (review widgets, embedded forms).
    const frames: { url: string; text: string }[] = [];
    for (const f of page.frames()) {
      if (f === page.mainFrame()) continue;
      try {
        const text = await f.evaluate(() => document.body?.innerText ?? "");
        if (text.trim()) frames.push({ url: f.url(), text });
      } catch {}
    }
    if (frames.length) fs.writeFileSync(path.join(OUT, "frames", `${slug}.json`), JSON.stringify(frames, null, 2));

    // Rendered visible text (innerText respects CSS visibility).
    const innerText = await page.evaluate(() => document.body.innerText);

    const data = extract(rendered, url);
    const rawData = extract(head.html, url);
    inventory[p] = {
      path: p,
      url,
      fetchedWith: "playwright",
      status,
      httpStatus: head.status,
      location: head.location,
      xRobotsTag: head.xRobotsTag,
      ...data,
      innerText,
      requestedHosts: [...requestedHosts].filter((h) => !h.endsWith("eapropainters.com")),
      iframes: frames.map((f) => f.url),
      // Differences between server HTML and rendered DOM reveal JS (e.g. Alli AI) rewrites.
      rawVsRendered: {
        title: rawData.title !== data.title ? { raw: rawData.title, rendered: data.title } : null,
        metaDescription:
          rawData.metaDescription !== data.metaDescription
            ? { raw: rawData.metaDescription, rendered: data.metaDescription }
            : null,
        canonical: rawData.canonical !== data.canonical ? { raw: rawData.canonical, rendered: data.canonical } : null,
        h1: JSON.stringify(rawData.h1) !== JSON.stringify(data.h1) ? { raw: rawData.h1, rendered: data.h1 } : null,
      },
    };
    console.log(status, data.title);
    await page.close();
    fs.writeFileSync(invPath, JSON.stringify(inventory, null, 2));
  }

  await browser.close();
  fs.writeFileSync(invPath, JSON.stringify(inventory, null, 2));
  fs.writeFileSync(path.join(OUT, "blocked-hosts.json"), JSON.stringify([...blockedLog].sort(), null, 2));
  console.log("done", Object.keys(inventory).length, "pages; blocked:", [...blockedLog].join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

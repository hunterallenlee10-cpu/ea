/**
 * Phase 4 QA (KICKSTART section 8). Run against a production build:
 *   npx next build && npx next start -p 3100
 *   npx tsx scripts/qa.ts http://localhost:3100 [--axe] [--lighthouse] [--mode=spec|launch]
 * Writes qa-report/report.json and qa-report/summary.md. Exits 1 if any check fails.
 */
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import { ALL_LIVE_PATHS, LEGACY_REDIRECTS, NOINDEX_PATHS, SITE_ORIGIN } from "../lib/live-urls";

const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith("http")) ?? "http://localhost:3100").replace(/\/$/, "");
const MODE = (args.find((a) => a.startsWith("--mode="))?.split("=")[1] ?? process.env.SITE_MODE ?? "spec") as "spec" | "launch";
const RUN_AXE = args.includes("--axe");
const RUN_LH = args.includes("--lighthouse");
const OUT = "qa-report";
fs.mkdirSync(OUT, { recursive: true });

const inv = JSON.parse(fs.readFileSync("audit/inventory.json", "utf8")) as Record<string, { title: string; metaDescription: string | null; verification: Record<string, string> }>;

type Result = { check: string; ok: boolean; detail?: string };
const results: Result[] = [];
const ok = (check: string, pass: boolean, detail?: string) => results.push({ check, ok: pass, detail });

// Allowed title/meta differences: values that were missing on the live site (KICKSTART section 6).
const NEW_META_ALLOWED = new Set(["/blog/step-by-step-guide-to-interior-painting", "/how-to-maintain-your-painted-surfaces-for-long-lasting-beauty"]);
const TRACKING_HOSTS = /googletagmanager|google-analytics|analytics\.google|googleadservices|googleads\.g\.doubleclick|clarity\.ms|hs-scripts|hs-analytics|track\.hubspot|connect\.facebook/;

async function get(path: string) {
  const r = await fetch(BASE + path, { redirect: "manual" });
  return { status: r.status, location: r.headers.get("location"), xrt: r.headers.get("x-robots-tag"), body: r.status === 200 ? await r.text() : "" };
}

async function main() {
  // ---- 0. Discover every page: live paths + sitemap (new pages) ---------------------------------
  const sm = await get("/sitemap.xml");
  const smLocs = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const smPaths = smLocs.map((u) => u.replace(SITE_ORIGIN, "") || "/");
  const pages = [...new Set([...ALL_LIVE_PATHS, ...smPaths])];

  // ---- 1. Every section 4 path returns 200 -------------------------------------------------------
  const html: Record<string, string> = {};
  const headers: Record<string, string | null> = {};
  for (const p of pages) {
    const r = await get(p);
    html[p] = r.body;
    headers[p] = r.xrt;
    ok(`200 ${p}`, r.status === 200, r.status === 200 ? undefined : `status ${r.status} ${r.location ?? ""}`);
  }

  // ---- 2. Redirects: one hop to a 200, query string kept -----------------------------------------
  const redirectCases: [string, string][] = [
    ...Object.entries(LEGACY_REDIRECTS),
    ["/Home", "/"],
    ["/About", "/about"],
    ["/Painting-Company/Kirkland?gclid=AbC", "/kirkland?gclid=AbC"],
    ["/about/", "/about"],
    ["/HOME-OLD?utm_source=x&utm_medium=y", "/?utm_source=x&utm_medium=y"],
    ["/Painting-Company/Bellevue/?gclid=Z1", "/painting-company/bellevue?gclid=Z1"],
  ];
  for (const [from, to] of redirectCases) {
    const r1 = await get(from);
    const loc = r1.location ? new URL(r1.location, BASE) : null;
    const target = loc ? loc.pathname + loc.search : null;
    const r2 = target ? await get(target) : null;
    const pass = [301, 308].includes(r1.status) && target === to && r2?.status === 200;
    ok(`redirect ${from} → ${to}`, pass, pass ? undefined : `got ${r1.status} → ${target} (${r2?.status})`);
  }

  // ---- 3. Per-page HTML checks -------------------------------------------------------------------
  let placeholders = 0;
  const placeholderPages: Record<string, number> = {};
  const internalLinks = new Set<string>();
  const titleDiffs: { path: string; field: string; live: string | null; now: string | null }[] = [];
  for (const p of pages) {
    const h = html[p];
    if (!h) continue;
    const $ = cheerio.load(h);
    const canonical = $('link[rel="canonical"]').attr("href") ?? "";
    const expected = SITE_ORIGIN + (p === "/" ? "" : p);
    ok(`canonical ${p}`, canonical.replace(/\/$/, "") === expected.replace(/\/$/, "") && canonical.startsWith("https://www."), canonical);
    const h1 = $("h1").length;
    ok(`one H1 ${p}`, h1 === 1, `${h1} H1`);
    ok(`no rating schema (HTML) ${p}`, !/aggregateRating|"@type":"Review"/.test(h));

    // Mode checks
    const metaRobots = $('meta[name="robots"]').attr("content") ?? "";
    const isNoindexPage = (NOINDEX_PATHS as readonly string[]).includes(p);
    if (MODE === "spec") {
      ok(`SPEC noindex header ${p}`, /noindex/.test(headers[p] ?? ""), headers[p] ?? "none");
      ok(`SPEC noindex meta ${p}`, /noindex/.test(metaRobots), metaRobots);
      ok(`SPEC banner ${p}`, h.includes("Concept by Lee Enterprises Unlimited. Not the live EA Pro Painters site."));
      ok(`SPEC no tracking tags ${p}`, !TRACKING_HOSTS.test(h) && !/GTM-T89BLP6F|45249857/.test(h));
    } else {
      ok(`LAUNCH indexing ${p}`, isNoindexPage ? /noindex/.test(metaRobots + (headers[p] ?? "")) : !/noindex/.test(metaRobots + (headers[p] ?? "")), metaRobots + " " + (headers[p] ?? ""));
      ok(`LAUNCH GTM ${p}`, h.includes("GTM-T89BLP6F"));
      ok(`LAUNCH no banner ${p}`, !h.includes("Concept by Lee Enterprises Unlimited"));
    }

    // Placeholders ([CONFIRM…] / [ERIK TO PROVIDE…] / visible <mark class="ph">)
    const visible = $("body").text();
    const n = (visible.match(/CONFIRM WITH ERIK|CONFIRM:|ERIK TO PROVIDE/g) ?? []).length;
    if (n) placeholderPages[p] = n;
    placeholders += n;

    // Title / meta parity with the live site
    const live = inv[p];
    if (live) {
      const title = $("title").text();
      const desc = $('meta[name="description"]').attr("content") ?? null;
      if (title !== live.title) titleDiffs.push({ path: p, field: "title", live: live.title, now: title });
      if ((live.metaDescription ?? null) !== desc && !(NEW_META_ALLOWED.has(p) && !live.metaDescription)) {
        titleDiffs.push({ path: p, field: "description", live: live.metaDescription, now: desc });
      }
      // Verification tags found on the live page must still be there.
      for (const [k, v] of Object.entries(live.verification ?? {})) {
        ok(`verification ${k} ${p}`, $(`meta[name="${k}"][content="${v}"], meta[property="${k}"][content="${v}"]`).length > 0);
      }
    }

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href")!;
      if (/^(tel:|mailto:|#|https?:\/\/(?!www\.eapropainters\.com))/.test(href)) return;
      const u = new URL(href, SITE_ORIGIN);
      internalLinks.add(u.pathname);
    });
  }
  ok("title/meta identical to live (except missing ones)", titleDiffs.length === 0, JSON.stringify(titleDiffs.slice(0, 5)));
  ok(`verification tags (live site had ${Object.values(inv).reduce((a, d) => a + Object.keys(d.verification ?? {}).length, 0)})`, true);
  if (MODE === "launch") ok("LAUNCH: no placeholders left", placeholders === 0, JSON.stringify(placeholderPages));

  // ---- 4. No broken internal links ---------------------------------------------------------------
  const broken: string[] = [];
  for (const l of internalLinks) {
    const r = await get(l);
    if (r.status !== 200) broken.push(`${l} → ${r.status}`);
  }
  ok(`no broken internal links (${internalLinks.size} checked)`, broken.length === 0, broken.join(", "));

  // ---- 5. Sitemap and robots ---------------------------------------------------------------------
  const indexable = ALL_LIVE_PATHS.filter((p) => !(NOINDEX_PATHS as readonly string[]).includes(p));
  const missing = indexable.filter((p) => !smPaths.includes(p));
  ok("sitemap lists every indexable live URL", missing.length === 0, missing.join(", "));
  ok("sitemap leaves out /success and /welcome", !smPaths.some((p) => (NOINDEX_PATHS as readonly string[]).includes(p)));
  ok("sitemap has no priority/changefreq", !/<priority>|<changefreq>/.test(sm.body));
  ok("sitemap uses absolute www URLs", smLocs.every((u) => u.startsWith(SITE_ORIGIN)));
  ok("sitemap includes images", /<image:loc>/.test(sm.body));
  const robots = (await get("/robots.txt")).body;
  ok("robots.txt allows crawling", /Allow: \//.test(robots) && !/Disallow: \/\s*$/m.test(robots));
  ok("robots.txt allows OAI-SearchBot and PerplexityBot", /OAI-SearchBot/.test(robots) && /PerplexityBot/.test(robots));
  ok(`robots.txt sitemap line (${MODE})`, MODE === "launch" ? /Sitemap:/.test(robots) : true);
  ok("/llms.txt", (await get("/llms.txt")).status === 200);
  ok("unknown slug is a real 404", (await get("/painting-company/duvall")).status === 404 && (await get("/not-a-page")).status === 404);

  // ---- 6. Rendered checks (Playwright): rating schema, H1, network requests ---------------------
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const axeResults: Record<string, { id: string; impact: string | null; nodes: number; help: string }[]> = {};
  const AxeBuilder = RUN_AXE ? (await import("@axe-core/playwright")).default : null;
  for (const p of pages) {
    const page = await ctx.newPage();
    const hosts = new Set<string>();
    page.on("request", (req) => hosts.add(new URL(req.url()).hostname));
    await page.goto(BASE + p, { waitUntil: "load" });
    await page.waitForTimeout(300);
    const dom = await page.content();
    ok(`no rating schema (rendered) ${p}`, !/aggregateRating/.test(dom) && !/"@type":\s*"Review"/.test(dom));
    ok(`one H1 (rendered) ${p}`, (await page.locator("h1").count()) === 1);
    if (MODE === "spec") ok(`SPEC no tracking requests ${p}`, ![...hosts].some((h) => TRACKING_HOSTS.test(h)), [...hosts].join(" "));
    if (AxeBuilder) {
      // Test what users actually see: scroll so scroll-reveal animations finish, then wait for transitions.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1300);
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
      axeResults[p] = r.violations.map((v) => ({ id: v.id, impact: v.impact ?? null, nodes: v.nodes.length, help: v.help }));
      ok(`axe ${p}`, r.violations.length === 0, r.violations.map((v) => `${v.id}(${v.nodes.length})`).join(", "));
    }
    await page.close();
  }
  await browser.close();

  // ---- 7. Lighthouse (mobile) --------------------------------------------------------------------
  const lh: Record<string, Record<string, number>> = {};
  if (RUN_LH) {
    for (const p of ["/", "/estimate", "/painting-company/bellevue", "/interior-painting"]) {
      const file = `${OUT}/lh-${p === "/" ? "home" : p.slice(1).replace(/\//g, "__")}.json`;
      const lhArgs = [
        "lighthouse",
        BASE + p,
        "--quiet",
        "--output=json",
        `--output-path=${file}`,
        "--only-categories=performance,accessibility,best-practices,seo",
        "--chrome-flags=--headless=new --no-sandbox",
        ...(MODE === "spec" ? ["--skip-audits=is-crawlable"] : []),
      ];
      // Median of 3 runs by performance score (Lighthouse's simulated metrics vary run to run).
      const runs: { score: number; json: string }[] = [];
      for (let i = 0; i < 3; i++) {
        execFileSync("npx", lhArgs, { stdio: "ignore", env: { ...process.env, CHROME_PATH: process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" } });
        const raw = fs.readFileSync(file, "utf8");
        runs.push({ score: JSON.parse(raw).categories.performance.score, json: raw });
      }
      runs.sort((a, b) => a.score - b.score);
      fs.writeFileSync(file, runs[1].json);
      const j = JSON.parse(runs[1].json);
      const s = {
        performance: Math.round(j.categories.performance.score * 100),
        accessibility: Math.round(j.categories.accessibility.score * 100),
        bestPractices: Math.round(j.categories["best-practices"].score * 100),
        seo: Math.round(j.categories.seo.score * 100),
        lcpMs: Math.round(j.audits["largest-contentful-paint"].numericValue),
        tbtMs: Math.round(j.audits["total-blocking-time"].numericValue),
        cls: Number(j.audits["cumulative-layout-shift"].numericValue.toFixed(3)),
      };
      lh[p] = s;
      ok(
        `lighthouse ${p}`,
        s.performance >= 95 && s.accessibility === 100 && s.bestPractices === 100 && s.seo === 100 && s.lcpMs <= 2500 && s.tbtMs <= 200 && s.cls <= 0.1,
        JSON.stringify(s),
      );
    }
  }

  // ---- Report ------------------------------------------------------------------------------------
  const failed = results.filter((r) => !r.ok);
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify({ base: BASE, mode: MODE, pages: pages.length, placeholders, placeholderPages, titleDiffs, lighthouse: lh, axe: axeResults, results }, null, 2));
  const groups = new Map<string, { pass: number; fail: string[] }>();
  for (const r of results) {
    const key = r.check.replace(/ \/.*$/, "").replace(/ https?:.*/, "");
    const g = groups.get(key) ?? { pass: 0, fail: [] };
    if (r.ok) g.pass++;
    else g.fail.push(`${r.check}${r.detail ? `: ${r.detail}` : ""}`);
    groups.set(key, g);
  }
  const md = [
    `# QA report (${MODE.toUpperCase()}) — ${BASE}`,
    "",
    `${pages.length} pages · ${results.length} checks · **${failed.length} failed** · ${placeholders} visible placeholders`,
    "",
    "| Check | Passed | Failed |",
    "|---|---|---|",
    ...[...groups].map(([k, g]) => `| ${k} | ${g.pass} | ${g.fail.length} |`),
    "",
    ...(Object.keys(lh).length ? ["## Lighthouse (mobile)", "", "| Page | Perf | A11y | BP | SEO | LCP ms | TBT ms | CLS |", "|---|---|---|---|---|---|---|---|", ...Object.entries(lh).map(([p, s]) => `| ${p} | ${s.performance} | ${s.accessibility} | ${s.bestPractices} | ${s.seo} | ${s.lcpMs} | ${s.tbtMs} | ${s.cls} |`), ""] : []),
    ...(failed.length ? ["## Failures", "", ...failed.map((f) => `- ${f.check}${f.detail ? `: ${f.detail}` : ""}`)] : ["All checks passed."]),
  ].join("\n");
  fs.writeFileSync(`${OUT}/summary.md`, md + "\n");
  console.log(md);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

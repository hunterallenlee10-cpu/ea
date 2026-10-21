/**
 * Smoothness check: loads pages as a phone (4x CPU slowdown, ~mobile network) and as a desktop,
 * scrolls through them like a person, and reports what makes a page feel "hitchy":
 *   - layout shift (CLS) during load AND scrolling
 *   - dropped frames while scrolling (frames over 50 ms)
 *   - long main-thread tasks (over 50 ms)
 *   - images still not loaded when they come on screen
 *   - images far bigger than their slot (wasted download + decode)
 * Usage: npx tsx scripts/smoothness.ts https://ea-lilac.vercel.app [paths...]
 */
import { chromium, type BrowserContext } from "playwright";

const [base = "http://localhost:3100", ...rest] = process.argv.slice(2);
const PATHS = rest.length ? rest : ["/", "/interior-painting", "/painting-company/bellevue", "/portfolio", "/estimate", "/blog", "/5-signs-time-to-repaint", "/about"];

const PROFILES = [
  { name: "phone", viewport: { width: 390, height: 844 }, dpr: 3, mobile: true, cpu: 4, net: { latency: 60, down: (9 * 1024 * 1024) / 8, up: (1.5 * 1024 * 1024) / 8 } },
  { name: "desktop", viewport: { width: 1440, height: 900 }, dpr: 1, mobile: false, cpu: 1, net: null },
] as const;

async function measure(ctx: BrowserContext, path: string, p: (typeof PROFILES)[number]) {
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (p.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: p.cpu });
  if (p.net) {
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: p.net.latency, downloadThroughput: p.net.down, uploadThroughput: p.net.up });
  }
  // tsx wraps functions with a __name() helper; make it exist inside the page.
  await page.addInitScript("window.__name = (f) => f");
  await page.addInitScript(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__cls = 0;
    w.__shifts = [] as string[];
    w.__long = [] as number[];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean; sources?: { node?: Node }[] })[]) {
        if (e.hadRecentInput) continue;
        w.__cls = (w.__cls as number) + e.value;
        const n = e.sources?.[0]?.node as Element | undefined;
        if (e.value > 0.005) (w.__shifts as string[]).push(`${e.value.toFixed(3)} ${n?.tagName ?? "?"}.${(n?.className?.toString?.() ?? "").slice(0, 50)}`);
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) (w.__long as number[]).push(Math.round(e.duration));
    }).observe({ type: "longtask", buffered: true });
  });
  const t0 = Date.now();
  await page.goto(base + path, { waitUntil: "load", timeout: 120000 });
  const loadMs = Date.now() - t0;
  await page.waitForTimeout(800);

  // Scroll like a person: steady wheel-style steps, measuring frame times; note images that are on screen but not loaded.
  const scroll = await page.evaluate(async () => {
    const frames: number[] = [];
    const late = new Set<string>();
    let last = performance.now();
    let running = true;
    const tick = (t: number) => {
      frames.push(t - last);
      last = t;
      if (running) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const H = document.documentElement.scrollHeight;
    // ~1,500 px/s: a quick but normal scroll (a hard flick is 3,000+).
    for (let y = 0; y < H; y += 120) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
      for (const img of Array.from(document.images)) {
        const r = img.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0 && r.width > 0 && !img.complete) late.add((img.currentSrc || img.src).split("url=")[1]?.split("&")[0] ?? img.src.slice(-40));
      }
    }
    running = false;
    window.scrollTo(0, 0);
    const slow = frames.filter((f) => f > 50);
    return { frames: frames.length, slow: slow.length, worst: Math.round(Math.max(...frames)), late: [...late] };
  });

  // Oversized images: intrinsic width vs. rendered width x device pixel ratio.
  const oversized = await page.evaluate(() =>
    Array.from(document.images)
      .filter((i) => i.complete && i.naturalWidth > 0 && i.getBoundingClientRect().width > 0 && !/\.svg/.test(i.currentSrc))
      .map((i) => ({ src: decodeURIComponent((i.currentSrc.split("url=")[1] ?? i.currentSrc).split("&")[0]).slice(-45), ratio: i.naturalWidth / (i.getBoundingClientRect().width * devicePixelRatio), nat: i.naturalWidth, shown: Math.round(i.getBoundingClientRect().width) }))
      .filter((x) => x.ratio > 1.6),
  );
  const res = await page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>;
    return { cls: Number((w.__cls as number).toFixed(3)), shifts: w.__shifts as string[], long: w.__long as number[] };
  });
  await page.close();
  return { loadMs, ...res, ...scroll, oversized };
}

(async () => {
  const b = await chromium.launch();
  let problems = 0;
  for (const p of PROFILES) {
    const ctx = await b.newContext({ viewport: p.viewport, deviceScaleFactor: p.dpr, isMobile: p.mobile, hasTouch: p.mobile });
    for (const path of PATHS) {
      const r = await measure(ctx, path, p);
      const longOver = r.long.filter((x) => x > 100);
      const flag = r.cls > 0.05 || r.slow > Math.max(3, r.frames * 0.05) || r.late.length > 0 || r.oversized.length > 0;
      if (flag) problems++;
      console.log(
        `${flag ? "✗" : "✓"} ${p.name.padEnd(7)} ${path.padEnd(30)} load ${String(r.loadMs).padStart(5)}ms · CLS ${r.cls} · long tasks ${r.long.length} (>100ms: ${longOver.length}, max ${Math.max(0, ...r.long)}ms) · slow frames ${r.slow}/${r.frames} (worst ${r.worst}ms) · late imgs ${r.late.length} · oversized ${r.oversized.length}`,
      );
      for (const s of r.shifts.slice(0, 4)) console.log("      shift", s);
      for (const l of r.late.slice(0, 4)) console.log("      late ", decodeURIComponent(l));
      for (const o of r.oversized.slice(0, 4)) console.log(`      big   ${o.src} ${o.nat}px for ${o.shown}px slot (${o.ratio.toFixed(1)}x)`);
    }
    // Click through pages like a visitor (client-side navigation) and make sure nothing stays invisible.
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "load" });
    for (const target of ["/interior-painting", "/painting-company/bellevue", "/about", "/"]) {
      await page.evaluate((t) => (document.querySelector(`a[href="${t}"]`) as HTMLAnchorElement | null)?.click(), target);
      await page.waitForURL((u) => u.pathname === target, { timeout: 30000 });
      await page.waitForTimeout(500);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 300) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      await page.waitForTimeout(800);
      const hidden = await page.evaluate(() => Array.from(document.querySelectorAll("[data-reveal]")).filter((e) => getComputedStyle(e).opacity === "0").length);
      if (hidden) problems++;
      console.log(`${hidden ? "✗" : "✓"} ${p.name.padEnd(7)} click → ${target.padEnd(22)} hidden elements after scrolling: ${hidden}`);
    }
    await page.close();
    await ctx.close();
  }
  await b.close();
  console.log(problems ? `\n${problems} page/device combinations need work` : "\nAll smooth.");
})();

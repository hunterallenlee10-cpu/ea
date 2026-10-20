// Full-page screenshots at 375px and 1440px. Usage: npx tsx scripts/screens.ts http://localhost:3100 /design-a /design-b
import { chromium } from "playwright";
import fs from "node:fs";
const [base, ...paths] = process.argv.slice(2);
const OUT = process.env.SCREENS_DIR ?? "audit/screens";
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const w of [1440, 375]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w === 375 ? 812 : 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    for (const p of paths) {
      const page = await ctx.newPage();
      await page.goto(base + p, { waitUntil: "load", timeout: 90000 });
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); } window.scrollTo(0, 0); });
      await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(500);
      const name = (p === "/" ? "home" : p.slice(1).replace(/\//g, "__")) + `-${w}`;
      await page.screenshot({ path: `${OUT}/${name}-fold.png` });
      await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
      console.log(name);
      await page.close();
    }
    await ctx.close();
  }
  await b.close();
})();

// Read-only: list the HubSpot embed's field names on /estimate and /contact. Never types, clicks or submits.
import { chromium } from "playwright";
import fs from "node:fs";
const BLOCK = /googleadservices|doubleclick|google\.com\/pagead|google-analytics|analytics\.google|googletagmanager|clarity\.ms|track\.hubspot|hs-analytics|hs-scripts|hs-banner|facebook\.com\/tr|connect\.facebook|bat\.bing|hsforms\.com\/submissions/i;
(async () => {
  const b = await chromium.launch();
  const out: Record<string, unknown> = {};
  for (const p of ["/estimate", "/contact"]) {
    const page = await b.newPage();
    await page.route("**/*", (r) => (BLOCK.test(r.request().url()) ? r.abort() : r.continue()));
    await page.goto("https://www.eapropainters.com" + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const fields: unknown[] = [];
    for (const f of page.frames()) {
      try {
        fields.push(
          ...(await f.evaluate(() =>
            Array.from(document.querySelectorAll("form input, form select, form textarea")).map((el) => {
              const e = el as HTMLInputElement;
              const lab = e.id ? document.querySelector(`label[for="${e.id}"]`)?.textContent?.trim() : null;
              return { frame: location.href.slice(0, 60), tag: e.tagName, name: e.name, type: e.type, required: e.required, label: lab, options: e.tagName === "SELECT" ? Array.from((e as unknown as HTMLSelectElement).options).map((o) => o.value) : undefined };
            }),
          )),
        );
      } catch {}
    }
    out[p] = fields;
    await page.close();
  }
  await b.close();
  fs.writeFileSync("audit/hubspot/form-fields.json", JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 1));
})();

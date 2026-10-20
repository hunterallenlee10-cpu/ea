/**
 * Turns each saved live page (audit/html/*.html) into ordered content blocks:
 * headings, paragraphs (with inline links kept), list items, buttons and images.
 * Only blocks visible at desktop width are kept (Duda duplicates mobile/desktop copies).
 * Runs offline from the saved HTML with page scripts disabled and all network blocked except CSS.
 * Output: content/live/<slug>.json
 * Run: npx tsx scripts/audit/extract-content.ts [paths...]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { ALL_LIVE_PATHS } from "../../lib/live-urls";

const slugFor = (p: string) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "__"));
fs.mkdirSync("content/live", { recursive: true });

export type Block =
  | { t: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"; text: string }
  | { t: "p"; text: string; html: string }
  | { t: "li"; text: string; html: string }
  | { t: "button"; text: string; href: string | null }
  | { t: "img"; src: string; alt: string | null }
  | { t: "faq"; q: string; a: { text: string; html: string }[] };

(async () => {
  const paths = process.argv.slice(2).length ? process.argv.slice(2) : ALL_LIVE_PATHS;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  for (const p of paths) {
    const slug = slugFor(p);
    const file = fs.existsSync(`audit/html/${slug}.html`) ? `audit/html/${slug}.html` : `audit/html/${slug}.raw.html`;
    if (!fs.existsSync(file)) continue;
    const page = await ctx.newPage();
    await page.route("**/*", (r) => {
      const t = r.request().resourceType();
      return t === "stylesheet" || t === "font" || t === "document" ? r.continue() : r.abort();
    });
    const html = fs.readFileSync(file, "utf8").replace(/<script[\s\S]*?<\/script>/gi, "");
    await page.setContent(html, { waitUntil: "load", timeout: 60000 }).catch(() => {});
    // tsx injects __name() helpers into functions; define it in the page.
    await page.evaluate("window.__name = (f) => f");
    const blocks = await page.evaluate(() => {
      const root = document.querySelector("#dm_content") ?? document.body;
      const out: any[] = [];
      const visible = (el: Element) => {
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden") return false;
        const r = (el as HTMLElement).getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      };
      const clean = (s: string) => s.replace(/ /g, " ").replace(/​|﻿/g, "").replace(/[ \t\r\n]+/g, " ").trim();
      const inlineHtml = (el: Element) => {
        const walk = (n: Node): string => {
          if (n.nodeType === 3) return (n.textContent ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);
          if (n.nodeType !== 1) return "";
          const e = n as Element;
          const inner = Array.from(e.childNodes).map(walk).join("");
          const tag = e.tagName.toLowerCase();
          if (tag === "a") return `<a href="${e.getAttribute("href") ?? ""}">${inner}</a>`;
          if (tag === "strong" || tag === "b") return inner.trim() ? `<strong>${inner}</strong>` : inner;
          if (tag === "em" || tag === "i") return inner.trim() ? `<em>${inner}</em>` : inner;
          if (tag === "br") return "<br>";
          return inner;
        };
        return clean(walk(el)).replace(/(<br>\s*)+$/, "");
      };
      const skip = (el: Element) =>
        !!el.closest('[id^="ssrWrap"], .dmFooter, footer, nav, [class*="birdeye"], form, iframe, .dmPhotoGallery .caption-container');
      const sel = '[data-element-type="ssraccordion"],h1,h2,h3,h4,h5,h6,p,li,a.dmButtonLink,img,.dmNewParagraph > div';
      for (const el of Array.from(root.querySelectorAll(sel))) {
        // FAQ accordions: answers are collapsed (hidden), so read them with textContent.
        if (el.matches('[data-element-type="ssraccordion"]')) {
          if (!visible(el)) continue;
          for (const item of Array.from(el.querySelectorAll('[data-grab="accordion-item-container"]'))) {
            const q = clean(item.querySelector('[data-grab="accordion-item-title"]')?.textContent ?? "");
            const desc = item.querySelector('[data-grab="accordion-item-desc-text"]');
            const parts = desc ? Array.from(desc.querySelectorAll("p,li")).filter((x) => !x.querySelector("p,li")) : [];
            const a = (parts.length ? parts : desc ? [desc] : [])
              .map((x) => ({ text: clean(x.textContent ?? ""), html: inlineHtml(x) }))
              .filter((x) => x.text);
            if (q) out.push({ t: "faq", q, a });
          }
          continue;
        }
        if (el.closest('[data-element-type="ssraccordion"]')) continue;
        if (skip(el) || !visible(el)) continue;
        const tag = el.tagName.toLowerCase();
        if (/^h[1-6]$/.test(tag)) {
          // A heading inside another captured heading/paragraph is handled by its parent.
          const text = clean((el as HTMLElement).innerText);
          if (text) out.push({ t: tag, text });
        } else if (tag === "p" || (tag === "div" && !el.querySelector("p,h1,h2,h3,h4,h5,h6,li,div"))) {
          if (el.closest("li") || el.querySelector("h1,h2,h3,h4,h5,h6")) continue;
          const text = clean((el as HTMLElement).innerText);
          if (text) out.push({ t: "p", text, html: inlineHtml(el) });
        } else if (tag === "li") {
          if (el.querySelector("li")) continue;
          const text = clean((el as HTMLElement).innerText);
          if (text) out.push({ t: "li", text, html: inlineHtml(el) });
        } else if (tag === "a") {
          out.push({ t: "button", text: clean((el as HTMLElement).innerText), href: el.getAttribute("href") });
        } else if (tag === "img") {
          const src = el.getAttribute("src") ?? el.getAttribute("data-src");
          if (src && !src.startsWith("data:")) out.push({ t: "img", src, alt: el.getAttribute("alt") });
        }
      }
      // Drop exact consecutive duplicates (Duda repeats some blocks).
      return out.filter((b, i) => i === 0 || JSON.stringify(b) !== JSON.stringify(out[i - 1]));
    });
    fs.writeFileSync(path.join("content/live", `${slug}.json`), JSON.stringify({ path: p, blocks }, null, 1));
    console.log(p, blocks.length);
    await page.close();
  }
  await browser.close();
})();

/**
 * Interaction test for the concept site: forms in demo mode (must send nothing), the lead endpoint
 * (must be off), phone menu, sticky bottom bar, portfolio filters, desktop dropdowns.
 * Usage: npx tsx scripts/interactive.ts https://ea-lilac.vercel.app
 * SPEC mode only: never point this at the real eapropainters.com.
 */
import { chromium } from "playwright";

const U = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
if (/eapropainters\.com/.test(U)) throw new Error("Never run form tests against the live business site.");
let failed = 0;
const ok = (name: string, pass: boolean, extra = "") => {
  if (!pass) failed++;
  console.log(`${pass ? "✓" : "✗"} ${name}${extra ? " — " + extra : ""}`);
};

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") posts.push(r.url());
  });

  // Estimate form, all 5 steps
  await page.goto(U + "/estimate", { waitUntil: "load" });
  const next = () => page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel("Exterior Painting").check();
  await next();
  await page.getByLabel("Exterior", { exact: true }).check();
  await next();
  await page.getByLabel("Project ZIP code").fill("98006");
  await next();
  await page.getByLabel("Within a month").check();
  await next();
  await page.getByLabel("Name").fill("QA Test");
  await page.getByLabel("Mobile phone").fill("2065550100");
  await page.getByLabel("Email").fill("qa@example.com");
  const submit = page.getByRole("button", { name: /Submit \(demo\)/ });
  ok("estimate: 5 steps, button reads 'Submit (demo)'", await submit.isVisible());
  await page.waitForTimeout(3200); // past the minimum fill time
  await submit.click();
  await page.waitForTimeout(800);
  ok("estimate: shows the demo message", await page.getByText("Demo only. Nothing was sent. To reach EA Pro Painters call 206.250.1194.").isVisible());
  ok("estimate: no data sent anywhere", posts.length === 0, posts.join(", "));

  // Contact form
  await page.goto(U + "/contact", { waitUntil: "load" });
  await page.getByLabel("Name").fill("QA Test");
  await page.getByLabel("Mobile phone").fill("2065550100");
  await page.getByLabel("Email").fill("qa@example.com");
  await page.waitForTimeout(3200);
  await page.getByRole("button", { name: /Submit \(demo\)/ }).click();
  await page.waitForTimeout(800);
  ok("contact: shows the demo message", await page.getByText("Demo only. Nothing was sent.", { exact: false }).isVisible());
  ok("contact: no data sent anywhere", posts.length === 0, posts.join(", "));

  // Lead endpoint is switched off in the concept
  const api = await page.request.post(U + "/api/lead", { data: { test: true } });
  ok("lead endpoint off in concept (404)", api.status() === 404, String(api.status()));

  // Phone menu: opens, navigates, and closes after navigating
  await page.goto(U + "/", { waitUntil: "load" });
  const menuNav = page.getByRole("navigation", { name: "Mobile" });
  await page.locator("header summary").click();
  ok("phone menu opens", await menuNav.isVisible());
  await menuNav.getByRole("link", { name: "Portfolio" }).click();
  await page.waitForURL("**/portfolio");
  await page.waitForTimeout(400);
  ok("phone menu link navigates", page.url().endsWith("/portfolio"));
  ok("phone menu closes after navigating", !(await menuNav.isVisible()));
  await page.locator("header summary").click();
  await page.keyboard.press("Escape");
  ok("phone menu closes on Escape", !(await menuNav.isVisible()));
  await page.locator("header summary").click();
  await page.mouse.click(200, 600);
  ok("phone menu closes on tap outside", !(await menuNav.isVisible()));

  // Sticky bottom bar
  const bar = page.getByRole("navigation", { name: "Quick actions" });
  await page.evaluate(() => window.scrollTo(0, 2000));
  const box = await bar.boundingBox();
  ok("bottom bar stays on screen while scrolling", !!box && box.y + box.height <= 845 && (await bar.isVisible()));
  ok("bottom bar Call link", (await bar.getByRole("link", { name: "Call" }).getAttribute("href")) === "tel:+12062501194");

  // Portfolio filter
  await page.evaluate(() => window.scrollTo(0, 0));
  const cards = () => page.locator("main li:not([hidden]) a[href^='/portfolio/']").count();
  const before = await cards();
  const btn = page.getByRole("button", { name: "Cabinet Painting" });
  await btn.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await btn.click();
  const after = await cards();
  ok("portfolio filter narrows results", after > 0 && after < before, `${before} → ${after}`);

  // Desktop: dropdowns open on hover and close after navigating
  const d = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await d.goto(U + "/", { waitUntil: "load" });
  const mainNav = d.getByRole("navigation", { name: "Main" });
  await mainNav.getByRole("link", { name: "Areas We Serve" }).hover();
  await d.waitForTimeout(300);
  const mi = mainNav.getByRole("link", { name: "Mercer Island" });
  ok("desktop: Areas We Serve menu opens on hover", await mi.isVisible());
  await mi.click();
  await d.waitForURL("**/painting-company/mercer-island");
  await d.mouse.move(700, 600);
  await d.waitForTimeout(400);
  ok("desktop: dropdown closes after navigating", !(await mi.isVisible()));
  await b.close();
  console.log(failed ? `\n${failed} interaction check(s) failed` : "\nAll interaction checks passed.");
  process.exit(failed ? 1 : 0);
})();

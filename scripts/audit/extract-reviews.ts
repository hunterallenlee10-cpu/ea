/**
 * Builds content/reviews.json from the public Birdeye widget data saved in Phase 1.
 * Text, names, dates and platforms are copied exactly. City is tagged ONLY when the
 * review text itself names a city we serve (KICKSTART 2.5).
 */
import fs from "node:fs";
import { CITIES } from "../../lib/nav";

type Raw = { rating: number; comment: string; reviewer: { name: string }; reviewDate: string; sourceName: string; reviewUrl?: string };
const find = (o: unknown, k: string, acc: unknown[] = []): unknown[] => {
  if (o && typeof o === "object") for (const [kk, v] of Object.entries(o)) { if (kk === k) acc.push(v); find(v, k, acc); }
  return acc;
};
const seen = new Map<string, unknown>();
for (const f of ["birdeye-w11", "birdeye-w12"]) {
  const html = fs.readFileSync(`audit/reviews/${f}.json`, "utf8");
  const data = JSON.parse(html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)![1]);
  for (const r of (find(data, "reviews").flat() as Raw[]).filter(Boolean)) {
    const key = r.reviewer.name + r.reviewDate;
    if (seen.has(key)) continue;
    const cities = CITIES.filter((c) => new RegExp(`\\b${c.name}\\b`, "i").test(r.comment)).map((c) => c.slug);
    const m = r.reviewDate.match(/^(\w{3}) (\d{1,2}),(\d{4})/);
    const date = m ? new Date(`${m[1]} ${m[2]} ${m[3]} 12:00 UTC`).toISOString().slice(0, 10) : null;
    seen.set(key, {
      id: `birdeye-${seen.size + 1}`,
      text: r.comment,
      name: r.reviewer.name,
      rating: r.rating,
      platform: r.sourceName,
      date,
      dateRaw: r.reviewDate,
      cities,
      via: "Birdeye widget on eapropainters.com",
      capturedOn: "2026-10-20",
    });
  }
}
const out = [...seen.values()];
fs.writeFileSync("content/reviews.birdeye.json", JSON.stringify(out, null, 2));
console.log(out.length, "reviews;", out.filter((r: any) => r.cities.length).map((r: any) => `${r.name}: ${r.cities}`));

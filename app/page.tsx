import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IS_LAUNCH } from "@/lib/mode";

// Phase 2 ★ only: a chooser for Hunter. Replaced by the real homepage in Phase 3.
export const metadata: Metadata = { title: "EA Pro Painters · Concept directions" };

export default function Page() {
  if (IS_LAUNCH) notFound();
  const cards = [
    { href: "/design-a", name: "A · Eastside Craft", line: "Editorial. Warm paper, a large serif, evergreen sections. Feels like a finished interior.", img: "/images/modern-home-exterior-white-stucco-and-cedar.jpg", cls: "bg-[#f7f4ef] text-[#1d211e]" },
    { href: "/design-b", name: "B · Bold Pro", line: "Cinematic. Dark ink over EA Pro's own drone footage, heavy condensed type, red only on calls to action.", img: "/images/ea-pro-drone-exterior-home-poster.jpg", cls: "bg-[#0e0d0c] text-[#f2eee8]" },
  ];
  return (
    <main className="min-h-dvh bg-[#ece8e1] px-5 py-14 text-[#1d211e] md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-[#5b5f59]">EA Pro Painters · Phase 2 concept review</p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-fraunces)] text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05]">Two design directions. Pick one.</h1>
        <p className="mt-5 max-w-2xl text-[#5b5f59]">
          Each shows the homepage hero and the Bellevue city page section, built with the live site’s own text, reviews and photos. Yellow marks are facts Erik still needs to confirm.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className={`group block overflow-hidden rounded-[4px] ${c.cls}`}>
              <Image src={c.img} alt="" width={1200} height={750} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" priority />
              <div className="p-7">
                <p className="text-2xl font-semibold">{c.name}</p>
                <p className="mt-2 opacity-80">{c.line}</p>
                <p className="mt-5 font-semibold underline underline-offset-4">Open direction →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

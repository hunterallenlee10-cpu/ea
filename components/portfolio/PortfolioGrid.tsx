"use client";
import { useState } from "react";
import Image from "next/image";

export type GridItem = {
  slug: string;
  name: string;
  service: string;
  serviceName: string;
  city: string | null;
  cityName: string | null;
  summary: string;
  photo: { src: string; alt: string; width: number; height: number };
  photoCount: number;
};

/**
 * Filterable project grid. Every card is rendered in the HTML (crawlable plain links);
 * the filters only hide cards in the browser.
 */
export function PortfolioGrid({ items, services }: { items: GridItem[]; services: { slug: string; name: string }[] }) {
  const [service, setService] = useState<string>("all");
  const [city, setCity] = useState<string>("all");
  const cities = [...new Map(items.filter((i) => i.city).map((i) => [i.city!, i.cityName!])).entries()];
  const shown = (i: GridItem) =>
    (service === "all" || i.service === service) && (city === "all" || (city === "pending" ? !i.city : i.city === city));
  const used = services.filter((s) => items.some((i) => i.service === s.slug));
  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-ui border px-4 text-[15px] transition-colors ${
      active ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"
    }`;
  const count = items.filter(shown).length;

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <fieldset>
          <legend className="eyebrow text-muted">Service</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip(service === "all")} aria-pressed={service === "all"} onClick={() => setService("all")}>
              All
            </button>
            {used.map((s) => (
              <button key={s.slug} type="button" className={chip(service === s.slug)} aria-pressed={service === s.slug} onClick={() => setService(s.slug)}>
                {s.name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="eyebrow text-muted">City</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip(city === "all")} aria-pressed={city === "all"} onClick={() => setCity("all")}>
              All
            </button>
            {cities.map(([slug, name]) => (
              <button key={slug} type="button" className={chip(city === slug)} aria-pressed={city === slug} onClick={() => setCity(slug)}>
                {name}
              </button>
            ))}
            {items.some((i) => !i.city) && (
              <button type="button" className={chip(city === "pending")} aria-pressed={city === "pending"} onClick={() => setCity("pending")}>
                Town pending
              </button>
            )}
          </div>
        </fieldset>
      </div>
      <p className="mt-6 text-[14px] text-muted" aria-live="polite">
        Showing {count} of {items.length} projects
      </p>
      <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <li key={i.slug} hidden={!shown(i)}>
            <a href={`/portfolio/${i.slug}`} className="group block">
              <div className="overflow-hidden rounded-ui">
                <Image
                  src={i.photo.src}
                  alt={i.photo.alt}
                  width={i.photo.width}
                  height={i.photo.height}
                  sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <p className="eyebrow mt-4 text-accent">
                {i.serviceName}
                {i.cityName ? ` · ${i.cityName}` : null}
              </p>
              <h2 className="mt-2 text-[20px] font-semibold group-hover:text-accent">{i.name}</h2>
              <p className="mt-2 text-[15px] text-muted">{i.summary}</p>
              <p className="mt-2 text-[13px] text-muted">{i.photoCount} photos</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

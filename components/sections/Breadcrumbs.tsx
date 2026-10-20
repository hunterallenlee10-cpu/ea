import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";

export type Crumb = { name: string; path: string };

/** Visible breadcrumbs + BreadcrumbList JSON-LD. The last crumb is the current page. */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const muted = tone === "dark" ? "text-dark-muted" : "text-muted";
  const current = tone === "dark" ? "text-dark-ink" : "text-ink";
  return (
    <>
      <nav aria-label="Breadcrumb" className={`text-[13px] ${muted}`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {i < items.length - 1 ? (
                <Link href={it.path} className="underline-offset-4 hover:text-accent hover:underline">
                  {it.name}
                </Link>
              ) : (
                <span aria-current="page" className={current}>
                  {it.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbs(items)} />
    </>
  );
}

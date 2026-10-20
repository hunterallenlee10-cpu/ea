import type { Metadata } from "next";
import type { PageContent } from "./content-types";
import { site } from "@/site.config";
import { IS_LAUNCH } from "./mode";
import { NOINDEX_PATHS } from "./live-urls";

const abs = (p: string) => `${site.url}${p}`;

/** Live title + description word for word, absolute self-canonical, live OG/Twitter values. */
export function metaFromContent(c: PageContent): Metadata {
  return buildMeta({
    path: c.path,
    title: c.title,
    description: c.description,
    ogTitle: c.og.title,
    ogDescription: c.og.description,
    ogType: c.og.type,
    image: c.og.image,
    twitterCard: c.twitter.card,
    twitterTitle: c.twitter.title,
    twitterDescription: c.twitter.description,
  });
}

/** For new pages (hub, projects, privacy, terms, blog pagination). */
export function buildMeta(m: {
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  image?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}): Metadata {
  const image = m.image ?? "/images/navy-home-exterior-red-front-door.jpg";
  const noindex = IS_LAUNCH && (NOINDEX_PATHS as readonly string[]).includes(m.path);
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: { canonical: abs(m.path === "/" ? "/" : m.path) },
    openGraph: {
      title: m.ogTitle ?? m.title,
      description: m.ogDescription ?? m.description,
      type: (m.ogType === "article" ? "article" : "website") as "article" | "website",
      url: abs(m.path === "/" ? "/" : m.path),
      siteName: site.name,
      images: [{ url: image }],
    },
    twitter: {
      card: (m.twitterCard === "summary_large_image" ? "summary_large_image" : "summary") as "summary" | "summary_large_image",
      title: m.twitterTitle ?? m.title,
      description: m.twitterDescription ?? m.description,
      images: [image],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

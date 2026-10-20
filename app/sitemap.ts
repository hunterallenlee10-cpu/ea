import type { MetadataRoute } from "next";
import { ALL_LIVE_PATHS, NOINDEX_PATHS } from "@/lib/live-urls";
import { blogPageCount, getPage } from "@/lib/content";
import type { Node } from "@/lib/content-types";
import { PHOTOS } from "@/content/photos";
import { PROJECTS, projectPhotos } from "@/content/projects";
import { site } from "@/site.config";

// All indexable URLs, absolute www, with real lastmod dates (live sitemap for existing pages).
// No priority or changefreq. Includes an image sitemap. /success and /welcome are left out.
const NEW_PAGE_DATE = "2026-10-20";
const abs = (p: string) => `${site.url}${p === "/" ? "" : p}`;
const img = (src: string) => `${site.url}${src}`;

function imagesFor(nodes: Node[], ogImage: string) {
  const ids = nodes.filter((n): n is Extract<Node, { t: "photo" }> => n.t === "photo").map((n) => n.id);
  const srcs = ids.map((id) => PHOTOS.find((p) => p.id === id)?.src).filter((s): s is string => !!s);
  return [...new Set([ogImage, ...srcs])].map(img);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const live: MetadataRoute.Sitemap = ALL_LIVE_PATHS.filter((p) => !(NOINDEX_PATHS as readonly string[]).includes(p)).map((p) => {
    const c = getPage(p);
    return {
      url: abs(p),
      lastModified: c.lastmod ?? c.post?.published.slice(0, 10) ?? NEW_PAGE_DATE,
      images: imagesFor(c.nodes, c.og.image),
    };
  });

  const projects: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: abs(`/portfolio/${p.slug}`),
    lastModified: NEW_PAGE_DATE,
    images: projectPhotos(p).map((ph) => img(ph.src)),
  }));

  const blogPages: MetadataRoute.Sitemap = Array.from({ length: Math.max(blogPageCount() - 1, 0) }, (_, i) => ({
    url: abs(`/blog/page/${i + 2}`),
    lastModified: NEW_PAGE_DATE,
  }));

  const other: MetadataRoute.Sitemap = ["/painting-company", "/privacy", "/terms"].map((p) => ({ url: abs(p), lastModified: NEW_PAGE_DATE }));

  return [...live, ...other, ...projects, ...blogPages];
}

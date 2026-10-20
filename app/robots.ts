import type { MetadataRoute } from "next";
import { IS_LAUNCH } from "@/lib/mode";
import { site } from "@/site.config";

// Crawling is allowed in BOTH modes: in SPEC the noindex header/meta must be visible to crawlers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    ...(IS_LAUNCH ? { sitemap: `${site.url}/sitemap.xml`, host: site.url } : {}),
  };
}

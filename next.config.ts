import type { NextConfig } from "next";
import { LEGACY_REDIRECTS, NOINDEX_PATHS } from "./lib/live-urls";

const IS_LAUNCH = process.env.SITE_MODE === "launch";

const nextConfig: NextConfig = {
  // Fully static marketing site. cacheComponents is off because it forbids
  // `dynamicParams = false`, which we need so unknown slugs return a real 404.
  trailingSlash: false,
  // proxy.ts strips trailing slashes together with lowercase + legacy redirects, so every
  // variant (e.g. /About/) reaches its final URL in a single hop.
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 75 for hero images, 60 for grids and galleries (visually the same at photo sizes, ~30% fewer bytes).
    qualities: [60, 75],
    // Fewer srcset widths than the defaults (15 -> 8): shorter HTML on photo-heavy pages. Originals top out
    // around 1920-2400px, so the dropped 2048/3840 widths added nothing.
    deviceSizes: [640, 750, 828, 1080, 1280, 1920],
    imageSizes: [256, 384],
  },
  async redirects() {
    return Object.entries(LEGACY_REDIRECTS).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    if (!IS_LAUNCH) {
      // SPEC: nothing on the concept site may be indexed.
      return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
    }
    return NOINDEX_PATHS.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

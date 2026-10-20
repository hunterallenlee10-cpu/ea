import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { POST_PATHS, SERVICE_SLUGS } from "@/lib/live-urls";
import { ServiceTemplate } from "@/components/templates/ServiceTemplate";
import { CityTemplate } from "@/components/templates/CityTemplate";
import { PostTemplate } from "@/components/templates/PostTemplate";

// Root-level live URLs: the 9 service pages, /kirkland and the blog posts that live at the root.
const ROOT_SLUGS = [
  ...SERVICE_SLUGS,
  "kirkland",
  ...POST_PATHS.filter((p) => p.split("/").length === 2).map((p) => p.slice(1)),
];

export const dynamicParams = false;
export function generateStaticParams() {
  return ROOT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return metaFromContent(getPage(`/${slug}`));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!ROOT_SLUGS.includes(slug)) notFound();
  const c = getPage(`/${slug}`);
  if (c.kind === "service") return <ServiceTemplate c={c} />;
  if (c.kind === "city") return <CityTemplate c={c} />;
  return <PostTemplate c={c} />;
}

import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { POST_PATHS } from "@/lib/live-urls";
import { PostTemplate } from "@/components/templates/PostTemplate";

// Only one live post lives under /blog/ (the rest are at the root).
const BLOG_SLUGS = POST_PATHS.filter((p) => p.startsWith("/blog/")).map((p) => p.replace("/blog/", ""));

export const dynamicParams = false;
export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return metaFromContent(getPage(`/blog/${slug}`));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostTemplate c={getPage(`/blog/${slug}`)} />;
}

import type { Metadata } from "next";
import { getPage, blogPageCount } from "@/lib/content";
import { buildMeta } from "@/lib/meta";
import { BlogIndex } from "@/components/blog/BlogIndex";

// Crawlable archive pages 2…N (new URLs, KICKSTART section 4).
export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from({ length: blogPageCount() - 1 }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const blog = getPage("/blog");
  return buildMeta({ path: `/blog/page/${n}`, title: `Painting Blog, Page ${n} | EA Pro Painters`, description: blog.description });
}

export default async function Page({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  return <BlogIndex page={Number(n)} h1={`${getPage("/blog").h1} (page ${n})`} />;
}

import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { BlogIndex } from "@/components/blog/BlogIndex";

export const metadata = metaFromContent(getPage("/blog"));

export default function Page() {
  return <BlogIndex page={1} h1={getPage("/blog").h1} />;
}

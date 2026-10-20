import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { CITY_SLUGS } from "@/lib/live-urls";
import { CityTemplate } from "@/components/templates/CityTemplate";

export const dynamicParams = false;
export function generateStaticParams() {
  return CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  return metaFromContent(getPage(`/painting-company/${city}`));
}

export default async function Page({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  return <CityTemplate c={getPage(`/painting-company/${city}`)} />;
}

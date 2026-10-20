import birdeye from "@/content/reviews.birdeye.json";

export type Review = {
  id: string;
  text: string;
  name: string;
  rating: number;
  platform: string;
  date: string | null;
  cities: string[];
};

export const REVIEWS: Review[] = birdeye as Review[];
export const reviewsFor = (city?: string, n = 3) => {
  const tagged = city ? REVIEWS.filter((r) => r.cities.includes(city)) : [];
  return [...tagged, ...REVIEWS.filter((r) => !tagged.includes(r))].slice(0, n);
};
export const formatReviewDate = (d: string | null) =>
  d ? new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }) : null;

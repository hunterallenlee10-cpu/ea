import { CITY_SLUGS } from "./live-urls";

export const SERVICES = [
  { slug: "interior-painting", name: "Interior Painting" },
  { slug: "exterior-painting", name: "Exterior Painting" },
  { slug: "commercial-painting", name: "Commercial Painting" },
  { slug: "cabinet-painting", name: "Cabinet Painting" },
  { slug: "custom-painting", name: "Custom Painting" },
  { slug: "millwork-painting", name: "Millwork Painting" },
  { slug: "drywall-painting", name: "Drywall Painting" },
  { slug: "decks-and-fences-painting", name: "Decks and Fences Painting" },
  { slug: "hoa", name: "HOA Painting" },
] as const;

const CITY_NAME_OVERRIDES: Record<string, string> = {
  "clyde-hill": "Clyde Hill",
  "mercer-island": "Mercer Island",
  "mill-creek": "Mill Creek",
};

export const cityName = (slug: string) =>
  CITY_NAME_OVERRIDES[slug] ?? slug.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase());

export const cityHref = (slug: string) => (slug === "kirkland" ? "/kirkland" : `/painting-company/${slug}`);

// Alphabetical, Kirkland included, as in the live "Areas We Serve" menu.
export const CITIES = [...CITY_SLUGS, "kirkland"]
  .map((slug) => ({ slug, name: cityName(slug), href: cityHref(slug) }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const MAIN_NAV = [
  { href: "/services", label: "Services" },
  { href: "/painting-company", label: "Areas We Serve" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
  { href: "/blog", label: "Blog" },
] as const;

/**
 * Portfolio projects (KICKSTART 5.2.10). Each groups EA Pro's own photos (content/photos.ts) from one job.
 * Only what is visible in the photos and the service are stated. Everything else is a placeholder
 * until Erik confirms it (OPEN-QUESTIONS #11, #23). Slugs are neutral (no town) so they never imply a location.
 */
import { PHOTOS, type Photo } from "./photos";

export const ERIK = (what: string) => `[ERIK TO PROVIDE: ${what}]`;

export type Project = {
  slug: string;
  name: string;
  /** Service slug from lib/nav.ts. */
  service: string;
  /** City slug once Erik confirms the town; null until then. */
  city: string | null;
  /** What the photos show, stated plainly. */
  summary: string;
  photoIds: string[];
  glance: { surfaces: string; products: string; finish: string };
  challenge: string;
  process: string;
  result: string;
  review: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "commercial-building-exterior-repaint",
    name: "Commercial building exterior repaint",
    service: "commercial-painting",
    city: null,
    summary: "A multi-story commercial building repainted in warm taupe, with vertical window bays, balconies and a landscaped entrance.",
    photoIds: ["commercial-building-exterior-repaint-front", "commercial-building-exterior-repaint-entrance", "commercial-building-exterior-repaint-balconies"],
    glance: { surfaces: ERIK("surfaces painted"), products: ERIK("paint products"), finish: ERIK("sheen / finish") },
    challenge: ERIK("the challenge on this job"),
    process: ERIK("how the job was done"),
    result: ERIK("the result"),
    review: ERIK("a review from this customer, if any"),
  },
  {
    slug: "modern-cedar-and-stucco-home-exterior",
    name: "Modern cedar and stucco home exterior",
    service: "exterior-painting",
    city: null,
    summary: "A modern home with white stucco, stained cedar siding and dark trim.",
    photoIds: ["modern-home-exterior-white-stucco-and-cedar", "modern-home-exterior-cedar-siding-side", "modern-home-exterior-with-ea-pro-yard-sign"],
    glance: { surfaces: ERIK("surfaces painted or stained"), products: ERIK("paint and stain products"), finish: ERIK("finish") },
    challenge: ERIK("the challenge on this job"),
    process: ERIK("how the job was done"),
    result: ERIK("the result"),
    review: ERIK("a review from this customer, if any"),
  },
  {
    slug: "kitchen-cabinet-painting-oak-to-white",
    name: "Kitchen cabinet painting, oak to white",
    service: "cabinet-painting",
    city: null,
    summary: "Honey-oak kitchen cabinets painted white, with the cabinet boxes masked and protected for spraying.",
    photoIds: ["kitchen-cabinets-before-painting", "kitchen-cabinets-after-painting-white", "kitchen-cabinet-boxes-masked-for-spraying", "kitchen-cabinet-doors-dark-to-white"],
    glance: { surfaces: "Cabinet boxes, doors and drawer fronts", products: ERIK("cabinet paint products"), finish: ERIK("sheen / finish") },
    challenge: ERIK("the challenge on this job"),
    process: ERIK("how the job was done"),
    result: ERIK("the result"),
    review: ERIK("a review from this customer, if any"),
  },
  {
    slug: "navy-blue-home-exterior",
    name: "Navy blue home exterior",
    service: "exterior-painting",
    city: null,
    summary: "A two-story home painted navy blue with white trim, a white garage door and a red front door.",
    photoIds: ["navy-home-exterior-red-front-door", "navy-home-exterior-garage-and-entry"],
    glance: { surfaces: ERIK("surfaces painted"), products: ERIK("paint products"), finish: ERIK("sheen / finish") },
    challenge: ERIK("the challenge on this job"),
    process: ERIK("how the job was done"),
    result: ERIK("the result"),
    review: ERIK("a review from this customer, if any"),
  },
  {
    slug: "covered-deck-staining",
    name: "Covered deck staining",
    service: "decks-and-fences-painting",
    city: null,
    summary: "A wood deck under a covered patio, freshly stained.",
    photoIds: ["stained-cedar-deck-covered-patio", "stained-deck-boards-close-up"],
    glance: { surfaces: "Deck boards", products: ERIK("stain products"), finish: ERIK("stain color / finish") },
    challenge: ERIK("the challenge on this job"),
    process: ERIK("how the job was done"),
    result: ERIK("the result"),
    review: ERIK("a review from this customer, if any"),
  },
  {
    slug: "storefront-commercial-painting",
    name: "Storefront commercial painting",
    service: "commercial-painting",
    city: null,
    summary: "Our crew painting storefront window frames from a boom lift, with EA Pro trucks on site.",
    photoIds: ["crew-painting-storefront-windows-from-boom-lift", "ea-pro-trucks-at-shopping-center", "ea-pro-truck-at-commercial-building"],
    glance: { surfaces: ERIK("surfaces painted"), products: ERIK("paint products"), finish: ERIK("sheen / finish") },
    challenge: ERIK("the challenge on this job"),
    process: ERIK("how the job was done"),
    result: ERIK("the result"),
    review: ERIK("a review from this customer, if any"),
  },
  {
    slug: "brick-and-gray-siding-home-exterior",
    name: "Brick and gray siding home exterior",
    service: "exterior-painting",
    city: null,
    summary: "A two-story home with a brick lower level and gray painted siding, plus a stained wood porch ceiling.",
    photoIds: ["brick-and-gray-siding-two-story-home", "stained-wood-porch-ceiling"],
    glance: { surfaces: ERIK("surfaces painted or stained"), products: ERIK("paint and stain products"), finish: ERIK("sheen / finish") },
    challenge: ERIK("the challenge on this job"),
    process: ERIK("how the job was done"),
    result: ERIK("the result"),
    review: ERIK("a review from this customer, if any"),
  },
  {
    slug: "interior-staircase-and-millwork",
    name: "Interior staircase and millwork",
    service: "millwork-painting",
    city: null,
    summary: "Staircases, risers, wainscoting and trim in white, with a black metal railing on one stair.",
    photoIds: ["foyer-staircase-white-risers-and-trim", "staircase-black-metal-railing-white-walls"],
    glance: { surfaces: "Stair risers, trim and wainscoting", products: ERIK("paint products"), finish: ERIK("sheen / finish") },
    challenge: ERIK("the challenge on this job"),
    process: ERIK("how the job was done"),
    result: ERIK("the result"),
    review: ERIK("a review from this customer, if any"),
  },
];

export const projectPhotos = (p: Project): Photo[] =>
  p.photoIds.map((id) => PHOTOS.find((x) => x.id === id)).filter((x): x is Photo => !!x);

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

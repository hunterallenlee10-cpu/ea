/**
 * Copies EA Pro's own project photos from audit/images-original into public/images with
 * descriptive names, and writes content/photos.ts. Stock images are never copied (rule 7).
 * Town is null until Erik confirms it (OPEN-QUESTIONS #11/#23). Originals over 2400px are
 * scaled down to keep the repo light; next/image serves AVIF/WebP from these.
 * Run: npx tsx scripts/curate-photos.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

type Pick = { src: string; name: string; alt: string; job: string; service?: string; note?: string };

const PICKS: Pick[] = [
  { src: "DJI_0436-scaled.jpeg", name: "crew-painting-storefront-windows-from-boom-lift", alt: "Two EA Pro Painters crew members painting storefront window frames from a boom lift", job: "Commercial exterior", service: "commercial-painting" },
  { src: "DSC00011-scaled.webp", name: "painter-masking-trim-before-painting", alt: "EA Pro painter pressing masking tape along trim before painting", job: "Prep", service: "exterior-painting" },
  { src: "DSC00021-scaled.webp", name: "crew-painting-exterior-column-base", alt: "Two EA Pro painters on drop cloths painting the base of an exterior column", job: "Exterior detail", service: "exterior-painting" },
  { src: "DSC00023-3-scaled.jpeg", name: "crew-cutting-in-exterior-column-edge", alt: "EA Pro painters cutting in a crisp edge on a dark exterior column", job: "Exterior detail", service: "exterior-painting" },
  { src: "A735728-scaled.jpeg", name: "commercial-building-exterior-repaint-front", alt: "Commercial building exterior repainted in warm taupe, front entrance", job: "Commercial exterior", service: "commercial-painting" },
  { src: "A735732-scaled.jpeg", name: "commercial-building-exterior-repaint-entrance", alt: "Repainted commercial building with vertical window bays and landscaped entrance", job: "Commercial exterior", service: "commercial-painting" },
  { src: "A735746-scaled.jpeg", name: "commercial-building-exterior-repaint-balconies", alt: "Side elevation of a repainted commercial building with balconies", job: "Commercial exterior", service: "commercial-painting" },
  { src: "EXTERIOR-1-scaled.jpeg", name: "modern-home-exterior-white-stucco-and-cedar", alt: "Modern home exterior with white stucco and cedar siding under a blue sky", job: "Exterior", service: "exterior-painting" },
  { src: "IMG_5898-2-scaled.webp", name: "modern-home-exterior-cedar-siding-side", alt: "Side view of a modern home with stained cedar siding and dark trim", job: "Exterior", service: "exterior-painting" },
  { src: "IMG_5919-3.jpeg", name: "modern-home-exterior-with-ea-pro-yard-sign", alt: "Modern single-story home exterior with an EA Pro Painters yard sign out front", job: "Exterior", service: "exterior-painting" },
  { src: "Edmonds-7bfa6695-603ccd1e.jpg", name: "modern-two-story-home-black-white-and-wood", alt: "Modern two-story home with white siding, black trim and natural wood accents", job: "Exterior", service: "exterior-painting", note: "Live filename says Edmonds; town not confirmed" },
  { src: "12.jpeg", name: "blue-farmhouse-exterior-white-porch", alt: "Blue farmhouse-style home with a white wraparound porch", job: "Exterior", service: "exterior-painting" },
  { src: "WhatsApp-Image-2023-06-21-at-1.38.48-PM-8.jpeg", name: "navy-home-exterior-red-front-door", alt: "Two-story home painted navy blue with white trim and a red front door", job: "Exterior", service: "exterior-painting" },
  { src: "WhatsApp-Image-2023-06-21-at-1.38.48-PM-8-24a1dcdf.jpeg", name: "navy-home-exterior-garage-and-entry", alt: "Navy blue home exterior with white garage door and red entry door", job: "Exterior", service: "exterior-painting" },
  { src: "WhatsApp-Image-2023-06-20-at-11.30.10-AM-8-2-scaled.webp", name: "brick-and-gray-siding-two-story-home", alt: "Two-story home with brick lower level and freshly painted gray siding", job: "Exterior", service: "exterior-painting" },
  { src: "WhatsApp-Image-2023-06-20-at-11.30.11-AM-9.jpeg", name: "stained-wood-porch-ceiling", alt: "Glossy stained tongue-and-groove wood porch ceiling", job: "Stain", service: "custom-painting" },
  { src: "DECK-AND-FENCES-2-scaled.jpeg", name: "stained-cedar-deck-covered-patio", alt: "Freshly stained wood deck under a covered patio with timber beams", job: "Deck stain", service: "decks-and-fences-painting" },
  { src: "DECK-AND-FENCES-3-scaled.jpeg", name: "stained-deck-boards-close-up", alt: "Close-up of evenly stained deck boards next to a patio", job: "Deck stain", service: "decks-and-fences-painting" },
  { src: "IMG_1388.jpeg", name: "kitchen-cabinets-before-painting", alt: "Kitchen with honey-oak cabinets before painting", job: "Cabinets (before)", service: "cabinet-painting" },
  { src: "IMG_1389-scaled.jpeg", name: "kitchen-cabinets-after-painting-white", alt: "The same kitchen after its cabinets were painted white", job: "Cabinets (after)", service: "cabinet-painting" },
  { src: "Kitchen-Cabinet-Boxes.jpeg", name: "kitchen-cabinet-boxes-masked-for-spraying", alt: "Kitchen cabinet boxes masked and protected for spraying", job: "Cabinet prep", service: "cabinet-painting" },
  { src: "Kitchen-Cabinet-Doors-and-Draws.jpeg", name: "kitchen-cabinet-doors-dark-to-white", alt: "Kitchen cabinets shown dark before and white after painting", job: "Cabinets", service: "cabinet-painting" },
  { src: "Vented-Closet-Door-2.jpeg", name: "hallway-closet-doors-with-floor-protection", alt: "Painted hallway closet doors with floor protection laid down", job: "Interior prep", service: "interior-painting" },
  { src: "INTERIOR-3.jpeg", name: "staircase-black-metal-railing-white-walls", alt: "Staircase with black metal railing against freshly painted white walls", job: "Interior", service: "interior-painting" },
  { src: "INTERIOR-4-scaled.jpeg", name: "foyer-staircase-white-risers-and-trim", alt: "Foyer staircase with white risers, wainscoting and trim", job: "Interior trim", service: "millwork-painting" },
  { src: "IMG_1384.jpeg", name: "foyer-curved-staircase-white-millwork", alt: "Bright foyer with a curved staircase and white millwork", job: "Interior", service: "interior-painting", note: "Confirm this is EA Pro's work" },
  { src: "IMG_1386.jpeg", name: "living-room-built-ins-and-brick-fireplace", alt: "Living room with built-in shelving beside a brick fireplace", job: "Interior", service: "interior-painting", note: "Confirm this is EA Pro's work" },
  { src: "RemoteMediaFile_6553612_0_2022_03_11_14_19_22-3.jpeg", name: "ea-pro-truck-at-teal-home-aerial", alt: "Aerial view of an EA Pro Painters truck in the driveway of a teal home", job: "Exterior", service: "exterior-painting" },
  { src: "Sin-titulo-2-scaled.webp", name: "ea-pro-van-at-two-story-homes", alt: "EA Pro Painters van parked outside two freshly painted two-story homes", job: "Exterior", service: "exterior-painting" },
  { src: "EA-Pro-Painters-Commercial-Painters.jpg", name: "ea-pro-trucks-at-shopping-center", alt: "EA Pro Painters trucks parked at a shopping center job", job: "Commercial", service: "commercial-painting" },
  { src: "IMG_0916-scaled-46eaa39c.jpeg", name: "ea-pro-truck-at-commercial-building", alt: "EA Pro Painters truck beside a commercial building being repainted", job: "Commercial", service: "commercial-painting" },
  { src: "website-video-cover-mov-image.jpeg", name: "painter-on-ladder-painting-siding", alt: "EA Pro painter on a ladder painting wood siding", job: "Exterior", service: "exterior-painting" },
];

const SRC = "audit/images-original";
const OUT = "public/images";
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const rows: string[] = [];
  for (const p of PICKS) {
    const file = `${p.name}.jpg`;
    const img = sharp(path.join(SRC, p.src)).rotate();
    const meta = await img.metadata();
    const long = Math.max(meta.width!, meta.height!);
    const pipe = long > 2400 ? img.resize({ width: meta.width! >= meta.height! ? 2400 : undefined, height: meta.height! > meta.width! ? 2400 : undefined }) : img;
    const info = await pipe.jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(OUT, file));
    rows.push(
      `  { id: ${JSON.stringify(p.name)}, src: "/images/${file}", width: ${info.width}, height: ${info.height}, alt: ${JSON.stringify(p.alt)}, job: ${JSON.stringify(p.job)}, service: ${JSON.stringify(p.service ?? null)}, town: null, liveFile: ${JSON.stringify(p.src)}${p.note ? `, note: ${JSON.stringify(p.note)}` : ""} },`,
    );
    process.stdout.write(".");
  }
  fs.writeFileSync(
    "content/photos.ts",
    `// Generated by scripts/curate-photos.ts. EA Pro's own photos from the live site, renamed.
// town stays null until Erik confirms it (OPEN-QUESTIONS #11, #23). Never guess a town.
import BLUR from "./photo-blur.json";

export type Photo = { id: string; src: string; width: number; height: number; alt: string; job: string; service: string | null; town: string | null; liveFile: string; note?: string; blur?: string };

export const PHOTOS: Photo[] = [
${rows.join("\n")}
];

// Tiny blurred preview per photo (run scripts/photo-blur.ts after this script).
for (const p of PHOTOS) p.blur = (BLUR as Record<string, string>)[p.id];

/**
 * Standard next/image props for one of EA Pro's photos (pass alt={p.alt} alongside).
 * The preview is a plain CSS background (the tiny JPEG, upscaled) rather than next/image's
 * placeholder="blur", which paints an SVG blur filter that is expensive to repaint while scrolling on phones.
 * quality: 75 for hero images, 60 elsewhere (both allowed in next.config.ts).
 */
export const photoImg = (p: Photo, opts: { hero?: boolean } = {}) => ({
  src: p.src,
  width: p.width,
  height: p.height,
  quality: opts.hero ? 75 : 60,
  ...(p.blur ? { style: { backgroundImage: \`url("\${p.blur}")\`, backgroundSize: "cover", backgroundPosition: "center" } } : {}),
});

/** Photos safe to rotate into any page (excludes ones still marked "Confirm this is EA Pro's work"). */
// Also excludes the warranty section's photo, which appears on every service page already.
export const USABLE_PHOTOS = PHOTOS.filter((p) => !/Confirm this is/i.test(p.note ?? "") && p.id !== "crew-painting-exterior-column-base");

export const photo = (id: string) => {
  const p = PHOTOS.find((x) => x.id === id);
  if (!p) throw new Error("Unknown photo " + id);
  return p;
};
`,
  );
  console.log(`\n${PICKS.length} photos curated`);
})();

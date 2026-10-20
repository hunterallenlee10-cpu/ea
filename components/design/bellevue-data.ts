import { faqs, liveBlocks, liveTestimonials, listItems, paragraphs, processSteps, sectionAfter } from "@/lib/live-content";

// Phase 2 preview: the Bellevue city page's live content, word for word.
export function getBellevue() {
  const b = liveBlocks("/painting-company/bellevue");
  const h1 = (b.find((x) => x.t === "h1") as { text: string }).text;
  const introHeading = "EA Pro Painters: Top-Ranking Bellevue Painters You Can Trust for Exterior & Interior";
  const intro = paragraphs(sectionAfter(b, introHeading));
  const why = sectionAfter(b, "Why You Need Professional Bellevue Painters");
  // The live list repeats "Drywall Painting Services"; show it once.
  const services = [...new Set(listItems(why).map((l) => l.text))];
  const allFaqs = faqs(b);
  const cost = allFaqs.find((f) => f.q.startsWith("How much does it cost"))!;
  const processIntro = paragraphs(sectionAfter(b, "EA Pro Painters Bellevue: Professional Painting Process"))[0];
  return {
    h1,
    introHeading,
    intro,
    services,
    faqs: allFaqs,
    cost,
    // From the cost FAQ, verbatim figures.
    costFigures: [
      { label: "Typical Bellevue exterior", range: "$5,000 to $12,000" },
      { label: "Typical Bellevue interior", range: "$3,500 to $25,000" },
    ],
    process: { intro: processIntro, steps: processSteps(b) },
    testimonials: liveTestimonials(b),
  };
}
export type Bellevue = ReturnType<typeof getBellevue>;

import { formatReviewDate, type Review } from "@/lib/reviews";
import { Stars } from "./Stars";

// Visible review text only. Never emits Review/aggregateRating schema (KICKSTART 2.8).
export function ReviewCard({ r, tone = "light", className = "" }: { r: Review; tone?: "light" | "dark"; className?: string }) {
  const muted = tone === "dark" ? "text-dark-muted" : "text-muted";
  return (
    <figure className={`flex h-full flex-col ${className}`}>
      <Stars className={tone === "dark" ? "text-dark-accent" : "text-accent"} label={`${r.rating} out of 5 stars`} />
      <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed">“{r.text}”</blockquote>
      <figcaption className="mt-5 text-[14px]">
        <span className="font-semibold">{r.name}</span>
        <span className={muted}>
          {" "}
          · {r.platform}
          {r.date ? ` · ${formatReviewDate(r.date)}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}

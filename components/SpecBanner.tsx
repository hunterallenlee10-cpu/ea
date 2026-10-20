import { IS_SPEC } from "@/lib/mode";

export function SpecBanner() {
  if (!IS_SPEC) return null;
  return (
    <div className="bg-[#111] px-4 py-1.5 text-center text-[13px] leading-snug text-[#f5f1ea]" role="region" aria-label="Concept notice">
      Concept by Lee Enterprises Unlimited. Not the live EA Pro Painters site.
    </div>
  );
}

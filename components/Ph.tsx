import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

const textOf = (n: React.ReactNode): string =>
  typeof n === "string" || typeof n === "number" ? String(n) : Array.isArray(n) ? n.map(textOf).join("") : "";

/**
 * Placeholder for a fact Erik must confirm or provide. Never fill these in.
 * When SHOW_PLACEHOLDERS is off it renders no visible text, only an empty hidden marker that QA counts.
 */
export function Ph({ children }: { children: React.ReactNode }) {
  if (!SHOW_PLACEHOLDERS) return <span hidden data-ph={textOf(children).trim()} />;
  return <mark className="ph">{children}</mark>;
}

/** " · Sammamish" after a photo caption, or nothing (plus a hidden marker) until Erik confirms the town. */
export function Town({ town }: { town: string | null | undefined }) {
  if (town) return <> · {town}</>;
  return SHOW_PLACEHOLDERS ? (
    <>
      {" · "}
      <Ph>CONFIRM: town</Ph>
    </>
  ) : (
    <Ph>CONFIRM: town</Ph>
  );
}

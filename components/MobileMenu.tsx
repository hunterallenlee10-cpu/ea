"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * The phone menu (<details>) plus header housekeeping on page changes.
 * The header stays mounted across client-side navigation, so without this:
 *  - the phone menu stayed open over the new page after tapping a link in it;
 *  - a desktop dropdown stayed open (focus was still on the clicked link inside it).
 * Also closes the phone menu on Escape or a tap outside it.
 */
export function MobileMenu({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
    const active = document.activeElement as HTMLElement | null;
    if (active?.closest("header")) active.blur();
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (ref.current?.open && !ref.current.contains(e.target as Node)) ref.current.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <details
      ref={ref}
      className={className}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a") && ref.current) ref.current.open = false;
      }}
    >
      {children}
    </details>
  );
}

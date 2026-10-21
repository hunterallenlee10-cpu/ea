"use client";
import { useEffect } from "react";

/**
 * Restrained scroll reveals for [data-reveal] elements.
 *
 * Content is visible by default. An element is only hidden ("reveal-pending") when the
 * IntersectionObserver reports it is below the screen, and it fades in as it approaches.
 * So nothing can ever get stuck invisible, there is no forced layout at startup, and pages
 * reached by clicking a link (client-side navigation adds new elements) work the same way:
 * a MutationObserver picks up new [data-reveal] elements as they appear.
 * Does nothing at all with prefers-reduced-motion.
 */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const shown = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            el.classList.remove("reveal-pending");
            shown.add(el);
            io.unobserve(el);
          } else if (!shown.has(el) && e.boundingClientRect.top > 0) {
            // Below the screen and not seen yet: hide it so it can fade in.
            el.classList.add("reveal-pending");
          }
        }
      },
      // Start the fade before the element scrolls into view (15% of a screen early).
      { rootMargin: "0px 0px 15% 0px" },
    );
    const observed = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        if (observed.has(el)) return;
        observed.add(el);
        io.observe(el);
      });
    };
    scan();
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}

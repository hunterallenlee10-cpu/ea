"use client";
import { useEffect } from "react";

/**
 * Adds restrained scroll reveals. Content is fully visible without JS and with
 * prefers-reduced-motion; only then do we hide-and-reveal [data-reveal] elements.
 */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    // Anything on (or just below) the screen stays visible: never hide the hero or its buttons.
    const vh = window.innerHeight * 1.15;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh) el.classList.add("is-in");
    });
    root.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      // Start the fade before the element scrolls into view (15% of a screen early).
      { rootMargin: "0px 0px 15% 0px" },
    );
    els.forEach((el) => !el.classList.contains("is-in") && io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

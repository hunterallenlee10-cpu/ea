"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Slow, muted hero loop. The poster (rendered by the parent with next/image, priority) is the LCP element.
 * The video only loads after the page has loaded, and never with reduced motion or data-saver on.
 */
export function HeroVideo({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    const start = () => setShow(true);
    if (document.readyState === "complete") {
      const id = window.setTimeout(start, 600);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  if (!show) return null;
  return (
    <video
      ref={ref}
      className={`${className} transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
    />
  );
}

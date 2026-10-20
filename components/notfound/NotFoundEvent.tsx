"use client";
import { useEffect } from "react";

// LAUNCH only (rendered conditionally): records missing URLs in GA4 via GTM, because Vercel keeps runtime logs only briefly.
export function NotFoundEvent() {
  useEffect(() => {
    const w = window as Window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "page_not_found", path: window.location.pathname + window.location.search });
  }, []);
  return null;
}

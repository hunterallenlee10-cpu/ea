"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type HsqWindow = Window & { _hsq?: unknown[][] };

/** Tells HubSpot about client-side page changes. The first page view is tracked by HubSpot's own script. */
export function HubSpotPageViews() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const w = window as HsqWindow;
    w._hsq = w._hsq ?? [];
    w._hsq.push(["setPath", pathname + window.location.search]);
    w._hsq.push(["trackPageView"]);
  }, [pathname]);
  return null;
}

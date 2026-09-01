"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackScrollDepth } from "@/lib/analytics";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/** Fire a GA4 event from client components */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

/** Tracks SPA route changes + scroll depth milestones */
export default function Analytics() {
  const pathname = usePathname();
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const firedDepths = useRef(new Set<number>());

  // Page view on route change
  useEffect(() => {
    if (!ga4Id || typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("config", ga4Id, { page_path: pathname });
    // Reset scroll tracking on navigation
    firedDepths.current = new Set();
  }, [pathname, ga4Id]);

  // Scroll depth tracking
  useEffect(() => {
    const MILESTONES = [25, 50, 75, 90] as const;

    function getScrollPct() {
      const el = document.documentElement;
      const scrolled = el.scrollTop + window.innerHeight;
      const total = el.scrollHeight;
      return total <= window.innerHeight ? 100 : Math.round((scrolled / total) * 100);
    }

    function onScroll() {
      const pct = getScrollPct();
      for (const milestone of MILESTONES) {
        if (pct >= milestone && !firedDepths.current.has(milestone)) {
          firedDepths.current.add(milestone);
          trackScrollDepth(milestone, pathname);
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}

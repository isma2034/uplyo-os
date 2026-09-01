"use client";

import { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Apparition au scroll — dégradation propre.
 *
 * Avant : le composant rendait `opacity-0` dès le SSR et ne repassait à 1 que
 * via IntersectionObserver. Sans JavaScript (ou si le bundle échoue), toutes
 * les sections du site restaient invisibles.
 *
 * Maintenant : le HTML servi est visible (`.reveal`). C'est le composant, une
 * fois monté côté client, qui « arme » l'animation (`.reveal-armed`) avant de
 * la déclencher. `prefers-reduced-motion` neutralise l'armement en CSS.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    el.classList.add("reveal-armed");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => el.classList.add("reveal-visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

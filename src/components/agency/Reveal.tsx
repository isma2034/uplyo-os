"use client";

import { useEffect, useRef, ReactNode } from "react";
import type React from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * Élément DOM réellement rendu — `div` par défaut. Nécessaire quand Reveal
   * enveloppe un `<li>` : rendu en `div`, il s'intercalait entre `<ul>`/`<ol>`
   * et `<li>`, ce que Lighthouse et les lecteurs d'écran signalent comme une
   * liste invalide (un `<li>` doit être un enfant DIRECT de son parent de
   * liste). Constaté sur audit PageSpeed du 15/09/2026, accessibilité 93/100.
   */
  as?: "div" | "li";
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
export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const Tag = as;
  // HTMLElement, pas HTMLDivElement : la ref sert aussi bien à un <div> qu'à
  // un <li> selon `as`.
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    el.classList.add("reveal-armed");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => el.classList.add("reveal-visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLLIElement & HTMLDivElement>}
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

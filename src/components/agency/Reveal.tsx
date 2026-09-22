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
   * liste).
   */
  as?: "div" | "li";
}

/**
 * Apparition au scroll — dégradation propre. Retire le 22/09/2026 au profit
 * d'un seul moment travaille (le hero), remis le meme jour a la demande
 * expresse d'Ismael : « UI/UX propre mais avec des effets visuels animes ».
 * Le mecanisme n'avait pas change de valeur, seule la decision d'usage —
 * donc on reprend l'implementation eprouvee plutot que d'en refaire une.
 *
 * Le HTML servi est visible (`.reveal`) : sans JS, rien ne reste cache.
 * C'est le composant, une fois monte cote client, qui « arme » l'animation
 * (`.reveal-armed`) avant de la declencher au scroll. `prefers-reduced-motion`
 * neutralise l'armement en CSS.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const Tag = as;
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

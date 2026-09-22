"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Barre de proportion qui se remplit au scroll — même contrat que `Counter`
 * et `Reveal` : le SSR rend directement la largeur finale (`pct`), donc rien
 * ne dépend du JavaScript pour être correct visuellement. Une fois monté,
 * si `prefers-reduced-motion` ne l'interdit pas, la barre repart de 0 et se
 * remplit avec une transition CSS quand elle entre dans le viewport.
 */
export default function AnimatedBar({
  pct,
  className,
}: {
  pct: number;
  className?: string;
}) {
  const [width, setWidth] = useState(pct);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    setWidth(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);
        // Un frame de battement pour que le passage à 0 soit bien peint
        // avant la transition vers la valeur finale.
        requestAnimationFrame(() => requestAnimationFrame(() => setWidth(pct)));
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pct]);

  return (
    <div
      ref={ref}
      className={
        className ?? "h-1.5 w-full rounded-full bg-lune-deep overflow-hidden"
      }
      aria-hidden="true"
    >
      <div
        className="h-full rounded-full bg-eclat transition-[width] duration-700 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

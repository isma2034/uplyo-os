"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  /** Valeur finale, déjà arrondie comme elle doit s'afficher. */
  value: number;
  /** Nombre de décimales à conserver (0 par défaut). */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * Compteur animé au scroll, même contrat de dégradation que `Reveal` :
 * le HTML servi contient déjà la valeur finale (SSR, no-JS, lecteurs d'écran,
 * indexation — rien ne dépend du JavaScript pour être correct), et c'est
 * uniquement l'affichage qui s'anime une fois monté côté client, si
 * `prefers-reduced-motion` ne l'interdit pas.
 */
export default function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  duration = 900,
}: CounterProps) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    setDisplay(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // ease-out cubic — démarre vite, ralentit en approchant la valeur finale
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(value * eased);
          if (progress < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("fr-FR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

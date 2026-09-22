"use client";

import { useLayoutEffect, useRef, ReactNode, createElement } from "react";
import { getGsap, prefersReducedMotion, EASE_BIG } from "./motion";

/**
 * Titre révélé ligne par ligne : chaque ligne monte depuis un masque
 * (effet « rideau » de Locomotive). Le texte est dans le HTML servi et
 * reste lisible sans JS ; le découpage n'a lieu qu'une fois monté.
 *
 * `immediate` : joue à l'arrivée (hero) au lieu d'attendre le scroll.
 */
export default function SplitTitle({
  as = "h2",
  children,
  className,
  immediate = false,
  delay = 0,
  id,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  children: ReactNode;
  className?: string;
  immediate?: boolean;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap, SplitText } = getGsap();

    const ctx = gsap.context(() => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            ease: EASE_BIG,
            stagger: 0.08,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [immediate, delay]);

  return createElement(as, { ref, className, id }, children);
}

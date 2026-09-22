"use client";

import { useLayoutEffect, useRef, ReactNode } from "react";
import { getGsap, prefersReducedMotion, EASE_SMALL } from "./motion";

/**
 * Apparition au scroll des enfants directs, en cascade (0,06 s d'écart).
 * Même courbe partout (easeOutCubic) : c'est la répétition des mêmes
 * gestes qui donne l'impression de maîtrise, pas leur variété.
 */
export default function FadeIn({
  children,
  className,
  as: Tag = "div",
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "dl";
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        y,
        autoAlpha: 0,
        duration: 1,
        ease: EASE_SMALL,
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [y]);

  // @ts-expect-error — ref générique sur une balise choisie à l'exécution
  return <Tag ref={ref} className={className}>{children}</Tag>;
}

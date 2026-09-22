"use client";

import { useLayoutEffect, useRef, ReactNode } from "react";
import { getGsap, prefersReducedMotion } from "./motion";

/**
 * Image qui s'élargit jusqu'aux bords de l'écran pendant qu'on la fait
 * défiler, avec un léger parallaxe à l'intérieur du cadre. C'est le geste
 * principal du hero de Locomotive, lié au scroll (scrub) plutôt que joué
 * une fois : le visiteur « pilote » l'image.
 *
 * Sans JS ou avec mouvement réduit : image pleine largeur, immobile.
 */
export default function ExpandingMedia({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!frame.current || !inner.current || prefersReducedMotion()) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const inset = () => (window.innerWidth >= 768 ? "0 6% 0 6%" : "0 4% 0 4%");
      gsap.fromTo(
        frame.current,
        { clipPath: () => `inset(${inset()})` },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: frame.current,
            start: "top 85%",
            end: "top 15%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
      gsap.fromTo(
        inner.current,
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={frame} className={`relative overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-[-6%] will-change-transform">
        {children}
      </div>
    </div>
  );
}

"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { getGsap, prefersReducedMotion, EASE_BIG } from "./motion";

/**
 * Portrait d'Ismael. Ne passe PAS par ExpandingMedia : son zoom (+12 %) et
 * son parallaxe rognaient le haut de la tête et les épaules, la photo
 * source étant cadrée serré (constaté le 23/09/2026 sur l'accueil et
 * /a-propos). Ici la photo, détourée sur fond transparent, est posée
 * entière en bas d'un panneau (object-contain), avec de l'air au-dessus ;
 * le seul mouvement est un rideau qui la découvre de bas en haut, sans
 * jamais la recadrer.
 */
export default function Portrait({
  alt,
  sizes,
  priority = false,
  className = "",
  panel = "bg-surface-2",
}: {
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Fond du panneau : à contraster avec celui de la section. */
  panel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.from(el, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.4,
        ease: EASE_BIG,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`relative aspect-[4/5] overflow-hidden ${panel} ${className}`}>
      <Image
        src="/images/ismael-portrait.webp"
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain object-bottom pt-[8%] grayscale"
      />
    </div>
  );
}

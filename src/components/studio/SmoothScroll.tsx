"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getGsap, prefersReducedMotion } from "./motion";

// Instance partagée : PageTransition la remet en haut à chaque changement
// de page (Next fait un window.scrollTo que Lenis, lui, ne voit pas).
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/**
 * Scroll lissé (Lenis), monté une seule fois dans le layout racine et
 * synchronisé sur l'horloge de GSAP pour que les animations liées au scroll
 * suivent exactement la position affichée. Désactivé si le visiteur a
 * demandé à réduire les animations, et sur écran tactile (le scroll natif y
 * est déjà inertiel, Lenis le dégraderait).
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;
    const { gsap, ScrollTrigger } = getGsap();

    lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 } });
    const l = lenis;
    l.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");

    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis = null;
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  // À chaque page : haut de page, ou l'ancre demandée (/#contact). Le saut
  // natif vers l'ancre a lieu avant que les titres découpés et les images
  // animées aient pris leur hauteur finale et tombe une section trop haut :
  // on recale une fois la page stabilisée (polices chargées, ScrollTrigger
  // recalculé).
  useEffect(() => {
    const { ScrollTrigger } = getGsap();
    const hash = window.location.hash;
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
      const target = hash && document.querySelector(hash);
      if (target) {
        if (lenis) lenis.scrollTo(target as HTMLElement, { immediate: true, offset: -80 });
        else (target as HTMLElement).scrollIntoView();
      } else {
        lenis?.scrollTo(0, { immediate: true });
      }
    });
  }, [pathname]);

  return null;
}

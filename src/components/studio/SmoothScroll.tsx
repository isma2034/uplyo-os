"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { getGsap, prefersReducedMotion } from "./motion";

/**
 * Scroll lissé (Lenis), synchronisé sur l'horloge de GSAP pour que les
 * animations liées au scroll suivent exactement la position affichée.
 * Désactivé si le visiteur a demandé à réduire les animations, et sur
 * écran tactile (le scroll natif y est déjà inertiel, Lenis le dégraderait).
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;
    const { gsap, ScrollTrigger } = getGsap();

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis");

    // Arrivée sur /#contact ou /#offres depuis une autre page : le saut natif
    // a lieu avant que les titres découpés et l'image animée aient pris leur
    // hauteur finale, et tombe une section trop haut. On recale une fois la
    // page stabilisée (polices chargées, ScrollTrigger recalculé).
    const hash = window.location.hash;
    if (hash && document.querySelector(hash)) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
        lenis.scrollTo(hash, { immediate: true, offset: -80 });
      });
    }

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}

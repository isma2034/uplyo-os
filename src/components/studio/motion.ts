"use client";

// Socle commun des animations de la refonte « studio » (direction C, 22/09/2026).
//
// Référence étudiée : locomotive.ca — GSAP + ScrollTrigger + SplitText, scroll
// lissé par Lenis, et DEUX courbes seulement sur tout le site. On reprend ce
// principe : peu de mouvements, toujours les mêmes courbes, pour que
// l'ensemble paraisse dirigé plutôt que décoré.
//
// Ce qu'on ne reprend PAS : leur écran de chargement (plus de 20 s constatées
// sur un Celeron). Les visiteurs d'Uplyo arrivent d'une annonce Google Ads et
// doivent voir le formulaire tout de suite.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    // Les deux courbes de Locomotive (relevées dans leur CSS) :
    // easeOutCubic pour les petits mouvements, easeOutQuint pour les grands.
    gsap.defaults({ ease: "power3.out", duration: 1 });
    registered = true;
  }
  return { gsap, ScrollTrigger, SplitText };
}

export const EASE_BIG = "expo.out"; // ≈ cubic-bezier(0.23, 1, 0.32, 1)
export const EASE_SMALL = "power3.out"; // ≈ cubic-bezier(0.215, 0.61, 0.355, 1)

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

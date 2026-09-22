"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getGsap, prefersReducedMotion, EASE_BIG } from "./motion";

/**
 * Le geste signature de la refonte — titres qui montent ligne par ligne
 * depuis un masque — appliqué à TOUS les h1/h2 du site, sans retoucher
 * chacune des ~20 pages. L'accueil pose ses titres avec SplitTitle
 * (marqués data-split) : ils sont ignorés ici.
 *
 * Le h1 joue à l'arrivée ; les h2 au moment où ils entrent à l'écran.
 * Exclus : titres dans la navigation, le pied de page, les formulaires et
 * les <summary> (le découpage y casserait la mise en page).
 */
export default function StudioMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap, SplitText } = getGsap();

    const titles = Array.from(document.querySelectorAll<HTMLElement>("h1, h2")).filter(
      (el) => !el.closest("[data-split], nav, footer, form, summary, [role='dialog']")
    );

    const ctx = gsap.context(() => {
      titles.forEach((el) => {
        const isH1 = el.tagName === "H1";
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
              delay: isH1 ? 0.15 : 0,
              scrollTrigger: isH1 ? undefined : { trigger: el, start: "top 90%", once: true },
            });
          },
        });
      });
    });

    return () => ctx.revert();
  }, [pathname]);

  return null;
}

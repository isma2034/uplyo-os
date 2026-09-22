"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoMark from "@/components/agency/LogoMark";
import { getGsap, prefersReducedMotion } from "./motion";

/**
 * Transition entre les pages, à la manière de Barba chez Locomotive : un
 * rideau encre (marque rouge au centre) monte et couvre l'écran, la page
 * change dessous, puis le rideau continue sa course vers le haut et découvre la nouvelle page.
 *
 * Intercepte les clics sur les liens internes (délégation sur document :
 * aucun <Link> du site n'a à être modifié). Laissés au navigateur : clics
 * avec modificateur (nouvel onglet), target/download, liens externes,
 * mailto/tel, ancres sur la même page, et le bouton Précédent.
 *
 * Durée totale ≈ 0,9 s dont ~0,45 s avant le changement de page ; le rideau
 * ne retombe qu'une fois la nouvelle page rendue, donc jamais d'écran blanc.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const covering = useRef(false);

  const uncover = () => {
    const { gsap } = getGsap();
    gsap.to(curtain.current, {
      yPercent: -100,
      duration: 0.6,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.set(curtain.current, { display: "none" });
        covering.current = false;
      },
    });
  };

  // Sortie : clic sur un lien interne → le rideau couvre, puis navigation.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Même page (ancre ou lien vers soi-même) : Lenis gère l'ancre.
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      if (covering.current) return;
      covering.current = true;
      router.prefetch(url.pathname + url.search);

      gsap.set(curtain.current, { display: "flex", yPercent: 100 });
      gsap.to(curtain.current, { yPercent: 0, duration: 0.5, ease: "expo.inOut" });

      // Navigation sur une minuterie et non en fin d'animation : si
      // l'animation est suspendue (onglet en arrière-plan, machine saturée),
      // le lien doit quand même aboutir.
      window.setTimeout(() => {
        router.push(url.pathname + url.search + url.hash, { scroll: !url.hash });
        // Filet : si la navigation n'aboutit pas (réseau coupé, erreur),
        // on ne laisse pas le visiteur devant un écran couvert.
        window.setTimeout(() => {
          if (covering.current) uncover();
        }, 6000);
      }, 500);
    };

    // Phase de capture : les <Link> de Next naviguent depuis leur propre
    // gestionnaire React et ignorent un clic déjà `defaultPrevented` — il
    // faut donc passer AVANT eux, sinon la page changerait sans rideau.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // Entrée : la nouvelle page est rendue → le rideau s'en va vers le haut.
  useEffect(() => {
    if (!covering.current) return;
    // Deux frames : laisser le nouveau contenu se peindre avant de découvrir.
    requestAnimationFrame(() => requestAnimationFrame(uncover));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={curtain}
      aria-hidden="true"
      className="fixed inset-0 z-[500] hidden items-center justify-center bg-nuit pointer-events-none"
    >
      <LogoMark size={56} />
    </div>
  );
}

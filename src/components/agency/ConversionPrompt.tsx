"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";
import { CONSENT_KEY } from "./ConsentBanner";

/**
 * Relance de conversion, déclenchée par l'engagement du visiteur.
 *
 * ── Pourquoi ce n'est PAS une fenêtre modale ──────────────────────────────
 * Google traite les interstitiels intrusifs comme un signal négatif de
 * classement sur mobile : une fenêtre qui recouvre le contenu peu après
 * l'arrivée depuis la recherche est précisément le cas visé. Sur un domaine
 * neuf dont on vient de demander l'indexation, le risque n'est pas payant.
 *
 * D'où les choix suivants, tous délibérés :
 *   • un panneau qui se glisse en bas, jamais un voile plein écran ;
 *   • pas de fond assombri, le contenu reste lisible et cliquable derrière ;
 *   • déclenchement à 55 % de défilement — donc après une lecture réelle,
 *     jamais à l'arrivée ;
 *   • `role="complementary"` et non `role="dialog"` : rien n'est modal ici,
 *     annoncer une boîte de dialogue piégerait le focus des lecteurs d'écran
 *     sans raison.
 *
 * ── Ce qui l'empêche d'apparaître ─────────────────────────────────────────
 *   • tant que le choix de consentement n'a pas été fait : les deux panneaux
 *     se superposeraient en bas d'écran, et le bandeau cookies doit rester
 *     lisible pour être valable juridiquement ;
 *   • sur les pages où le visiteur est DÉJÀ en train de convertir (/audit,
 *     /contact, /merci) : l'y relancer n'est que de la friction ;
 *   • après un refus, mémorisé — on ne redemande pas à chaque page.
 */

export const DISMISS_KEY = "uplyo_prompt_v1";
/** Part de la page lue avant de proposer quoi que ce soit. */
export const SCROLL_TRIGGER = 0.55;
/** Le visiteur y est déjà : ne rien lui superposer. */
export const EXCLUDED = ["/audit", "/contact", "/merci"];

/**
 * Décide si la relance a le droit d'apparaître. Isolée du composant pour
 * être testable sans navigateur : les conditions sont ce qui compte ici, et
 * une règle seulement écrite en commentaire ne protège personne.
 */
export function shouldOffer(opts: {
  pathname: string;
  /** Choix de consentement déjà mémorisé (sinon le bandeau occupe le bas). */
  consentChoiceMade: boolean;
  /** Relance déjà refusée par ce visiteur. */
  dismissed: boolean;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}): boolean {
  if (EXCLUDED.some((p) => opts.pathname.startsWith(p))) return false;
  if (opts.dismissed) return false;
  if (!opts.consentChoiceMade) return false;
  const readable = opts.scrollHeight - opts.clientHeight;
  // Page trop courte pour qu'un défilement veuille dire quelque chose.
  if (readable < 400) return false;
  return opts.scrollTop / readable >= SCROLL_TRIGGER;
}

export default function ConversionPrompt() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* stockage bloqué : le refus vaut alors pour la page en cours */
    }
  }, []);

  useEffect(() => {
    if (EXCLUDED.some((p) => pathname.startsWith(p))) return;

    // On n'interroge PAS le consentement ici : il est relu a chaque
    // defilement par `shouldOffer`. La version precedente sortait des le
    // montage quand aucun choix n'etait memorise, et n'attachait donc jamais
    // l'ecouteur — si le visiteur acceptait ensuite, plus rien ne le
    // rebranchait. La relance ne pouvait donc jamais apparaitre lors de la
    // PREMIERE visite, exactement celle qui compte. Constate en navigateur
    // sur la production le 07/09/2026.

    const onScroll = () => {
      const h = document.documentElement;
      let dismissed = false;
      let consentChoiceMade = false;
      try {
        dismissed = !!localStorage.getItem(DISMISS_KEY);
        consentChoiceMade = !!localStorage.getItem(CONSENT_KEY);
      } catch {
        return;
      }
      if (
        shouldOffer({
          pathname,
          consentChoiceMade,
          dismissed,
          scrollTop: h.scrollTop,
          scrollHeight: h.scrollHeight,
          clientHeight: h.clientHeight,
        })
      ) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <aside
      role="complementary"
      aria-label="Proposition d'audit gratuit"
      className="fixed z-[150] bottom-4 right-4 left-4 sm:left-auto sm:w-[380px] bg-surface-0 border border-line-strong rounded-card shadow-lift p-5 motion-safe:animate-[slideUp_.28s_ease-out]"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fermer cette proposition"
        className="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-transparent border-0 cursor-pointer text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
      >
        <X size={17} aria-hidden="true" />
      </button>

      {/* Le texte reprend ce que le site tient déjà : rien n'est promis en
          résultat, et la contrepartie est explicite (aucune obligation). */}
      <p className="text-body-lg font-semibold text-ink mb-2 pr-8">
        Vous voulez savoir ce que ça donne chez vous ?
      </p>
      <p className="text-body text-ink-2 font-light mb-4">
        Je regarde votre compte et votre site, et je vous écris ce que j&apos;y vois. Gratuit, sous
        48 h ouvrées, et vous repartez avec le rapport même si l&apos;on ne travaille pas ensemble.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/audit"
          onClick={() => trackCTAClick("conversion_prompt", "audit")}
          className="btn-primary no-underline inline-flex items-center gap-2 text-body px-4 py-2.5"
        >
          Recevoir mon audit
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex items-center py-2 text-body text-ink-3 font-light bg-transparent border-0 cursor-pointer hover:text-ink-2 transition-colors"
        >
          Plus tard
        </button>
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const CONSENT_KEY = "uplyo_consent_v1";

type Choice = "granted" | "denied";

// `Window.dataLayer` est déjà déclaré dans Analytics.tsx : le redéclarer ici
// avec un modificateur différent (optionnel) fait échouer la compilation
// TypeScript ("All declarations of 'dataLayer' must have identical
// modifiers"). Les augmentations globales sont partagées par tout le projet.

/** Envoie la mise à jour à Google via dataLayer (fonctionne avec GTM comme
 *  avec gtag.js, les deux consomment la même file). */
function pushConsent(choice: Choice) {
  window.dataLayer = window.dataLayer || [];
  // La forme `arguments` est imposée par gtag : un objet simple ne serait
  // pas interprété comme une commande de consentement.
  // Signature en paramètres du reste pour que TypeScript accepte l'appel,
  // mais on pousse bien `arguments` : gtag n'interprète une commande de
  // consentement que sous cette forme, pas sous forme d'objet simple.
  function gtag(...args: unknown[]) {
    void args;
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  gtag("consent", "update", {
    ad_storage: choice,
    analytics_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  });
  window.dataLayer.push({ event: choice === "granted" ? "consent_granted" : "consent_denied" });
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      // Navigation privée ou stockage bloqué : on affiche la bannière, le
      // choix ne sera simplement pas mémorisé d'une visite à l'autre.
      setVisible(true);
    }
  }, []);

  function decide(choice: Choice) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* choix non mémorisable, mais appliqué pour cette visite */
    }
    pushConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Choix concernant la mesure d'audience"
      className="fixed inset-x-0 bottom-0 z-[200] border-t border-line-strong bg-surface-0 shadow-lift"
    >
      <div className="container-wide py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-body text-ink-2 font-light max-w-[62ch]">
          J&apos;utilise un outil de mesure d&apos;audience pour savoir quelles pages
          sont lues et d&apos;où viennent les visiteurs. Rien n&apos;est mesuré tant que
          vous n&apos;avez pas accepté, et le site fonctionne identiquement si vous
          refusez.{" "}
          <Link
            href="/confidentialite"
            className="text-eclat-ink underline underline-offset-4"
          >
            Détail des données
          </Link>
        </p>

        {/* Refuser doit être aussi accessible qu'accepter : même taille, même
            niveau de lecture. Une bannière où le refus est caché ou grisé est
            un dark pattern, et la CNIL le sanctionne. */}
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="btn-outline text-body px-5 py-2.5"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="btn-primary text-body px-5 py-2.5"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

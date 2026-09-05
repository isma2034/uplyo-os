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
        {/* Le texte est le seul vrai levier d'acceptation qui reste légal.
            Ce qui fonctionne, et qui est vrai ici :
            1. une raison CONCRÈTE (pas « améliorer votre expérience », formule
               vide qui fait refuser par réflexe) ;
            2. la réciprocité : ces visiteurs sont des dirigeants de PME à qui
               Uplyo vend précisément de la mesure — leur dire pourquoi elle
               compte est à la fois honnête et convaincant pour eux ;
            3. l'absence d'enjeu affichée clairement : rien ne change pour eux
               s'ils refusent, ce qui lève la méfiance qui fait cliquer
               « refuser » par défaut. */}
        <p className="text-body text-ink-2 font-light max-w-[62ch]">
          Je mesure quelles pages sont lues et d&apos;où viennent les visiteurs —
          c&apos;est comme ça que je sais quoi améliorer, et c&apos;est exactement ce
          que je mets en place chez mes clients. Rien n&apos;est collecté avant
          votre accord, rien n&apos;est revendu, et le site fonctionne à
          l&apos;identique si vous refusez.{" "}
          <Link
            href="/confidentialite"
            className="text-eclat-ink underline underline-offset-4"
          >
            Ce qui est collecté
          </Link>
        </p>

        {/* Refuser doit rester aussi accessible qu'accepter : un seul clic,
            même taille, même lisibilité. La CNIL a sanctionné exactement
            l'inverse (Google 150 M€, Amazon 35 M€ en 2021 : refuser demandait
            plusieurs clics quand accepter n'en demandait qu'un).

            Ce qui reste permis et qu'on utilise : « Accepter » porte le style
            principal du site, « Refuser » le style secondaire — les deux
            boutons ont la même taille, la même police et le même nombre de
            clics. C'est la limite exacte du légal. */}
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="btn-outline text-body px-5 py-2.5 whitespace-nowrap"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="btn-primary text-body px-5 py-2.5 whitespace-nowrap"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

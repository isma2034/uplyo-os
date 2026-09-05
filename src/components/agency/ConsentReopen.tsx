"use client";

import { CONSENT_EVENT } from "./ConsentBanner";

/**
 * Lien « Gérer mes cookies » du pied de page.
 *
 * Sans lui, un visiteur qui a fait son choix une fois ne peut plus jamais en
 * changer : la bannière ne se réaffiche pas, et rien d'autre ne la rouvre.
 * C'est un manquement — le RGPD impose de pouvoir retirer son consentement
 * aussi facilement qu'on l'a donné — et c'est aussi ce qui rendait le
 * dispositif intestable après un premier clic.
 *
 * Le pied de page est un composant serveur : ce bouton est isolé côté client
 * uniquement pour pouvoir déclencher l'événement.
 */
export default function ConsentReopen() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_EVENT))}
      className="inline-flex items-center py-1.5 text-caption text-white/70 no-underline hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0"
    >
      Gérer mes cookies
    </button>
  );
}

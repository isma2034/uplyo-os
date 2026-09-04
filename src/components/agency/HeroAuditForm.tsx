"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

/**
 * Unique CTA plein de la page d'accueil : une carte à un seul champ (URL) qui
 * pré-remplit le formulaire d'audit.
 *
 * Remplace l'ancien widget KPI décoratif du hero et les deux boutons
 * concurrents ("Réserver un appel" + "Voir les offres") qui se disputaient
 * l'attention.
 */
export default function HeroAuditForm() {
  const [site, setSite] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = site.trim();
    trackCTAClick("hero", "audit_site_url");
    router.push(value ? `/audit?site=${encodeURIComponent(value)}` : "/audit");
  };

  return (
    <div className="bg-white border border-line rounded-panel overflow-hidden shadow-panel">
      <div className="bg-nuit px-5 py-3.5 flex items-center justify-between gap-3">
        <span className="label text-white">Audit gratuit</span>
        <span className="label text-spark">48 h</span>
      </div>

      <form onSubmit={handleSubmit} className="p-5 md:p-6">
        <label htmlFor="hero-site" className="block text-body font-semibold text-ink mb-1.5">
          L&apos;adresse de votre site
        </label>
        <p className="text-caption text-ink-3 mb-3.5">
          Je regarde votre marché, vos concurrents sur Google et — si vous avez déjà des campagnes —
          votre compte. Vous recevez le rapport sous 48 h.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            id="hero-site"
            name="site"
            type="text"
            inputMode="url"
            autoComplete="url"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="monentreprise.fr"
            className="field flex-1 min-w-0"
          />
          <button type="submit" className="btn-primary justify-center whitespace-nowrap">
            Demander l&apos;audit
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Seconde entrée, explicite. La majorité des entreprises démarchées
            n'a aucune campagne Google Ads : sans cette porte, elles lisent une
            promesse (« votre compte ») qui ne les concerne pas et repartent. */}
        <button
          type="button"
          onClick={() => {
            const value = site.trim();
            trackCTAClick("hero", "audit_sans_campagne");
            router.push(
              value
                ? `/audit/sans-campagne?site=${encodeURIComponent(value)}`
                : "/audit/sans-campagne"
            );
          }}
          className="mt-3.5 inline-flex items-center gap-1.5 text-caption font-semibold text-eclat-ink bg-transparent border-none p-0 cursor-pointer hover:underline underline-offset-4"
        >
          Pas encore de campagne Google Ads ? C&apos;est par ici
          <ArrowRight size={13} aria-hidden="true" />
        </button>

        <ul className="mt-4 pt-4 border-t border-line flex flex-col gap-1.5">
          {[
            "Gratuit, et vous ne payez rien ensuite si vous en restez là",
            "Pas de rappel commercial si vous ne le demandez pas",
            "Budget Google Ads minimum conseillé : 500 €/mois",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 text-caption text-ink-2">
              <span aria-hidden="true" className="text-eclat-ink font-semibold leading-5">
                ·
              </span>
              {t}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

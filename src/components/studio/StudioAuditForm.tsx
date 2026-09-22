"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { trackCTAClick } from "@/lib/analytics";

/**
 * Même mécanique que HeroAuditForm (un seul champ, l'URL, qui pré-remplit
 * /audit), en version « studio » : un champ souligné sur toute la largeur
 * au lieu d'une carte encadrée. La seconde porte (« pas encore de
 * campagne ») est conservée : c'est la majorité des visiteurs démarchés.
 */
export default function StudioAuditForm({ id = "hero-site" }: { id?: string }) {
  const [site, setSite] = useState("");
  const router = useRouter();

  const go = (path: string, label: string) => {
    const value = site.trim();
    trackCTAClick("hero", label);
    router.push(value ? `${path}?site=${encodeURIComponent(value)}` : path);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    go("/audit", "audit_site_url");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor={id} className="block studio-meta text-ink-3 mb-3">
        L&apos;adresse de votre site — audit gratuit, rapport écrit sous 48 h
      </label>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
        <input
          id={id}
          name="site"
          type="text"
          inputMode="url"
          autoComplete="url"
          value={site}
          onChange={(e) => setSite(e.target.value)}
          placeholder="monentreprise.fr"
          className="flex-1 min-w-0 bg-transparent border-0 border-b-2 border-ink focus:border-eclat outline-none transition-colors duration-300 pb-3 text-[clamp(1.375rem,2.4vw,2rem)] text-ink placeholder:text-ink-3/60 font-display"
        />
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-2 bg-eclat text-white studio-body font-semibold px-6 py-3.5 rounded-uplyo whitespace-nowrap transition-colors duration-300 hover:bg-eclat-hover"
        >
          Recevoir mon audit
          <span aria-hidden="true" className="studio-arrow group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
      <button
        type="button"
        onClick={() => go("/audit/sans-campagne", "audit_sans_campagne")}
        className="studio-link mt-4 studio-meta font-semibold text-eclat-ink bg-transparent border-none cursor-pointer p-0"
      >
        Pas encore de campagne Google Ads ? C&apos;est par ici →
      </button>
    </form>
  );
}

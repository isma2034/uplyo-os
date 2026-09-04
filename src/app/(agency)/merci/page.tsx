import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import CalendlyLink from "@/components/agency/CalendlyLink";
import { SITE_CONFIG } from "@/lib/config";

/**
 * Page de confirmation, atteinte après l'envoi d'un des trois formulaires.
 *
 * COMPOSANT SERVEUR, et c'est le correctif principal ici. La page était un
 * Client Component qui lisait `useSearchParams()` dans un <Suspense
 * fallback={null}> : sur une page prérendue, Next.js sert alors le fallback,
 * c'est-à-dire RIEN. Le HTML livré ne contenait ni titre, ni confirmation, ni
 * étapes suivantes (vérifié : `curl /merci?source=audit | grep -c "<h1"` → 0).
 * Tout n'apparaissait qu'après hydratation. Autrement dit : le visiteur venait
 * d'envoyer sa demande et voyait une page vide le temps du chargement du
 * bundle — et une page définitivement vide si le bundle échouait.
 *
 * En lisant `searchParams` côté serveur, la confirmation est dans le HTML dès
 * la première réponse. La page devient rendue à la demande, ce qui est sans
 * conséquence : elle est en `disallow` dans robots.ts et n'a aucun enjeu SEO.
 *
 * `generate_lead` n'est PAS émis ici : les formulaires l'émettent déjà, et
 * l'émettre aussi au chargement de cette page comptait chaque conversion en
 * double dans GA4 (bug corrigé précédemment, à ne pas réintroduire).
 */

export const metadata: Metadata = {
  title: "Demande reçue",
  robots: { index: false, follow: false },
};

type Source = "contact" | "audit" | "rappel";

const CONTENT: Record<Source, { h1: string; lead: string; steps: string[] }> = {
  rappel: {
    h1: "Demande de rappel reçue",
    lead: "Je vous appelle sur le créneau que vous avez choisi, sous 48 h ouvrées.",
    steps: [
      "Je note votre demande et votre créneau",
      "Je vous appelle sur le créneau choisi, sous 48 h ouvrées",
      "Si vous n'êtes pas disponible, je laisse un message et je n'insiste pas",
    ],
  },
  audit: {
    h1: "Demande d'audit reçue",
    lead: "Je vous envoie le rapport écrit sous 48 h ouvrées.",
    steps: [
      "Je regarde votre site, votre marché et — si vous en avez un — votre compte",
      "Vous recevez le rapport écrit sous 48 h ouvrées",
      "On en parle 30 minutes si vous le souhaitez — sinon, le rapport est à vous",
    ],
  },
  contact: {
    h1: "Message reçu",
    lead: "Je vous réponds sous 24 h ouvrées.",
    steps: [
      "Je lis votre message",
      "Je vous réponds sous 24 h ouvrées, personnellement",
      "On cale un appel de 30 minutes si c'est pertinent",
    ],
  },
};

export default function MerciPage({
  searchParams,
}: {
  searchParams?: { source?: string | string[] };
}) {
  const raw = Array.isArray(searchParams?.source) ? searchParams?.source[0] : searchParams?.source;
  const source: Source = raw === "audit" || raw === "rappel" ? raw : "contact";
  const c = CONTENT[source];

  return (
    <section className="min-h-[calc(100vh-68px)] flex items-center justify-center py-16">
      <div className="container-text">
        <Reveal>
          <div className="bg-white border border-line rounded-card p-8 md:p-12 max-w-[560px] mx-auto text-center shadow-card">
            <CircleCheck size={44} className="text-eclat-ink mx-auto mb-5" aria-hidden="true" />

            <h1 className="text-section font-semibold text-ink mb-3">{c.h1}</h1>
            <p className="text-body-lg text-ink-2 mb-8 font-light">{c.lead}</p>

            <div className="bg-surface-2 rounded-card p-5 mb-8 text-left">
              <div className="label text-ink-3 mb-4">Ce qui se passe maintenant</div>
              <ol className="flex flex-col gap-3">
                {c.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="w-[22px] h-[22px] rounded-full bg-eclat text-white text-caption font-semibold grid place-items-center shrink-0 mt-0.5"
                    >
                      {i + 1}
                    </span>
                    <span className="text-body text-ink-2 font-light">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <CalendlyLink location="merci_page" className="btn-primary no-underline justify-center">
                Réserver un créneau
                <ArrowRight size={16} aria-hidden="true" />
              </CalendlyLink>
              <Link href="/" className="btn-outline no-underline justify-center">
                Retour au site
              </Link>
            </div>

            <p className="text-caption text-ink-3 font-light">
              Une question urgente ?{" "}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-eclat-ink no-underline hover:underline underline-offset-4"
              >
                {SITE_CONFIG.contactEmail}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

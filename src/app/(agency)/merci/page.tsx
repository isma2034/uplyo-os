"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import { SITE_CONFIG } from "@/lib/config";
import { trackCalendlyClick } from "@/lib/analytics";

// useSearchParams() désoptimise la page en rendu statique si elle n'est pas
// enveloppée dans un <Suspense> — le build échoue sinon. Détecté en lançant
// réellement `npm run build`, pas visible à la lecture du code.
export default function MerciPage() {
  return (
    <Suspense fallback={null}>
      <MerciContent />
    </Suspense>
  );
}

type Source = "contact" | "audit" | "rappel";

function MerciContent() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("source") ?? "contact";
  const source: Source = raw === "audit" || raw === "rappel" ? raw : "contact";

  // `generate_lead` etait emis DEUX fois par soumission : une fois par le
  // formulaire (qui connait le budget, donc la valeur de conversion) et une
  // seconde ici, au chargement de la page. Toutes les conversions du site
  // etaient donc comptees double dans GA4, avec une valeur faussee. Cette
  // page ne declenche plus rien : les deux formulaires emettent deja
  // l'evenement, et /merci n'est atteignable que depuis eux (verifie : aucun
  // autre lien vers /merci dans src/, et la page est en disallow robots).
  // Conversion Google Ads — a activer apres validation de la balise, cote
  // formulaire : trackGoogleAdsConversion("AW-XXXXXXXXX/XXXXXXXXXXXXXXXX").

  const isAudit = source === "audit";
  const isRappel = source === "rappel";

  const steps = isRappel
    ? [
        "Je note votre demande et votre créneau",
        "Je vous appelle sur le créneau choisi, sous 48 h ouvrées",
        "Si vous n'êtes pas disponible, je laisse un message et je n'insiste pas",
      ]
    : isAudit
    ? [
        "Je regarde votre compte et votre marché",
        "Vous recevez le rapport écrit sous 48 h ouvrées",
        "On en parle 30 minutes si vous le souhaitez — sinon, le rapport est à vous",
      ]
    : [
        "Je lis votre message",
        "Je vous réponds sous 24 h ouvrées, personnellement",
        "On cale un appel de 30 minutes si c'est pertinent",
      ];

  return (
    <section className="min-h-[calc(100vh-68px)] flex items-center justify-center py-16">
      <div className="container-text">
        <Reveal>
          <div className="bg-white border border-line rounded-card p-8 md:p-12 max-w-[560px] mx-auto text-center shadow-card">
            <CircleCheck size={44} className="text-eclat-ink mx-auto mb-5" aria-hidden="true" />

            <h1 className="text-section font-semibold text-ink mb-3">
              {isRappel
                ? "Demande de rappel reçue"
                : isAudit
                ? "Demande d'audit reçue"
                : "Message reçu"}
            </h1>
            <p className="text-body-lg text-ink-2 mb-8 font-light">
              {isRappel
                ? "Je vous appelle sur le créneau que vous avez choisi, sous 48 h ouvrées."
                : isAudit
                ? "Je vous envoie le rapport écrit sous 48 h ouvrées."
                : "Je vous réponds sous 24 h ouvrées."}
            </p>

            <div className="bg-surface-2 rounded-card p-5 mb-8 text-left">
              <div className="label text-ink-3 mb-4">Ce qui se passe maintenant</div>
              <ol className="flex flex-col gap-3">
                {steps.map((step, i) => (
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
              <a
                href={SITE_CONFIG.calendlyUrl}
                target="_blank"
                rel="noopener"
                onClick={() => trackCalendlyClick("merci_page")}
                className="btn-primary no-underline justify-center"
              >
                Réserver un créneau
                <ArrowRight size={16} aria-hidden="true" />
              </a>
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

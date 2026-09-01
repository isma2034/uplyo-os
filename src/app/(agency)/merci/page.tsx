"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/agency/Reveal";
import { SITE_CONFIG } from "@/lib/config";
import { trackFormSubmit, trackCalendlyClick } from "@/lib/analytics";

// useSearchParams() opts the page out of static rendering unless wrapped in
// Suspense — Next.js build fails otherwise ("should be wrapped in a
// suspense boundary"). Caught by actually running `npm run build`, not
// visible from reading the code alone.
export default function MerciPage() {
  return (
    <Suspense fallback={null}>
      <MerciContent />
    </Suspense>
  );
}

function MerciContent() {
  const searchParams = useSearchParams();
  const source = (searchParams.get("source") ?? "contact") as "contact" | "audit";
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackFormSubmit(source);
    // Google Ads conversion — activer après validation dans Google Ads
    // trackGoogleAdsConversion("AW-XXXXXXXXX/XXXXXXXXXXXXXXXX");
  }, [source]);

  const isAudit = source === "audit";

  return (
    <section className="min-h-[calc(100vh-68px)] flex items-center justify-center px-6 md:px-10 py-16">
      <Reveal>
        <div className="bg-white border-[1.5px] border-[var(--bd)] rounded-uplyo-lg p-8 md:p-12 max-w-[560px] w-full text-center shadow-[0_8px_30px_rgba(108,92,231,0.06)]">
          {/* Icon */}
          <div className="w-[72px] h-[72px] bg-lune border-[2px] border-eclat/20 rounded-full grid place-items-center mx-auto mb-6 text-3xl">
            ✅
          </div>

          <h1 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-semibold tracking-tight text-ink mb-3 leading-[1.1]">
            {isAudit ? "Demande d'audit reçue !" : "Demande reçue !"}
          </h1>
          <p className="text-[15px] text-ink-2 leading-relaxed mb-8 font-light">
            {isAudit
              ? "Nous analysons votre compte et vous envoyons le rapport sous 48h ouvrées."
              : <>Nous avons bien reçu votre demande et revenons vers vous sous{" "}<strong className="text-ink font-semibold">24 heures ouvrées</strong> avec une analyse personnalisée.</>}
          </p>

          {/* Steps */}
          <div className="bg-[var(--w2)] rounded-xl p-5 mb-8 text-left">
            <div className="font-mono text-[10px] font-semibold text-ink-3 uppercase tracking-[0.1em] mb-4">
              Ce qui se passe maintenant
            </div>
            <div className="flex flex-col gap-3">
              {(isAudit
                ? [
                    "Nous analysons votre compte et votre potentiel Google Ads",
                    "Vous recevez un rapport PDF détaillé sous 48h",
                    "On en discute ensemble lors de l'appel de restitution",
                  ]
                : [
                    "Nous analysons votre secteur et votre potentiel Google Ads",
                    "Nous préparons une analyse personnalisée avec des chiffres concrets",
                    "Nous vous contactons sous 24h pour un échange de 30 minutes",
                  ]
              ).map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-[22px] h-[22px] rounded-full bg-eclat text-white text-[11px] font-bold grid place-items-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-[14px] text-ink-2 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a
              href={SITE_CONFIG.calendlyUrl}
              target="_blank"
              rel="noopener"
              onClick={() => trackCalendlyClick("merci_page")}
              className="btn-primary no-underline text-sm"
            >
              📅 Réserver un créneau maintenant →
            </a>
            <Link href="/" className="btn-outline no-underline text-sm">
              ← Retour au site
            </Link>
          </div>

          <div className="text-[12px] text-ink-3 font-light">
            Des questions urgentes ?{" "}
            <a href="mailto:contact@uplyo.fr" className="text-eclat no-underline hover:underline">
              contact@uplyo.fr
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

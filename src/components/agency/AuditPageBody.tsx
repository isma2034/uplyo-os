import Link from "next/link";
import { ArrowRight, Check, UserRound } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import AuditForm from "@/components/agency/AuditForm";
import { AUDIT_TRACKS, type AuditTrack } from "@/lib/audit-content";

/**
 * Corps commun aux deux pages d'audit (/audit et /audit/sans-campagne).
 *
 * Composant SERVEUR : tout l'interactif est isolé dans <AuditForm />. Le
 * contenu éditorial, long, n'entre donc pas dans le bundle client, et les
 * pages qui l'utilisent restent statiques et peuvent exporter `metadata`.
 *
 * Le contenu vient de src/lib/audit-content.ts ; ce fichier ne contient que la
 * mise en page, strictement identique d'un parcours à l'autre.
 */
export default function AuditPageBody({ track }: { track: AuditTrack }) {
  const c = AUDIT_TRACKS[track];

  return (
    <>
      {/* Bascule vers l'autre parcours — première chose lue, avant le H1.
          C'est le correctif du défaut principal : un visiteur sans compte
          Google Ads arrivé sur /audit repartait au lieu de trouver sa porte. */}
      <div className="border-b border-line bg-surface-2">
        <div className="container-wide py-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
          <span className="text-body text-ink-2 font-light">{c.switchTo.question}</span>
          <Link
            href={c.switchTo.href}
            className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
          >
            {c.switchTo.cta}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Hero + formulaire.

          Placement explicite en grille plutôt qu'un simple « colonne gauche /
          colonne droite » : sur mobile, la grille retombe sur une colonne et
          suit l'ordre du DOM. Avec l'ancienne structure, le formulaire arrivait
          APRÈS la liste complète de ce que contient le rapport, soit très bas
          dans la page — sur la page de conversion principale. Ici, l'ordre
          mobile est : titre, chapô, repères, FORMULAIRE, puis le détail.
          Sur ≥ lg, le formulaire reprend sa colonne de droite sur deux rangées
          (`self-stretch` donne enfin de la course à son `lg:sticky`, qui ne
          servait à rien dans une cellule alignée en `items-start`). */}
      <section className="section">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-x-16 lg:gap-y-10 items-start">
          <Reveal className="lg:col-start-1 lg:row-start-1">
            <div>
              <p className="label text-eclat-ink mb-4">{c.eyebrow}</p>
              <h1 className="text-display font-semibold text-ink mb-5">{c.h1}</h1>
              <p className="text-lead text-ink-2 max-w-[58ch] font-light mb-8">{c.lede}</p>

              <dl className="grid grid-cols-2 sm:grid-cols-4 border-t border-line">
                {c.stats.map((s) => (
                  <div key={s.k} className="py-4 pr-4 border-b border-line">
                    <dt className="label text-ink-3 mb-1">{s.k}</dt>
                    <dd className="text-body-lg font-semibold text-ink">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {/* Formulaire multi-etapes (composant client isole) */}
          <Reveal
            delay={120}
            className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-stretch"
          >
            <AuditForm track={track} title={c.form.title} subtitle={c.form.subtitle} />
          </Reveal>

          <Reveal className="lg:col-start-1 lg:row-start-2">
            <div>
              <h2 className="text-title font-semibold text-ink mb-5">{c.includesTitle}</h2>
              <ol className="border-t border-line">
                {c.includes.map((item, i) => (
                  <li
                    key={item.t}
                    className="grid grid-cols-[40px_1fr] gap-3 py-4 border-b border-line"
                  >
                    <span className="font-mono text-body font-medium text-eclat-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-body font-semibold text-ink mb-1">{item.t}</span>
                      <span className="block text-body text-ink-2 font-light">{item.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Qui fait cet audit */}
      <section className="section-tight bg-surface-2">
        <div className="container-wide">
          <Reveal>
            <div className="bg-white border border-line rounded-card p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start max-w-[860px]">
              {/* Emplacement photo — aucun portrait réel disponible à ce jour. */}
              <div
                className="w-[84px] h-[84px] shrink-0 rounded-full border border-dashed border-line-strong bg-surface-2 grid place-items-center"
                aria-hidden="true"
              >
                <UserRound size={26} className="text-ink-3" />
              </div>
              <div>
                <div className="label text-ink-3 mb-2">Qui fait cet audit</div>
                <h2 className="text-title font-semibold text-ink mb-2">Ismael</h2>
                <p className="text-body text-ink-2 font-light mb-3 max-w-[62ch]">
                  Je gère des campagnes Google Ads, seul. C&apos;est moi qui
                  regarderai votre situation, moi qui rédigerai ce rapport, et moi qui vous répondrai
                  si vous avez une question dessus — il n&apos;y a personne d&apos;autre.
                </p>
                <Link
                  href="/a-propos"
                  className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
                >
                  Mon parcours et mes limites
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Ce que cet audit ne fera pas */}
      <section className="section-tight bg-nuit">
        <div className="container-wide">
          <Reveal>
            <div className="max-w-text mb-7">
              <p className="label text-spark mb-4">Les limites</p>
              <h2 className="text-section font-semibold text-white">{c.wontTitle}</h2>
            </div>
          </Reveal>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3.5">
            {c.wont.map((t) => (
              <li key={t} className="flex gap-3 text-body text-white/80 font-light">
                <span aria-hidden="true" className="text-spark shrink-0 leading-6">
                  —
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Transparence */}
      <section className="section-tight">
        <div className="container-text text-center">
          <Reveal>
            <h2 className="text-title font-semibold text-ink mb-4">
              Pas de témoignages ici — pas encore
            </h2>
            <p className="text-body-lg text-ink-2 font-light mb-3">
              J&apos;accompagne un seul client à ce jour, depuis 2026. Tant que son accord de
              publication n&apos;est pas obtenu, vous ne trouverez sur ce site ni avis, ni note, ni
              moyenne de résultats.
            </p>
            <p className="text-body-lg text-ink-2 font-light">
              L&apos;audit est justement fait pour ça : il porte sur votre activité à vous, et il
              vous montre comment je travaille avant tout engagement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-text">
          <Reveal>
            <h2 className="text-section font-semibold text-ink mb-8">Questions sur l&apos;audit</h2>
            <div className="border-t border-line">
              {c.faq.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="py-4 flex items-start justify-between gap-6 cursor-pointer text-body-lg font-medium text-ink list-none">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-eclat-ink text-xl leading-6 shrink-0 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-body text-ink-2 leading-relaxed font-light">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Rappel final — seul bloc bg-eclat de la page.
          L'ancre visait #a-website, l'identifiant d'un champ qui n'existe dans
          le DOM qu'à l'étape 1 du formulaire : le bouton ne faisait plus rien
          dès que le visiteur avait passé l'étape 1 ou basculé en mode rappel.
          Elle vise désormais le conteneur du formulaire, toujours présent. */}
      <section className="bg-eclat">
        <div className="container-text py-14 md:py-20 text-center">
          <h2 className="text-section font-semibold text-white mb-5">{c.closing.title}</h2>
          <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center mb-8">
            {c.closing.bullets.map((t) => (
              <li key={t} className="flex items-center justify-center gap-2 text-body-lg text-white">
                <Check size={16} className="shrink-0" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <a href="#formulaire" className="btn-invert">
            Remplir le formulaire
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}

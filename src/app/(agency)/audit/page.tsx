import Link from "next/link";
import { ArrowRight, Check, UserRound } from "lucide-react";
import Reveal from "@/components/agency/Reveal";
import AuditForm from "@/components/agency/AuditForm";
import { MEDIA_FLOOR } from "@/lib/offers";

const AUDIT_INCLUDES = [
  {
    t: "L'état de la mesure",
    d: "Je teste vos conversions pour de vrai : j'appelle le numéro, j'envoie le formulaire, et je vous montre ce qui remonte, ce qui est compté deux fois et ce qui manque.",
  },
  {
    t: "Où part le budget",
    d: "Lecture du rapport de termes de recherche : les requêtes réellement payées, celles qui n'ont rien à voir avec votre activité, et ce qu'elles vous coûtent.",
  },
  {
    t: "La structure du compte",
    d: "Campagnes, groupes, enchères, exclusions, annonces. Ce qui est en place, ce qui manque, et ce qui est à refaire plutôt qu'à corriger.",
  },
  {
    t: "Le marché et les concurrents",
    d: "Les requêtes tapées par vos clients, leur volume, leur coût au clic, et les annonceurs déjà présents dessus.",
  },
  {
    t: "Trois actions à faire en premier",
    d: "Classées par effet attendu, avec le détail pour les appliquer vous-même si vous le souhaitez.",
  },
  {
    t: "Un rapport écrit, sous 48 h",
    d: "Avec les captures du compte à l'appui. Il est à vous, que l'on travaille ensemble ensuite ou non.",
  },
];

// Limite assumée : ce que l'audit ne fera pas. Sans ce bloc, « audit gratuit »
// laisse entendre une prestation illimitée et déçoit à la livraison.
const AUDIT_WONT = [
  "Prédire votre coût par demande ou votre chiffre d'affaires : cela dépend de la concurrence, de la saison et de votre taux de transformation, que personne ne connaît à l'avance.",
  "Corriger votre compte. L'audit constate et priorise ; les modifications sont du travail facturé, ou à faire vous-même avec le rapport.",
  "Refaire votre site. Je signale ce qui freine la conversion, sans intervenir dessus.",
  "Analyser Meta, TikTok, Amazon ou votre référencement naturel : je ne fais que Google Ads.",
  `Vous être utile si votre budget publicitaire est très inférieur à ${MEDIA_FLOOR.local} : il n'y aurait pas assez de données pour conclure quoi que ce soit.`,
];

const FAQ = [
  {
    q: "C'est vraiment gratuit ? Où est le piège ?",
    a: "Il n'y en a pas, mais il y a un intérêt : c'est ma façon de vous montrer comment je travaille avant que vous ne payiez quoi que ce soit. Si le rapport vous suffit et que vous appliquez les corrections vous-même, tant mieux — vous ne me devez rien.",
  },
  {
    q: "Faut-il me donner accès au compte ?",
    a: "C'est mieux, en lecture seule, parce que l'essentiel se voit dans le rapport de termes de recherche et dans la configuration des conversions. Sans accès, je peux tout de même faire une analyse de marché et de concurrence à partir de votre site.",
  },
  {
    q: "Et si je n'ai pas encore de campagnes ?",
    a: "L'audit devient une étude d'opportunité : les requêtes tapées dans votre secteur et votre zone, leur volume, leur coût au clic, et l'ordre de grandeur de budget nécessaire. Il arrive que la conclusion soit « n'y allez pas » — je vous le dirai.",
  },
  {
    q: "Combien de temps ça prend, de mon côté ?",
    a: "Le formulaire ci-contre, puis rien. Vous recevez le rapport sous 48 h. L'appel de restitution de 30 minutes est proposé, pas imposé.",
  },
  {
    q: "Allez-vous me relancer ?",
    a: "Non. Vous recevez le rapport, et un appel seulement si vous le demandez. Si vous ne répondez pas, je n'insiste pas.",
  },
];

// Cette page n'est plus un Client Component : tout l'interactif vit dans
// <AuditForm />. Le layout voisin peut donc continuer d'exporter `metadata`,
// et le contenu editorial (long) est rendu cote serveur.
export default function AuditPage() {
  return (
    <>
      {/* Hero + formulaire */}
      <section className="section">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
          <Reveal>
            <div>
              <p className="label text-eclat-ink mb-4">Audit gratuit · 48 h</p>
              <h1 className="text-display font-semibold text-ink mb-5">
                Je regarde votre compte, et je vous écris ce que j&apos;y vois.
              </h1>
              <p className="text-lead text-ink-2 max-w-[58ch] font-light mb-8">
                Requêtes hors sujet payées chaque jour, conversions qui ne remontent pas, structure
                qui empêche d&apos;arbitrer : la plupart des comptes perdent du budget sans que
                personne ne le voie. L&apos;audit chiffre ces fuites et vous les montre, captures à
                l&apos;appui.
              </p>

              <dl className="grid grid-cols-2 sm:grid-cols-4 border-t border-line mb-10">
                {[
                  { k: "Prix", v: "Gratuit" },
                  { k: "Délai", v: "48 h" },
                  { k: "Format", v: "Rapport écrit" },
                  { k: "Suite", v: "Aucune obligation" },
                ].map((s) => (
                  <div key={s.k} className="py-4 pr-4 border-b border-line">
                    <dt className="label text-ink-3 mb-1">{s.k}</dt>
                    <dd className="text-body-lg font-semibold text-ink">{s.v}</dd>
                  </div>
                ))}
              </dl>

              <h2 className="text-title font-semibold text-ink mb-5">Ce que contient le rapport</h2>
              <ol className="border-t border-line">
                {AUDIT_INCLUDES.map((item, i) => (
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

          {/* Formulaire multi-etapes (composant client isole) */}
          <Reveal delay={120}>
            <AuditForm />
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
                  Je gère les campagnes Google Ads de PME de services, seul. C&apos;est moi qui
                  ouvrirai votre compte, moi qui rédigerai ce rapport, et moi qui vous répondrai si
                  vous avez une question dessus — il n&apos;y a personne d&apos;autre.
                </p>
                <Link
                  href="/a-propos"
                  className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
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
              <h2 className="text-section font-semibold text-white">Ce que cet audit ne fera pas</h2>
            </div>
          </Reveal>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3.5">
            {AUDIT_WONT.map((t) => (
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
              L&apos;audit est justement fait pour ça : il porte sur votre compte à vous, et il vous
              montre comment je travaille avant tout engagement.
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
              {FAQ.map((f) => (
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

      {/* Rappel final — seul bloc bg-eclat de la page */}
      <section className="bg-eclat">
        <div className="container-text py-14 md:py-20 text-center">
          <h2 className="text-section font-semibold text-white mb-5">
            Il n&apos;y a rien à perdre à essayer
          </h2>
          <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center mb-8">
            {["Gratuit", "Rapport écrit sous 48 h", "Aucune relance"].map((t) => (
              <li key={t} className="flex items-center justify-center gap-2 text-body-lg text-white">
                <Check size={16} className="shrink-0" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <a href="#a-website" className="btn-invert">
            Remplir le formulaire
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}

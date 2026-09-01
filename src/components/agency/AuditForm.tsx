"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { trackFormStart, trackFormStep, trackFormSubmit, trackCTAClick } from "@/lib/analytics";

/**
 * Formulaire de la page /audit.
 *
 * Découpé en 2 étapes dans un seul composant (pas de navigation de page) :
 *   1. site web + email — le strict nécessaire pour ouvrir un dossier ;
 *   2. identité, budget, secteur, objectif, et un mot libre facultatif.
 *
 * Pourquoi 2 et pas 3 : une 3e étape ne portant qu'un champ facultatif
 * ajouterait un point d'abandon APRÈS que le visiteur a tout saisi, mais
 * AVANT le seul envoi — on perdrait le lead en entier pour un champ dont on
 * peut se passer. Le mot libre est donc rattaché à l'étape 2.
 *
 * Chaque étape atteinte émet `form_step` (voir src/lib/analytics.ts) : c'est
 * ce qui permet de lire dans GA4 l'étape où les gens décrochent.
 *
 * Le champ « identifiant Google Ads » a été retiré : inutile à ce stade, et
 * c'était le champ le plus intimidant de l'ancien formulaire d'une traite.
 */

const TOTAL_STEPS = 2;

const SLOTS = [
  { v: "matin", l: "Matin (9 h – 12 h)" },
  { v: "apres-midi", l: "Après-midi (14 h – 18 h)" },
  { v: "soir", l: "Soir (18 h – 20 h)" },
];

type Values = {
  website: string;
  email: string;
  firstname: string;
  lastname: string;
  budget: string;
  sector: string;
  objective: string;
  message: string;
  phone: string;
  slot: string;
};

const EMPTY: Values = {
  website: "",
  email: "",
  firstname: "",
  lastname: "",
  budget: "",
  sector: "",
  objective: "",
  message: "",
  phone: "",
  slot: "matin",
};

export default function AuditForm() {
  const [mode, setMode] = useState<"audit" | "callback">("audit");
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [v, setV] = useState<Values>(EMPTY);
  const started = useRef(false);
  const stepsSeen = useRef<Set<number>>(new Set());

  // Pré-remplissage depuis la carte d'audit du hero (/audit?site=…).
  // Lu via window.location plutôt que useSearchParams() : ce dernier
  // désoptimise la page en rendu statique et impose une frontière Suspense
  // (l'erreur de build rencontrée sur /merci).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("site");
    if (param) setV((prev) => ({ ...prev, website: param }));
  }, []);

  const set = (k: keyof Values) => (e: { target: { value: string } }) =>
    setV((prev) => ({ ...prev, [k]: e.target.value }));

  /** Une étape n'est comptée qu'une fois : un aller-retour ne gonfle pas GA4. */
  const seeStep = (n: number, name: string) => {
    if (stepsSeen.current.has(n)) return;
    stepsSeen.current.add(n);
    trackFormStep(n, "audit", name);
  };

  const handleFocus = () => {
    if (started.current) return;
    started.current = true;
    trackFormStart("audit");
    seeStep(1, "site_email");
  };

  const post = async (payload: Record<string, string>) => {
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/audit-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return true;
      // 429 = plafond de soumissions atteint : on affiche le message renvoyé
      // par l'API plutôt qu'un « échec » générique, sinon le visiteur réessaie
      // en boucle sans comprendre.
      const data = await res.json().catch(() => null);
      setErrorMsg(data?.error ?? "L'envoi a échoué. Réessayez, ou écrivez à contact@uplyo.fr.");
      setStatus("error");
      return false;
    } catch {
      setErrorMsg("L'envoi a échoué. Réessayez, ou écrivez à contact@uplyo.fr.");
      setStatus("error");
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "callback") {
      const ok = await post({
        type: "callback",
        phone: v.phone,
        slot: v.slot,
        website: v.website,
        email: v.email,
      });
      if (ok) {
        trackFormSubmit("audit_rappel");
        window.location.href = "/merci?source=rappel";
      }
      return;
    }

    if (step < TOTAL_STEPS) {
      const next = step + 1;
      setStep(next);
      seeStep(next, "qualification");
      return;
    }

    const ok = await post({
      type: "audit",
      website: v.website,
      email: v.email,
      firstname: v.firstname,
      lastname: v.lastname,
      budget: v.budget,
      sector: v.sector,
      objective: v.objective,
      message: v.message,
    });
    if (ok) {
      trackFormSubmit("audit", v.budget);
      window.location.href = "/merci?source=audit";
    }
  };

  const switchMode = (to: "audit" | "callback") => {
    setMode(to);
    setStatus("idle");
    setErrorMsg(null);
    if (to === "callback") {
      trackCTAClick("audit_form", "preferer_etre_rappele");
      trackFormStep(1, "audit_rappel", "rappel_telephone");
    }
  };

  const sending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFocus}
      className="flex flex-col gap-3.5 bg-white border border-line rounded-card p-6 md:p-8 lg:sticky lg:top-[88px] shadow-card"
    >
      <div className="mb-1">
        <div className="text-title font-semibold text-ink mb-1">
          {mode === "callback" ? "Être rappelé" : "Demander mon audit"}
        </div>
        <div className="text-caption text-ink-3 font-light">
          {mode === "callback"
            ? "Deux champs, et je vous appelle sur le créneau que vous choisissez."
            : "Rapport écrit sous 48 h · gratuit · sans contrepartie"}
        </div>
      </div>

      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      {mode === "audit" && (
        <>
          {/* Repère d'avancement : sans lui, un formulaire qui change de
              contenu au clic donne l'impression d'avoir échoué. */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="h-1 flex-1 rounded-full bg-lune-deep overflow-hidden">
              <div
                className="h-full bg-eclat transition-all duration-300"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <span className="label text-ink-3 shrink-0">
              {step}/{TOTAL_STEPS}
            </span>
          </div>
          <p className="sr-only" role="status">
            Étape {step} sur {TOTAL_STEPS}
          </p>
        </>
      )}

      {mode === "audit" && step === 1 && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-website" className="label text-ink-2">
              Site web *
            </label>
            <input
              id="a-website"
              name="website"
              type="text"
              required
              inputMode="url"
              autoComplete="url"
              value={v.website}
              onChange={set("website")}
              placeholder="monentreprise.fr"
              className="field"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-email" className="label text-ink-2">
              Email professionnel *
            </label>
            <input
              id="a-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={v.email}
              onChange={set("email")}
              placeholder="sophie@entreprise.fr"
              className="field"
            />
            <p className="text-caption text-ink-3 font-light">
              C&apos;est là que j&apos;enverrai le rapport. Rien d&apos;autre n&apos;y sera envoyé.
            </p>
          </div>
        </>
      )}

      {mode === "audit" && step === 2 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="a-firstname" className="label text-ink-2">
                Prénom *
              </label>
              <input
                id="a-firstname"
                name="firstname"
                type="text"
                required
                autoComplete="given-name"
                value={v.firstname}
                onChange={set("firstname")}
                placeholder="Sophie"
                className="field"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="a-lastname" className="label text-ink-2">
                Nom *
              </label>
              <input
                id="a-lastname"
                name="lastname"
                type="text"
                required
                autoComplete="family-name"
                value={v.lastname}
                onChange={set("lastname")}
                placeholder="Martin"
                className="field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="a-budget" className="label text-ink-2">
                Budget mensuel
              </label>
              <select
                id="a-budget"
                name="budget"
                value={v.budget}
                onChange={set("budget")}
                className="field appearance-none"
              >
                <option value="" disabled>
                  —
                </option>
                <option value="moins-500">Moins de 500 €</option>
                <option value="500-1000">500 € – 1 000 €</option>
                <option value="1000-3000">1 000 € – 3 000 €</option>
                <option value="3000-10000">3 000 € – 10 000 €</option>
                <option value="10000+">10 000 €+</option>
                <option value="pas-encore">Pas encore de campagnes</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="a-sector" className="label text-ink-2">
                Secteur
              </label>
              <select
                id="a-sector"
                name="sector"
                value={v.sector}
                onChange={set("sector")}
                className="field appearance-none"
              >
                <option value="" disabled>
                  —
                </option>
                <option value="artisan">Artisan / BTP</option>
                <option value="services-locaux">Services aux particuliers</option>
                <option value="btob">Services B2B</option>
                <option value="sante">Santé / Bien-être</option>
                <option value="immo">Immobilier</option>
                <option value="ecommerce">E-commerce</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-objective" className="label text-ink-2">
              Votre objectif principal
            </label>
            <select
              id="a-objective"
              name="objective"
              value={v.objective}
              onChange={set("objective")}
              className="field appearance-none"
            >
              <option value="" disabled>
                —
              </option>
              <option value="baisser-cout-lead">Faire baisser mon coût par demande</option>
              <option value="plus-de-demandes">Recevoir plus de demandes</option>
              <option value="comprendre-ou-part-budget">Comprendre où part mon budget</option>
              <option value="lancer">Lancer mes premières campagnes</option>
              <option value="changer-prestataire">Changer de prestataire</option>
              <option value="verifier-tracking">Vérifier mon suivi de conversions</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-message" className="label text-ink-2">
              Un mot sur votre situation (facultatif)
            </label>
            <textarea
              id="a-message"
              name="message"
              value={v.message}
              onChange={set("message")}
              placeholder="Ex : des campagnes tournent depuis six mois, je reçois des appels mais je ne sais pas lesquels viennent de Google."
              className="field min-h-[84px] resize-y"
            />
          </div>
        </>
      )}

      {mode === "callback" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="a-phone" className="label text-ink-2">
              Votre numéro *
            </label>
            <input
              id="a-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              value={v.phone}
              onChange={set("phone")}
              placeholder="06 12 34 56 78"
              className="field"
            />
          </div>

          <fieldset className="flex flex-col gap-1.5 border-none p-0 m-0">
            <legend className="label text-ink-2 mb-1.5">Quand vous appeler ?</legend>
            <div className="flex flex-col gap-2">
              {SLOTS.map((s) => (
                <label
                  key={s.v}
                  className="flex items-center gap-2.5 text-body text-ink cursor-pointer"
                >
                  <input
                    type="radio"
                    name="slot"
                    value={s.v}
                    checked={v.slot === s.v}
                    onChange={set("slot")}
                    className="accent-eclat w-4 h-4"
                  />
                  {s.l}
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      <div className="flex items-center gap-3 mt-2">
        {mode === "audit" && step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 text-body font-medium text-ink-2 bg-transparent border-none cursor-pointer px-1 py-3.5 hover:text-ink"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Retour
          </button>
        )}
        <button
          type="submit"
          disabled={sending}
          className="flex-1 bg-eclat text-white text-body-lg font-semibold py-3.5 rounded-uplyo border-none cursor-pointer transition-all hover:bg-eclat-hover hover:-translate-y-px flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {sending ? (
            <>
              <span
                aria-hidden="true"
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
              Envoi en cours…
            </>
          ) : status === "error" ? (
            "Réessayer"
          ) : mode === "callback" ? (
            <>
              Demander un rappel
              <ArrowRight size={16} aria-hidden="true" />
            </>
          ) : step < TOTAL_STEPS ? (
            <>
              Continuer
              <ArrowRight size={16} aria-hidden="true" />
            </>
          ) : (
            <>
              Recevoir mon audit
              <ArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <p role="alert" className="text-caption text-[#B3261E] text-center">
          {errorMsg}
        </p>
      )}

      {/* Voie de sortie pour qui n'écrit pas volontiers : le visiteur donne son
          numéro, aucun numéro n'est publié de notre côté. */}
      <div className="border-t border-line pt-3.5 text-center">
        {mode === "audit" ? (
          <button
            type="button"
            onClick={() => switchMode("callback")}
            className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink bg-transparent border-none cursor-pointer hover:underline underline-offset-4"
          >
            <Phone size={14} aria-hidden="true" />
            Préférez-vous qu&apos;on vous rappelle ?
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => switchMode("audit")}
            className="inline-flex items-center gap-1.5 text-body font-semibold text-eclat-ink bg-transparent border-none cursor-pointer hover:underline underline-offset-4"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Revenir au formulaire d&apos;audit
          </button>
        )}
      </div>

      {/* « Aucun démarchage » ne vaut que pour les personnes qui remplissent
          elles-mêmes ce formulaire : de la prospection email sortante existe
          par ailleurs. */}
      <p className="text-caption text-ink-3 text-center font-light">
        Vos données restent confidentielles. Je ne vous relance pas si vous ne me le demandez pas.
      </p>
    </form>
  );
}

"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { trackFormStart, trackFormStep, trackFormSubmit, trackCTAClick } from "@/lib/analytics";
import type { AuditTrack } from "@/lib/audit-content";

/**
 * Formulaire des pages /audit et /audit/sans-campagne.
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
 *
 * `track` distingue les deux parcours : il change les libellés et surtout les
 * options de budget et d'objectif (demander « votre budget mensuel actuel » à
 * quelqu'un qui n'a jamais fait de publicité n'a pas de sens), et il est
 * transmis à l'API pour que l'email interne dise d'emblée quel travail
 * préparer.
 */

const TOTAL_STEPS = 2;

const SLOTS = [
  { v: "matin", l: "Matin (9 h – 12 h)" },
  { v: "apres-midi", l: "Après-midi (14 h – 18 h)" },
  { v: "soir", l: "Soir (18 h – 20 h)" },
];

/** Doit rester aligné sur la validation serveur de /api/audit-check. */
const PHONE_RE = /^\+?\d{9,15}$/;
const normalizePhone = (raw: string) => raw.replace(/[\s.\-()]/g, "");

type FieldOption = { value: string; label: string };

const BUDGET_OPTIONS: Record<AuditTrack, { label: string; options: FieldOption[] }> = {
  compte: {
    label: "Budget mensuel actuel",
    options: [
      { value: "moins-500", label: "Moins de 500 €" },
      { value: "500-1000", label: "500 € – 1 000 €" },
      { value: "1000-3000", label: "1 000 € – 3 000 €" },
      { value: "3000-10000", label: "3 000 € – 10 000 €" },
      { value: "10000+", label: "10 000 €+" },
      { value: "pas-encore", label: "Pas encore de campagnes" },
    ],
  },
  "sans-campagne": {
    label: "Budget envisagé (si vous y allez)",
    options: [
      { value: "je-ne-sais-pas", label: "Je ne sais pas encore" },
      { value: "moins-500", label: "Moins de 500 €/mois" },
      { value: "500-1000", label: "500 € – 1 000 €/mois" },
      { value: "1000-3000", label: "1 000 € – 3 000 €/mois" },
      { value: "3000+", label: "Plus de 3 000 €/mois" },
    ],
  },
};

const OBJECTIVE_OPTIONS: Record<AuditTrack, { label: string; options: FieldOption[] }> = {
  compte: {
    label: "Votre objectif principal",
    options: [
      { value: "baisser-cout-lead", label: "Faire baisser mon coût par demande" },
      { value: "plus-de-demandes", label: "Recevoir plus de demandes" },
      { value: "comprendre-ou-part-budget", label: "Comprendre où part mon budget" },
      { value: "changer-prestataire", label: "Changer de prestataire" },
      { value: "verifier-tracking", label: "Vérifier mon suivi de conversions" },
    ],
  },
  "sans-campagne": {
    label: "Ce que vous cherchez à savoir",
    options: [
      { value: "est-ce-que-ca-vaut-le-coup", label: "Si Google Ads vaut le coup chez moi" },
      { value: "budget-necessaire", label: "Quel budget il faudrait" },
      { value: "concurrents", label: "Ce que font mes concurrents" },
      { value: "plus-de-demandes", label: "Recevoir plus de demandes de devis" },
      { value: "lancer", label: "Lancer mes premières campagnes" },
    ],
  },
};

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

export default function AuditForm({
  track = "compte",
  title,
  subtitle,
}: {
  track?: AuditTrack;
  title?: string;
  subtitle?: string;
}) {
  const [mode, setMode] = useState<"audit" | "callback">("audit");
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [v, setV] = useState<Values>(EMPTY);
  const started = useRef(false);
  const stepsSeen = useRef<Set<number>>(new Set());
  // Verrou de soumission : `status` ne repasse à "sending" qu'au prochain
  // rendu. Deux clics très rapprochés (ou Entrée maintenue) partaient donc
  // deux fois avant que le bouton ne soit désactivé — deux emails, deux
  // `generate_lead`, et deux jetons consommés sur le rate limit.
  const inFlight = useRef(false);

  const budgetField = BUDGET_OPTIONS[track];
  const objectiveField = OBJECTIVE_OPTIONS[track];
  const isCampaignless = track === "sans-campagne";
  const submitLabel = isCampaignless ? "Recevoir mon étude" : "Recevoir mon audit";

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

    // Le pot de miel n'était jamais lu : il était rendu dans le DOM mais la
    // charge utile était construite à la main sans lui, donc le contrôle
    // serveur ne pouvait pas se déclencher.
    const honey = String(new FormData(e.currentTarget).get("_honey") ?? "");

    if (mode === "callback") {
      const phone = normalizePhone(v.phone);
      if (!PHONE_RE.test(phone)) {
        // Contrôle côté client : `type="tel"` n'impose aucun format, l'API
        // renvoyait donc un 400 après un aller-retour réseau inutile.
        setErrorMsg("Numéro invalide. Attendu : 10 chiffres, ou +33 suivi de 9 chiffres.");
        setStatus("error");
        return;
      }
      if (inFlight.current) return;
      inFlight.current = true;
      const ok = await post({
        type: "callback",
        track,
        phone,
        slot: v.slot,
        website: v.website,
        email: v.email,
        _honey: honey,
      });
      if (ok) {
        trackFormSubmit("audit_rappel");
        window.location.href = "/merci?source=rappel";
        return;
      }
      inFlight.current = false;
      return;
    }

    if (step < TOTAL_STEPS) {
      const next = step + 1;
      setStep(next);
      seeStep(next, "qualification");
      return;
    }

    if (inFlight.current) return;
    inFlight.current = true;
    const ok = await post({
      type: "audit",
      track,
      website: v.website,
      email: v.email,
      firstname: v.firstname,
      lastname: v.lastname,
      budget: v.budget,
      sector: v.sector,
      objective: v.objective,
      message: v.message,
      _honey: honey,
    });
    if (ok) {
      trackFormSubmit("audit", v.budget);
      window.location.href = "/merci?source=audit";
      return;
    }
    inFlight.current = false;
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
      id="formulaire"
      onSubmit={handleSubmit}
      onFocus={handleFocus}
      className="flex flex-col gap-3.5 bg-white border border-line rounded-card p-6 md:p-8 lg:sticky lg:top-[88px] shadow-card scroll-mt-[88px]"
    >
      <div className="mb-1">
        <div className="text-title font-semibold text-ink mb-1">
          {mode === "callback" ? "Être rappelé" : title ?? (isCampaignless ? "Demander mon étude" : "Demander mon audit")}
        </div>
        <div className="text-caption text-ink-3 font-light">
          {mode === "callback"
            ? "Deux champs, et je vous appelle sur le créneau que vous choisissez."
            : subtitle ??
              (isCampaignless
                ? "Étude écrite sous 48 h ouvrées · gratuite · aucun compte Google Ads requis"
                : "Rapport écrit sous 48 h ouvrées · gratuit · sans contrepartie")}
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
            {isCampaignless && (
              <p className="text-caption text-ink-3 font-light">
                Pas de site ? Mettez le nom de votre entreprise et votre ville : je pars de votre
                fiche Google.
              </p>
            )}
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
          {/* grid-cols-2 sans point de rupture écrasait ces deux champs à
              ~110 px de large sur un écran de 320 px. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="a-budget" className="label text-ink-2">
                {budgetField.label}
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
                {budgetField.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
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
              {objectiveField.label}
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
              {objectiveField.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
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
              placeholder={
                isCampaignless
                  ? "Ex : plombier à Rezé, je travaille surtout au bouche-à-oreille et je me demande si ça vaut le coup de payer Google."
                  : "Ex : des campagnes tournent depuis six mois, je reçois des appels mais je ne sais pas lesquels viennent de Google."
              }
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
              onChange={(e) => {
                setV((prev) => ({ ...prev, phone: e.target.value }));
                if (status === "error") {
                  setStatus("idle");
                  setErrorMsg(null);
                }
              }}
              placeholder="06 12 34 56 78"
              aria-describedby="a-phone-help"
              aria-invalid={status === "error" && !PHONE_RE.test(normalizePhone(v.phone))}
              className="field"
            />
            <p id="a-phone-help" className="text-caption text-ink-3 font-light">
              10 chiffres, ou +33 suivi de 9 chiffres. Les espaces et les points sont acceptés.
            </p>
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
          className="flex-1 bg-eclat text-white text-body-lg font-semibold py-3.5 rounded-uplyo border-none cursor-pointer transition-all hover:bg-eclat-hover hover:-translate-y-px flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
              {submitLabel}
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

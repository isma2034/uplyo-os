"use client";

import { useState, useRef, useId, FormEvent } from "react";
import { CircleCheck } from "lucide-react";
import { trackFormStart, trackFormSubmit } from "@/lib/analytics";
import { MEDIA_FLOOR } from "@/lib/offers";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formStarted = useRef(false);
  // Verrou de soumission : `status` ne repasse à "sending" qu'au rendu
  // suivant, deux clics rapprochés partaient donc deux fois avant que le
  // bouton ne soit désactivé (deux emails, deux `generate_lead`).
  const inFlight = useRef(false);
  // Le formulaire est monté deux fois sur le site (home + /contact) : sans id
  // unique, les <label for> pointeraient vers le mauvais champ.
  const uid = useId();

  const handleFormFocus = () => {
    if (!formStarted.current) {
      formStarted.current = true;
      trackFormStart("contact");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Pot de miel : contrôle AVANT de passer en "sending". Dans l'ordre
    // précédent, un robot qui remplissait le champ laissait le formulaire
    // bloqué sur « Envoi en cours… » indéfiniment — et un humain aussi, si
    // un gestionnaire de mots de passe remplissait le champ caché.
    if (formData.get("_honey")) return;

    if (inFlight.current) return;
    inFlight.current = true;
    setStatus("sending");
    setErrorMsg(null);

    const data = {
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      email: formData.get("email") as string,
      website: formData.get("website") as string,
      budget: formData.get("budget") as string,
      sector: formData.get("sector") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        trackFormSubmit("contact", data.budget);
        // L'état "sent" n'était jamais atteint (redirection immédiate) : son
        // écran de confirmation était du code mort. Il sert désormais de
        // filet si la navigation vers /merci ne se fait pas.
        setStatus("sent");
        window.location.href = "/merci?source=contact";
        return;
      }
      // Message renvoyé par l'API (429 « trop de messages », 400 « email
      // invalide »…) plutôt qu'un échec générique : sans lui, le visiteur
      // réessaie en boucle sans comprendre.
      const payload = await res.json().catch(() => null);
      setErrorMsg(payload?.error ?? null);
      setStatus("error");
    } catch {
      setStatus("error");
    }
    inFlight.current = false;
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center bg-white border border-line rounded-card p-10 text-center min-h-[400px]">
        <CircleCheck size={40} className="text-eclat-ink mb-4" aria-hidden="true" />
        <div className="text-title font-semibold text-ink mb-2">Demande envoyée</div>
        <p className="text-body text-ink-2 font-light max-w-sm">
          Je vous réponds sous 24 h ouvrées.
        </p>
        <button
          onClick={() => {
            // Sans cette remise à zéro, le verrou anti-double-envoi resterait
            // fermé et le second message ne partirait jamais.
            inFlight.current = false;
            setStatus("idle");
          }}
          className="mt-6 text-body text-eclat-ink font-medium cursor-pointer bg-transparent border-none hover:underline underline-offset-4"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFormFocus}
      className="flex flex-col gap-3.5 bg-white border border-line rounded-card p-6 md:p-8 shadow-card"
    >
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-firstname`} className="label text-ink-2">
            Prénom
          </label>
          <input
            id={`${uid}-firstname`}
            name="firstname"
            type="text"
            placeholder="Sophie"
            autoComplete="given-name"
            required
            className="field"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-lastname`} className="label text-ink-2">
            Nom
          </label>
          <input
            id={`${uid}-lastname`}
            name="lastname"
            type="text"
            placeholder="Martin"
            autoComplete="family-name"
            required
            className="field"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-email`} className="label text-ink-2">
          Email professionnel
        </label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          placeholder="sophie@entreprise.fr"
          autoComplete="email"
          required
          className="field"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${uid}-website`} className="label text-ink-2">
          Site web
        </label>
        <input
          id={`${uid}-website`}
          name="website"
          type="url"
          placeholder="https://"
          autoComplete="url"
          className="field"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-budget`} className="label text-ink-2">
            Budget publicitaire mensuel
          </label>
          <select id={`${uid}-budget`} name="budget" required defaultValue="" className="field appearance-none">
            <option value="" disabled>
              —
            </option>
            <option value="moins-500">Moins de 500 € / mois</option>
            <option value="500-1000">500 € – 1 000 € / mois</option>
            <option value="1000-3000">1 000 € – 3 000 € / mois</option>
            <option value="3000-10000">3 000 € – 10 000 € / mois</option>
            <option value="10000+">10 000 €+ / mois</option>
            <option value="pas-encore">Pas encore de campagnes</option>
          </select>
          <p className="text-caption text-ink-3 font-light">
            Réglé directement à Google. Minimum conseillé : {MEDIA_FLOOR.local} (
            {MEDIA_FLOOR.ecommerce} en e-commerce).
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${uid}-sector`} className="label text-ink-2">
            Secteur
          </label>
          <select id={`${uid}-sector`} name="sector" defaultValue="" className="field appearance-none">
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
        <label htmlFor={`${uid}-message`} className="label text-ink-2">
          Votre situation
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          placeholder="Ex : j'ai des campagnes en cours depuis six mois, je reçois des appels mais je ne sais pas lesquels viennent de Google."
          className="field min-h-[100px] resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-eclat text-white text-body-lg font-semibold py-3.5 rounded-uplyo border-none cursor-pointer transition-all hover:bg-eclat-hover hover:-translate-y-px flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <>
            <span
              aria-hidden="true"
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            />
            Envoi en cours…
          </>
        ) : status === "error" ? (
          "Réessayer"
        ) : (
          "Envoyer ma demande"
        )}
      </button>

      {status === "error" && (
        <p role="alert" className="text-caption text-[#B3261E] text-center">
          {errorMsg ?? "L'envoi a échoué. Réessayez, ou écrivez directement à contact@uplyo.fr."}
        </p>
      )}

      {/* « Aucun démarchage » ne peut se dire que de ceux qui remplissent
          eux-mêmes ce formulaire : la prospection email sortante existe par
          ailleurs. Formulation restreinte en conséquence. */}
      <p className="text-caption text-ink-3 text-center font-light">
        Vos données restent confidentielles. Je ne vous relance pas si vous ne me le demandez pas.
      </p>
    </form>
  );
}

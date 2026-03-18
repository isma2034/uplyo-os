"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    if (formData.get("_honey")) return;

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
        // Redirect to thank you page for conversion tracking
        window.location.href = "/merci?source=contact";
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center bg-white border-[1.5px] border-eclat/30 rounded-uplyo-lg p-12 text-center min-h-[400px]">
        <div className="text-4xl mb-4">✅</div>
        <div className="text-xl font-semibold text-ink mb-2">Demande envoyée !</div>
        <p className="text-sm text-ink-2 font-light max-w-sm">
          Merci pour votre message. Nous vous répondrons sous 24h ouvrées.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-[13px] text-eclat font-medium cursor-pointer bg-transparent border-none hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3.5 bg-white border-[1.5px] border-[var(--bd)] rounded-uplyo-lg p-6 md:p-8"
    >
      <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-ink-2 uppercase tracking-wider font-mono">
            Prénom
          </label>
          <input
            name="firstname"
            type="text"
            placeholder="Sophie"
            required
            className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3.5 py-2.5 text-sm text-ink outline-none focus:border-eclat focus:bg-white transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-ink-2 uppercase tracking-wider font-mono">
            Nom
          </label>
          <input
            name="lastname"
            type="text"
            placeholder="Martin"
            required
            className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3.5 py-2.5 text-sm text-ink outline-none focus:border-eclat focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-ink-2 uppercase tracking-wider font-mono">
          Email professionnel
        </label>
        <input
          name="email"
          type="email"
          placeholder="sophie@entreprise.fr"
          required
          className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3.5 py-2.5 text-sm text-ink outline-none focus:border-eclat focus:bg-white transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-ink-2 uppercase tracking-wider font-mono">
          Site web
        </label>
        <input
          name="website"
          type="url"
          placeholder="https://"
          className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3.5 py-2.5 text-sm text-ink outline-none focus:border-eclat focus:bg-white transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-ink-2 uppercase tracking-wider font-mono">
            Budget Google Ads mensuel
          </label>
          <select
            name="budget"
            required
            defaultValue=""
            className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3.5 py-2.5 text-sm text-ink outline-none focus:border-eclat appearance-none transition-colors"
          >
            <option value="" disabled>—</option>
            <option value="500-1000">500€ – 1 000€ / mois</option>
            <option value="1000-3000">1 000€ – 3 000€ / mois</option>
            <option value="3000-10000">3 000€ – 10 000€ / mois</option>
            <option value="10000+">10 000€+ / mois</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-ink-2 uppercase tracking-wider font-mono">
            Secteur
          </label>
          <select
            name="sector"
            defaultValue=""
            className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3.5 py-2.5 text-sm text-ink outline-none focus:border-eclat appearance-none transition-colors"
          >
            <option value="" disabled>—</option>
            <option value="ecommerce">E-commerce</option>
            <option value="btob">Services BtoB</option>
            <option value="btoc">Services BtoC / Local</option>
            <option value="artisan">Artisan / BTP</option>
            <option value="sante">Santé / Bien-être</option>
            <option value="immo">Immobilier</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium text-ink-2 uppercase tracking-wider font-mono">
          Votre situation & objectifs
        </label>
        <textarea
          name="message"
          placeholder="Ex : j'ai des campagnes en cours mais les résultats ne sont pas là. Budget : 1 500€/mois."
          className="bg-[var(--w2)] border-[1.5px] border-[var(--bd)] rounded-md px-3.5 py-2.5 text-sm text-ink outline-none focus:border-eclat focus:bg-white min-h-[100px] resize-y transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-eclat text-white text-[15px] font-semibold py-3.5 rounded-lg border-none cursor-pointer transition-all hover:bg-eclat-hover hover:-translate-y-px flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Envoi en cours…
          </>
        ) : status === "error" ? (
          "Réessayer →"
        ) : (
          "Envoyer ma demande →"
        )}
      </button>
      <div className="text-[11px] text-ink-3 text-center font-mono">
        Données confidentielles · Aucun démarchage
      </div>
    </form>
  );
}

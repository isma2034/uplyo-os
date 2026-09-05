/**
 * POST /api/audit-check — réception d'une demande d'audit (ou de rappel).
 *
 * Ce que fait cet endpoint :
 *   1. limite le débit par IP ;
 *   2. pour une demande d'audit, lance UNE vérification HTML de la seule page
 *      d'accueil du site soumis (voir src/lib/site-check.ts) ;
 *   3. envoie à Ismael un email interne contenant le lead + le relevé brut,
 *      pour qu'il prépare le vrai rapport sous 48 h ouvrées.
 *
 * Ce que cet endpoint ne fait PAS, volontairement :
 *   - il ne crawle jamais un site (une page, une requête, pas de sitemap) ;
 *   - il n'appelle jamais l'API PageSpeed : la clé est partagée avec l'usage
 *     interne d'Ismael et un flux public en épuiserait le quota. Aucune clé
 *     PageSpeed ne doit être ajoutée à ce dépôt ;
 *   - il ne renvoie AUCUN résultat au visiteur. La réponse est un simple
 *     accusé de réception. Afficher un score instantané recréerait la
 *     « fausse autorité » que le reste du site s'emploie à éviter : ces
 *     contrôles constatent des faits HTML, ils ne valent pas diagnostic.
 *
 * Le relevé n'est jamais bloquant : si le site est injoignable, hors délai ou
 * hostile au bot, l'email part quand même avec la raison de l'échec. Un lead
 * ne doit jamais être perdu à cause d'un site tiers.
 */

import { NextResponse } from "next/server";
import { escapeHtml as esc } from "@/lib/escape";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { checkHomepage, type SiteCheck } from "@/lib/site-check";

// Le contrôle sortant a besoin de la résolution DNS Node (anti-SSRF) : pas
// d'exécution sur le runtime edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 3 soumissions par IP et par heure. Un prospect légitime en envoie une.
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;
// Second garde-fou : plafond global, pour qu'une attaque distribuée sur
// beaucoup d'IP ne transforme pas le site en scanner de masse.
const GLOBAL_LIMIT = 40;

const SLOTS: Record<string, string> = {
  matin: "Matin (9 h – 12 h)",
  "apres-midi": "Après-midi (14 h – 18 h)",
  soir: "Soir (18 h – 20 h)",
};

// Parcours d'origine de la demande (voir src/lib/audit-content.ts). Il change
// le travail à préparer : lecture d'un compte existant, ou étude de marché
// pour quelqu'un qui n'a jamais fait de publicité.
const TRACKS: Record<string, string> = {
  compte: "Compte Google Ads existant",
  "sans-campagne": "Aucune campagne — étude d'opportunité",
};

function s(v: unknown, max: number): string {
  return esc(String(v ?? "").trim().slice(0, max));
}

export async function POST(request: Request) {
  // Un corps non-JSON (bot, requête tronquée) faisait lever request.json() et
  // retombait dans le catch générique : 500 « Erreur serveur » pour une faute
  // du client. C'est un 400, et cela évite de polluer les logs d'erreur.
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  try {
    const type = body?.type === "callback" ? "callback" : "audit";
    const track = body?.track === "sans-campagne" ? "sans-campagne" : "compte";

    // Pot de miel : on répond 200 pour ne pas renseigner le robot.
    if (body?._honey) return NextResponse.json({ success: true });

    if (type === "audit") {
      if (!body?.email || !EMAIL_REGEX.test(String(body.email))) {
        return NextResponse.json({ error: "Email invalide" }, { status: 400 });
      }
      if (!body?.website) {
        return NextResponse.json({ error: "Site web requis" }, { status: 400 });
      }
    } else {
      const phone = String(body?.phone ?? "").replace(/[\s.\-()]/g, "");
      if (!/^\+?\d{9,15}$/.test(phone)) {
        return NextResponse.json({ error: "Numéro invalide" }, { status: 400 });
      }
    }

    const ip = clientIp(request);
    const perIp = rateLimit(`audit:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
    const global = rateLimit("audit:global", GLOBAL_LIMIT, RATE_WINDOW_MS);
    if (!perIp.allowed || !global.allowed) {
      const retryAfter = Math.max(perIp.retryAfter, global.retryAfter);
      return NextResponse.json(
        {
          error:
            "Trop de demandes envoyées depuis cette connexion. Réessayez plus tard, ou écrivez directement à contact@uplyo.fr.",
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const lead = {
      firstname: s(body?.firstname, 100),
      lastname: s(body?.lastname, 100),
      email: s(body?.email, 254),
      website: s(body?.website, 300),
      budget: s(body?.budget, 50),
      sector: s(body?.sector, 50),
      objective: s(body?.objective, 80),
      message: s(body?.message, 2000),
      phone: s(body?.phone, 30),
      slot: s(body?.slot, 30),
      track: TRACKS[track],
    };

    let check: SiteCheck | null = null;
    if (type === "audit" && lead.website) {
      try {
        check = await checkHomepage(String(body.website));
      } catch (e) {
        // Ne doit jamais arriver (checkHomepage capture déjà), ceinture et
        // bretelles : le lead prime sur le relevé.
        check = {
          ok: false,
          url: lead.website,
          reason: e instanceof Error ? e.message : "erreur_inattendue",
        };
      }
    }

    const subject =
      type === "callback"
        ? `📞 Demande de rappel — ${lead.phone} · ${SLOTS[lead.slot] ?? "créneau non précisé"}`
        : `${track === "sans-campagne" ? "🌱 Étude d'opportunité" : "🔔 Demande d'audit"} — ${
            lead.website || lead.email
          }${lead.budget ? ` · ${lead.budget}` : ""}`;

    const html = type === "callback" ? callbackEmail(lead) : auditEmail(lead, check);

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      if (process.env.NODE_ENV !== "production") {
        console.log("📧 [audit-check] (sans RESEND_API_KEY) —", subject);
        console.log(JSON.stringify({ type, lead: { ...lead, message: undefined }, check }, null, 2));
        return NextResponse.json({ success: true, mode: "log" });
      }

      // Même défaut que /api/contact, corrigé en même temps : répondre
      // « succès » en production sans avoir rien envoyé fait disparaître le
      // lead sans que personne ne s'en aperçoive — ni le visiteur, ni nous.
      console.error(
        "[audit-check] RESEND_API_KEY absente en production — lead NON transmis:",
        { email: lead.email, site: lead.website, type }
      );
      return NextResponse.json(
        {
          error:
            "L'envoi automatique est momentanément indisponible. Écrivez-moi directement à contact@uplyo.fr, je vous réponds sous 24 h ouvrées.",
        },
        { status: 503 }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Uplyo <noreply@uplyo.fr>",
        to: ["contact@uplyo.fr"],
        ...(type === "audit" && lead.email ? { reply_to: lead.email } : {}),
        subject,
        html,
      }),
    });

    if (!res.ok) {
      console.error("[audit-check] Resend error:", await res.text());
      // Ce texte est affiché tel quel dans le formulaire : « Erreur envoi
      // email » n'apprenait rien au visiteur et ne lui donnait aucune sortie.
      return NextResponse.json(
        { error: "L'envoi a échoué de mon côté. Réessayez, ou écrivez à contact@uplyo.fr." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[audit-check] API error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez, ou écrivez à contact@uplyo.fr." },
      { status: 500 }
    );
  }
}

// ── Rendu email ────────────────────────────────────────────────────────────

type Lead = Record<string, string>;

const shell = (title: string, inner: string) => `
  <div style="font-family:sans-serif;max-width:640px;margin:0 auto;">
    <div style="background:#6C5CE7;padding:20px 24px;border-radius:8px 8px 0 0;">
      <h1 style="color:#fff;font-size:18px;margin:0;">${title}</h1>
    </div>
    <div style="background:#f9f8ff;padding:24px;border:1px solid #e8e5f5;border-radius:0 0 8px 8px;">
      ${inner}
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e8e5f5;font-size:12px;color:#6F6D8A;">
        Envoyé depuis le formulaire d'audit de uplyo.fr
      </div>
    </div>
  </div>`;

const row = (k: string, v: string) =>
  v
    ? `<tr><td style="padding:7px 0;color:#6F6D8A;width:150px;vertical-align:top;">${k}</td><td style="padding:7px 0;font-weight:600;color:#0D0B1A;">${v}</td></tr>`
    : "";

function callbackEmail(lead: Lead): string {
  return shell(
    "Demande de rappel",
    `<table style="width:100%;font-size:14px;border-collapse:collapse;">
       ${row("Téléphone", `<a href="tel:${lead.phone}" style="color:#6C5CE7;">${lead.phone}</a>`)}
       ${row("Créneau souhaité", SLOTS[lead.slot] || lead.slot || "non précisé")}
       ${row("Parcours", lead.track)}
       ${row("Site web", lead.website)}
       ${row("Email", lead.email)}
     </table>
     <p style="font-size:13px;color:#3D3B5C;margin-top:16px;">
       Aucune vérification automatique n'est lancée sur une demande de rappel.
     </p>`
  );
}

function auditEmail(lead: Lead, check: SiteCheck | null): string {
  const info = `<table style="width:100%;font-size:14px;border-collapse:collapse;">
      ${row("Parcours", lead.track)}
      ${row("Site web", lead.website)}
      ${row("Email", `<a href="mailto:${lead.email}" style="color:#6C5CE7;">${lead.email}</a>`)}
      ${row("Prénom / Nom", [lead.firstname, lead.lastname].filter(Boolean).join(" "))}
      ${row("Budget", lead.budget)}
      ${row("Secteur", lead.sector)}
      ${row("Objectif", lead.objective)}
    </table>
    ${
      lead.message
        ? `<div style="margin-top:16px;padding:14px;background:#fff;border:1px solid #e8e5f5;border-radius:6px;font-size:14px;color:#3D3B5C;line-height:1.6;"><strong style="color:#0D0B1A;">Message :</strong><br/>${lead.message}</div>`
        : ""
    }`;

  return shell(lead.track || "Demande d'audit", info + checkBlock(check));
}

function checkBlock(check: SiteCheck | null): string {
  const head = `<h2 style="font-size:14px;color:#0D0B1A;margin:24px 0 4px;">Relevé automatique — page d'accueil uniquement</h2>
    <p style="font-size:12px;color:#6F6D8A;margin:0 0 12px;">
      Une seule requête HTTP, contrôles HTML statiques. Aucun crawl, aucun appel PageSpeed.
      Constat brut à confirmer avec l'outil complet avant de rédiger le rapport.
    </p>`;

  if (!check) {
    return head + `<p style="font-size:13px;color:#3D3B5C;">Aucun site fourni — relevé non lancé.</p>`;
  }
  if (!check.ok) {
    return (
      head +
      `<div style="padding:12px;background:#fff4f4;border:1px solid #f0d5d5;border-radius:6px;font-size:13px;color:#8a2b2b;">
         Relevé impossible sur <strong>${esc(check.url)}</strong> — motif : <code>${esc(check.reason)}</code>.<br/>
         (Site injoignable, hors délai, non-HTML, ou filtrage du bot. À vérifier à la main.)
       </div>`
    );
  }

  const alt = check.images.total
    ? `${check.images.total} image(s) — ${check.images.noAlt} sans attribut alt, ${check.images.emptyAlt} avec alt vide`
    : "aucune balise <img> dans le HTML initial";

  return (
    head +
    `<table style="width:100%;font-size:13px;border-collapse:collapse;background:#fff;border:1px solid #e8e5f5;border-radius:6px;">
      ${row("URL finale", `${esc(check.finalUrl)} (HTTP ${check.status}, ${check.elapsedMs} ms)`)}
      ${row("Title", check.title ? `${esc(check.title)} <span style="color:#6F6D8A;font-weight:400;">(${check.titleLength} car.)</span>` : "<em>absent</em>")}
      ${row("Meta description", check.metaDescription ? `${esc(check.metaDescription)} <span style="color:#6F6D8A;font-weight:400;">(${check.metaDescriptionLength} car.)</span>` : "<em>absente</em>")}
      ${row("H1", `${check.h1Count} trouvé(s)${check.h1Texts.length ? ` — ${check.h1Texts.map((t) => esc(t)).join(" | ")}` : ""}`)}
      ${row("Canonical", check.canonical ? esc(check.canonical) : "<em>absente</em>")}
      ${row("JSON-LD", check.jsonLdBlocks ? `${check.jsonLdBlocks} bloc(s) — types : ${check.jsonLdTypes.map((t) => esc(t)).join(", ") || "non identifiés"}` : "<em>aucun</em>")}
      ${row("Images / alt", alt)}
      ${row("Contenu mixte http://", check.mixedContent.length ? `${check.mixedContent.length} URL — ${check.mixedContent.slice(0, 5).map((u) => esc(u)).join("<br/>")}` : "aucun")}
      ${row("CMS", [check.cms.generator ? `generator: ${esc(check.cms.generator)}` : "", ...check.cms.fingerprints.map((f) => esc(f))].filter(Boolean).join(" · ") || "non identifié")}
      ${row("Poids HTML", `${Math.round(check.htmlBytes / 1024)} Ko`)}
    </table>`
  );
}

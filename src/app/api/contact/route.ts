/**
 * POST /api/contact — réception d'un message du formulaire de contact
 * (monté sur la home et sur /contact).
 *
 * Mêmes garde-fous que /api/audit-check, qui les avait tous et pas celui-ci :
 * corps non-JSON traité comme une erreur du client (400) et non du serveur,
 * pot de miel, limitation de débit par IP et plafond global. Sans limite, un
 * script pouvait déclencher autant d'appels facturés à l'API Resend qu'il le
 * voulait, et noyer la boîte contact@uplyo.fr — c'est la seule adresse par
 * laquelle les demandes arrivent.
 *
 * Sur les limites réelles du compteur en mémoire, voir docs/RATE_LIMIT.md.
 */

import { NextResponse } from "next/server";
import { escapeHtml as esc } from "@/lib/escape";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Plus permissif que /api/audit-check (3/h) : un message de contact ne
// déclenche aucun travail sortant, et une même personne peut légitimement
// écrire deux fois. Reste très en dessous d'un usage abusif.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const GLOBAL_LIMIT = 60;

const TOO_MANY =
  "Trop de messages envoyés depuis cette connexion. Réessayez plus tard, ou écrivez directement à contact@uplyo.fr.";

/** N'affiche un lien que si l'URL est réellement http(s) — pas de javascript:. */
function safeLink(url: string): string {
  return /^https?:\/\//i.test(url) ? esc(url) : "";
}

export async function POST(request: Request) {
  // Un corps non-JSON faisait lever request.json(), donc 500 « Erreur
  // serveur » pour une faute du client, et une entrée dans les logs d'erreur
  // à chaque bot qui tape l'endpoint. C'est un 400.
  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    body = parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  try {
    // Pot de miel : on répond 200 pour ne pas renseigner le robot.
    if (body._honey) return NextResponse.json({ success: true });

    const str = (v: unknown) => String(v ?? "").trim();
    const firstname = str(body.firstname);
    const lastname = str(body.lastname);
    const email = str(body.email);

    // `!firstname` laissait passer "   " : le lead arrivait sans nom.
    if (!firstname || !lastname || !email) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const ip = clientIp(request);
    const perIp = rateLimit(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
    const global = rateLimit("contact:global", GLOBAL_LIMIT, RATE_WINDOW_MS);
    if (!perIp.allowed || !global.allowed) {
      const retryAfter = Math.max(perIp.retryAfter, global.retryAfter);
      return NextResponse.json(
        { error: TOO_MANY },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    // Sanitize all inputs before rendering into HTML
    const safe = {
      firstname: esc(firstname.slice(0, 100)),
      lastname: esc(lastname.slice(0, 100)),
      email: esc(email.slice(0, 254)),
      website: esc(str(body.website).slice(0, 500)),
      budget: esc(str(body.budget).slice(0, 50)),
      sector: esc(str(body.sector).slice(0, 50)),
      message: esc(str(body.message).slice(0, 2000)),
    };
    const websiteHref = safeLink(str(body.website).slice(0, 500));

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      // En développement : on journalise et on laisse passer, c'est pratique.
      if (process.env.NODE_ENV !== "production") {
        console.log("📧 [contact] New submission (no RESEND_API_KEY):", {
          firstname: safe.firstname,
          lastname: safe.lastname,
          email: safe.email,
          budget: safe.budget,
          sector: safe.sector,
        });
        return NextResponse.json({ success: true, mode: "log" });
      }

      // En PRODUCTION, ne JAMAIS répondre « succès » sans avoir envoyé quoi
      // que ce soit. Ce code répondait success:true en mode "log" : le
      // visiteur voyait « message envoyé » et le lead était perdu sans
      // trace. Constaté en production le 05/09/2026 — la variable
      // RESEND_API_KEY n'était pas configurée sur Vercel, et toutes les
      // demandes reçues depuis la mise en ligne ont disparu ainsi.
      console.error(
        "[contact] RESEND_API_KEY absente en production — lead NON transmis:",
        { email: safe.email, nom: `${safe.firstname} ${safe.lastname}` }
      );
      return NextResponse.json(
        {
          error:
            "L'envoi automatique est momentanément indisponible. Écrivez-moi directement à contact@uplyo.fr, je vous réponds sous 24 h ouvrées.",
        },
        { status: 503 }
      );
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#6C5CE7;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:#fff;font-size:18px;margin:0;">Nouveau lead Uplyo</h1>
        </div>
        <div style="background:#f9f8ff;padding:24px;border:1px solid #e8e5f5;border-radius:0 0 8px 8px;">
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6F6D8A;width:120px;">Prénom</td><td style="padding:8px 0;font-weight:600;">${safe.firstname}</td></tr>
            <tr><td style="padding:8px 0;color:#6F6D8A;">Nom</td><td style="padding:8px 0;font-weight:600;">${safe.lastname}</td></tr>
            <tr><td style="padding:8px 0;color:#6F6D8A;">Email</td><td style="padding:8px 0;"><a href="mailto:${safe.email}" style="color:#6C5CE7;">${safe.email}</a></td></tr>
            ${
              safe.website
                ? `<tr><td style="padding:8px 0;color:#6F6D8A;">Site web</td><td style="padding:8px 0;">${
                    websiteHref
                      ? `<a href="${websiteHref}" style="color:#6C5CE7;">${safe.website}</a>`
                      : safe.website
                  }</td></tr>`
                : ""
            }
            ${safe.budget ? `<tr><td style="padding:8px 0;color:#6F6D8A;">Budget</td><td style="padding:8px 0;font-weight:600;color:#6C5CE7;">${safe.budget}</td></tr>` : ""}
            ${safe.sector ? `<tr><td style="padding:8px 0;color:#6F6D8A;">Secteur</td><td style="padding:8px 0;">${safe.sector}</td></tr>` : ""}
          </table>
          ${safe.message ? `<div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e8e5f5;border-radius:6px;font-size:14px;color:#3D3B5C;line-height:1.6;"><strong style="color:#0D0B1A;">Message :</strong><br/>${safe.message}</div>` : ""}
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e8e5f5;font-size:12px;color:#6F6D8A;">
            Envoyé depuis le formulaire uplyo.fr
          </div>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Uplyo <noreply@uplyo.fr>",
        to: ["contact@uplyo.fr"],
        reply_to: safe.email,
        subject: `🔔 Nouveau lead — ${safe.firstname} ${safe.lastname} · ${safe.budget || "Budget non précisé"}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[contact] Resend error:", err);
      // Ce texte est affiché tel quel dans le formulaire.
      return NextResponse.json(
        { error: "L'envoi a échoué de mon côté. Réessayez, ou écrivez à contact@uplyo.fr." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact] API error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez, ou écrivez à contact@uplyo.fr." },
      { status: 500 }
    );
  }
}

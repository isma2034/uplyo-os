import { NextResponse } from "next/server";

/** Escape HTML special characters to prevent injection in email templates */
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstname, lastname, email, website, budget, sector, message } = body;

    // Required field validation
    if (!firstname || !lastname || !email) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // Email format validation
    if (!EMAIL_REGEX.test(String(email))) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Sanitize all inputs before rendering into HTML
    const safe = {
      firstname: esc(String(firstname).trim().slice(0, 100)),
      lastname: esc(String(lastname).trim().slice(0, 100)),
      email: esc(String(email).trim().slice(0, 254)),
      website: website ? esc(String(website).trim().slice(0, 500)) : "",
      budget: budget ? esc(String(budget).trim().slice(0, 50)) : "",
      sector: sector ? esc(String(sector).trim().slice(0, 50)) : "",
      message: message ? esc(String(message).trim().slice(0, 2000)) : "",
    };

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      // Dev mode: log submission without secrets
      if (process.env.NODE_ENV !== "production") {
        console.log("📧 [contact] New submission (no RESEND_API_KEY):", {
          firstname: safe.firstname,
          lastname: safe.lastname,
          email: safe.email,
          budget: safe.budget,
          sector: safe.sector,
        });
      }
      return NextResponse.json({ success: true, mode: "log" });
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
            ${safe.website ? `<tr><td style="padding:8px 0;color:#6F6D8A;">Site web</td><td style="padding:8px 0;"><a href="${safe.website}" style="color:#6C5CE7;">${safe.website}</a></td></tr>` : ""}
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
      return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact] API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

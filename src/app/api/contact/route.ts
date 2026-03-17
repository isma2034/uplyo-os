import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstname, lastname, email, website, budget, sector, message } = body;

    // Validate required fields
    if (!firstname || !lastname || !email) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      // Fallback: log to console if no API key (dev mode)
      console.log("📧 NEW CONTACT FORM SUBMISSION:");
      console.log({ firstname, lastname, email, website, budget, sector, message });
      console.log("⚠️  Set RESEND_API_KEY to enable email sending.");
      return NextResponse.json({ success: true, mode: "log" });
    }

    // Send via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Uplyo <noreply@uplyo.fr>",
        to: ["contact@uplyo.fr"],
        reply_to: email,
        subject: `🔔 Nouveau lead — ${firstname} ${lastname} · ${budget || "Budget non précisé"}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#6C5CE7;padding:20px 24px;border-radius:8px 8px 0 0;">
              <h1 style="color:#fff;font-size:18px;margin:0;">Nouveau lead Uplyo</h1>
            </div>
            <div style="background:#f9f8ff;padding:24px;border:1px solid #e8e5f5;border-radius:0 0 8px 8px;">
              <table style="width:100%;font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#7C7A9A;width:120px;">Prénom</td><td style="padding:8px 0;font-weight:600;">${firstname}</td></tr>
                <tr><td style="padding:8px 0;color:#7C7A9A;">Nom</td><td style="padding:8px 0;font-weight:600;">${lastname}</td></tr>
                <tr><td style="padding:8px 0;color:#7C7A9A;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#6C5CE7;">${email}</a></td></tr>
                ${website ? `<tr><td style="padding:8px 0;color:#7C7A9A;">Site web</td><td style="padding:8px 0;"><a href="${website}" style="color:#6C5CE7;">${website}</a></td></tr>` : ""}
                ${budget ? `<tr><td style="padding:8px 0;color:#7C7A9A;">Budget</td><td style="padding:8px 0;font-weight:600;color:#6C5CE7;">${budget}</td></tr>` : ""}
                ${sector ? `<tr><td style="padding:8px 0;color:#7C7A9A;">Secteur</td><td style="padding:8px 0;">${sector}</td></tr>` : ""}
              </table>
              ${message ? `<div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e8e5f5;border-radius:6px;font-size:14px;color:#3D3B5C;line-height:1.6;"><strong style="color:#0D0B1A;">Message :</strong><br/>${message}</div>` : ""}
              <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e8e5f5;font-size:12px;color:#7C7A9A;">
                Envoyé depuis le formulaire uplyo.fr
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

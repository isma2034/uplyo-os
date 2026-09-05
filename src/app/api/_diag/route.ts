import { NextResponse } from "next/server";

// ⚠️ POINT DE DIAGNOSTIC TEMPORAIRE — à supprimer une fois le problème réglé.
//
// Objectif : savoir si RESEND_API_KEY parvient réellement au code en
// production, sans jamais exposer sa valeur. On ne renvoie que sa présence,
// sa longueur et son préfixe attendu — jamais la clé, même partiellement.
//
// Protégé par un jeton pour que l'endpoint ne soit pas sondable publiquement.
const DIAG_TOKEN = "uplyo-diag-2026";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("t") !== DIAG_TOKEN) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const k = process.env.RESEND_API_KEY;

  return NextResponse.json({
    resend_api_key: {
      definie: typeof k === "string" && k.length > 0,
      longueur: k?.length ?? 0,
      commence_par_re: k?.startsWith("re_") ?? false,
      espaces_parasites: k ? k !== k.trim() : false,
    },
    env: process.env.NODE_ENV,
    // Liste des noms de variables visibles commençant par RESEND ou
    // contenant API — utile si la variable a été créée sous un autre nom.
    noms_approchants: Object.keys(process.env)
      .filter((n) => /RESEND|API_KEY|MAIL/i.test(n))
      .sort(),
  });
}

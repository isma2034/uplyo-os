import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import Script from "next/script";
import ConsentBanner from "@/components/agency/ConsentBanner";
import "@/styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// DM Mono n'habille plus que les jetons numériques (marqueurs de jour J0-J5
// des plannings, numéros d'étape de l'audit). Tous les libellés / eyebrows
// sont repassés en DM Sans via `.label` — voir globals.css. Un seul poids
// suffit désormais : cela retire une requête de police au chargement.
const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["500"],
});

// Ces valeurs par défaut servent à toute page qui ne déclare pas les siennes
// (mentions légales, CGV, confidentialité) ET à tout partage de lien, puisque
// aucune de ces pages ne redéclare openGraph/twitter.
//
// Elles annonçaient « Agence Google Ads performance » et « accès direct à
// l'expert qui gère vos campagnes », alors que le reste du site dit
// explicitement le contraire : « Uplyo n'est pas une agence avec des équipes,
// c'est une activité indépendante ». Le titre partagé sur LinkedIn ou WhatsApp
// contredisait donc le positionnement de la page d'accueil. Aligné sur la
// formulation de la home.
export const metadata: Metadata = {
  title: {
    default: "Uplyo — Google Ads pour PME de services",
    template: "%s — Uplyo",
  },
  description:
    "Je gère les campagnes Google Ads de PME de services. Audit gratuit sous 48 h ouvrées, aucun engagement de durée, un seul interlocuteur — celui qui exécute.",
  metadataBase: new URL("https://uplyo.fr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://uplyo.fr",
    siteName: "Uplyo",
    title: "Uplyo — Google Ads pour PME de services",
    description:
      "Je gère les campagnes Google Ads de PME de services. Audit gratuit sous 48 h ouvrées, aucun engagement de durée.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uplyo — Google Ads pour PME de services",
    description:
      "Je gère les campagnes Google Ads de PME de services. Audit gratuit sous 48 h ouvrées, aucun engagement de durée.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        {/* Consent Mode v2 — DOIT s'exécuter avant GTM et GA4, sinon des
            balises partent avant que le refus par défaut soit connu.
            `beforeInteractive` garantit cet ordre ; GTM/GA4 sont en
            `afterInteractive`.

            Le choix déjà donné est relu ici, de façon synchrone : sans ça,
            un visiteur qui a accepté lors d'une visite précédente resterait
            bloqué en « refusé » jusqu'à ce que la bannière React soit
            montée, et on perdrait la mesure du début de sa session. */}
        {(GTM_ID || GA4_ID) && (
          <Script id="consent-default" strategy="beforeInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });
            try {
              var c = localStorage.getItem('uplyo_consent_v1');
              if (c === 'granted' || c === 'denied') {
                gtag('consent', 'update', {
                  ad_storage: c, analytics_storage: c,
                  ad_user_data: c, ad_personalization: c
                });
              }
            } catch (e) {}
          `}</Script>
        )}
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}</Script>
        )}
        {GA4_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', { send_page_view: false });
            `}</Script>
          </>
        )}
      </head>
      <body className="font-sans">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        {(GTM_ID || GA4_ID) && <ConsentBanner />}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: {
    default: "Uplyo — Agence Google Ads performance",
    template: "%s — Uplyo",
  },
  description:
    "Agence Google Ads pour PME et e-commerce. Audit gratuit, gestion transparente, accès direct à l'expert qui gère vos campagnes.",
  metadataBase: new URL("https://uplyo.fr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://uplyo.fr",
    siteName: "Uplyo",
    title: "Uplyo — Agence Google Ads performance",
    description:
      "Agence Google Ads pour PME et e-commerce. Audit gratuit, gestion transparente, accès direct à l'expert qui gère vos campagnes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uplyo — Agence Google Ads performance",
    description:
      "Agence Google Ads pour PME et e-commerce. Audit gratuit, gestion transparente, accès direct à l'expert.",
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
      </body>
    </html>
  );
}

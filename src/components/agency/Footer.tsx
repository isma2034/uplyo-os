import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { OFFER_ROUTES } from "@/lib/offers";

// Footer unique du site (il était dupliqué à l'identique dans le layout
// (agency) et dans page.tsx, la home étant hors du groupe de routes).
//
// Contrastes sur --nuit (#1A1040) : white/50 = 5.14:1, white/55 = 5.96:1,
// white/70 = 8.96:1, white/80 = 11.44:1, --spark = 11.70:1, --aura = 7.26:1.
// Toutes ces valeurs passent AA. Les anciennes (white/18, /25, /35) étaient
// entre 1.71:1 et 3.15:1.
const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Prestations",
    links: [
      { label: "Toutes les offres", href: "/offres" },
      { label: OFFER_ROUTES.setup.label, href: OFFER_ROUTES.setup.href },
      { label: OFFER_ROUTES.pilotage.label, href: OFFER_ROUTES.pilotage.href },
      { label: OFFER_ROUTES.ecommerce.label, href: OFFER_ROUTES.ecommerce.href },
    ],
  },
  {
    title: "Uplyo",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Audit gratuit", href: "/audit" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: SITE_CONFIG.contactEmail, href: `mailto:${SITE_CONFIG.contactEmail}`, external: true },
      { label: "LinkedIn", href: SITE_CONFIG.linkedinUrl, external: true },
    ],
  },
];

const LINK_CLASS = "text-body text-white/70 font-light no-underline hover:text-white transition-colors";

export default function Footer() {
  return (
    <footer className="bg-nuit border-t-2 border-eclat">
      <div className="container-wide pt-12 md:pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 pb-10 md:pb-12 border-b border-white/[0.12] mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg width="26" height="26" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <polygon points="18,4 28,20 18,36 8,20" fill="#6C5CE7" />
                <polygon points="29,2 34,10 29,18 24,10" fill="#A29BFE" opacity="0.88" />
                <polygon points="7,18 12,26 7,34 2,26" fill="#A29BFE" opacity="0.6" />
              </svg>
              <span className="text-title font-semibold text-white">uplyo</span>
            </div>
            <p className="text-body text-white/70 max-w-[260px] mb-5 font-light">
              Gestion de campagnes Google Ads pour PME de services. Activité indépendante — un seul
              interlocuteur, celui qui exécute.
            </p>
            <div className="label text-white/70">Google Ads · GA4 · Looker Studio</div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="label text-spark mb-3">{col.title}</div>
              <div className="flex flex-col gap-2">
                {col.links.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                      className={LINK_CLASS}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.label} href={link.href} className={LINK_CLASS}>
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="label text-white/70">© 2026 Uplyo · Tous droits réservés</div>
          <div className="flex gap-5 flex-wrap">
            {[
              { label: "Mentions légales", href: "/mentions-legales" },
              { label: "Confidentialité", href: "/confidentialite" },
              { label: "CGV", href: "/cgv" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-caption text-white/70 no-underline hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

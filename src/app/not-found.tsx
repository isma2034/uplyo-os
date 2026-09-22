import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";
import LogoMark from "@/components/agency/LogoMark";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

const LINKS = [
  { label: "Les prestations", href: "/offres" },
  { label: "Qui je suis", href: "/a-propos" },
  { label: "Audit gratuit", href: "/audit" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-1 flex items-center justify-center">
      <div className="container-text text-center">
        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="Uplyo — accueil">
            <LogoMark size={40} />
          </Link>
        </div>

        <p className="text-caption font-semibold text-eclat-ink mb-4">Erreur 404</p>

        <h1 className="text-display font-semibold text-ink mb-4">Page introuvable</h1>
        <p className="text-lead text-ink-2 font-light mb-8">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center mb-10">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center gap-1.5 py-1 text-body font-semibold text-eclat-ink no-underline hover:underline underline-offset-4"
            >
              {l.label}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>

        <p className="text-caption text-ink-3 font-light">
          Une question ?{" "}
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="text-eclat-ink no-underline hover:underline underline-offset-4"
          >
            {SITE_CONFIG.contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
}

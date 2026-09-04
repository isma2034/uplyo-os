"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Offres", href: "/offres" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

const MOBILE_LINKS = [
  { label: "Accueil", href: "/", strong: true },
  { label: "Offres", href: "/offres", strong: true },
  { label: "Le setup", href: "/offres/pack-lancement", strong: false },
  { label: "Le pilotage", href: "/offres/retainer", strong: false },
  { label: "Module e-commerce", href: "/offres/ecommerce", strong: false },
  { label: "À propos", href: "/a-propos", strong: true },
  { label: "Contact", href: "/contact", strong: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Les pages d'audit sont les pages de conversion : la navigation complète y
  // est réduite au strict minimum (logo + retour), pour ne pas offrir de porte
  // de sortie à côté du formulaire. `startsWith` et non `===` : sans quoi
  // /audit/sans-campagne récupérait la navigation complète et se comportait
  // autrement que /audit.
  const minimal = pathname === "/audit" || pathname.startsWith("/audit/");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, handleKeyDown]);

  const logo = (
    <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="Uplyo — accueil">
      <svg width="30" height="30" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <polygon points="18,4 28,20 18,36 8,20" fill="#6C5CE7" />
        <polygon points="29,2 34,10 29,18 24,10" fill="#A29BFE" opacity="0.88" />
        <polygon points="7,18 12,26 7,34 2,26" fill="#A29BFE" opacity="0.6" />
      </svg>
      <span className="text-title font-semibold text-ink">uplyo</span>
    </Link>
  );

  const shell = `fixed top-0 left-0 right-0 z-[200] h-[68px] flex items-center justify-between transition-colors duration-200 ${
    scrolled ? "bg-white/95 backdrop-blur-xl border-b border-line" : "bg-transparent border-b border-transparent"
  }`;

  if (minimal) {
    return (
      <nav className={shell} role="navigation" aria-label="Navigation réduite">
        <div className="container-wide flex items-center justify-between">
          {logo}
          <Link
            href="/"
            className="text-body font-medium text-ink-3 hover:text-ink transition-colors no-underline"
          >
            Retour au site
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={shell} role="navigation" aria-label="Navigation principale">
        <div className="container-wide flex items-center justify-between">
          {logo}

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`text-body font-medium transition-colors no-underline ${
                  pathname === l.href ? "text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <Link
            href="/audit"
            className="hidden md:inline-flex bg-eclat text-white text-body font-semibold px-5 py-2.5 rounded-uplyo transition-colors hover:bg-eclat-hover no-underline"
          >
            Audit gratuit
          </Link>

          <div className="flex items-center gap-3 md:hidden">
            <Link
              href="/audit"
              onClick={() => setMobileOpen(false)}
              className="bg-eclat text-white text-caption font-semibold px-3.5 py-2 rounded-uplyo transition-colors hover:bg-eclat-hover no-underline whitespace-nowrap"
            >
              Audit gratuit
            </Link>

            <button
              className="flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span
                aria-hidden="true"
                className={`w-[22px] h-[2px] bg-ink block rounded-sm transition-all duration-200 ${
                  mobileOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                aria-hidden="true"
                className={`w-[22px] h-[2px] bg-ink block rounded-sm transition-all duration-200 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                aria-hidden="true"
                className={`w-[22px] h-[2px] bg-ink block rounded-sm transition-all duration-200 ${
                  mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className="fixed inset-0 top-[68px] bg-white z-[190] px-6 py-8 flex flex-col gap-1 border-t border-line md:hidden overflow-y-auto"
        >
          {MOBILE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={
                l.strong
                  ? "text-body-lg font-medium text-ink no-underline py-3 border-b border-line"
                  : "text-body text-ink-2 no-underline py-2 pl-4"
              }
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/audit"
            onClick={() => setMobileOpen(false)}
            className="bg-eclat text-white text-body-lg font-semibold py-3.5 px-6 rounded-uplyo cursor-pointer mt-5 w-full no-underline text-center block"
          >
            Audit gratuit
          </Link>
        </div>
      )}
    </>
  );
}

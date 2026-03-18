"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] h-[68px] flex items-center justify-between px-6 md:px-10 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-[var(--bd)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <polygon points="18,4 28,20 18,36 8,20" fill="#6C5CE7" />
            <polygon points="29,2 34,10 29,18 24,10" fill="#A29BFE" opacity="0.88" />
            <polygon points="7,18 12,26 7,34 2,26" fill="#A29BFE" opacity="0.6" />
          </svg>
          <span className="text-xl font-semibold text-ink tracking-tight">uplyo</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/#services" className="text-[13px] font-medium text-ink-3 hover:text-ink transition-colors no-underline">Nos offres</Link>
          <Link href="/contact" className="text-[13px] font-medium text-ink-3 hover:text-ink transition-colors no-underline">Contact</Link>
        </div>

        <Link href="/audit" className="hidden md:block bg-eclat text-white text-[13px] font-semibold px-[22px] py-[10px] rounded-lg border-none cursor-pointer transition-all hover:bg-eclat-hover hover:-translate-y-px no-underline">
          Audit gratuit →
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`w-[22px] h-[2px] bg-ink block rounded-sm transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`w-[22px] h-[2px] bg-ink block rounded-sm transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-[22px] h-[2px] bg-ink block rounded-sm transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[68px] bg-white z-[190] p-8 flex flex-col gap-4 border-t border-[var(--bd)] md:hidden overflow-y-auto">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-[17px] font-medium text-ink no-underline py-2 border-b border-[var(--bd)]">Accueil</Link>
          <Link href="/offres/pack-lancement" onClick={() => setMobileOpen(false)} className="text-[15px] text-ink-2 no-underline py-1.5 pl-4">Pack Lancement</Link>
          <Link href="/offres/retainer" onClick={() => setMobileOpen(false)} className="text-[15px] text-ink-2 no-underline py-1.5 pl-4">Pilotage mensuel</Link>
          <Link href="/offres/ecommerce" onClick={() => setMobileOpen(false)} className="text-[15px] text-ink-2 no-underline py-1.5 pl-4 border-b border-[var(--bd)] pb-3">Pack E-commerce</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-[17px] font-medium text-ink no-underline py-2 border-b border-[var(--bd)]">Contact</Link>
          <Link
            href="/audit"
            onClick={() => setMobileOpen(false)}
            className="bg-eclat text-white text-[15px] font-semibold py-3 px-6 rounded-lg border-none cursor-pointer mt-4 w-full no-underline text-center block"
          >
            Audit gratuit →
          </Link>
        </div>
      )}
    </>
  );
}

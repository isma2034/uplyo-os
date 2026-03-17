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

        <div className="hidden md:flex bg-lune border border-[var(--bd)] rounded-full p-[3px] gap-[2px]">
          <span className="text-[13px] font-semibold bg-eclat text-white px-[18px] py-[7px] rounded-full cursor-pointer">
            Agence
          </span>
          <Link
            href="/os"
            className="text-[13px] font-medium text-ink-3 px-[18px] py-[7px] rounded-full hover:text-ink transition-colors no-underline"
          >
            Uplyo OS
          </Link>
        </div>

        <button className="hidden md:block bg-eclat text-white text-[13px] font-semibold px-[22px] py-[10px] rounded-lg border-none cursor-pointer transition-all hover:bg-eclat-hover hover:-translate-y-px">
          Réserver un audit →
        </button>

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
        <div className="fixed inset-0 top-[68px] bg-white z-[190] p-8 flex flex-col gap-4 border-t border-[var(--bd)] md:hidden">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="text-[17px] font-medium text-ink no-underline py-2 border-b border-[var(--bd)]"
          >
            Agence
          </Link>
          <Link
            href="/os"
            onClick={() => setMobileOpen(false)}
            className="text-[17px] font-medium text-ink no-underline py-2 border-b border-[var(--bd)]"
          >
            Uplyo OS
          </Link>
          <a
            href="#services"
            onClick={() => setMobileOpen(false)}
            className="text-[17px] font-medium text-ink no-underline py-2 border-b border-[var(--bd)]"
          >
            Nos offres
          </a>
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="text-[17px] font-medium text-ink no-underline py-2 border-b border-[var(--bd)]"
          >
            Contact
          </a>
          <button className="bg-eclat text-white text-[15px] font-semibold py-3 px-6 rounded-lg border-none cursor-pointer mt-4 w-full">
            Réserver un audit →
          </button>
        </div>
      )}
    </>
  );
}

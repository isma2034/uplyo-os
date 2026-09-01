import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable — Uplyo",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--w)] flex items-center justify-center px-6">
      <div className="text-center max-w-[480px]">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="Uplyo — accueil">
            <svg width="40" height="40" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <polygon points="18,4 28,20 18,36 8,20" fill="#6C5CE7" />
              <polygon points="29,2 34,10 29,18 24,10" fill="#A29BFE" opacity="0.88" />
              <polygon points="7,18 12,26 7,34 2,26" fill="#A29BFE" opacity="0.6" />
            </svg>
          </Link>
        </div>

        {/* Status */}
        <div className="font-mono text-[11px] font-semibold tracking-[0.15em] uppercase text-eclat mb-4">
          Erreur 404
        </div>

        <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-semibold tracking-tight text-ink leading-[1.05] mb-4">
          Page introuvable
        </h1>
        <p className="text-[15px] text-ink-2 font-light leading-relaxed mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="bg-eclat text-white text-[14px] font-semibold px-6 py-3 rounded-lg no-underline transition-all hover:bg-eclat-hover hover:-translate-y-px">
            ← Retour à l&apos;accueil
          </Link>
          <Link href="/audit" className="bg-[var(--w2)] border border-[var(--bd)] text-ink text-[14px] font-medium px-6 py-3 rounded-lg no-underline transition-all hover:border-eclat/40">
            Audit gratuit →
          </Link>
        </div>

        <div className="mt-10 text-[12px] text-ink-3 font-mono">
          Des questions ?{" "}
          <a href="mailto:contact@uplyo.fr" className="text-eclat no-underline hover:underline">
            contact@uplyo.fr
          </a>
        </div>
      </div>
    </div>
  );
}

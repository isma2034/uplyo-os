import Navbar from "@/components/agency/Navbar";
import Link from "next/link";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--w)] text-ink overflow-x-hidden">
      <Navbar />
      <div className="pt-[68px]">{children}</div>

      {/* FOOTER */}
      <footer className="bg-nuit px-6 md:px-10 pt-12 md:pt-16 pb-8 border-t-2 border-eclat">
        <div className="max-w-[1160px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 pb-10 md:pb-12 border-b border-white/[0.06] mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <svg width="26" height="26" viewBox="0 0 36 36" fill="none"><polygon points="18,4 28,20 18,36 8,20" fill="#6C5CE7"/><polygon points="29,2 34,10 29,18 24,10" fill="#A29BFE" opacity="0.88"/><polygon points="7,18 12,26 7,34 2,26" fill="#A29BFE" opacity="0.6"/></svg>
                <span className="text-lg font-semibold text-white tracking-tight">uplyo</span>
              </div>
              <p className="text-[13px] text-white/25 leading-relaxed max-w-[240px] mb-5 font-light">Agence Google Ads performance pour PME et e-commerce. Résultats mesurables, transparence totale.</p>
              <div className="font-mono text-[10px] text-white/[0.18] flex items-center gap-1.5"><span className="text-eclat">◆</span>Google Ads Certified · GA4 · Looker Studio</div>
            </div>
            <div>
              <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/25 mb-3">Agence</div>
              <div className="flex flex-col gap-1.5">
                <Link href="/offres/pack-lancement" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Pack Lancement</Link>
                <Link href="/offres/retainer" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Pilotage mensuel</Link>
                <Link href="/offres/ecommerce" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Pack E-commerce</Link>
                <Link href="/contact" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/25 mb-3">Ressources</div>
              <div className="flex flex-col gap-1.5">
                <Link href="/audit" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Audit gratuit</Link>
                <Link href="/cgv" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">CGV</Link>
                <Link href="/mentions-legales" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Mentions légales</Link>
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/25 mb-3">Contact</div>
              <div className="flex flex-col gap-1.5">
                <a href="mailto:contact@uplyo.fr" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">contact@uplyo.fr</a>
                <Link href="/contact" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">Réserver un audit</Link>
                <a href="https://linkedin.com/company/uplyo" target="_blank" rel="noopener" className="text-[13px] text-white/35 font-light no-underline hover:text-aura transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="font-mono text-[11px] text-white/[0.18]">© 2026 <span className="text-eclat">Uplyo</span> · Tous droits réservés</div>
            <div className="flex gap-4 md:gap-6">
              <Link href="/mentions-legales" className="text-[11px] text-white/[0.18] no-underline hover:text-white/45 transition-colors">Mentions légales</Link>
              <Link href="/confidentialite" className="text-[11px] text-white/[0.18] no-underline hover:text-white/45 transition-colors">Confidentialité</Link>
              <Link href="/cgv" className="text-[11px] text-white/[0.18] no-underline hover:text-white/45 transition-colors">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

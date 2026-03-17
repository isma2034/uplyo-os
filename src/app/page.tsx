import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--w)] flex flex-col">
      {/* ── Nav ── */}
      <nav className="h-[68px] flex items-center justify-between px-10 border-b border-[var(--bd)] bg-white/95 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 bg-eclat rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-ink tracking-tight">Uplyo</span>
        </Link>

        {/* Switch */}
        <div className="flex bg-lune border border-[var(--bd)] rounded-full p-0.5 gap-0.5">
          <span className="text-[13px] font-semibold bg-eclat text-white px-5 py-1.5 rounded-full">
            Agency
          </span>
          <Link
            href="/os"
            className="text-[13px] font-medium text-ink-3 px-5 py-1.5 rounded-full hover:text-ink transition-colors no-underline"
          >
            Uplyo OS
          </Link>
        </div>

        <Link href="/os" className="btn-primary text-[13px] py-2.5 px-5">
          Accéder à l&apos;OS →
        </Link>
      </nav>

      {/* ── Hero Agency ── */}
      <section className="flex-1 flex items-center px-10 relative overflow-hidden">
        {/* Deco */}
        <div
          className="absolute top-0 right-0 w-[42%] h-full z-0"
          style={{
            background: "linear-gradient(150deg, var(--lune) 0%, var(--lune2) 100%)",
            clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-24">
          <div>
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-lune border border-[var(--bd2)] text-eclat text-xs font-semibold px-3.5 py-1 rounded-full mb-7 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-eclat animate-pulse-dot" />
              GOOGLE ADS AGENCY
            </div>

            <h1 className="text-[clamp(3rem,5.2vw,5.2rem)] font-semibold leading-[0.98] tracking-[-2px] text-ink mb-6">
              Performance{" "}
              <span className="text-eclat">Google Ads</span>
              <br />
              pour PME &{" "}
              <span className="relative inline-block">
                e-commerce
                <span className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-spark rounded-full" />
              </span>
            </h1>

            <p className="text-[17px] text-ink-2 leading-relaxed mb-9 max-w-[480px] font-light">
              Nous gérons vos campagnes Google Ads avec une approche{" "}
              <strong className="text-ink font-medium">data-driven</strong>. Résultats mesurables,
              reporting transparent, croissance durable.
            </p>

            <div className="flex gap-3 flex-wrap mb-8">
              <button className="btn-primary">
                Réserver un appel découverte
                <span>→</span>
              </button>
              <Link href="/os" className="btn-outline no-underline">
                Découvrir Uplyo OS
              </Link>
            </div>

            {/* Trust */}
            <div className="flex items-center gap-5 flex-wrap">
              <span className="flex items-center gap-1.5 text-[13px] text-ink-3">
                <span className="text-eclat font-bold text-xs">✓</span> Google Partner
              </span>
              <span className="w-px h-3.5 bg-[var(--bd2)]" />
              <span className="flex items-center gap-1.5 text-[13px] text-ink-3">
                <span className="text-eclat font-bold text-xs">✓</span> +50 comptes gérés
              </span>
              <span className="w-px h-3.5 bg-[var(--bd2)]" />
              <span className="flex items-center gap-1.5 text-[13px] text-ink-3">
                <span className="text-eclat font-bold text-xs">✓</span> CPA moyen -34%
              </span>
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="bg-white border border-[var(--bd)] rounded-uplyo-lg overflow-hidden shadow-[0_24px_60px_rgba(108,92,231,0.1)]">
            <div className="bg-nuit px-5 py-4 flex items-center justify-between">
              <span className="font-mono text-[10px] text-white/40 tracking-wider">
                UPLYO OS — LIVE DASHBOARD
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-green-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
                LIVE
              </span>
            </div>
            <div className="grid grid-cols-2">
              {[
                { label: "ROAS", value: "4.2x", color: "text-green-600", delta: "+12%", up: true },
                { label: "CPA MOYEN", value: "38€", color: "text-eclat", delta: "-18%", up: false },
                { label: "CONVERSIONS", value: "847", color: "text-amber-500", delta: "+24%", up: true },
                { label: "BUDGET", value: "31.7K€", color: "text-red-500", delta: "98%", up: true },
              ].map((kpi, i) => (
                <div key={i} className="p-5 border-b border-r border-[var(--bd)] last:border-r-0">
                  <div className="font-mono text-[10px] text-ink-3 uppercase tracking-wider mb-1">
                    {kpi.label}
                  </div>
                  <div className={`text-2xl font-semibold leading-none tracking-tight ${kpi.color}`}>
                    {kpi.value}
                  </div>
                  <div className={`text-[11px] font-medium mt-0.5 ${kpi.up ? "text-green-600" : "text-red-500"}`}>
                    {kpi.up ? "↑" : "↓"} {kpi.delta}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-lune border-t border-[var(--bd)] flex items-center justify-between">
              <span className="text-[11px] font-medium text-eclat">MRR Total</span>
              <span className="text-lg font-semibold text-eclat tracking-tight">4 300€</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

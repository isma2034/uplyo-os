"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

const TITLES: Record<string, string> = {
  "/os": "Dashboard",
  "/os/clients": "CRM Clients",
  "/os/analytics": "Analytics",
  "/os/ai-wizards": "AI Wizards",
  "/os/analyste-pro": "Analyste Pro",
  "/os/scripts": "Scripts Library",
  "/os/structures": "Structures GA",
  "/os/reports": "Rapports WL",
  "/os/alerts": "Alertes & Monitoring",
  "/os/invoices": "Facturation",
  "/os/config": "Configuration",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] || Object.entries(TITLES).find(([k]) => k !== "/os" && pathname.startsWith(k))?.[1] || "Dashboard";

  return (
    <header
      className="h-[50px] flex items-center justify-between px-8 sticky top-0 z-[90]"
      style={{
        background: "var(--bg2)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="font-mono text-[11px] flex items-center gap-1.5" style={{ color: "var(--t3)" }}>
        <span>uplyo-os</span>
        <span style={{ color: "var(--t4)" }}>/</span>
        <b style={{ color: "var(--t2)" }}>{title}</b>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--t3)" }}
          />
          <input
            type="text"
            placeholder="⌘K Rechercher…"
            className="font-mono text-[11px] outline-none w-[200px] py-1 pl-7 pr-3 rounded transition-colors"
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--line2)",
              color: "var(--t)",
            }}
          />
        </div>
        <button className="btn-os text-[11px]">Export</button>
        <button className="btn-os-primary text-[11px]">+ Nouveau</button>
      </div>
    </header>
  );
}

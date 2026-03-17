"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Sparkles,
  Code2,
  Receipt,
  Settings,
  Bell,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { OS_NAV } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  BarChart3,
  Sparkles,
  Code2,
  Receipt,
  Settings,
  Bell,
  FileText,
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[252px] flex flex-col z-[100] overflow-y-auto hidden md:flex"
      style={{
        background: "var(--bg2)",
        borderRight: "1px solid var(--line)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--line)" }}>
        <Link href="/os" className="flex items-center gap-2.5 no-underline">
          <div className="w-[26px] h-[26px] bg-eclat rounded-[5px] flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <span className="font-mono text-[13px] font-semibold" style={{ color: "var(--t)" }}>
              Uplyo OS
            </span>
            <div className="font-mono text-[10px] tracking-wide" style={{ color: "var(--t3)" }}>
              Google Ads OS
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {OS_NAV.map((section) => (
          <div key={section.title}>
            <div
              className="px-5 py-1 font-mono text-[9px] font-semibold tracking-[0.12em] uppercase mt-2"
              style={{ color: "var(--t4)" }}
            >
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const isActive =
                pathname === item.href ||
                (item.href !== "/os" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn("sb-link no-underline", isActive && "active")}
                >
                  {Icon && <Icon size={14} className="shrink-0" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className="ml-auto font-mono text-[9px] px-1.5 py-0.5 rounded-lg"
                      style={{
                        background: "var(--bg4)",
                        color: "var(--t3)",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-3 font-mono text-[9px] leading-relaxed"
        style={{
          borderTop: "1px solid var(--line)",
          color: "var(--t3)",
        }}
      >
        <span style={{ color: "var(--eclat)" }}>Uplyo OS</span> v2.0-beta
        <br />
        Built with Next.js + Tailwind
      </div>
    </aside>
  );
}

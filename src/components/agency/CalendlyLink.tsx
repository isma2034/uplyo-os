"use client";

import type { ReactNode } from "react";
import { SITE_CONFIG } from "@/lib/config";
import { trackCalendlyClick } from "@/lib/analytics";

/**
 * Lien Calendly avec suivi du clic. Isolé en Client Component pour que les
 * pages qui l'utilisent (/merci) puissent rester rendues côté serveur : le
 * seul besoin de JavaScript y était ce `onClick`.
 */
export default function CalendlyLink({
  location,
  className,
  children,
}: {
  location: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={SITE_CONFIG.calendlyUrl}
      target="_blank"
      rel="noopener"
      onClick={() => trackCalendlyClick(location)}
      className={className}
    >
      {children}
    </a>
  );
}

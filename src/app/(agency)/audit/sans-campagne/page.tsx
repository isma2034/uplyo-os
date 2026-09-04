import type { Metadata } from "next";
import AuditPageBody from "@/components/agency/AuditPageBody";
import { AUDIT_TRACKS } from "@/lib/audit-content";

// Entrée dédiée aux prospects SANS compte Google Ads (le profil majoritaire de
// la prospection en cours : plombiers, serruriers, couvreurs qui n'ont jamais
// fait de publicité). Voir l'en-tête de src/lib/audit-content.ts pour le
// raisonnement complet.
export const metadata: Metadata = {
  title: AUDIT_TRACKS["sans-campagne"].meta.title,
  description: AUDIT_TRACKS["sans-campagne"].meta.description,
  alternates: { canonical: "/audit/sans-campagne" },
};

export default function AuditSansCampagnePage() {
  return <AuditPageBody track="sans-campagne" />;
}

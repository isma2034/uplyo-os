import type { Metadata } from "next";
import AuditPageBody from "@/components/agency/AuditPageBody";
import { AUDIT_TRACKS } from "@/lib/audit-content";

// La page n'est plus un Client Component (tout l'interactif vit dans
// <AuditForm />) : elle peut donc exporter `metadata` elle-même. L'ancien
// audit/layout.tsx, créé uniquement pour contourner cette limite, portait un
// `alternates.canonical: "/audit"` qui aurait été hérité tel quel par
// /audit/sans-campagne — les deux pages auraient déclaré la même canonique et
// la seconde n'aurait jamais été indexée. Le layout est supprimé, chaque page
// déclare la sienne.
export const metadata: Metadata = {
  title: AUDIT_TRACKS.compte.meta.title,
  description: AUDIT_TRACKS.compte.meta.description,
  alternates: { canonical: "/audit" },
};

export default function AuditPage() {
  return <AuditPageBody track="compte" />;
}

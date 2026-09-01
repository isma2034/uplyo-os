import { Metadata } from "next";

// "src/app/(agency)/audit/page.tsx" is a Client Component ("use client"),
// which cannot export `metadata` — Next.js silently ignores it, so this
// page (arguably the most important conversion page on the site) was
// falling back to the root layout's generic title/description with no
// page-specific canonical. Found by actually running the audit tool
// against the built site, not by reading the code.
export const metadata: Metadata = {
  title: "Audit Google Ads gratuit",
  description: "Découvrez combien votre compte Google Ads vous fait perdre. Audit gratuit et sans engagement, rapport sous 48h.",
  alternates: { canonical: "/audit" },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

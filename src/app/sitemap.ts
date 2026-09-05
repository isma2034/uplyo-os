import type { MetadataRoute } from "next";
import { SECTORS } from "@/lib/sectors";
import { CITIES } from "@/lib/cities";

const BASE = "https://uplyo.fr";

const ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, freq: "monthly" },
  { path: "/audit", priority: 0.9, freq: "monthly" },
  { path: "/audit/sans-campagne", priority: 0.9, freq: "monthly" },
  { path: "/offres", priority: 0.9, freq: "monthly" },
  { path: "/offres/pack-lancement", priority: 0.8, freq: "monthly" },
  { path: "/offres/retainer", priority: 0.8, freq: "monthly" },
  { path: "/offres/ecommerce", priority: 0.7, freq: "monthly" },
  { path: "/secteurs", priority: 0.8, freq: "monthly" },
  // Les pages sectorielles sont derivees de SECTORS : en ajouter une au
  // fichier de contenu suffit, le plan de site suit tout seul.
  ...SECTORS.map((s) => ({
    path: `/secteurs/${s.slug}`,
    priority: 0.8,
    freq: "monthly" as const,
  })),
  { path: "/villes", priority: 0.8, freq: "monthly" },
  ...CITIES.map((c) => ({
    path: `/villes/${c.slug}`,
    priority: 0.7,
    freq: "monthly" as const,
  })),
  { path: "/a-propos", priority: 0.7, freq: "monthly" },
  { path: "/contact", priority: 0.7, freq: "monthly" },
  { path: "/mentions-legales", priority: 0.1, freq: "yearly" },
  { path: "/confidentialite", priority: 0.1, freq: "yearly" },
  { path: "/cgv", priority: 0.1, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}

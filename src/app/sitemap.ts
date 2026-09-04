import type { MetadataRoute } from "next";

const BASE = "https://uplyo.fr";

const ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, freq: "monthly" },
  { path: "/audit", priority: 0.9, freq: "monthly" },
  { path: "/audit/sans-campagne", priority: 0.9, freq: "monthly" },
  { path: "/offres", priority: 0.9, freq: "monthly" },
  { path: "/offres/pack-lancement", priority: 0.8, freq: "monthly" },
  { path: "/offres/retainer", priority: 0.8, freq: "monthly" },
  { path: "/offres/ecommerce", priority: 0.7, freq: "monthly" },
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

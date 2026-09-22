import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}

/**
 * Refonte "dossier d'audit" du 22/09/2026 : passthrough sans animation.
 *
 * Avant, ce composant declenchait un fondu-glisse au scroll sur A PEU PRES
 * CHAQUE section du site (~40 usages). Le skill de design frontend flague
 * explicitement ce pattern ("fade-and-slide-up entrances on each section...
 * read as AI-generated") — choix explicite d'Ismael de retirer le mouvement
 * disperse au profit d'un seul moment travaille (l'arrivee sur le hero,
 * gere a la main dans page.tsx, pas via ce composant).
 *
 * Garde en place plutot que supprime partout : les ~40 appels a <Reveal>
 * dans le code restent valides (memes props `as`/`delay`/`className`), donc
 * aucun autre fichier n'a besoin d'etre touche pour ce changement. `delay`
 * est accepte mais ignore — le signaler au lint serait plus de bruit que
 * d'interet vu que la prop reste utile si une future page veut reintroduire
 * un mouvement ponctuel ici.
 */
export default function Reveal({ children, className, as = "div" }: RevealProps) {
  const Tag = as;
  return <Tag className={cn(className)}>{children}</Tag>;
}

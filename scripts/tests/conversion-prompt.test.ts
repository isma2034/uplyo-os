/**
 * Contrôle des conditions d'apparition de la relance de conversion.
 *
 * Pourquoi ce fichier : la logique vit dans un composant client, donc
 * invérifiable sans navigateur — et une règle qu'on ne peut pas exécuter
 * finit par ne plus être appliquée. C'est arrivé le 06/09/2026 avec le
 * garde-fou MIN_SAMPLE de MarketReadout, documenté en commentaire mais
 * jamais branché. `shouldOffer` est donc une fonction pure, testée ici.
 *
 * Lancer : npx tsx scripts/tests/conversion-prompt.test.ts
 */

import { shouldOffer } from "../../src/components/agency/ConversionPrompt.tsx";

// Page longue, lecture au-dela du seuil, tous les feux au vert.
const OK = {
  pathname: "/secteurs/auto-ecoles",
  consentChoiceMade: true,
  dismissed: false,
  scrollTop: 1210, // 1210 / 2200 = 55,0 % — exactement le seuil
  scrollHeight: 3000,
  clientHeight: 800,
} as const;

const CAS: [string, Parameters<typeof shouldOffer>[0], boolean][] = [
  ["cas nominal : page lue a 55 %", { ...OK }, true],
  ["juste sous le seuil (54,5 %)", { ...OK, scrollTop: 1200 }, false],
  ["haut de page", { ...OK, scrollTop: 0 }, false],
  ["consentement pas encore choisi", { ...OK, consentChoiceMade: false }, false],
  ["deja refuse", { ...OK, dismissed: true }, false],
  ["page /audit exclue", { ...OK, pathname: "/audit" }, false],
  ["page /audit/sans-campagne exclue", { ...OK, pathname: "/audit/sans-campagne" }, false],
  ["page /contact exclue", { ...OK, pathname: "/contact" }, false],
  ["page /merci exclue", { ...OK, pathname: "/merci" }, false],
  ["page trop courte pour compter", { ...OK, scrollHeight: 1000, clientHeight: 800 }, false],
  ["bas de page atteint", { ...OK, scrollTop: 2200 }, true],
  ["accueil, lecture suffisante", { ...OK, pathname: "/" }, true],
];

let echecs = 0;
for (const [nom, opts, attendu] of CAS) {
  const obtenu = shouldOffer(opts);
  const ok = obtenu === attendu;
  if (!ok) echecs++;
  console.log(`  ${ok ? "ok  " : "ECHEC"} ${nom} → ${obtenu} (attendu ${attendu})`);
}
console.log(`\n${CAS.length - echecs}/${CAS.length} cas conformes`);
process.exit(echecs === 0 ? 0 : 1);

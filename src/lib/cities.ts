/**
 * Contenu des pages de villes.
 *
 * Deux risques encadrent ces pages, et les deux sont traités ici :
 *
 * 1. LA PAGE SATELLITE. Une page par ville déclinée d'un gabarit commun est
 *    ce que Google appelle une doorway page — motif d'action manuelle. Chaque
 *    ville ci-dessous porte donc un relevé qui lui est propre : nombre
 *    d'entreprises analysées, annonceurs détectés, et composition sectorielle
 *    réelle de l'échantillon. Deux villes ne peuvent pas produire la même page.
 *
 * 2. LA FAUSSE PRÉSENCE LOCALE. Uplyo n'a pas de bureau à Lyon, Paris ou
 *    Toulouse. Aucune page ne doit laisser croire le contraire : pas
 *    d'adresse, pas de « votre agence à », et une mention explicite du
 *    travail à distance sur chaque page. Le seul ancrage géographique réel
 *    est la Loire-Atlantique, via le client accompagné.
 *
 * Règle statistique : le pourcentage n'est affiché que sur le total de la
 * ville (échantillon ≥ 25). La composition sectorielle est donnée en
 * comptages bruts — « 1 annonceur sur 14 agences » est un fait, le
 * transformer en « 7 % » serait une extrapolation abusive.
 */

export type CityMix = { sector: string; count: number; advertisers: number };

export type City = {
  slug: string;
  name: string;
  /** « à Lyon », « à Paris »… la préposition varie. */
  prep: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  mix: CityMix[];
  /** Lecture du relevé propre à cette ville — doit être fausse ailleurs. */
  reading: string;
};

export const CITIES: City[] = [
  {
    slug: "lyon",
    name: "Lyon",
    prep: "à Lyon",
    metaTitle: "Google Ads à Lyon : 64 entreprises analysées",
    metaDescription:
      "Sur 64 entreprises lyonnaises analysées, 7 diffusent des annonces Google Ads détectables. Composition du marché, secteurs concernés et lecture de ces chiffres.",
    intro:
      "Lyon est la ville la mieux représentée dans mon relevé, avec 64 entreprises analysées. C'est aussi celle où l'échantillon est le plus varié — ce qui rend sa lecture plus intéressante que celle d'un marché dominé par un seul métier.",
    mix: [
      { sector: "agences immobilières", count: 14, advertisers: 1 },
      { sector: "auto-écoles", count: 8, advertisers: 0 },
      { sector: "cabinets d'avocats", count: 5, advertisers: 1 },
    ],
    reading:
      "La dispersion sectorielle est le fait marquant : aucun métier ne domine l'échantillon lyonnais, et les annonceurs détectés sont répartis sur plusieurs secteurs plutôt que concentrés sur un seul. Concrètement, cela signifie que la concurrence publicitaire y est diffuse — on n'y affronte pas un bloc d'annonceurs installés sur un même jeu de requêtes, comme c'est le cas dans des marchés plus spécialisés.",
  },
  {
    slug: "paris",
    name: "Paris",
    prep: "à Paris",
    metaTitle: "Google Ads à Paris : 43 entreprises analysées",
    metaDescription:
      "Le taux d'annonceurs détectés est le plus élevé du relevé. Ce que cela change pour le coût au clic et la façon de construire un compte à Paris.",
    intro:
      "Paris affiche le taux d'annonceurs le plus élevé de mon relevé : 6 entreprises sur 43. L'écart avec les autres villes est faible en valeur absolue, mais la structure du marché parisien change ce qu'on peut en conclure.",
    mix: [
      { sector: "agences immobilières", count: 10, advertisers: 3 },
      { sector: "auto-écoles", count: 5, advertisers: 1 },
      { sector: "cabinets d'avocats", count: 3, advertisers: 0 },
    ],
    reading:
      "Les agences immobilières concentrent la moitié des annonceurs détectés — c'est la seule ville du relevé où un secteur se détache aussi nettement. Sur un marché où plusieurs acteurs d'un même métier enchérissent en parallèle, le coût au clic monte et le ciblage large devient rapidement intenable : le découpage par arrondissement et par type de bien y a plus d'effet qu'ailleurs.",
  },
  {
    slug: "rennes",
    name: "Rennes",
    prep: "à Rennes",
    metaTitle: "Google Ads à Rennes : 36 entreprises analysées",
    metaDescription:
      "36 entreprises analysées à Rennes, 4 annonceurs Google Ads détectés. Répartition par secteur et lecture du marché local.",
    intro:
      "Rennes compte 36 entreprises dans mon relevé, avec une composition plus équilibrée que la plupart des autres villes : immobilier, auto-écoles et architecture y pèsent des poids comparables.",
    mix: [
      { sector: "agences immobilières", count: 9, advertisers: 2 },
      { sector: "auto-écoles", count: 6, advertisers: 1 },
      { sector: "cabinets d'architecture", count: 5, advertisers: 0 },
    ],
    reading:
      "C'est la ville du relevé où les annonceurs détectés sont les plus également répartis entre secteurs. Aucun métier n'y a pris d'avance publicitaire nette, y compris l'immobilier qui domine ailleurs. Sur un marché de cette taille, une position solide se construit encore sur des requêtes précises plutôt que par la surenchère.",
  },
  {
    slug: "nantes",
    name: "Nantes",
    prep: "à Nantes",
    metaTitle: "Google Ads à Nantes : 35 entreprises analysées",
    metaDescription:
      "35 entreprises nantaises analysées, 2 annonceurs — le taux le plus bas du relevé. Le seul marché où j'accompagne un client.",
    intro:
      "Nantes est la seule ville de ce relevé où j'ai une expérience de terrain : le compte que je pilote au mois est celui d'une entreprise de débarras et de déménagement de Loire-Atlantique. C'est aussi la ville où j'ai détecté le moins d'annonceurs.",
    mix: [
      { sector: "agences immobilières", count: 12, advertisers: 1 },
      { sector: "cabinets d'avocats", count: 6, advertisers: 0 },
      { sector: "administrateurs de biens", count: 5, advertisers: 0 },
    ],
    reading:
      "Deux annonceurs détectés sur 35 entreprises, c'est le taux le plus bas de tout le relevé, et l'immobilier y est très présent sans être publicitairement actif. Sur le compte que je pilote dans ce département, ce que j'ai vu concorde : la concurrence sur les requêtes locales de services y est encore modérée, et l'essentiel du travail porte sur l'exclusion des recherches sans intention commerciale plutôt que sur la lutte aux enchères.",
  },
  {
    slug: "toulouse",
    name: "Toulouse",
    prep: "à Toulouse",
    metaTitle: "Google Ads à Toulouse : 34 entreprises analysées",
    metaDescription:
      "34 entreprises analysées à Toulouse, 4 annonceurs Google Ads détectés. Un marché dominé par l'immobilier et l'architecture.",
    intro:
      "Toulouse compte 34 entreprises dans mon relevé. Sa particularité tient à la place qu'y occupent les métiers de la construction et de l'immobilier, plus marquée que dans les autres villes analysées.",
    mix: [
      { sector: "agences immobilières", count: 13, advertisers: 1 },
      { sector: "cabinets d'architecture", count: 6, advertisers: 0 },
      { sector: "auto-écoles", count: 4, advertisers: 0 },
    ],
    reading:
      "Les cabinets d'architecture forment ici la deuxième population de l'échantillon, et aucun ne diffusait d'annonces détectables — cohérent avec ce que j'observe sur ce métier au niveau national, où je n'ai relevé aucun annonceur sur 32 cabinets. Le marché toulousain confirme donc plutôt qu'il n'infirme la réserve que j'exprime sur ce secteur.",
  },
];

export const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

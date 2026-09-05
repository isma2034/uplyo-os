/**
 * Contenu des pages sectorielles.
 *
 * Objectif SEO : ces pages doivent mériter leur position. Une page « Google
 * Ads pour X » qui se contente de décliner un gabarit avec le nom du métier
 * est exactement ce que Google traite en page satellite — et c'est l'un des
 * rares motifs d'action manuelle. Chaque section ci-dessous doit donc être
 * FAUSSE si on l'applique à un autre secteur. C'est le test à repasser avant
 * d'ajouter un métier ici.
 *
 * Aucun chiffre de performance n'est promis nulle part : les seuls chiffres
 * publiés viennent de market-data.ts et sont des mesures de marché, pas des
 * résultats clients.
 */

export type Sector = {
  slug: string;
  /** Pluriel, tel qu'il apparaît dans les phrases statistiques. */
  plural: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** L'erreur de ciblage propre au métier. */
  intent: { title: string; body: string };
  /** Mots-clés à exclure, avec la raison — la raison est ce qui a de la valeur. */
  negatives: { term: string; why: string }[];
  /** Ce qu'il faut réellement mesurer dans ce métier. */
  tracking: { title: string; body: string };
  /** Structure de compte adaptée. */
  structure: { title: string; body: string };
  /** Angles d'annonce qui fonctionnent, et pourquoi. */
  angles: string[];
  /** Quand ce levier ne convient pas — obligatoire, c'est la promesse du site. */
  caveat: string;
};

export const SECTORS: Sector[] = [
  {
    slug: "agences-immobilieres",
    plural: "agences immobilières",
    metaTitle: "Google Ads pour agence immobilière : capter des mandats, pas des locataires",
    metaDescription:
      "Le piège du secteur : les requêtes qui rapportent des mandats de vente ne ressemblent pas à celles qui rapportent du trafic. Exclusions, suivi des appels, structure de compte.",
    h1: "Google Ads pour une agence immobilière",
    intro:
      "Dans ce métier, la majorité du budget publicitaire part sur des recherches qui ne produiront jamais de mandat. Ce n'est pas un problème d'enchères ni d'annonces : c'est un problème d'intention. Voici ce qui distingue les deux.",
    intent: {
      title: "Le vendeur et l'acheteur ne cherchent pas la même chose",
      body: "Une agence gagne sa vie sur les mandats, donc sur les vendeurs. Or les requêtes à gros volume — « appartement à vendre Lyon 3 », « maison à louer » — sont tapées par des acheteurs et des locataires, qui iront de toute façon sur les portails. Les requêtes qui amènent un vendeur sont plus rares et beaucoup moins évidentes : « estimation maison », « combien vaut mon appartement », « vendre sans agence », « frais d'agence vente ». Ce sont elles qui doivent porter le budget. Un compte qui ne sépare pas ces deux mondes en campagnes distinctes ne peut pas arbitrer entre les deux.",
    },
    negatives: [
      { term: "leboncoin, pap, particulier à particulier", why: "recherche d'un canal sans agence : le clic est payé pour un visiteur qui cherche précisément à vous éviter." },
      { term: "location, louer, colocation", why: "à exclure des campagnes vendeurs — sauf si la gestion locative est une vraie ligne de revenus, auquel cas elle mérite sa propre campagne et son propre budget." },
      { term: "emploi, recrutement, salaire négociateur, stage", why: "trafic de candidats, jamais de clients. Volume non négligeable dans ce secteur." },
      { term: "simulateur, calcul notaire, barème", why: "intention documentaire : la personne cherche un outil, pas un interlocuteur." },
      { term: "viager, saisie, enchères", why: "à exclure si vous ne traitez pas ces cas ; ils déclenchent des clics chers et des appels hors sujet." },
    ],
    tracking: {
      title: "Ici, l'appel compte plus que le formulaire",
      body: "Un vendeur qui hésite appelle : il ne remplit pas un formulaire de dix champs. Si seul l'envoi de formulaire est suivi comme conversion, Google optimise vers la minorité des contacts et ignore la majorité. Il faut un suivi des appels — numéro dynamique ou clic sur le numéro depuis mobile — et une valeur de conversion distincte entre « demande d'estimation » et « demande d'information », parce qu'un mandat vaut plusieurs milliers d'euros quand une question sur les frais n'en vaut rien.",
    },
    structure: {
      title: "Le rayon, pas la ville",
      body: "Cibler « Lyon » fait diffuser sur toute la métropole alors qu'une agence de quartier ne prendra pas un mandat à 20 minutes. Un rayon autour de l'agence, ajusté secteur par secteur, coûte moins cher et convertit mieux. Séparer ensuite une campagne « estimation / vendre » d'une campagne « acheter » : elles n'ont ni le même objectif, ni le même coût par clic acceptable, ni la même page d'arrivée.",
    },
    angles: [
      "Annoncer la contrepartie concrète — « estimation sous 48 h, sans engagement » — plutôt que « votre partenaire immobilier depuis 20 ans », qui ne dit rien au visiteur.",
      "Nommer le secteur précis dans l'annonce ; un vendeur veut une agence qui connaît sa rue, pas sa région.",
      "Envoyer sur une page dédiée à l'estimation, pas sur la page d'accueil avec les biens en vitrine : la vitrine sert les acheteurs et fait fuir les vendeurs.",
    ],
    caveat:
      "Si votre zone est déjà saturée de réseaux nationaux qui enchérissent sans plafond sur « estimation immobilière », le coût par mandat peut ne pas être tenable. Ça se vérifie avant de dépenser, pas après.",
  },
  {
    slug: "auto-ecoles",
    plural: "auto-écoles",
    metaTitle: "Google Ads pour auto-école : viser l'inscription, pas le code gratuit",
    metaDescription:
      "Le code attire du volume sans valeur, les plateformes nationales tiennent les enchères. Exclusions, ciblage local serré et suivi de l'inscription réelle.",
    h1: "Google Ads pour une auto-école",
    intro:
      "Une inscription vaut souvent plus de mille euros, ce qui laisse de la marge pour acquérir un élève. Le problème n'est donc pas le budget : c'est que l'essentiel du volume de recherche du secteur n'a aucune valeur commerciale.",
    intent: {
      title: "« Code de la route » est un piège à budget",
      body: "C'est la requête la plus tapée du secteur, et la moins rentable : ceux qui la tapent cherchent des tests gratuits, pas une école. Elle est en plus disputée par des applications qui monétisent l'audience autrement et peuvent payer plus cher le clic que vous. Ce qui convertit, ce sont les requêtes d'inscription et de proximité : « auto-école + quartier », « permis boîte automatique », « conduite accompagnée », « permis accéléré », « repasser le permis après annulation » — cette dernière étant l'une des plus rentables du métier et presque jamais travaillée.",
    },
    negatives: [
      { term: "gratuit, en ligne, test, série, application", why: "chercheurs de code gratuit. C'est le poste de gaspillage numéro un du secteur." },
      { term: "ornikar, en voiture simone, lepermislibre", why: "requêtes de marque concurrente : cher, et vous vendez rarement à quelqu'un qui a déjà choisi." },
      { term: "emploi, moniteur, devenir enseignant, BEPECASER, formation moniteur", why: "candidats à l'embauche, volume important et zéro valeur." },
      { term: "code gratuit 2026, questions officielles", why: "même logique que ci-dessus, sur des variantes qui échappent au filtre « gratuit » seul." },
      { term: "poids lourd, bateau, moto (si non proposé)", why: "clics sur des permis que vous ne délivrez pas." },
    ],
    tracking: {
      title: "L'inscription se fait au comptoir, pas sur le site",
      body: "Presque personne ne s'inscrit en ligne : on appelle, ou on passe. Le suivi doit donc porter sur l'appel et sur l'itinéraire demandé, pas sur un formulaire. Sans cela, un compte affichera « 0 conversion » alors qu'il remplit l'agenda — et l'algorithme, privé de signal, optimisera dans le vide. C'est le cas le plus fréquent que je rencontre dans ce métier.",
    },
    structure: {
      title: "Cinq kilomètres, pas un département",
      body: "Un élève choisit une auto-école sur son trajet. Au-delà de quelques kilomètres, le taux de transformation s'effondre alors que le coût par clic, lui, ne baisse pas. Un rayon serré autour de chaque agence, avec une campagne par agence si vous en avez plusieurs, permet de voir laquelle rentabilise et laquelle non — impossible à distinguer dans une campagne unique.",
    },
    angles: [
      "Afficher le taux de réussite réel s'il est bon : c'est le seul chiffre que les parents comparent, et il est vérifiable publiquement.",
      "Mettre en avant le délai d'obtention d'une place à l'examen : c'est le vrai point de douleur, davantage que le prix.",
      "Traiter « boîte automatique » comme une campagne à part entière — demande en forte hausse, concurrence encore faible.",
    ],
    caveat:
      "Si votre zone compte déjà plusieurs auto-écoles enchérissant sur les mêmes requêtes locales, le coût par inscription peut dépasser la marge. Sur les 45 auto-écoles que j'ai analysées, très peu diffusent des annonces — cela peut être une opportunité comme le signe que le levier ne rentre pas dans ce marché. Ça se mesure avant.",
  },
  {
    slug: "avocats",
    plural: "cabinets d'avocats",
    metaTitle: "Google Ads pour avocat : spécialité, déontologie et coût par clic élevé",
    metaDescription:
      "Un des secteurs les plus chers de Google Ads. Pourquoi la spécialité prime sur la ville, quelles exclusions posent le plus, et ce que la déontologie autorise.",
    h1: "Google Ads pour un cabinet d'avocats",
    intro:
      "C'est l'un des secteurs où le clic coûte le plus cher, et où l'écart entre une campagne bien construite et une campagne moyenne se compte en milliers d'euros par mois. Deux contraintes structurent tout : la déontologie et la spécialité.",
    intent: {
      title: "« Avocat + ville » est la pire requête à acheter",
      body: "Elle est chère, disputée par tous les cabinets de la ville et par les annuaires juridiques, et elle n'indique aucun besoin précis. Une personne qui tape « avocat Lyon » ne sait pas encore ce qu'elle cherche. Celle qui tape « avocat licenciement sans cause réelle et sérieuse » ou « contester une rupture conventionnelle » sait exactement, et vaut beaucoup plus. La règle du secteur : enchérir sur le problème du client, jamais sur votre titre.",
    },
    negatives: [
      { term: "gratuit, aide juridictionnelle, consultation gratuite", why: "public sans budget. À exclure sauf si c'est délibérément votre positionnement." },
      { term: "définition, c'est quoi, article, code civil, jurisprudence", why: "intention documentaire — étudiants et curieux. Volume énorme dans ce secteur." },
      { term: "emploi, stage, collaboration, élève avocat, CRFPA", why: "candidats et étudiants." },
      { term: "modèle, lettre type, formulaire, exemple", why: "cherche à se passer d'un avocat." },
      { term: "avis, honoraires moyens, tarif", why: "à surveiller : parfois de vrais prospects, souvent de la comparaison sans suite. À isoler dans sa propre campagne pour trancher sur données." },
    ],
    tracking: {
      title: "Toutes les prises de contact ne se valent pas",
      body: "Un dossier de droit des affaires et une question sur un litige de voisinage arrivent par le même formulaire et ne pèsent pas le même poids. Sans valeur de conversion différenciée par type de demande, Google optimise vers le volume, c'est-à-dire vers les petits dossiers. Il faut aussi suivre l'appel : dans ce métier, un client en difficulté téléphone.",
    },
    structure: {
      title: "Une campagne par domaine de droit",
      body: "Droit du travail, droit de la famille, droit des affaires : coûts par clic, valeurs de dossier et concurrences sans rapport entre eux. Les mélanger revient à laisser le domaine le plus cher absorber le budget du plus rentable. Séparer permet aussi d'envoyer chaque visiteur sur une page qui traite son sujet — un justiciable en instance de divorce n'a rien à faire sur une page listant huit spécialités.",
    },
    angles: [
      "Répondre à la question que tout le monde se pose et que personne n'affiche : combien ça coûte, et comment se déroule un premier rendez-vous.",
      "Nommer la situation précise plutôt que le domaine : « rupture conventionnelle contestée » parle, « droit du travail » non.",
      "Rester dans le cadre du RIN : pas de comparaison avec des confrères, pas de promesse de résultat, pas de témoignage client identifiable. La publicité est permise, la sollicitation personnalisée et le démarchage restent encadrés.",
    ],
    caveat:
      "Avec des clics à plusieurs euros et un taux de transformation modeste, ce levier suppose une valeur de dossier suffisante. Pour un cabinet dont l'activité repose sur la recommandation et les dossiers récurrents, il n'est pas toujours pertinent, et je le dirai.",
  },
  {
    slug: "architectes",
    plural: "cabinets d'architecture",
    metaTitle: "Google Ads pour architecte : ce que dit un secteur où presque personne n'annonce",
    metaDescription:
      "Sur 32 cabinets d'architecture analysés, aucun ne diffusait d'annonces détectables. Pourquoi, et dans quels cas précis ce levier a malgré tout du sens.",
    h1: "Google Ads pour un cabinet d'architecture",
    intro:
      "Sur les 32 cabinets d'architecture que j'ai analysés, je n'ai détecté aucun annonceur Google Ads. C'est le seul secteur de mon relevé dans ce cas, et cela mérite une explication honnête avant toute proposition.",
    intent: {
      title: "Un cycle long, une décision qui ne se prend pas sur un clic",
      body: "Entre la première recherche et la signature d'un contrat de maîtrise d'œuvre, il s'écoule souvent des mois, et la décision passe par la recommandation, le bouche-à-oreille et le portfolio. Google Ads est bon pour capter une intention immédiate ; il l'est beaucoup moins pour accompagner une décision longue et relationnelle. L'absence totale d'annonceurs dans ce relevé est cohérente avec ça — ce n'est probablement pas un oubli collectif.",
    },
    negatives: [
      { term: "gratuit, plan gratuit, logiciel, 3D, autocad", why: "recherche d'outils, pas de maître d'œuvre. Volume très supérieur aux requêtes commerciales." },
      { term: "emploi, stage, HMONP, école d'architecture", why: "étudiants et candidats : l'essentiel du volume sur « architecte »." },
      { term: "salaire, devenir architecte, études", why: "intention documentaire pure." },
      { term: "architecte d'intérieur (si non proposé)", why: "métier différent, souvent confondu par le public, et clics perdus." },
    ],
    tracking: {
      title: "Mesurer le rendez-vous, pas le contact",
      body: "Avec des volumes faibles, un compte peut mettre des mois à accumuler assez de conversions pour qu'une stratégie d'enchères automatique fonctionne. Il faut donc suivre des étapes intermédiaires — consultation du portfolio, page honoraires, prise de rendez-vous — et accepter un pilotage plus manuel qu'ailleurs.",
    },
    structure: {
      title: "Le projet, pas le métier",
      body: "Les rares requêtes à valeur sont celles qui décrivent un projet précis et contraint : « extension maison permis de construire », « surélévation », « architecte pour ERP », « rénovation bâtiment classé ». Elles ont peu de volume mais une intention forte. Une campagne unique sur « architecte + ville » ne captera que des étudiants et des curieux.",
    },
    angles: [
      "Afficher le budget d'honoraires ou son mode de calcul : c'est ce qui bloque la prise de contact, et presque aucun cabinet ne le fait.",
      "Cibler les projets soumis à autorisation, où le recours à un professionnel est obligatoire au-delà d'un seuil de surface.",
      "Traiter les marchés publics et les projets professionnels séparément des particuliers : ni le même cycle, ni le même interlocuteur.",
    ],
    caveat:
      "C'est le secteur où je suis le plus réservé. Si votre activité vient de la recommandation et de la commande publique, Google Ads a peu de chances d'être votre meilleur euro investi, et je vous le dirai plutôt que de vous vendre un dispositif.",
  },
];

export const SECTOR_BY_SLUG = new Map(SECTORS.map((s) => [s.slug, s]));

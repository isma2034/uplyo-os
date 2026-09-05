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
  {
    slug: "debarras-demenagement",
    plural: "entreprises de débarras et déménagement",
    metaTitle: "Google Ads pour le débarras et le déménagement : filtrer le « gratuit »",
    metaDescription:
      "Le secteur où je pilote réellement un compte. Le piège du débarras gratuit, le devis qui ne peut pas se faire en ligne, et la saisonnalité qui ruine les budgets mal repartis.",
    h1: "Google Ads pour une entreprise de débarras ou de déménagement",
    intro:
      "C'est le seul métier de cette liste où je pilote un compte réel, au mois, depuis 2026. Ce qui suit ne vient donc pas d'une lecture de documentation : c'est ce que j'ai vu passer dans un rapport de termes de recherche.",
    intent: {
      title: "« Débarras gratuit » est la requête la plus tapée, et la moins rentable",
      body: "Une large part du volume vient de personnes qui cherchent à faire enlever leurs affaires sans payer, en échange de la valeur des biens. Elles cliquent, elles appellent, elles occupent le temps du standard, et elles ne signent jamais un devis payant. Ce sont pourtant les requêtes les plus tapées du secteur. À l'inverse, « débarras succession », « vide maison après décès », « débarras avant travaux » ou « encombrants appartement étage » signalent une contrainte réelle, un délai, et quelqu'un prêt à payer. La séparation entre ces deux mondes est le premier travail à faire, avant toute optimisation d'enchères.",
    },
    negatives: [
      { term: "gratuit, gratuitement, contre récupération, don", why: "le cœur du gaspillage dans ce métier. Volume élevé, transformation nulle." },
      { term: "emploi, recrutement, déménageur salaire, offre d'emploi", why: "secteur à fort turnover : le volume de recherche d'emploi est important et coûte cher." },
      { term: "location camion, utilitaire, self stockage, box", why: "la personne compte déménager seule ; elle cherche un véhicule, pas un prestataire." },
      { term: "déchetterie, encombrants mairie, ramassage gratuit commune", why: "recherche du service public gratuit — jamais un client." },
      { term: "prix au m3, tarif, combien coûte", why: "à isoler plutôt qu'à exclure d'emblée : ce sont parfois de vrais prospects, mais ils méritent leur propre campagne et une page qui parle prix, sinon ils rebondissent." },
    ],
    tracking: {
      title: "Le devis se fait sur place, pas sur le site",
      body: "Personne ne signe un débarras en ligne : on appelle, on envoie des photos, on convient d'une visite. La conversion à suivre est donc l'appel et l'envoi de photos, pas un formulaire abouti. Sur le compte que je gère, c'est exactement ce qui bloquait au départ — les campagnes ramenaient des appels que rien ne comptait, et l'algorithme optimisait à l'aveugle. Vérifier ce point avant de toucher aux enchères change davantage le résultat que n'importe quel réglage.",
    },
    structure: {
      title: "La saisonnalité déplace le budget, pas la moyenne annuelle",
      body: "Les déménagements se concentrent sur juin-septembre, les débarras de succession n'ont aucune saison, et les débarras avant travaux suivent le rythme du bâtiment. Un budget mensuel constant sur-dépense en hiver et manque de plafond en été, exactement quand la demande est là. Séparer ces motifs en campagnes distinctes permet de déplacer l'argent au bon moment au lieu de subir la moyenne.",
    },
    angles: [
      "Annoncer la contrainte que le client a réellement : un délai (« intervention sous 48 h »), pas une qualité générale (« sérieux et rapide »).",
      "Nommer l'étage et l'absence d'ascenseur : c'est ce qui inquiète, et le dire écarte les appels qui n'auraient pas abouti.",
      "Traiter la succession comme un parcours à part : le ton, l'urgence et la personne qui appelle n'ont rien à voir avec un déménagement classique.",
    ],
    caveat:
      "Sur une zone rurale à faible volume de recherche, il n'y aura simplement pas assez de requêtes pour alimenter un compte — le levier local classique reste alors plus efficace. C'est vérifiable en une étude de volume avant de dépenser le premier euro.",
  },
  {
    slug: "plomberie-depannage",
    plural: "entreprises de plomberie et de dépannage",
    metaTitle: "Google Ads pour plombier : l'urgence se gagne sur les horaires, pas sur l'enchère",
    metaDescription:
      "Diffuser 24h/24 sans décrocher la nuit, c'est payer pour rien. Programmation horaire, exclusion du bricolage, et suivi des appels — les trois leviers du dépannage.",
    h1: "Google Ads pour un plombier ou une entreprise de dépannage",
    intro:
      "Dans le dépannage, le visiteur n'a ni le temps ni l'envie de comparer : il appelle le premier qui répond. Cela change complètement la hiérarchie des leviers — l'horaire de diffusion y pèse plus lourd que le montant de l'enchère.",
    intent: {
      title: "Le bricoleur et l'urgence tapent presque les mêmes mots",
      body: "« Fuite chasse d'eau » peut venir de quelqu'un qui cherche un tutoriel comme de quelqu'un dont l'appartement prend l'eau. La différence se lit dans les formulations : tout ce qui commence par « comment », « réparer soi-même » ou « tuto » est du bricolage, tout ce qui contient « urgence », « en urgence », « dépannage », « 24h » ou un nom de ville est commercial. Le volume documentaire écrase le volume commercial dans ce métier : sans séparation nette, l'essentiel du budget part chez des gens qui n'appelleront jamais.",
    },
    negatives: [
      { term: "comment, tuto, soi-même, réparer, astuce, vidéo", why: "intention documentaire. C'est le premier poste de dépense inutile du secteur." },
      { term: "pièce, joint, robinet pas cher, leroy merlin, castorama", why: "recherche d'un produit en magasin, pas d'un artisan." },
      { term: "emploi, apprenti, formation plombier, salaire", why: "candidats." },
      { term: "devis gratuit en ligne, simulateur, estimation", why: "à surveiller : dans le dépannage d'urgence, un devis en ligne n'existe pas — ces clics aboutissent rarement." },
      { term: "assurance, dégât des eaux prise en charge, expertise", why: "la personne cherche à se faire indemniser, pas à faire intervenir un artisan." },
    ],
    tracking: {
      title: "Sans suivi des appels, ce métier est mesuré à zéro",
      body: "La quasi-totalité des conversions sont des appels. Si seuls les formulaires sont comptés, le compte affichera des résultats catastrophiques alors que le téléphone sonne. Il faut compter le clic sur le numéro depuis mobile, et idéalement la durée d'appel : dans le dépannage, un appel de moins de trente secondes est presque toujours une erreur ou un démarchage, et le compter comme conversion apprend à l'algorithme à chercher les mauvaises personnes.",
    },
    structure: {
      title: "La programmation horaire avant tout le reste",
      body: "Annoncer « dépannage 24h/24 » et diffuser la nuit sans décrocher revient à payer plein tarif des clics qui iront chez le concurrent qui répond. Soit on répond réellement la nuit et on assume le coût par clic nocturne, souvent plus faible, soit on cale la diffusion sur les heures où quelqu'un décroche. C'est le réglage qui change le plus le coût par intervention dans ce métier, avant toute optimisation d'annonce.",
    },
    angles: [
      "Afficher un délai d'intervention chiffré et tenable — c'est le seul critère de choix dans l'urgence.",
      "Afficher un ordre de prix de déplacement : le secteur souffre d'une réputation d'abus tarifaire, et être le seul à annoncer un montant crée un avantage immédiat.",
      "Séparer le dépannage urgent des travaux planifiés (salle de bain, chaudière) : cycles, budgets et pages d'arrivée n'ont rien en commun.",
    ],
    caveat:
      "Si vous ne pouvez pas décrocher dans les minutes qui suivent, ce levier ne fonctionnera pas, quel que soit le budget. Un standard qui laisse sonner transforme chaque euro dépensé en clic offert au concurrent suivant.",
  },
  {
    slug: "garages-automobiles",
    plural: "garages automobiles",
    metaTitle: "Google Ads pour un garage : le piège des recherches de pièces détachées",
    metaDescription:
      "La longue traîne « marque + modèle + prestation » est le vrai gisement d'un garage. Comment écarter les chercheurs de pièces et mesurer la prise de rendez-vous.",
    h1: "Google Ads pour un garage automobile",
    intro:
      "C'est le secteur où j'ai relevé la proportion d'annonceurs la plus élevée de mon échantillon — sur un effectif trop réduit pour en publier un pourcentage, mais suffisant pour dire que le levier y est déjà utilisé. La concurrence y est donc réelle, et la précision compte plus que le budget.",
    intent: {
      title: "Le gisement est dans « marque + modèle + prestation »",
      body: "« Garage Toulouse » est cher, vague, et disputé par toutes les enseignes nationales. « Changement courroie distribution Clio 4 prix », « révision 208 sans perdre la garantie », « diagnostic voyant moteur Golf 7 » sont peu volumiques, peu disputées, et tapées par quelqu'un qui a déjà identifié son problème. Ces requêtes existent par centaines de combinaisons : c'est un travail d'inventaire, pas d'enchère. C'est aussi ce qui permet à un garage indépendant de coexister avec des réseaux au budget bien supérieur.",
    },
    negatives: [
      { term: "pièce détachée, oscaro, mister auto, occasion, casse", why: "la personne veut acheter une pièce, pas la faire monter. Volume massif sur les requêtes de modèles." },
      { term: "voiture occasion, annonce, leboncoin, acheter", why: "recherche d'achat de véhicule — sauf si vous vendez aussi, auquel cas c'est une campagne distincte." },
      { term: "tuto, comment changer, forum, notice", why: "bricolage automobile, très actif en ligne." },
      { term: "emploi, mécanicien recrutement, apprentissage", why: "candidats." },
      { term: "contrôle technique (si non proposé)", why: "activité réglementée distincte ; les clics sont nombreux et inexploitables si vous ne la proposez pas." },
    ],
    tracking: {
      title: "Le rendez-vous se prend par téléphone",
      body: "Comme dans la plupart des métiers d'atelier, la conversion est l'appel — parfois le formulaire de prise de rendez-vous, rarement une réservation aboutie en ligne. Il faut aussi distinguer la valeur : une vidange et un embrayage arrivent par le même canal et ne pèsent pas le même chiffre d'affaires. Sans valeur différenciée, l'algorithme optimise vers les petites interventions, celles qui remplissent l'atelier sans le rentabiliser.",
    },
    structure: {
      title: "Une campagne par famille de prestation",
      body: "Entretien courant, pneumatiques, distribution, climatisation, diagnostic électronique : ces familles n'ont ni le même panier, ni la même concurrence, ni la même urgence. Les mélanger laisse les requêtes à fort volume et faible marge — les pneus notamment, où les pure players cassent les prix — absorber le budget des prestations rentables.",
    },
    angles: [
      "Afficher un tarif ou une fourchette : c'est le premier motif de contact, et l'immense majorité des garages ne l'affiche pas.",
      "Lever l'objection de la garantie constructeur, qui retient beaucoup de propriétaires de véhicules récents chez le concessionnaire alors que la loi ne l'impose pas.",
      "Décliner les annonces par marque quand l'atelier a une spécialité : « spécialiste Volkswagen » convertit mieux que « toutes marques ».",
    ],
    caveat:
      "Avec des réseaux nationaux qui enchérissent sur les requêtes génériques d'entretien, un garage isolé qui vise large dépensera sans résultat. Ce levier ne tient que sur la longue traîne et sur une spécialité assumée.",
  },
  {
    slug: "hebergement-touristique",
    plural: "hébergements touristiques",
    metaTitle: "Google Ads pour un gîte ou un hôtel : défendre son nom contre les plateformes",
    metaDescription:
      "Booking et Airbnb enchérissent sur le nom de votre établissement et vous revendent vos propres clients. La campagne de marque, la saisonnalité et la mesure de la réservation directe.",
    h1: "Google Ads pour un gîte, une chambre d'hôtes ou un hôtel",
    intro:
      "Dans l'hébergement, la question n'est pas seulement d'attirer de nouveaux voyageurs : c'est d'éviter de payer une commission sur des clients qui vous cherchaient déjà par votre nom.",
    intent: {
      title: "Les plateformes enchérissent sur le nom de votre établissement",
      body: "Quelqu'un tape le nom de votre gîte pour réserver en direct. En haut des résultats, il trouve une annonce Booking ou Expedia pointant vers votre fiche chez eux. Il réserve là, et vous versez 15 à 20 % de commission sur un client que vous aviez déjà gagné. Une campagne sur votre propre marque coûte quelques centimes le clic — la concurrence y est nulle puisque vous êtes le seul à porter ce nom — et récupère ces réservations en direct. C'est, dans ce métier, le calcul de rentabilité le plus simple à faire et le plus souvent ignoré.",
    },
    negatives: [
      { term: "emploi, saisonnier, recrutement", why: "très fort volume en période de recrutement saisonnier." },
      { term: "à vendre, reprise, investissement, rentabilité gîte", why: "porteurs de projet et investisseurs, pas des voyageurs." },
      { term: "pas cher, gratuit, camping, auberge de jeunesse", why: "à ajuster selon votre positionnement, mais ces mots attirent un public qui ne réservera pas un hébergement de standing." },
      { term: "booking, airbnb, abritel, comparateur", why: "la personne cherche la plateforme, pas vous — sauf dans votre campagne de marque, où l'association nom + plateforme est au contraire à conserver." },
      { term: "avis, forum, tripadvisor", why: "phase de vérification, très rarement de réservation directe." },
    ],
    tracking: {
      title: "La réservation part vers un moteur externe",
      body: "La plupart des hébergements confient leur moteur de réservation à un prestataire tiers, sur un autre domaine. Sans configuration explicite, le suivi se casse au moment précis du passage — le compte enregistre zéro réservation alors que le planning se remplit. C'est le défaut le plus courant que je rencontre dans ce secteur, et il rend toute optimisation impossible tant qu'il n'est pas corrigé. La valeur de conversion doit en plus refléter le montant du séjour, pas un forfait : deux nuits et deux semaines n'ont rien à voir.",
    },
    structure: {
      title: "Une saisonnalité brutale, et des dates dans les requêtes",
      body: "La demande se concentre sur quelques semaines, et les recherches sont datées — « gîte Ardèche août », « hôtel Lyon week-end ». Un budget lissé sur l'année manque la haute saison et dépense hors période. Il faut aussi anticiper : les réservations d'été se décident au printemps, donc la diffusion doit précéder le pic de plusieurs mois, pas l'accompagner.",
    },
    angles: [
      "Afficher l'avantage de la réservation directe — meilleur tarif garanti, annulation souple : c'est ce qui fait basculer un visiteur qui compare avec la plateforme.",
      "Séparer la campagne de marque du reste, avec son propre budget : elle est peu chère, très rentable, et ne doit jamais entrer en concurrence budgétaire avec la prospection.",
      "Cibler les périodes creuses avec des motifs différents — télétravail, hors-saison, longs séjours — plutôt que de surenchérir en pleine saison où tout est déjà complet.",
    ],
    caveat:
      "Si votre taux d'occupation est déjà proche du maximum en saison et que vous ne cherchez pas à remplir l'hors-saison, ce levier n'a pas grand-chose à vous apporter au-delà de la campagne de marque — laquelle reste rentable presque partout.",
  },
];

export const SECTOR_BY_SLUG = new Map(SECTORS.map((s) => [s.slug, s]));

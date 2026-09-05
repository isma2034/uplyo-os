/**
 * Pages « problème » — contenu de réponse à des requêtes réellement tapées.
 *
 * Pourquoi ces pages plutôt que d'autres : elles captent quelqu'un qui est
 * déjà en difficulté sur son compte, souvent chez un prestataire qui ne lui
 * répond pas. L'intention commerciale y est plus forte que sur une requête
 * générique de type « agence google ads », et la concurrence publicitaire y
 * est bien moindre.
 *
 * Règle de rédaction : la page doit régler le problème du lecteur, y compris
 * s'il repart sans nous contacter. Une page qui retient l'information pour
 * forcer la prise de contact ne se fait ni citer ni recommander — et Google
 * sait lire la différence entre une réponse et une accroche.
 *
 * Aucune promesse chiffrée ici non plus : voir la note en tête de sectors.ts.
 */

export type Problem = {
  slug: string;
  /** Formulée comme le lecteur la tape, sert de H1. */
  question: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  causes: {
    title: string;
    /** Comment reconnaître que c'est bien cette cause-là. */
    check: string;
    /** Ce qu'on fait ensuite. */
    fix: string;
  }[];
  /** Ce que la page ne résout pas — obligatoire. */
  honest: string;
};

export const PROBLEMS: Problem[] = [
  {
    slug: "cout-par-clic-augmente",
    question: "Pourquoi mon coût par clic augmente-t-il sans que j'aie rien changé ?",
    metaTitle: "Coût par clic Google Ads qui augmente : les 5 causes réelles, dans l'ordre",
    metaDescription:
      "Historique des modifications, requêtes nouvellement captées, niveau de qualité, stratégie d'enchères, concurrence. Comment identifier laquelle vous concerne, en quelques minutes.",
    intro:
      "Un coût par clic qui monte n'est presque jamais dû au hasard ni à une décision opaque de Google. Dans la grande majorité des cas, l'une des cinq causes ci-dessous suffit à l'expliquer, et les deux premières se vérifient en moins de cinq minutes.",
    causes: [
      {
        title: "Quelqu'un a modifié quelque chose",
        check:
          "Ouvrez l'historique des modifications du compte et filtrez sur les deux semaines précédant la hausse. Il enregistre tout, y compris les changements automatiques appliqués par Google et les « recommandations » acceptées automatiquement si l'option est active.",
        fix:
          "C'est de loin la première cause, et la plus souvent écartée à tort — « je n'ai rien touché » signifie fréquemment que quelqu'un d'autre, ou une automatisation, a touché. Commencez toujours par là avant d'aller chercher plus loin.",
      },
      {
        title: "Vos mots-clés captent de nouvelles requêtes",
        check:
          "Comparez le rapport des termes de recherche avant et après la hausse. En requête large, Google élargit continuellement les correspondances : votre mot-clé n'a pas bougé, mais ce qu'il attrape a changé.",
        fix:
          "Ajoutez en exclusion tout ce qui est apparu et qui n'a pas d'intention commerciale. Si l'élargissement est massif, resserrez le type de correspondance plutôt que d'exclure indéfiniment terme par terme.",
      },
      {
        title: "Votre niveau de qualité a baissé",
        check:
          "Affichez les colonnes de niveau de qualité et ses trois composantes : pertinence de l'annonce, taux de clic attendu, expérience sur la page de destination. Une baisse d'un point suffit à faire monter le coût par clic de façon notable.",
        fix:
          "Regardez laquelle des trois composantes a bougé. Une page de destination devenue lente ou modifiée agit sur la troisième sans que rien n'ait changé côté campagne.",
      },
      {
        title: "La stratégie d'enchères fait son travail",
        check:
          "Si vous êtes en « maximiser les conversions » ou en coût par acquisition cible, Google monte les enchères tant qu'il trouve des conversions dans la cible. Un coût par clic qui augmente pendant que le coût par conversion reste stable n'est pas un problème : c'est le fonctionnement attendu.",
        fix:
          "Ne regardez le coût par clic que rapporté au coût par conversion. Isolément, c'est un indicateur trompeur — c'est l'erreur d'analyse la plus fréquente sur ce sujet.",
      },
      {
        title: "Un concurrent est arrivé ou a augmenté ses enchères",
        check:
          "Le rapport « Analyse des enchères » montre qui partage vos enchères et à quelle fréquence. Un nouvel entrant, ou un acteur dont le taux de présence grimpe, se voit immédiatement.",
        fix:
          "C'est la seule cause sur laquelle vous n'avez pas la main. La réponse n'est pas de surenchérir mais de se déplacer : requêtes plus précises, horaires ou zones où le concurrent est absent.",
      },
    ],
    honest:
      "Si après ces cinq vérifications rien n'explique la hausse, la cause est probablement structurelle — un marché qui se tend durablement — et aucun réglage ne la fera redescendre. Il faut alors arbitrer sur la rentabilité, pas sur le coût par clic.",
  },
  {
    slug: "verifier-suivi-conversions",
    question: "Comment savoir si mon suivi de conversions Google Ads fonctionne vraiment ?",
    metaTitle: "Vérifier son suivi de conversions Google Ads : le test en conditions réelles",
    metaDescription:
      "Une conversion « active » dans l'interface ne prouve pas qu'elle enregistre vos vraies demandes. La méthode de vérification, et les cinq défauts les plus fréquents.",
    intro:
      "C'est la vérification la plus rentable qui existe sur un compte Google Ads, et la plus souvent négligée. Piloter sur une mesure fausse conduit à optimiser dans la mauvaise direction pendant des mois — sans que rien, dans l'interface, ne signale l'erreur.",
    causes: [
      {
        title: "Faites une vraie conversion vous-même",
        check:
          "Depuis votre téléphone, en 4G et pas sur le wifi du bureau, remplissez votre propre formulaire avec une adresse reconnaissable. Appelez votre propre numéro depuis une annonce. Attendez : les conversions Google Ads remontent avec un délai de quelques heures.",
        fix:
          "Aucun outil de diagnostic ne remplace ce test. C'est le seul qui vérifie la chaîne complète — clic, page, envoi, réception de la demande, remontée dans le compte — plutôt qu'un maillon isolé.",
      },
      {
        title: "Comparez le compte à la réalité du mois",
        check:
          "Prenez le nombre de vraies demandes reçues le mois dernier — boîte mail, cahier d'appels — et comparez-le au nombre de conversions affiché. Un écart de 20 % s'explique ; un rapport du simple au triple révèle un défaut.",
        fix:
          "Un compte qui affiche plus de conversions que de demandes réelles compte deux fois, ou compte des choses sans valeur. Moins de conversions que de demandes signifie qu'un canal entier échappe à la mesure — presque toujours le téléphone.",
      },
      {
        title: "Vérifiez que la page de remerciement n'est pas accessible directement",
        check:
          "Tapez l'URL de votre page de confirmation dans le navigateur, sans passer par le formulaire. Si elle s'affiche et déclenche la conversion, chaque visite directe, chaque robot et chaque rechargement en crée une.",
        fix:
          "C'est un défaut classique et très gonflant pour les chiffres. Il fait croire à des performances qui n'existent pas, et l'algorithme apprend sur du bruit.",
      },
      {
        title: "Regardez si les appels sont comptés",
        check:
          "Dans la plupart des métiers de services, la majorité des demandes arrivent par téléphone. Si aucune action de conversion de type appel n'existe, cette majorité n'est simplement pas mesurée.",
        fix:
          "Comptez au minimum le clic sur le numéro depuis mobile. Filtrez sur une durée minimale : un appel de dix secondes est une erreur ou du démarchage, et le compter apprend à Google à chercher les mauvaises personnes.",
      },
      {
        title: "Contrôlez le statut « principale » ou « secondaire »",
        check:
          "Une action de conversion marquée comme secondaire est enregistrée mais n'entre pas dans l'optimisation des enchères. Elle apparaît dans les rapports, ce qui donne l'illusion qu'elle sert à quelque chose.",
        fix:
          "Vérifiez que ce qui compte pour votre activité est bien en « principale ». C'est un réglage discret, et une inversion suffit à rendre inefficace une stratégie d'enchères automatique.",
      },
    ],
    honest:
      "Cette page vous permet de détecter un suivi cassé, pas d'en reconstruire un. Selon votre site — moteur de réservation externe, formulaire chargé dans un cadre, gestionnaire de balises mal configuré — la réparation peut demander une intervention technique réelle.",
  },
  {
    slug: "acces-compte-google-ads",
    question: "Mon agence refuse de me donner accès à mon compte Google Ads. Que faire ?",
    metaTitle: "Accès à son compte Google Ads : ce que vous pouvez exiger de votre agence",
    metaDescription:
      "Qui possède réellement le compte, comment vérifier, comment récupérer un accès administrateur, et pourquoi un compte ouvert au nom de l'agence pose un problème dès le départ.",
    intro:
      "C'est une situation fréquente, et la réponse dépend entièrement d'un point rarement vérifié au démarrage : à quel nom le compte a-t-il été ouvert. Il faut le savoir avant d'engager la discussion.",
    causes: [
      {
        title: "Établissez d'abord qui possède le compte",
        check:
          "Un compte Google Ads appartient à celui qui l'a créé et qui figure comme administrateur. Si l'agence l'a ouvert dans son propre centre multicomptes avec son moyen de paiement, le compte est juridiquement le sien, même si vous en avez financé toutes les campagnes.",
        fix:
          "Cherchez à qui sont adressées les factures Google. C'est l'indice le plus fiable : elles portent le nom du titulaire réel du compte.",
      },
      {
        title: "Demandez un accès administrateur, par écrit",
        check:
          "Un accès en lecture seule ne suffit pas : il ne permet ni de voir l'historique complet des modifications, ni de reprendre la main si la relation s'arrête. Demandez l'accès administrateur sur votre propre adresse e-mail.",
        fix:
          "Formulez la demande par écrit, en donnant l'adresse à autoriser et un délai. Une agence qui travaille correctement accepte sans difficulté : cela ne lui retire rien.",
      },
      {
        title: "Si le compte est au nom de l'agence, demandez un transfert",
        check:
          "Un compte peut être transféré d'un centre multicomptes à un autre, ou détaché pour devenir indépendant. C'est une opération standard, prévue par Google, qui ne demande aucune manipulation complexe.",
        fix:
          "Si le transfert est refusé, vous conservez le droit d'ouvrir un compte neuf à votre nom. Vous perdrez l'historique d'apprentissage — c'est réel, et c'est le coût de la reprise en main.",
      },
      {
        title: "Récupérez ce qui vous appartient de toute façon",
        check:
          "Même sans le compte, certaines choses restent les vôtres : la propriété Google Analytics de votre site, le conteneur Google Tag Manager s'il est sur votre domaine, et votre fiche d'établissement Google.",
        fix:
          "Vérifiez que vous êtes bien administrateur de ces trois-là. On les oublie dans les ruptures, et les récupérer ensuite est beaucoup plus difficile.",
      },
      {
        title: "Retenez la règle pour la suite",
        check:
          "Le compte doit être ouvert à votre nom, avec votre moyen de paiement, et le prestataire y accède par invitation. C'est l'inverse qui crée la situation où vous êtes.",
        fix:
          "Cela ne coûte rien à mettre en place au démarrage et rend toute rupture indolore. Un prestataire qui refuse ce principe vous dit quelque chose sur la suite.",
      },
    ],
    honest:
      "Je ne suis pas juriste et cette page ne remplace pas un avis juridique. Si votre contrat comporte des clauses sur la propriété des livrables, faites-le lire à quelqu'un dont c'est le métier avant d'agir.",
  },
  {
    slug: "clics-mais-pas-de-demandes",
    question: "Je paie des clics mais je ne reçois aucune demande. Pourquoi ?",
    metaTitle: "Des clics Google Ads mais aucune demande : où la chaîne se rompt",
    metaDescription:
      "Entre le clic et la demande, cinq maillons peuvent céder. Comment tester chacun dans l'ordre, en commençant par celui qui ne coûte rien à vérifier.",
    intro:
      "Entre le clic payé et la demande reçue, il y a une chaîne de maillons. Un seul suffit à tout rompre, et la plupart se testent en quelques minutes depuis votre téléphone. Prenez-les dans cet ordre : le premier est celui qui explique le plus de cas.",
    causes: [
      {
        title: "Les demandes arrivent, mais vous ne les voyez pas",
        check:
          "Envoyez votre propre formulaire et vérifiez que le message atteint réellement votre boîte — y compris le dossier indésirable. Un formulaire qui affiche « merci » sans rien envoyer est un défaut courant et totalement silencieux.",
        fix:
          "À vérifier avant toute chose : cela ne coûte rien et cela explique une part importante des cas. C'est arrivé sur ce site même, où des demandes ont été perdues sans aucune trace.",
      },
      {
        title: "Les requêtes captées ne sont pas les vôtres",
        check:
          "Ouvrez le rapport des termes de recherche — les vraies requêtes tapées, pas vos mots-clés. Si vous n'y reconnaissez pas vos clients, le problème est là et nulle part ailleurs.",
        fix:
          "Excluez ce qui n'a pas d'intention commerciale, et resserrez les correspondances. Une campagne qui attire les bonnes personnes convertit sans qu'on touche à la page.",
      },
      {
        title: "La page d'arrivée ne tient pas la promesse de l'annonce",
        check:
          "Cliquez sur votre propre annonce depuis un téléphone. Est-ce que la page parle exactement de ce que l'annonce promettait, ou est-ce la page d'accueil générale ? Combien de temps met-elle à s'afficher en 4G ?",
        fix:
          "Envoyer tout le trafic sur la page d'accueil est l'erreur la plus répandue. Quelqu'un qui cherche une prestation précise doit atterrir sur cette prestation, pas sur un menu.",
      },
      {
        title: "Le moyen de vous contacter est trop loin",
        check:
          "Sur mobile, comptez combien de gestes séparent l'arrivée sur la page du premier champ de contact. Au-delà d'un défilement ou deux, vous perdez l'essentiel des visiteurs.",
        fix:
          "Un moyen de contact visible sans défiler change davantage le résultat que la plupart des réglages de campagne. C'est le premier travail que j'ai fait sur le site de mon client.",
      },
      {
        title: "Personne ne répond assez vite",
        check:
          "Comptez le délai réel entre une demande reçue et votre réponse. Au-delà de quelques heures, une part importante des prospects a déjà contacté quelqu'un d'autre.",
        fix:
          "Aucun réglage publicitaire ne compense un délai de réponse trop long. C'est le maillon le moins technique de la chaîne et souvent le plus coûteux.",
      },
    ],
    honest:
      "Si les cinq maillons tiennent et que les demandes ne viennent toujours pas, l'hypothèse à examiner est que la demande n'existe pas sur vos requêtes, ou que votre offre n'est pas compétitive à ce prix. C'est une conclusion désagréable, et parfois la bonne.",
  },
  {
    slug: "annonces-ne-s-affichent-pas",
    question: "Mes annonces Google Ads ne s'affichent pas. Comment savoir pourquoi ?",
    metaTitle: "Annonces Google Ads qui ne s'affichent pas : le diagnostic dans l'ordre",
    metaDescription:
      "Ne cherchez pas votre annonce sur Google — vous faussez vos propres statistiques. L'outil de diagnostic prévu pour ça, et les six causes classiques.",
    intro:
      "Avant tout : ne tapez pas votre requête dans Google pour vérifier. Chaque recherche compte une impression sans clic, ce qui dégrade votre taux de clic et donc votre niveau de qualité. Utilisez l'outil « Aperçu et diagnostic des annonces », prévu exactement pour ça et sans effet sur vos statistiques.",
    causes: [
      {
        title: "Le budget est épuisé",
        check:
          "Une campagne limitée par le budget cesse de diffuser une partie de la journée. La colonne d'état l'indique explicitement.",
        fix:
          "Soit vous augmentez le budget, soit vous réduisez le périmètre — moins de mots-clés, zone plus étroite — pour que le budget existant tienne la journée entière.",
      },
      {
        title: "L'annonce est refusée",
        check:
          "Le statut au niveau de l'annonce indique « Refusée » ou « Approuvée avec restrictions ». Le motif est consultable en survolant le statut.",
        fix:
          "Les motifs les plus fréquents sont des majuscules abusives, une ponctuation excessive, ou une allégation invérifiable. Corrigez et redemandez l'examen ; l'annonce ne diffuse pas tant qu'elle est refusée.",
      },
      {
        title: "Un problème de facturation bloque le compte",
        check:
          "Une carte expirée ou un prélèvement rejeté suspend la diffusion du compte entier, souvent sans que l'alerte soit vue.",
        fix:
          "C'est la première chose à regarder quand tout s'arrête d'un coup, sans modification récente.",
      },
      {
        title: "Le ciblage vous exclut vous-même",
        check:
          "Vérifiez la zone géographique, le calendrier de diffusion et les appareils. Si vous testez depuis un endroit ou à une heure hors ciblage, l'annonce ne s'affichera pas — et c'est le comportement voulu.",
        fix:
          "L'outil de diagnostic permet justement de simuler une position et un moment précis, ce que votre propre recherche ne fait pas.",
      },
      {
        title: "L'enchère est trop basse pour la première page",
        check:
          "Comparez votre enchère à l'estimation d'enchère pour la première page. En dessous, l'annonce est éligible mais ne sort pratiquement jamais.",
        fix:
          "Monter l'enchère est une option ; améliorer le niveau de qualité en est une autre, moins chère à long terme.",
      },
      {
        title: "Le mot-clé a trop peu de volume",
        check:
          "Un mot-clé marqué « Faible volume de recherche » est désactivé par Google jusqu'à ce que la demande remonte. Il reste visible dans le compte, ce qui trompe.",
        fix:
          "Regroupez ces requêtes trop précises sous une formulation un peu plus large, plutôt que de les laisser inactives.",
      },
    ],
    honest:
      "Si l'outil de diagnostic indique que l'annonce est bien éligible et qu'elle ne sort toujours pas, il s'agit d'une question d'enchère face à la concurrence sur ce créneau précis. C'est une décision de rentabilité, pas un dysfonctionnement à réparer.",
  },
];

export const PROBLEM_BY_SLUG = new Map(PROBLEMS.map((p) => [p.slug, p]));

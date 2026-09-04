// ═══════════════════════════════════════════
// Uplyo — Contenu des deux parcours d'audit
// ═══════════════════════════════════════════
//
// POURQUOI DEUX PARCOURS
// La page /audit ne s'adressait qu'aux annonceurs déjà actifs : « Je regarde
// VOTRE COMPTE, et je vous écris ce que j'y vois ». Or la prospection en cours
// vise majoritairement des artisans (plombiers, serruriers, couvreurs) qui
// n'ont AUCUN compte Google Ads. Ces visiteurs ne se reconnaissaient pas dans
// la promesse et repartaient — sur la page de conversion principale du site.
//
// Deux pages statiques plutôt qu'un sélecteur client :
//   - chaque page a son H1, sa meta, sa canonique et son URL propre, ce qui
//     donne à la prospection un lien à envoyer directement au bon profil
//     (/audit/sans-campagne) sans dépendre d'un état JavaScript ;
//   - le contenu éditorial reste rendu côté serveur, sans passer dans le
//     bundle client ;
//   - aucun contenu dupliqué : H1, chapô, contenu du rapport, limites et FAQ
//     sont écrits séparément ; seuls les blocs neutres (qui fait l'audit,
//     absence de témoignages) sont mutualisés.
//
// Les deux pages se renvoient l'une vers l'autre en haut de page : un visiteur
// arrivé sur la mauvaise n'a jamais à revenir en arrière.

import { MEDIA_FLOOR } from "@/lib/offers";

export type AuditTrack = "compte" | "sans-campagne";

export type AuditTrackContent = {
  track: AuditTrack;
  href: string;
  /** Bandeau de bascule vers l'autre parcours, en haut de page. */
  switchTo: { href: string; question: string; cta: string };
  meta: { title: string; description: string };
  eyebrow: string;
  h1: string;
  lede: string;
  stats: { k: string; v: string }[];
  includesTitle: string;
  includes: { t: string; d: string }[];
  wontTitle: string;
  wont: string[];
  faq: { q: string; a: string }[];
  form: { title: string; subtitle: string };
  closing: { title: string; bullets: string[] };
};

const AUDIT_DELAY = "48 h ouvrées";

// ── Parcours 1 : compte Google Ads existant ────────────────────────────────
const COMPTE: AuditTrackContent = {
  track: "compte",
  href: "/audit",
  switchTo: {
    href: "/audit/sans-campagne",
    question: "Vous n'avez pas encore de campagne Google Ads ?",
    cta: "L'audit sans campagne",
  },
  meta: {
    title: "Audit Google Ads gratuit",
    description:
      "Vous avez déjà des campagnes : je regarde votre compte et je vous écris ce que j'y vois — où part le budget, ce que vaut votre suivi de conversions, quoi corriger en premier. Rapport écrit sous 48 h ouvrées, gratuit.",
  },
  eyebrow: "Audit gratuit · campagnes en cours",
  h1: "Je regarde votre compte, et je vous écris ce que j'y vois.",
  lede: "Requêtes hors sujet payées chaque jour, conversions qui ne remontent pas, structure qui empêche d'arbitrer : la plupart des comptes perdent du budget sans que personne ne le voie. L'audit chiffre ces fuites et vous les montre, captures à l'appui.",
  stats: [
    { k: "Prix", v: "Gratuit" },
    { k: "Délai", v: AUDIT_DELAY },
    { k: "Format", v: "Rapport écrit" },
    { k: "Suite", v: "Aucune obligation" },
  ],
  includesTitle: "Ce que contient le rapport",
  includes: [
    {
      t: "L'état de la mesure",
      d: "Je teste vos conversions pour de vrai : j'appelle le numéro, j'envoie le formulaire, et je vous montre ce qui remonte, ce qui est compté deux fois et ce qui manque.",
    },
    {
      t: "Où part le budget",
      d: "Lecture du rapport de termes de recherche : les requêtes réellement payées, celles qui n'ont rien à voir avec votre activité, et ce qu'elles vous coûtent.",
    },
    {
      t: "La structure du compte",
      d: "Campagnes, groupes, enchères, exclusions, annonces. Ce qui est en place, ce qui manque, et ce qui est à refaire plutôt qu'à corriger.",
    },
    {
      t: "Le marché et les concurrents",
      d: "Les requêtes tapées par vos clients, leur volume, leur coût au clic, et les annonceurs déjà présents dessus.",
    },
    {
      t: "Trois actions à faire en premier",
      d: "Classées par effet attendu, avec le détail pour les appliquer vous-même si vous le souhaitez.",
    },
    {
      t: `Un rapport écrit, sous ${AUDIT_DELAY}`,
      d: "Avec les captures du compte à l'appui. Il est à vous, que l'on travaille ensemble ensuite ou non.",
    },
  ],
  wontTitle: "Ce que cet audit ne fera pas",
  wont: [
    "Prédire votre coût par demande ou votre chiffre d'affaires : cela dépend de la concurrence, de la saison et de votre taux de transformation, que personne ne connaît à l'avance.",
    "Corriger votre compte. L'audit constate et priorise ; les modifications sont du travail facturé, ou à faire vous-même avec le rapport.",
    "Refaire votre site. Je signale ce qui freine la conversion, sans intervenir dessus.",
    "Analyser Meta, TikTok, Amazon ou votre référencement naturel : je ne fais que Google Ads.",
    `Vous être utile si votre budget publicitaire est très inférieur à ${MEDIA_FLOOR.local} : il n'y aurait pas assez de données pour conclure quoi que ce soit.`,
  ],
  faq: [
    {
      q: "C'est vraiment gratuit ? Où est le piège ?",
      a: "Il n'y en a pas, mais il y a un intérêt : c'est ma façon de vous montrer comment je travaille avant que vous ne payiez quoi que ce soit. Si le rapport vous suffit et que vous appliquez les corrections vous-même, tant mieux — vous ne me devez rien.",
    },
    {
      q: "Faut-il me donner accès au compte ?",
      a: "C'est mieux, en lecture seule, parce que l'essentiel se voit dans le rapport de termes de recherche et dans la configuration des conversions. Sans accès, je peux tout de même faire une analyse de marché et de concurrence à partir de votre site.",
    },
    {
      q: "Et si je n'ai pas encore de campagnes ?",
      a: "C'est l'autre parcours : l'audit devient une étude d'opportunité, à partir de votre site et de votre zone. La page /audit/sans-campagne décrit exactement ce qu'il contient.",
    },
    {
      q: "Combien de temps ça prend, de mon côté ?",
      a: `Le formulaire ci-contre, puis rien. Vous recevez le rapport sous ${AUDIT_DELAY}. L'appel de restitution de 30 minutes est proposé, pas imposé.`,
    },
    {
      q: "Allez-vous me relancer ?",
      a: "Non. Vous recevez le rapport, et un appel seulement si vous le demandez. Si vous ne répondez pas, je n'insiste pas.",
    },
  ],
  form: {
    title: "Demander mon audit",
    subtitle: `Rapport écrit sous ${AUDIT_DELAY} · gratuit · sans contrepartie`,
  },
  closing: {
    title: "Il n'y a rien à perdre à essayer",
    bullets: ["Gratuit", `Rapport écrit sous ${AUDIT_DELAY}`, "Aucune relance"],
  },
};

// ── Parcours 2 : aucune campagne à ce jour ─────────────────────────────────
// Public visé : artisan ou PME locale qui n'a jamais fait de publicité. La
// promesse ne peut pas être « où part votre budget » (il n'y en a pas) : c'est
// « est-ce qu'il y a de la demande, combien elle coûte, et faut-il y aller ».
// La conclusion « n'y allez pas » est annoncée d'entrée : c'est ce qui rend
// l'étude crédible pour quelqu'un qui se méfie du démarchage publicitaire.
const SANS_CAMPAGNE: AuditTrackContent = {
  track: "sans-campagne",
  href: "/audit/sans-campagne",
  switchTo: {
    href: "/audit",
    question: "Vous avez déjà des campagnes Google Ads en cours ?",
    cta: "L'audit de compte",
  },
  meta: {
    title: "Google Ads sans campagne : l'étude avant de se lancer",
    description:
      "Pas encore de publicité Google ? Je regarde votre site et votre marché : ce que vos clients tapent, le coût d'un clic dans votre zone, qui est déjà en face, et le budget qu'il faudrait. Étude écrite sous 48 h ouvrées, gratuite.",
  },
  eyebrow: "Audit gratuit · aucune campagne à ce jour",
  h1: "Pas encore de campagne ? Je regarde votre site et votre marché.",
  lede: "Vous n'avez jamais fait de publicité sur Google et vous ne savez pas si cela vaut le coup. Je pars de votre site et de votre zone d'intervention : ce que vos clients tapent réellement, combien de fois par mois, ce que coûte un clic chez vous, et qui paie déjà pour être devant vous. Vous recevez une étude écrite — y compris si sa conclusion est « n'y allez pas ».",
  stats: [
    { k: "Prix", v: "Gratuit" },
    { k: "Délai", v: AUDIT_DELAY },
    { k: "Format", v: "Étude écrite" },
    { k: "Compte Ads", v: "Pas nécessaire" },
  ],
  includesTitle: "Ce que contient l'étude",
  includes: [
    {
      t: "La demande réelle dans votre zone",
      d: "Les requêtes tapées par vos clients — votre métier, votre ville, les urgences, les demandes de devis — et le nombre de recherches par mois sur chacune. C'est le seul chiffre qui dit s'il y a un marché à capter.",
    },
    {
      t: "Ce que coûte un clic chez vous",
      d: "Les fourchettes de coût au clic constatées sur ces requêtes dans votre zone. Un dépannage d'urgence et une pose de fenêtres ne se paient pas le même prix, et l'écart change tout au budget.",
    },
    {
      t: "Qui est déjà en face",
      d: "Les annonceurs présents sur vos requêtes : concurrents locaux, plateformes de mise en relation, réseaux nationaux. Avec ce qu'ils promettent dans leurs annonces, puisque c'est à ça que vous serez comparé.",
    },
    {
      t: "Ce que votre site fera perdre",
      d: "Je regarde votre page d'accueil comme le ferait quelqu'un qui vient de cliquer : est-ce qu'on trouve le téléphone, la zone couverte, un moyen de demander un devis en moins de dix secondes. Payer pour envoyer des visiteurs sur une page qui ne convertit pas est la façon la plus rapide de perdre un budget.",
    },
    {
      t: "L'ordre de grandeur du budget",
      d: "Ce qu'il faudrait engager par mois pour être présent sérieusement, d'après le coût au clic et le volume constatés — pas un tarif type. Si ce montant dépasse ce que votre activité peut absorber, c'est écrit noir sur blanc.",
    },
    {
      t: "Ce que je ferais en premier, dans l'ordre",
      d: "Trois actions, classées. Elles ne passent pas forcément par une campagne : il arrive que la première chose à faire soit votre fiche Google, ou le formulaire de votre site.",
    },
    {
      t: `Une étude écrite, sous ${AUDIT_DELAY}`,
      d: "Elle est à vous, que l'on travaille ensemble ensuite ou non. Vous pouvez la donner à n'importe quel autre prestataire.",
    },
  ],
  wontTitle: "Ce que cette étude ne fera pas",
  wont: [
    "Vous promettre un nombre d'appels ou de devis. Les volumes de recherche sont des estimations Google, pas des clients : personne ne peut les convertir en chiffre d'affaires à l'avance.",
    "Lancer quoi que ce soit. Rien n'est créé, aucun compte n'est ouvert, aucun budget n'est engagé tant que vous ne le demandez pas.",
    "Refaire votre site. Je signale ce qui freine la conversion et ce que cela vous coûterait ; l'intervention est un autre sujet.",
    "Analyser Meta, TikTok, votre référencement naturel ou votre fiche Google en détail : je ne fais que Google Ads.",
    `Vous conseiller de vous lancer à tout prix. En dessous de ${MEDIA_FLOOR.local} de budget publicitaire mensuel, je vous dirai d'attendre plutôt que de dépenser à l'aveugle.`,
  ],
  faq: [
    {
      q: "Je n'ai aucun compte Google Ads. C'est bloquant ?",
      a: "Non, c'est justement le cas prévu par cette page. Je pars de votre site et de votre zone d'intervention. Aucun accès, aucun identifiant, aucune carte bancaire ne vous sont demandés.",
    },
    {
      q: "Et si je n'ai pas de site du tout ?",
      a: "Dites-le dans le champ « votre situation » avec le nom de votre entreprise et votre ville : je pars alors de votre fiche Google et de vos concurrents. L'étude est un peu moins précise sur la partie conversion, le reste ne change pas. Sachez toutefois qu'envoyer du trafic payant sans page où atterrir ne fonctionne pas — ce serait la première chose à régler.",
    },
    {
      q: "C'est vraiment gratuit ? Où est le piège ?",
      a: "Il n'y en a pas, mais il y a un intérêt : c'est ma façon de vous montrer comment je travaille avant que vous ne payiez quoi que ce soit. Si l'étude vous suffit et que vous vous lancez seul, ou avec quelqu'un d'autre, vous ne me devez rien.",
    },
    {
      q: "Vous allez me dire d'y aller de toute façon, non ?",
      a: "Pas si le marché ne le justifie pas. Il arrive que le volume de recherche soit trop faible dans une zone, ou que le coût au clic soit tel qu'un budget réaliste n'achèterait que quelques clics par jour. Dans ce cas la conclusion écrite est « n'y allez pas », et je préfère la donner avant que vous ne dépensiez.",
    },
    {
      q: "Combien de temps ça prend, de mon côté ?",
      a: `Le formulaire ci-contre — le site et votre email suffisent pour commencer — puis rien. Vous recevez l'étude sous ${AUDIT_DELAY}.`,
    },
    {
      q: "Allez-vous me relancer ?",
      a: "Non. Vous recevez l'étude, et un appel seulement si vous le demandez. Si vous ne répondez pas, je n'insiste pas.",
    },
  ],
  form: {
    title: "Demander mon étude",
    subtitle: `Étude écrite sous ${AUDIT_DELAY} · gratuite · aucun compte Google Ads requis`,
  },
  closing: {
    title: "Savoir avant de dépenser",
    bullets: ["Gratuit", `Étude écrite sous ${AUDIT_DELAY}`, "Aucune relance"],
  },
};

export const AUDIT_TRACKS: Record<AuditTrack, AuditTrackContent> = {
  compte: COMPTE,
  "sans-campagne": SANS_CAMPAGNE,
};

// ═══════════════════════════════════════════
// Uplyo — Contenu des deux parcours d'audit
// ═══════════════════════════════════════════
//
// POURQUOI DEUX PARCOURS
// La page /audit ne s'adressait qu'aux annonceurs déjà actifs (à l'époque :
// « Je regarde VOTRE COMPTE », promesse retirée depuis, voir Parcours 1). Or la prospection en cours
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

import { MEDIA_FLOOR, TERMS } from "@/lib/offers";

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

const AUDIT_DELAY = TERMS.auditDelay;

// ── Parcours 1 : campagnes déjà en cours ───────────────────────────────────
// Réécrit le 23/09/2026 : l'audit promettait de « regarder votre compte »
// (rapport de termes de recherche, captures, structure) alors qu'aucun accès
// au compte n'est demandé ni obtenu avant de travailler ensemble. L'audit
// porte désormais sur ce qui se constate SANS accès : les annonces telles
// que Google les diffuse (Centre de transparence des annonces), les requêtes
// sur lesquelles elles sortent ou non, la concurrence, la page d'arrivée et
// les balises de mesure posées sur le site. Ce qui ne se voit que dans le
// compte est listé comme « à vérifier », jamais présenté comme constaté.
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
      "Vos campagnes vues de l'extérieur, comme vos clients les voient : annonces, requêtes, concurrents, page d'arrivée et suivi. Sans accès à votre compte, sous 48 h.",
  },
  eyebrow: "Audit gratuit, campagnes en cours",
  h1: "Vos campagnes vues de l'extérieur, comme vos clients les voient.",
  lede: "Tout ce qu'un client voit de votre publicité se vérifie sans entrer dans votre compte : les annonces que Google diffuse en votre nom, les recherches sur lesquelles vous apparaissez (ou pas), ce que promettent vos concurrents à côté, la page où vous envoyez les visiteurs et la façon dont le suivi y est posé. L'audit rassemble ces constats, captures à l'appui, et liste à part ce qui ne se vérifie que dans le compte.",
  stats: [
    { k: "Prix", v: "Gratuit" },
    { k: "Délai", v: AUDIT_DELAY },
    { k: "Format", v: "Rapport écrit" },
    { k: "Accès au compte", v: "Aucun" },
  ],
  includesTitle: "Ce que contient le rapport",
  includes: [
    {
      t: "Vos annonces, telles que Google les diffuse",
      d: "Relevées dans le Centre de transparence des annonces de Google, qui rend publiques les annonces de chaque annonceur : ce qu'elles disent, ce qu'elles promettent, et ce qu'elles oublient de dire.",
    },
    {
      t: "Les recherches où vous êtes absent",
      d: "Les requêtes que tapent vos clients dans votre zone, leur volume et leur coût au clic, et celles sur lesquelles vos concurrents apparaissent alors que vous non.",
    },
    {
      t: "Qui est en face de vous",
      d: "Les annonceurs présents sur vos requêtes et leurs arguments. Votre annonce est lue à côté des leurs : c'est à eux qu'on vous compare.",
    },
    {
      t: "La page où vous envoyez les visiteurs",
      d: "Regardée comme par quelqu'un qui vient de cliquer : téléphone visible, zone couverte, demande de devis en moins de dix secondes, vitesse de chargement mesurée sur mobile.",
    },
    {
      t: "Le suivi, vu depuis votre site",
      d: "Les balises Google posées sur la page (Google Ads, GA4, Tag Manager, consentement) et ce qu'elles permettent de mesurer. Ce qui remonte réellement dans votre compte ne se voit pas d'ici : c'est listé comme point à vérifier.",
    },
    {
      t: "Trois actions à faire en premier",
      d: "Classées par effet attendu, avec le détail pour les appliquer vous-même si vous le souhaitez.",
    },
    {
      t: `Un rapport écrit, sous ${AUDIT_DELAY}`,
      d: "Chaque constat est accompagné de sa capture ; ce qui demande l'accès au compte est séparé et posé comme une question, jamais comme un fait. Le rapport est à vous, que l'on travaille ensemble ensuite ou non.",
    },
  ],
  wontTitle: "Ce que cet audit ne fera pas",
  wont: [
    "Entrer dans votre compte. Aucun accès, aucun identifiant ne vous est demandé : vos coûts réels, vos termes de recherche et vos conversions enregistrées restent chez vous. Ils se regardent au démarrage, si l'on travaille ensemble.",
    "Prédire votre coût par demande ou votre chiffre d'affaires : cela dépend de la concurrence, de la saison et de votre taux de transformation, que personne ne connaît à l'avance.",
    "Corriger vos campagnes. L'audit constate et priorise ; les modifications sont du travail facturé, ou à faire vous-même avec le rapport.",
    "Refaire votre site. Je signale ce qui freine la conversion, sans intervenir dessus.",
    "Analyser Meta, TikTok, Amazon ou votre référencement naturel : je ne fais que Google Ads.",
  ],
  faq: [
    {
      q: "C'est vraiment gratuit ? Où est le piège ?",
      a: "Il n'y en a pas, mais il y a un intérêt : c'est ma façon de vous montrer comment je travaille avant que vous ne payiez quoi que ce soit. Si le rapport vous suffit et que vous appliquez les corrections vous-même, tant mieux — vous ne me devez rien.",
    },
    {
      q: "Faut-il me donner accès au compte ?",
      a: "Non. L'audit ne porte que sur ce qui est visible de l'extérieur, comme le voient vos clients et vos concurrents. L'accès au compte n'intervient que si l'on travaille ensemble : c'est alors la première chose que je vérifie, notamment les points que le rapport aura laissés en question.",
    },
    {
      q: "Qu'est-ce que l'audit ne peut pas voir, du coup ?",
      a: "Ce qui n'existe que dans le compte : ce que vous payez réellement par clic, les recherches exactes qui ont déclenché vos annonces, et les conversions enregistrées. Le rapport le dit clairement et transforme ces angles morts en questions précises, plutôt que de les deviner.",
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
    subtitle: `Rapport écrit sous ${AUDIT_DELAY} · gratuit · sans accès à votre compte`,
  },
  closing: {
    title: "Il n'y a rien à perdre à essayer",
    bullets: ["Gratuit", `Rapport écrit sous ${AUDIT_DELAY}`, "Aucun accès demandé"],
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
    title: "Google Ads : l'étude avant de se lancer",
    description:
      "Pas encore de publicité ? J'étudie votre marché : ce que vos clients tapent, le coût d'un clic chez vous, et le budget qu'il faudrait.",
  },
  eyebrow: "Audit gratuit, aucune campagne à ce jour",
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

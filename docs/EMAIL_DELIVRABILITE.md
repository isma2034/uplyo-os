# Délivrabilité email — uplyo.fr

> **État au 4 septembre 2026 : aucun enregistrement DMARC n'existe sur le domaine.**
> Tant qu'il manque, une partie de la prospection sortante partira en spam.
> Les exigences publiées par les grands fournisseurs (Gmail et Yahoo depuis
> février 2024, Outlook.com depuis mai 2025) imposent formellement DMARC aux
> expéditeurs de masse (≥ 5 000 messages/jour) ; en dessous de ce seuil, SPF ou
> DKIM suffit à la lettre du règlement, mais l'absence de DMARC reste un signal
> négatif de filtrage pour de l'email froid non sollicité — c'est-à-dire
> exactement le cas de la prospection en cours.
>
> **L'action ci-dessous est à faire par Ismael dans l'espace client OVH.**
> Elle ne peut pas être faite depuis ce dépôt : la zone DNS n'y est pas versionnée.

---

## 1. Ce qui existe aujourd'hui (relevé, pas supposé)

Vérifié le 4 septembre 2026 en interrogeant directement les serveurs
faisant autorité (`ns200.anycast.me`, `dns200.anycast.me`) :

| Enregistrement | Valeur constatée | Verdict |
|---|---|---|
| `TXT uplyo.fr` | `v=spf1 include:mx.ovh.com ~all` | SPF présent, couvre les envois depuis les serveurs OVH |
| `TXT uplyo.fr` | `1\|www.uplyo.fr` | jeton de vérification OVH, sans effet sur la messagerie |
| `MX uplyo.fr` | `mx0/mx1/mx2/mx3.mail.ovh.net` | boîte aux lettres chez OVH |
| `TXT resend._domainkey.uplyo.fr` | `p=MIGfMA0GCSqGSIb3…` (clé RSA 1024) | DKIM Resend présent et aligné sur `uplyo.fr` |
| `TXT send.uplyo.fr` | `v=spf1 include:amazonses.com ~all` | SPF du chemin de retour Resend |
| `MX send.uplyo.fr` | `feedback-smtp.eu-west-1.amazonses.com` | chemin de retour Resend |
| `TXT _dmarc.uplyo.fr` | **vide** | ❌ **manquant** |
| `TXT <sélecteur>._domainkey.uplyo.fr` pour OVH | **rien trouvé** (`ovhcloud`, `mail`, `selector1`, `selector2`, `default`, `dkim`, `smtp`, `k1`, `s1`, `s2`) | ⚠️ DKIM OVH probablement non activé |

Commande de contrôle utilisée :

```bash
dig +short TXT _dmarc.uplyo.fr @dns200.anycast.me   # → vide
dig +short TXT uplyo.fr        @dns200.anycast.me
dig +short TXT resend._domainkey.uplyo.fr
```

### Conséquence pour les emails envoyés par le site

Les formulaires `/audit` et `/contact` envoient via Resend, avec
`from: Uplyo <noreply@uplyo.fr>` (voir `src/app/api/audit-check/route.ts` et
`src/app/api/contact/route.ts`). Ces messages **passeront DMARC sans aucune
modification supplémentaire** :

- DKIM est signé avec `d=uplyo.fr` (clé `resend._domainkey`) → alignement strict OK ;
- SPF est évalué sur le domaine d'enveloppe `send.uplyo.fr`, sous-domaine de
  `uplyo.fr` → alignement relâché OK.

**Ne pas ajouter `include:amazonses.com` au SPF de `uplyo.fr`** : c'est inutile
(l'enveloppe n'est pas `uplyo.fr`) et cela consomme une des 10 résolutions DNS
autorisées par SPF.

---

## 2. L'enregistrement à créer chez OVH

### Valeur exacte, phase 1 (observation)

```
Type      : TXT
Sous-domaine / Nom : _dmarc
TTL       : par défaut (3600)
Valeur    : v=DMARC1; p=none; rua=mailto:contact@uplyo.fr; fo=1; adkim=r; aspf=r; pct=100
```

Le nom complet de l'enregistrement doit être `_dmarc.uplyo.fr.` — dans le
formulaire OVH, on saisit **uniquement** `_dmarc` dans le champ sous-domaine,
le domaine est ajouté automatiquement. Saisir `_dmarc.uplyo.fr` créerait
`_dmarc.uplyo.fr.uplyo.fr`, qui ne sert à rien (erreur la plus fréquente).

Lecture de la valeur, tag par tag :

| Tag | Effet |
|---|---|
| `v=DMARC1` | obligatoire, en premier |
| `p=none` | on n'impose rien pour l'instant : on **observe** avant de durcir |
| `rua=mailto:contact@uplyo.fr` | destination des rapports agrégés quotidiens (boîte OVH existante) |
| `fo=1` | rapport d'échec dès que SPF **ou** DKIM échoue, pas seulement les deux |
| `adkim=r` / `aspf=r` | alignement relâché : un sous-domaine (`send.uplyo.fr`) reste aligné |
| `pct=100` | la politique s'applique à 100 % des messages |

`p=none` **ne bloque rien** : c'est la seule valeur sûre pour un premier
déploiement. Elle suffit déjà à satisfaire l'exigence « avoir un DMARC » de
Gmail / Yahoo / Microsoft pour les envois en petit volume.

### Où le créer, pas à pas

1. Se connecter sur <https://www.ovh.com/manager/> avec le compte OVH d'Ismael.
2. Menu de gauche : **Web Cloud** → **Noms de domaine** → **uplyo.fr**.
3. Onglet **Zone DNS**.
4. Bouton **Ajouter une entrée**.
5. Choisir le type :
   - si la liste propose **DMARC** : utiliser ce formulaire guidé, remplir
     `Politique = none`, `Adresse de réception des rapports agrégés = contact@uplyo.fr`,
     `Options de rapport = 1`, laisser le reste par défaut ; OVH compose la
     chaîne lui-même. Vérifier ensuite qu'elle correspond bien à la valeur
     ci-dessus ;
   - sinon : choisir **TXT** et saisir manuellement sous-domaine `_dmarc` et la
     valeur complète entre guillemets si l'interface les demande.
6. Valider. La propagation prend de quelques minutes à 4 h (TTL).

⚠️ **Ne pas toucher aux entrées existantes** : le TXT racine SPF, le TXT
`resend._domainkey`, les MX `mail.ovh.net` et les entrées `send` (Resend) sont
tous nécessaires. Le CNAME `www` → `cname.vercel-dns.com` et l'A racine
`216.198.79.1` servent au site, pas à la messagerie.

---

## 3. Vérifier que c'est en place

Après 15 min, puis à nouveau le lendemain :

```bash
# 1. L'enregistrement existe et est bien formé
dig +short TXT _dmarc.uplyo.fr
# Attendu : "v=DMARC1; p=none; rua=mailto:contact@uplyo.fr; fo=1; adkim=r; aspf=r; pct=100"

# 2. Depuis les serveurs OVH faisant autorité (court-circuite tout cache)
dig +short TXT _dmarc.uplyo.fr @dns200.anycast.me

# 3. Rien n'a été cassé au passage
dig +short TXT uplyo.fr                     # SPF toujours là
dig +short TXT resend._domainkey.uplyo.fr   # DKIM Resend toujours là
dig +short MX  uplyo.fr                     # MX OVH toujours là
```

Vérifications complémentaires, dans l'ordre d'utilité :

1. **Test d'envoi réel** — envoyer un message depuis la boîte
   `contact@uplyo.fr` (celle qui servira à la prospection) vers l'adresse
   jetable fournie par <https://www.mail-tester.com>. Viser 9/10 minimum et
   lire le détail SPF / DKIM / DMARC.
2. **Test du formulaire du site** — soumettre `/audit` en production, puis
   ouvrir l'email reçu sur `contact@uplyo.fr` et afficher l'original
   (Gmail : « Afficher l'original »). On doit lire :
   `spf=pass`, `dkim=pass header.i=@uplyo.fr`, `dmarc=pass`.
3. **Lecteur de rapports** — les `rua` arrivent en XML compressé, illisibles à
   l'œil. Déposer les pièces jointes sur <https://dmarcian.com/dmarc-xml/> ou
   <https://www.dmarcanalyzer.com> (versions gratuites suffisantes au volume
   actuel).

---

## 4. Ce qui reste à décider — points bloquants côté Ismael

Ces trois points touchent à des outils ou à des comptes auxquels ce dépôt n'a
pas accès. Ils ne peuvent pas être tranchés ici.

### 4.1 Activer DKIM sur la boîte OVH (à faire avant de durcir la politique)

Aucun sélecteur DKIM OVH n'a été trouvé sur le domaine. Si la prospection part
depuis le webmail OVH ou depuis un client de messagerie configuré sur
`contact@uplyo.fr`, les messages passeront DMARC **par SPF seul** : suffisant
avec `p=none`, fragile ensuite (une seule redirection de liste casse SPF, et
sans DKIM il ne reste rien).

Chez OVH : **Web Cloud → Emails → uplyo.fr → onglet Diagnostic / DKIM** (le
libellé varie selon l'offre MX Plan / Email Pro / Zimbra) → activer DKIM. OVH
crée alors lui-même l'entrée `<sélecteur>._domainkey` dans la zone. À
re-vérifier ensuite avec `dig +short TXT <sélecteur>._domainkey.uplyo.fr`.

### 4.2 Quel outil enverra la prospection ?

**Décision non prise, et elle conditionne le reste.** Si les emails de
prospection partent d'un outil tiers (Lemlist, Instantly, Brevo, Mailjet,
Smartlead, ou Resend lui-même), alors, pour ce domaine ou le sous-domaine
d'envoi utilisé :

- il faut publier le DKIM de cet outil ;
- il faut ajouter son `include:` au SPF **du domaine d'enveloppe** ;
- et il faut le faire **avant** de passer à `p=quarantine`, sinon toute la
  prospection sera mise en quarantaine du jour au lendemain.

Recommandation : envoyer la prospection depuis un **sous-domaine dédié**
(ex. `contact@mail.uplyo.fr`), pour que la réputation d'une campagne froide
n'entame jamais celle du domaine principal — celui qui porte les emails
transactionnels du site et la boîte professionnelle.

### 4.3 Durcissement de la politique — calendrier

| Quand | Valeur `p=` | Condition pour passer à l'étape suivante |
|---|---|---|
| Immédiat | `p=none` | — |
| Après 2 à 4 semaines de rapports | `p=quarantine` | 100 % des sources légitimes identifiées dans les rapports `rua`, et toutes en `pass` |
| Après 1 à 2 mois en quarantine sans incident | `p=reject` | aucun message légitime tombé en quarantaine |

Ne pas sauter d'étape. Passer directement à `p=reject` sur un domaine dont on
n'a pas encore lu les rapports revient à couper l'email sans filet.

---

## 5. Rappel : ce n'est qu'un tiers du sujet

DMARC empêche l'usurpation et rend l'expéditeur authentifiable. Il **ne rend
pas** une campagne froide bienvenue. Sur le volume de prospection prévu,
comptent au moins autant :

- une montée en volume progressive sur une boîte neuve (quelques dizaines de
  messages par jour au départ, pas plusieurs centaines) ;
- un lien de désinscription honoré immédiatement, y compris en B2B ;
- la conformité RGPD / e-Privacy de la prospection B2B — la base légale est
  l'intérêt légitime, l'objet du message doit être en rapport avec la fonction
  professionnelle du destinataire, et l'information sur ses droits doit être
  donnée dès le premier message (voir `/confidentialite` sur le site) ;
- un contenu qui ne ressemble pas à un envoi de masse : pas de pièce jointe,
  peu de liens, pas d'image de traqueur si elle n'apporte rien.

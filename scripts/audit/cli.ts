/**
 * Second étage d'audit — outil en ligne de commande, déclenché par Ismael.
 *
 * ── Pourquoi une commande et pas une route protégée par jeton
 * Une route, même derrière un jeton, reste une surface exposée sur un site en
 * production, et resterait soumise à la durée maximale d'une fonction Vercel
 * alors qu'un run PageSpeed prend couramment 30 à 40 s sur un site lent. Une
 * commande locale n'a ni jeton à faire fuiter, ni quota public à protéger, ni
 * limite de temps ; la clé PageSpeed reste sur le poste, elle ne monte jamais
 * en production. C'est aussi ce qui protège la promesse « 48 h ouvrées » : le
 * prospect n'attend rien en direct, le travail se fait hors ligne.
 *
 * ── Usage
 *   npm run audit -- https://www.exemple.fr
 *   npm run audit -- exemple.fr --out rapport.md
 *   npm run audit -- exemple.fr --json          (données brutes)
 *   npm run audit -- exemple.fr --pages 5       (pages internes en plus)
 *   npm run audit -- exemple.fr --no-pagespeed  (aucun appel à l'API Google)
 *
 * ── La clé PageSpeed
 * Elle est lue dans PAGESPEED_API_KEY et NULLE PART ailleurs : jamais dans le
 * dépôt, jamais dans un rapport. Le script npm charge le fichier
 * ~/.claude/skills/web-optimization/.env s'il existe, via --env-file-if-exists.
 * Sans clé, la vitesse est marquée indisponible avec son motif — jamais
 * estimée.
 */

import { writeFileSync } from "node:fs";
import { auditSite, DEFAULT_OPTIONS, type RunOptions } from "./run.ts";
import { renderReport } from "./report.ts";
import { summarize } from "./findings.ts";

type Args = {
  target: string | null;
  out: string | null;
  json: boolean;
  options: RunOptions;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    target: null,
    out: null,
    json: false,
    options: { ...DEFAULT_OPTIONS },
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") args.json = true;
    else if (a === "--no-pagespeed") args.options.pagespeed = false;
    else if (a === "--out") args.out = argv[++i] ?? null;
    else if (a === "--pages") {
      const n = Number(argv[++i]);
      // Plafond dur : au-delà, on repart vers le crawl massif que ce projet
      // s'interdit depuis l'incident du site mis hors ligne.
      args.options.maxExtraPages = Number.isFinite(n) ? Math.max(0, Math.min(6, n)) : 3;
    } else if (a.indexOf("--") === 0) {
      throw new Error(`option inconnue : ${a}`);
    } else if (!args.target) args.target = a;
  }
  return args;
}

function usage(): string {
  return [
    "Usage : npm run audit -- <domaine> [options]",
    "",
    "  --out <fichier>   écrit le rapport Markdown dans un fichier",
    "  --json            affiche les données brutes au lieu du rapport",
    "  --pages <n>       pages internes lues en plus de l'accueil (0 à 6, défaut 3)",
    "  --no-pagespeed    n'appelle pas l'API Google",
    "",
    "Exemple : npm run audit -- https://www.mr-debarrasse.fr --out /tmp/rapport.md",
  ].join("\n");
}

async function main(): Promise<number> {
  let args: Args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    console.error(usage());
    return 2;
  }

  if (!args.target) {
    console.error(usage());
    return 2;
  }

  if (args.options.pagespeed && !process.env.PAGESPEED_API_KEY) {
    // Signalé, pas bloquant : l'audit reste utile sans la vitesse, et la
    // mesure absente sera listée comme indisponible avec ce motif.
    console.error(
      "[!] PAGESPEED_API_KEY absente de l'environnement — la vitesse sera marquée indisponible.\n" +
        "    Attendu dans ~/.claude/skills/web-optimization/.env (chargé par `npm run audit`).\n"
    );
  }

  console.error(`Relevé en cours sur ${args.target}…`);
  const audit = await auditSite(args.target, args.options);

  if (args.json) {
    process.stdout.write(JSON.stringify(audit, null, 2) + "\n");
    return audit.ok ? 0 : 1;
  }

  const md = renderReport(audit);
  if (args.out) {
    writeFileSync(args.out, md, "utf8");
    console.error(`Rapport écrit dans ${args.out}`);
  } else {
    process.stdout.write(md);
  }

  const s = summarize(audit.findings);
  console.error(
    `\n${audit.pagesTested} page(s) lue(s), ${audit.requestsUsed} requête(s), ` +
      `${(audit.elapsedMs / 1000).toFixed(1)} s — ${s.problemes} constat(s), ` +
      `${s.bloquants} bloquant(s), ${s.corps} au corps du rapport, ` +
      `${s.indisponibles} mesure(s) indisponible(s).`
  );
  return audit.ok ? 0 : 1;
}

main().then(
  (code) => {
    process.exitCode = code;
  },
  (e) => {
    console.error("[audit] échec inattendu :", e);
    process.exitCode = 1;
  }
);

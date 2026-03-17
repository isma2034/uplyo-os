import { Metadata } from "next";
import Reveal from "@/components/agency/Reveal";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Uplyo",
};

export default function ConfidentialitePage() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-[800px] mx-auto">
        <Reveal>
          <h1 className="text-3xl font-semibold tracking-tight text-ink mb-8">Politique de confidentialité</h1>
          <div className="prose prose-sm text-ink-2 leading-relaxed font-light space-y-6">
            <p>Dernière mise à jour : mars 2026</p>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">1. Responsable du traitement</h2>
              <p>Uplyo, dont le siège est situé en Espagne. Contact : contact@uplyo.fr</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">2. Données collectées</h2>
              <p>Nous collectons les données que vous nous fournissez volontairement via le formulaire de contact : nom, prénom, email, site web, budget publicitaire, secteur d&apos;activité et votre message. Nous collectons également des données de navigation anonymisées via Google Analytics 4.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">3. Finalités du traitement</h2>
              <p>Vos données sont utilisées pour répondre à vos demandes de contact, établir des devis, assurer le suivi de la relation commerciale et améliorer nos services. Les données de navigation sont utilisées à des fins statistiques.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">4. Base légale</h2>
              <p>Le traitement est fondé sur votre consentement (formulaire de contact) et sur notre intérêt légitime (amélioration des services, statistiques).</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">5. Durée de conservation</h2>
              <p>Les données de contact sont conservées 3 ans à compter du dernier échange. Les données de navigation sont conservées 14 mois.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">6. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez des droits d&apos;accès, de rectification, de suppression, de limitation, de portabilité et d&apos;opposition au traitement de vos données. Vous pouvez exercer ces droits en nous contactant à contact@uplyo.fr.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">7. Sous-traitants</h2>
              <p>Vercel (hébergement), Google (Analytics), Anthropic (IA pour Uplyo OS). Aucune donnée personnelle n&apos;est vendue à des tiers.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">8. Transferts internationaux</h2>
              <p>Certaines données peuvent être transférées vers les États-Unis (Vercel, Google) dans le cadre de clauses contractuelles types approuvées par la Commission européenne.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

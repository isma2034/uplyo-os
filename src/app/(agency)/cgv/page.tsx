import { Metadata } from "next";
import Reveal from "@/components/agency/Reveal";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Uplyo",
};

export default function CGVPage() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-[800px] mx-auto">
        <Reveal>
          <h1 className="text-3xl font-semibold tracking-tight text-ink mb-8">Conditions Générales de Vente</h1>
          <div className="prose prose-sm text-ink-2 leading-relaxed font-light space-y-6">
            <p>Dernière mise à jour : mars 2026</p>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">1. Objet</h2>
              <p>Les présentes CGV régissent les prestations de services proposées par Uplyo : gestion de campagnes Google Ads (agence) et accès à la plateforme Uplyo OS (SaaS).</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">2. Prestations agence</h2>
              <p><strong>Pack Lancement :</strong> prestation one-shot facturée à la commande. Livraison sous 5 jours ouvrés.<br />
              <strong>Pilotage mensuel :</strong> engagement minimum de 6 mois, puis résiliable avec un préavis de 30 jours. Facturation mensuelle en début de mois.<br />
              <strong>Pack E-commerce :</strong> tarif sur devis, adapté au volume et au catalogue. Setup inclus dans le premier mois.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">3. Uplyo OS (SaaS)</h2>
              <p><strong>Plan Solo :</strong> 99€/mois HT. Abonnement mensuel, résiliable à tout moment.<br />
              <strong>Plan Team :</strong> 299€–599€/mois HT selon le nombre d&apos;utilisateurs. Sur devis.<br />
              Essai gratuit de 14 jours sans carte bancaire. En fin de période d&apos;essai, l&apos;abonnement est activé sur validation du paiement.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">4. Tarifs et paiement</h2>
              <p>Les tarifs sont exprimés en euros HT. TVA applicable selon la localisation du client (reverse charge pour clients UE avec numéro de TVA intracommunautaire). Paiement par virement bancaire ou carte bancaire (Stripe). En cas de retard de paiement, des pénalités de retard de 3× le taux d&apos;intérêt légal seront appliquées.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">5. Budget publicitaire</h2>
              <p>Le budget publicitaire Google Ads est réglé directement par le client auprès de Google. Uplyo ne gère pas et ne facture pas le budget publicitaire. Uplyo facture uniquement ses prestations de conseil et de gestion.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">6. Obligations du client</h2>
              <p>Le client s&apos;engage à fournir un accès administrateur à son compte Google Ads, à répondre aux demandes d&apos;information dans un délai raisonnable et à maintenir son budget publicitaire actif pendant la durée de la prestation.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">7. Résiliation</h2>
              <p>Pilotage mensuel : résiliable avec 30 jours de préavis après la période d&apos;engagement de 6 mois. Uplyo OS : résiliable à tout moment depuis l&apos;interface de facturation.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">8. Responsabilité</h2>
              <p>Uplyo s&apos;engage à mettre en œuvre les meilleurs efforts pour optimiser les campagnes du client. Uplyo ne garantit pas de résultats spécifiques (CPA, ROAS, conversions) compte tenu de la nature variable de la publicité en ligne.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">9. Droit applicable</h2>
              <p>Les présentes CGV sont régies par le droit espagnol. Tout litige sera soumis aux tribunaux compétents du siège social d&apos;Uplyo.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

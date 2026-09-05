import { Metadata } from "next";
import Reveal from "@/components/agency/Reveal";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description:
    "Conditions générales de vente d'Uplyo : prestations, tarifs, durée, résiliation, obligations de chaque partie et règlement des litiges.",
  alternates: { canonical: "/cgv" },
};

export default function CGVPage() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-[800px] mx-auto">
        <Reveal>
          <h1 className="text-3xl font-semibold tracking-tight text-ink mb-8">Conditions Générales de Vente</h1>
          <div className="prose prose-sm text-ink-2 leading-relaxed font-light space-y-6">
            <p>Dernière mise à jour : septembre 2026</p>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">1. Objet</h2>
              <p>Les présentes CGV régissent les prestations de services proposées par Uplyo : gestion de campagnes Google Ads et optimisation web.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">2. Prestations</h2>
              <p><strong>Le setup :</strong> prestation unique facturée à la commande. Livraison sous 5 jours ouvrés à compter de l&apos;appel de cadrage.<br />
              <strong>Le pilotage :</strong> prestation mensuelle, <strong>sans engagement de durée minimum</strong>. Facturation mensuelle en début de mois. Résiliable à tout moment par l&apos;une ou l&apos;autre des parties avec un préavis de 30 jours.<br />
              <strong>Module e-commerce :</strong> complément au pilotage, sur devis, adapté au volume et au catalogue. Ne se souscrit pas seul.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">3. Tarifs et paiement</h2>
              <p>Les tarifs sont exprimés en euros HT. TVA applicable selon la localisation du client (reverse charge pour clients UE avec numéro de TVA intracommunautaire). Paiement par virement bancaire. En cas de retard de paiement, des pénalités de retard de 3× le taux d&apos;intérêt légal seront appliquées.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">4. Budget publicitaire</h2>
              <p>Le budget publicitaire Google Ads est réglé directement par le client auprès de Google, sur son propre compte et avec son propre moyen de paiement. Uplyo ne gère pas, ne facture pas et ne perçoit aucune commission sur le budget publicitaire ; Uplyo facture uniquement ses prestations de conseil et de gestion.</p>
              <p>Un budget publicitaire minimum est requis pour que la prestation ait un sens : 500 € par mois pour une activité de services locale, 1 000 € par mois en e-commerce. En dessous de ces seuils, le volume de données est insuffisant pour piloter les campagnes et Uplyo se réserve le droit de ne pas engager la prestation.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">5. Propriété du compte et obligations du client</h2>
              <p>Le compte Google Ads est ouvert au nom du client, qui en demeure propriétaire pendant et après la prestation, y compris de l&apos;intégralité de son historique. Le client s&apos;engage à fournir un accès administrateur à ce compte, à répondre aux demandes d&apos;information dans un délai raisonnable et à maintenir son budget publicitaire actif pendant la durée de la prestation.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">6. Résiliation</h2>
              <p>Le pilotage ne comporte aucune durée d&apos;engagement minimum. Il est résiliable à tout moment par l&apos;une ou l&apos;autre des parties, par simple email, avec un préavis de 30 jours. Ce préavis a pour seul objet de permettre la remise en main propre du compte et la transmission des informations nécessaires à sa reprise. Les mois entamés restent dus ; aucune indemnité de rupture n&apos;est facturée.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">7. Responsabilité</h2>
              <p>Uplyo s&apos;engage à mettre en œuvre les meilleurs efforts pour optimiser les campagnes du client. Uplyo ne garantit pas de résultats spécifiques (CPA, ROAS, conversions) compte tenu de la nature variable de la publicité en ligne.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">8. Droit applicable</h2>
              <p>Les présentes CGV sont régies par le droit espagnol. Tout litige sera soumis aux tribunaux compétents du siège social d&apos;Uplyo.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

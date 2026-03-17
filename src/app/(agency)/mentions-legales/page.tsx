import { Metadata } from "next";
import Reveal from "@/components/agency/Reveal";

export const metadata: Metadata = {
  title: "Mentions légales — Uplyo",
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-[800px] mx-auto">
        <Reveal>
          <h1 className="text-3xl font-semibold tracking-tight text-ink mb-8">Mentions légales</h1>
          <div className="prose prose-sm text-ink-2 leading-relaxed font-light space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">Éditeur du site</h2>
              <p>Uplyo — Société en cours de constitution (SL Espagne)<br />
              Siège social : Espagne<br />
              Email : contact@uplyo.fr<br />
              Directeur de la publication : Fondateur Uplyo</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">Hébergement</h2>
              <p>Vercel Inc.<br />
              340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
              Site : vercel.com</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">Propriété intellectuelle</h2>
              <p>L&apos;ensemble du contenu du site uplyo.fr (textes, images, graphismes, logo, icônes, logiciels) est la propriété exclusive d&apos;Uplyo ou de ses partenaires. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, est interdite sans autorisation préalable écrite.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">Données personnelles</h2>
              <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à contact@uplyo.fr. Voir notre <a href="/confidentialite" className="text-eclat">politique de confidentialité</a>.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink mb-2">Cookies</h2>
              <p>Ce site utilise des cookies strictement nécessaires au fonctionnement du site et des cookies d&apos;analyse (Google Analytics 4) pour mesurer l&apos;audience. Vous pouvez paramétrer votre navigateur pour refuser les cookies.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

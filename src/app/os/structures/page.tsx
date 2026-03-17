"use client";

import { useState } from "react";
import { Copy, CheckCircle, ChevronRight } from "lucide-react";

const STRUCTURES = [
  { id: "t1", title: "Lead Gen B2B — Search", sector: "B2B", budget: "2K-10K€", campaigns: ["Brand", "Generic_Service1", "Generic_Service2", "Competitor", "DSA_Catch-all"], desc: "Structure classique B2B lead gen avec séparation brand/generic/competitor. Idéal pour SaaS, conseil, services." },
  { id: "t2", title: "E-commerce Shopping Standard", sector: "E-commerce", budget: "3K-20K€", campaigns: ["Shopping_Brand", "Shopping_Generic_HighMargin", "Shopping_Generic_LowMargin", "Shopping_Catch-all"], desc: "Segmentation Shopping par marge produit. Priorités de campagne pour contrôler le trafic." },
  { id: "t3", title: "E-commerce PMax + Shopping", sector: "E-commerce", budget: "5K-50K€", campaigns: ["PMax_TopProducts", "PMax_Categories", "Shopping_Brand", "Search_Brand", "Search_Generic_Top"], desc: "Hybride PMax + Shopping standard pour maximiser la couverture tout en gardant le contrôle brand." },
  { id: "t4", title: "Local Business — Multi-villes", sector: "Local", budget: "500€-3K€", campaigns: ["Search_Ville1_Services", "Search_Ville2_Services", "Search_Brand", "Display_Remarketing"], desc: "Structure pour artisan/commerce multi-zones. Une campagne par ville principale + brand." },
  { id: "t5", title: "SaaS — Funnel complet", sector: "B2B SaaS", budget: "5K-30K€", campaigns: ["Search_TOFU_Problem", "Search_MOFU_Solution", "Search_BOFU_Brand+Competitor", "Display_Remarketing_Visitors", "Display_Remarketing_Trial"], desc: "Mapping du funnel TOFU/MOFU/BOFU sur les campagnes. Remarketing segmenté par étape." },
  { id: "t6", title: "Immobilier — Programmes neufs", sector: "Immobilier", budget: "3K-15K€", campaigns: ["Search_Programme1_Ville", "Search_Programme2_Ville", "Search_Generic_Investissement", "Search_Brand", "Display_Remarketing"], desc: "Un ad group par programme immobilier. Ciblage géo précis par zone de chalandise." },
  { id: "t7", title: "E-commerce — Black Friday", sector: "E-commerce", budget: "10K-100K€", campaigns: ["Shopping_BF_TopProducts", "PMax_BF_Bundles", "Search_BF_Promos", "Display_BF_Remarketing", "Search_Brand_BF"], desc: "Structure temporaire Black Friday avec budgets boostés sur les top produits et bundles promo." },
  { id: "t8", title: "Médecin / Santé — Local", sector: "Santé", budget: "500€-2K€", campaigns: ["Search_Specialite_Ville", "Search_Brand", "Search_Urgence"], desc: "Structure minimaliste pour professions médicales. Focus sur la spécialité + géo locale." },
  { id: "t9", title: "Formation / Éducation", sector: "Éducation", budget: "2K-10K€", campaigns: ["Search_Formation_Nom", "Search_Generic_Domaine", "Search_Financement_CPF", "Display_Remarketing", "YouTube_Video"], desc: "Ciblage par nom de formation + domaine + financement. Video ads pour awareness." },
  { id: "t10", title: "Restaurant / Food delivery", sector: "Food", budget: "300€-1K€", campaigns: ["Search_Livraison_Ville", "Search_Restaurant_Cuisine", "Search_Brand", "Local_Campaign"], desc: "Structure simple avec focus livraison + type de cuisine. Local Campaign pour GMB." },
  { id: "t11", title: "Agency — Multi-clients MCC", sector: "Agence", budget: "Variable", campaigns: ["[Client]_Search_Brand", "[Client]_Search_Generic", "[Client]_Shopping", "[Client]_PMax", "[Client]_Remarketing"], desc: "Naming convention MCC pour agences gérant 10+ comptes. Standardisation cross-client." },
  { id: "t12", title: "App Mobile — Install + Engagement", sector: "App", budget: "5K-50K€", campaigns: ["UAC_Install_iOS", "UAC_Install_Android", "UAC_Engagement_Lapsed", "Search_Brand_App", "Display_Remarketing"], desc: "Universal App Campaigns segmentées par OS + campagnes d'engagement pour réactivation." },
  { id: "t13", title: "B2C Services — Devis", sector: "B2C", budget: "1K-5K€", campaigns: ["Search_Service_Ville", "Search_Generic_National", "Search_Brand", "Display_Remarketing", "Search_Urgence"], desc: "Pour services B2C (déménagement, plomberie, assurance). Focus sur les requêtes à intention forte." },
  { id: "t14", title: "Marketplace — Vendeurs + Acheteurs", sector: "Marketplace", budget: "5K-30K€", campaigns: ["Search_Acheteurs_Categorie", "Search_Vendeurs_Inscription", "Search_Brand", "PMax_Acheteurs", "Display_Remarketing_Vendeurs"], desc: "Double ciblage offre/demande. Campagnes séparées pour acquisition vendeurs et acheteurs." },
];

const SECTORS = ["Tous", ...Array.from(new Set(STRUCTURES.map((s) => s.sector)))];

export default function StructuresPage() {
  const [sector, setSector] = useState("Tous");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = sector === "Tous" ? STRUCTURES : STRUCTURES.filter((s) => s.sector === sector);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-semibold tracking-tight" style={{ color: "var(--t)" }}>
          <span className="text-eclat">##</span> Structures Google Ads
        </h1>
        <p className="text-[13px] mt-1 max-w-[700px] leading-relaxed" style={{ color: "var(--t2)" }}>
          14 templates de structure de compte validés par secteur. Copiez, adaptez, déployez.
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {SECTORS.map((s) => (
          <button
            key={s}
            onClick={() => setSector(s)}
            className="font-mono text-[10px] px-3 py-1.5 rounded transition-all"
            style={{
              background: sector === s ? "var(--eclat)" : "var(--bg3)",
              color: sector === s ? "#0e0f11" : "var(--t3)",
              border: `1px solid ${sector === s ? "var(--eclat)" : "var(--line2)"}`,
              fontWeight: sector === s ? 600 : 400,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Templates */}
      <div className="space-y-3">
        {filtered.map((tmpl) => (
          <div key={tmpl.id} className="card-os transition-all hover:border-[var(--line2)]">
            <button
              onClick={() => setExpanded(expanded === tmpl.id ? null : tmpl.id)}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg3)] transition-colors"
              style={{ border: "none", background: "transparent" }}
            >
              <div className="flex items-center gap-3 text-left">
                <span className="font-mono text-[10px] font-semibold text-eclat bg-eclat/10 border border-eclat/20 px-2 py-0.5 rounded shrink-0">{tmpl.id.replace("t", "#")}</span>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--t)" }}>{tmpl.title}</div>
                  <div className="flex gap-2 mt-0.5">
                    <span className="badge badge-purple">{tmpl.sector}</span>
                    <span className="badge badge-blue">{tmpl.budget}</span>
                    <span className="badge badge-green">{tmpl.campaigns.length} campagnes</span>
                  </div>
                </div>
              </div>
              <ChevronRight
                size={14}
                className="transition-transform shrink-0"
                style={{ color: "var(--t3)", transform: expanded === tmpl.id ? "rotate(90deg)" : "none" }}
              />
            </button>
            {expanded === tmpl.id && (
              <div className="px-5 pb-4" style={{ borderTop: "1px solid var(--line)" }}>
                <p className="text-[12px] leading-relaxed mt-3 mb-4" style={{ color: "var(--t2)" }}>{tmpl.desc}</p>
                <div className="font-mono text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--t3)" }}>
                  Structure des campagnes
                </div>
                <div className="space-y-1.5">
                  {tmpl.campaigns.map((camp, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-3 rounded text-[12px] font-mono" style={{ background: "var(--bg3)", border: "1px solid var(--line)", color: "var(--t)" }}>
                      <span className="text-eclat">├</span> {camp}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

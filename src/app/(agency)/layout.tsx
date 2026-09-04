import Navbar from "@/components/agency/Navbar";
import Analytics from "@/components/agency/Analytics";
import Footer from "@/components/agency/Footer";

// `overflow-x-clip` et non `overflow-x-hidden` : `hidden` transforme ce
// conteneur en zone de défilement, ce qui neutralise silencieusement TOUT
// `position: sticky` du site (le formulaire de /audit, les deux colonnes
// sticky de la home). Vérifié : sans le garde-fou, aucune page ne déborde
// horizontalement à 320, 375 ni 768 px — il ne masquait donc rien d'utile,
// il ne fait que rester en filet. `clip` coupe sans créer de scrollport.
export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--w)] text-ink overflow-x-clip">
      <Analytics />
      <Navbar />
      <div className="pt-[68px]">{children}</div>

      <Footer />
    </div>
  );
}

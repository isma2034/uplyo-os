import Navbar from "@/components/agency/Navbar";
import Analytics from "@/components/agency/Analytics";
import Footer from "@/components/agency/Footer";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--w)] text-ink overflow-x-hidden">
      <Analytics />
      <Navbar />
      <div className="pt-[68px]">{children}</div>

      <Footer />
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demande reçue",
  robots: { index: false, follow: false },
};

export default function MerciLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

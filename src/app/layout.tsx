import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "@/styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Uplyo — Google Ads Agency & Uplyo OS",
  description:
    "Agence Google Ads performance pour PME et e-commerce. Et Uplyo OS, le SaaS pour agences et freelances Google Ads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

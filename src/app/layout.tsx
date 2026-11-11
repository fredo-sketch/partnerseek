import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fredoka";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UtmCapture from "@/components/UtmCapture";
import { AnalyticsBody, AnalyticsHead } from "@/components/Analytics";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "PartnerSeek — Seek Your Partner and Catch the Peak!", template: "%s · PartnerSeek" },
  description:
    "PartnerSeek menghubungkan mahasiswa berdasarkan keahlian. Temukan partner untuk lomba, PKM, dan proyek dengan profil skill, portofolio, dan chat terintegrasi.",
  openGraph: {
    title: "PartnerSeek — Seek Your Partner and Catch the Peak!",
    description: "Platform pencarian partner mahasiswa berbasis keahlian.",
    type: "website",
    locale: "id_ID",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = { themeColor: "#002868" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="flex min-h-dvh flex-col">
        <AnalyticsBody />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <UtmCapture />
        <AnalyticsHead />
      </body>
    </html>
  );
}

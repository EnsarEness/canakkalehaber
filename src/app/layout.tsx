import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Çanakkale Haber | Güvenilir Yerel Haber Kaynağı",
  description:
    "Çanakkale'nin en güncel haberleri, yerel gelişmeler, kültür-sanat, spor ve ekonomi haberleri için Çanakkale Haber'i takip edin.",
  keywords: "Çanakkale, haber, yerel haber, gündem, kültür, spor",
  authors: [{ name: "Çanakkale Haber Portalı" }],
  openGraph: {
    title: "Çanakkale Haber",
    description: "Çanakkale'nin güvenilir haber kaynağı",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

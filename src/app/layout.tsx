import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { BrandsProvider } from "@/components/BrandsProvider";
import { BrandBar } from "@/components/BrandBar";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-bricolage" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Unbranded — AI reviews & local SEO",
  description: "Reply to every Google review in your brand voice and climb the local rankings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased">
        <BrandsProvider>
          <div className="flex min-h-screen">
            <Nav />
            <div className="flex min-w-0 flex-1 flex-col">
              <BrandBar />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </div>
        </BrandsProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";
import { BrandsProvider } from "@/components/BrandsProvider";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-bricolage" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Unbranded — Rank your business on Google & AI",
  description: "Get found on Google and recommended by ChatGPT, Claude & Gemini. AI audits your site, writes your blogs, and replies to your reviews.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased">
        <BrandsProvider>{children}</BrandsProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Anton, Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { IS_SPEC } from "@/lib/mode";
import { SpecBanner } from "@/components/SpecBanner";
import { Reveal } from "@/components/Reveal";
import { site } from "@/site.config";

// Self-hosted at build time by next/font. Phase 2 loads both directions' display faces;
// the loser is removed after Hunter picks.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s` },
  // SPEC: noindex on every route (the X-Robots-Tag header is set in next.config.ts too).
  robots: IS_SPEC ? { index: false, follow: false } : undefined,
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ef",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${inter.variable} ${fraunces.variable} ${anton.variable}`}>
      <body className="min-h-dvh antialiased">
        <SpecBanner />
        {children}
        <Reveal />
      </body>
    </html>
  );
}

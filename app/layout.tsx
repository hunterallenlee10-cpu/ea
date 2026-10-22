import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { IS_SPEC } from "@/lib/mode";
import { SpecBanner } from "@/components/SpecBanner";
import { Reveal } from "@/components/Reveal";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { Tracking } from "@/components/Tracking";
import { site } from "@/site.config";

// Self-hosted at build time by next/font.
// Body font: Inter (OFL, see app/fonts/Inter-OFL.txt), trimmed to the weights the site uses (400-700)
// and Latin-1 plus common punctuation: 24 KB instead of 48 KB. Not preloaded, so on slow phones it
// doesn't compete with the headline font and the hero photo; the size-matched fallback avoids layout shift.
const inter = localFont({
  src: "./fonts/inter-latin-400-700.woff2",
  weight: "400 700",
  variable: "--font-inter",
  display: "swap",
  preload: false,
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  // One static weight (normal + italic) instead of the variable font with extra axes: ~60% smaller.
  weight: "400",
  style: ["normal", "italic"],
});

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
    <html lang="en-US" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh antialiased">
        <a href="#main" className="sr-only z-[60] bg-accent px-4 py-3 text-on-accent focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          Skip to content
        </a>
        <SpecBanner />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <Reveal />
        <Tracking />
      </body>
    </html>
  );
}

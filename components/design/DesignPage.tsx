import { notFound } from "next/navigation";
import { IS_LAUNCH } from "@/lib/mode";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";

// Phase 2 only: wraps a design direction preview. These routes are deleted once Hunter picks.
export function DesignPage({ theme, headerTone, label, children }: { theme: "theme-a" | "theme-b"; headerTone: "light" | "dark"; label: string; children: React.ReactNode }) {
  if (IS_LAUNCH) notFound();
  return (
    <div className={`${theme} bg-bg text-ink`}>
      <Header tone={headerTone} />
      <main id="main">{children}</main>
      <Footer />
      <MobileBar />
      <p className="sr-only">{label}</p>
    </div>
  );
}

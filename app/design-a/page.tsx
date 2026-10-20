import type { Metadata } from "next";
import { DesignPage } from "@/components/design/DesignPage";
import { HeroA, BellevueA } from "@/components/design/DirectionA";
import { getBellevue } from "@/components/design/bellevue-data";

export const metadata: Metadata = { title: "Direction A · Eastside Craft (concept)" };

export default function Page() {
  return (
    <DesignPage theme="theme-a" headerTone="light" label="Direction A, Eastside Craft">
      <HeroA />
      <BellevueA d={getBellevue()} />
    </DesignPage>
  );
}

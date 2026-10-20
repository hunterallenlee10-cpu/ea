import type { Metadata } from "next";
import { DesignPage } from "@/components/design/DesignPage";
import { HeroB, BellevueB } from "@/components/design/DirectionB";
import { getBellevue } from "@/components/design/bellevue-data";

export const metadata: Metadata = { title: "Direction B · Bold Pro (concept)" };

export default function Page() {
  return (
    <DesignPage theme="theme-b" headerTone="dark" label="Direction B, Bold Pro">
      <HeroB />
      <BellevueB d={getBellevue()} />
    </DesignPage>
  );
}

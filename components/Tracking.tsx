// LAUNCH-only tracking (GTM + HubSpot). Filled in Phase 3. Renders nothing in SPEC.
import { IS_LAUNCH } from "@/lib/mode";

export function Tracking() {
  if (!IS_LAUNCH) return null;
  return null;
}

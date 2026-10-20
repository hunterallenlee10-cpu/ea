// One switch for every SPEC/LAUNCH difference (KICKSTART section 1). Missing = spec.
export type SiteMode = "spec" | "launch";
export const SITE_MODE: SiteMode = process.env.SITE_MODE === "launch" ? "launch" : "spec";
export const IS_LAUNCH = SITE_MODE === "launch";
export const IS_SPEC = !IS_LAUNCH;

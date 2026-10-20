import Script from "next/script";
import { IS_LAUNCH } from "@/lib/mode";
import { site } from "@/site.config";
import { HubSpotPageViews } from "./HubSpotPageViews";

/**
 * LAUNCH only (KICKSTART section 7, "Tracking"): exactly GTM (which already holds GA4, Google Ads
 * and Clarity) and HubSpot tracking. Nothing else. In SPEC this renders nothing, so no tag or ID
 * reaches the page. tel:/mailto: click tracking stays in GTM (plain <a href> links everywhere).
 */
export function Tracking() {
  if (!IS_LAUNCH) return null;
  const gtm = site.tracking.gtm;
  const portal = site.tracking.hubspotPortal;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
      </Script>
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtm}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
      </noscript>
      <Script id="hs-script-loader" strategy="afterInteractive" src={`https://js.hs-scripts.com/${portal}.js`} />
      <HubSpotPageViews />
    </>
  );
}

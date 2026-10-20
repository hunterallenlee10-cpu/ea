import type { Metadata } from "next";
import { buildMeta } from "@/lib/meta";
import { site } from "@/site.config";
import { LegalPage } from "@/components/legal/LegalPage";
import { Ph } from "@/components/Ph";

const PATH = "/privacy";
export const metadata: Metadata = buildMeta({
  path: PATH,
  title: "Privacy Policy | EA Pro Painters",
  description: "How EA Pro Painters collects, uses and protects the information you share through our website, estimate and contact forms.",
});

export default function Privacy() {
  return (
    <LegalPage path={PATH} name="Privacy" title="Privacy Policy" updated="October 20, 2026">
      <p>
        This policy explains how {site.name} (“we”, “us”) handles information collected through www.eapropainters.com. Questions:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> or <a href={`tel:${site.phone.e164}`}>{site.phone.display}</a>,{" "}
        {site.address.street}, {site.address.city}, {site.address.region} {site.address.zip}.
      </p>

      <h2>Information you give us</h2>
      <p>When you request an estimate or contact us, we collect what you enter in the form:</p>
      <ul>
        <li>Your name, phone number and email address.</li>
        <li>Project details such as the service, interior or exterior, ZIP code or address, timeline and your notes.</li>
        <li>Photos you choose to upload, if that option is offered.</li>
        <li>Whether you checked the optional box agreeing to calls and texts, the wording you agreed to and when.</li>
      </ul>
      <p>We use this information to respond to you, prepare and schedule your estimate, and carry out and support your project.</p>

      <h2>Where your information goes</h2>
      <p>
        Form submissions are stored in our customer management system (HubSpot). We may also use a service that helps us reply to new
        requests quickly by phone or text; it only receives your details if you checked the calls-and-texts box.{" "}
        <Ph>CONFIRM WITH ERIK: list every service that receives lead data</Ph>
      </p>
      <p>We do not sell your personal information. We share it only with the service providers that help us run our business, or when the law requires it.</p>

      <h2>Calls and text messages</h2>
      <p>
        If you check the optional consent box on a form, you agree that {site.name} may call or text you about your estimate, including
        automated or AI-assisted calls. Consent is not a condition of getting an estimate or buying any service. Message and data rates may
        apply. You can reply STOP to any text, or tell us on a call, to opt out at any time. <Ph>CONFIRM WITH ERIK: consent wording, have it reviewed (#15)</Ph>
      </p>

      <h2>Cookies and analytics</h2>
      <p>Our website uses cookies and similar technologies to understand how visitors use the site and to measure our advertising:</p>
      <ul>
        <li>Google Tag Manager, Google Analytics 4 and Google Ads (visits, pages viewed, and whether a visit led to an estimate request).</li>
        <li>Microsoft Clarity (how pages are used, such as clicks and scrolling, to improve the site).</li>
        <li>HubSpot tracking (which pages a visitor viewed before contacting us).</li>
      </ul>
      <p>
        You can block or delete cookies in your browser settings. Google offers an opt-out for Google Analytics at{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">tools.google.com/dlpage/gaoptout</a>.
      </p>

      <h2>Reviews and outside links</h2>
      <p>
        We link to our reviews on Birdeye and Google, and to our social pages. Those sites have their own privacy policies.
      </p>

      <h2>How long we keep information</h2>
      <p>
        We keep estimate and project records as long as we need them to serve you, honor our warranty and meet our legal obligations.{" "}
        <Ph>ERIK TO PROVIDE: retention period</Ph>
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to see, correct or delete the personal information we hold about you by emailing{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. We will respond within a reasonable time.
      </p>

      <h2>Children</h2>
      <p>Our website is not directed at children under 13, and we do not knowingly collect their information.</p>

      <h2>Changes</h2>
      <p>We may update this policy. The date at the top shows when it last changed.</p>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { buildMeta } from "@/lib/meta";
import { site } from "@/site.config";
import { LegalPage } from "@/components/legal/LegalPage";
import { Ph } from "@/components/Ph";

const PATH = "/terms";
export const metadata: Metadata = buildMeta({
  path: PATH,
  title: "Terms of Use | EA Pro Painters",
  description: "The terms that apply when you use the EA Pro Painters website, request an estimate or agree to calls and texts.",
});

export default function Terms() {
  return (
    <LegalPage path={PATH} name="Terms" title="Terms of Use" updated="October 20, 2026">
      <p>
        These terms apply to your use of www.eapropainters.com, operated by {site.name}, {site.address.street}, {site.address.city},{" "}
        {site.address.region} {site.address.zip} (WA contractor license {site.license.contractor}, UBI {site.license.ubi}). By using the site you agree to them.
      </p>

      <h2>Estimates and information on this site</h2>
      <p>
        Content on this site, including cost ranges, timelines and service descriptions, is general information. It is not a quote or a
        contract. Your price, scope and schedule are set only in a written estimate or agreement for your project.
      </p>

      <h2>Warranty</h2>
      <p>
        Warranty terms for your project are the ones stated in your written estimate or agreement.{" "}
        <Ph>{site.warranty.flagShort}</Ph> <Ph>CONFIRM WITH ERIK: warranty terms and exclusions</Ph>
      </p>

      <h2>Forms, calls and texts</h2>
      <p>
        When you submit a form you confirm the information is accurate and that you are allowed to share it. If you check the optional
        consent box, you agree that {site.name} may call or text you about your estimate, including automated or AI-assisted calls, as
        described in our <Link href="/privacy">Privacy Policy</Link>. Consent is not required to get an estimate. Message and data rates may
        apply; reply STOP to opt out. <Ph>CONFIRM WITH ERIK: consent wording, have it reviewed (#15)</Ph>
      </p>

      <h2>Photos and content</h2>
      <p>
        Photos, text and logos on this site belong to {site.name} or are used with permission. Please don’t copy them for commercial use
        without asking us.
      </p>

      <h2>Reviews</h2>
      <p>Reviews shown on this site are copied exactly from the platform where they were posted, with the reviewer’s name as shown there.</p>

      <h2>Outside links</h2>
      <p>We link to other websites, such as review platforms and partner companies. We are not responsible for their content or practices.</p>

      <h2>Limitation of liability</h2>
      <p>
        The site is provided “as is”. To the extent the law allows, {site.name} is not liable for losses arising from use of the site.
        Nothing here limits rights you have under Washington law. <Ph>DRAFT: have this section reviewed</Ph>
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of Washington.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a> or <a href={`tel:${site.phone.e164}`}>{site.phone.display}</a>.
      </p>
    </LegalPage>
  );
}

import { IS_LAUNCH } from "@/lib/mode";

/**
 * LAUNCH only: send a lead to Erik's HubSpot form (KICKSTART section 7, "Forms").
 * In SPEC this returns 404 before any HubSpot ID or webhook URL is read.
 *
 * Fields map ONLY to fields on his live HubSpot forms (audit/hubspot/form-fields.json):
 * firstname, email, mobilephone, address, city, message. Everything else goes into `message`.
 * HubSpot "Collected forms" should be off for the domain so leads aren't logged twice.
 * The live forms use invisible reCAPTCHA (OPEN-QUESTIONS #21): if HubSpot rejects API
 * submissions, Erik must turn CAPTCHA off on both forms.
 */

const MIN_FILL_MS = 3000;

type Body = {
  form?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
  service?: unknown;
  scope?: unknown;
  zip?: unknown;
  timeline?: unknown;
  consent?: unknown;
  consentText?: unknown;
  consentVersion?: unknown;
  consentAt?: unknown;
  startedAt?: unknown;
  website?: unknown;
  pageUri?: unknown;
  pageName?: unknown;
};

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  if (!IS_LAUNCH) return new Response("Not found", { status: 404 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Spam: honeypot filled or submitted faster than a person could. Pretend success, send nothing.
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  if (str(body.website) || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return Response.json({ ok: true });
  }

  const form = body.form === "contact" ? "contact" : "estimate";
  const name = str(body.name, 200);
  const phone = str(body.phone, 40);
  const email = str(body.email, 200);
  if (!name) return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 10) return Response.json({ error: "Please enter a phone number with area code." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return Response.json({ error: "Please enter a valid email." }, { status: 400 });

  const consent = body.consent === true;
  const consentText = str(body.consentText, 500);
  const consentVersion = str(body.consentVersion, 40);
  const consentAt = str(body.consentAt, 40) || new Date().toISOString();

  const extra = [
    str(body.service, 100) && `Service: ${str(body.service, 100)}`,
    str(body.scope, 40) && `Interior/exterior: ${str(body.scope, 40)}`,
    str(body.zip, 10) && `ZIP: ${str(body.zip, 10)}`,
    str(body.timeline, 60) && `Timeline: ${str(body.timeline, 60)}`,
  ].filter(Boolean);
  const notes = str(body.message, 4000);
  const consentLine = `Call/text consent: ${consent ? "YES" : "NO"} (wording ${consentVersion || "unknown"}, ${consentAt})${consent && consentText ? ` "${consentText}"` : ""}`;
  const message = [...extra, notes && `Notes: ${notes}`, consentLine].filter(Boolean).join("\n");

  const cookie = request.headers.get("cookie") ?? "";
  const hutk = cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/)?.[1];
  const ipAddress = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || undefined;

  const portal = process.env.HUBSPOT_PORTAL_ID;
  const guid = form === "contact" ? process.env.HUBSPOT_CONTACT_FORM_GUID : process.env.HUBSPOT_ESTIMATE_FORM_GUID;
  if (!portal || !guid) {
    console.error("lead: HubSpot env vars missing");
    return Response.json({ error: "We couldn't send your request. Please call 206.250.1194." }, { status: 500 });
  }

  const payload = {
    submittedAt: Date.now(),
    fields: [
      { objectTypeId: "0-1", name: "firstname", value: name },
      { objectTypeId: "0-1", name: "email", value: email },
      { objectTypeId: "0-1", name: "mobilephone", value: phone },
      { objectTypeId: "0-1", name: "message", value: message },
    ],
    context: {
      ...(hutk ? { hutk } : {}),
      pageUri: str(body.pageUri, 500) || undefined,
      pageName: str(body.pageName, 200) || undefined,
      ...(ipAddress ? { ipAddress } : {}),
    },
  };

  const hs = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(portal)}/${encodeURIComponent(guid)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((e: unknown) => {
    console.error("lead: HubSpot request failed", e instanceof Error ? e.message : e);
    return null;
  });
  if (!hs || !hs.ok) {
    if (hs) console.error("lead: HubSpot rejected submission", hs.status, (await hs.text()).slice(0, 500));
    return Response.json({ error: "We couldn't send your request. Please call 206.250.1194." }, { status: 502 });
  }

  // Optional speed-to-lead. Never for a lead whose consent box is unchecked.
  const stl = process.env.STL_WEBHOOK_URL;
  if (consent && stl) {
    await fetch(stl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        form,
        name,
        phone,
        email,
        service: str(body.service, 100) || null,
        scope: str(body.scope, 40) || null,
        zip: str(body.zip, 10) || null,
        timeline: str(body.timeline, 60) || null,
        notes: notes || null,
        consent: { agreed: true, text: consentText, version: consentVersion, at: consentAt },
        pageUri: str(body.pageUri, 500) || null,
      }),
    }).catch((e: unknown) => console.error("lead: STL webhook failed", e instanceof Error ? e.message : e));
  }

  return Response.json({ ok: true });
}

"use client";
import { Ph } from "@/components/Ph";

/*
 * Shared form pieces (client). Nothing here may import site.config or any env var:
 * no HubSpot ID or webhook URL can reach browser code (KICKSTART section 1).
 */

export const CONSENT_TEXT =
  "I agree EA Pro Painters may call or text me about my estimate, including automated or AI-assisted calls.";
/** Bump when the wording changes, so each lead records which version it agreed to. */
export const CONSENT_VERSION = "2026-10-20-v1";
export const DEMO_MESSAGE = "Demo only. Nothing was sent. To reach EA Pro Painters call 206.250.1194.";

export type LeadPayload = {
  form: "estimate" | "contact";
  name: string;
  phone: string;
  email: string;
  message?: string;
  service?: string;
  scope?: string;
  zip?: string;
  timeline?: string;
  consent: boolean;
  consentText: string;
  consentVersion: string;
  consentAt: string;
  startedAt: number;
  website: string; // honeypot
  pageUri: string;
  pageName: string;
};

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

/**
 * SPEC: never makes a network request. LAUNCH: POST /api/lead, push a dataLayer event,
 * then a full page load to /success (his Google Ads conversion fires on that page view).
 */
export async function submitLead(isLaunch: boolean, payload: LeadPayload): Promise<{ ok: true; demo: boolean } | { ok: false; error: string }> {
  if (!isLaunch) return { ok: true, demo: true };
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: j?.error ?? "Something went wrong. Please call 206.250.1194." };
    }
    const w = window as DataLayerWindow;
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event: "ea_lead_submitted", form: payload.form });
    // A full page load on purpose (KICKSTART 7): his Google Ads conversion fires on the /success page view.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/success");
    return { ok: true, demo: false };
  } catch {
    return { ok: false, error: "We couldn't send your request. Please call 206.250.1194." };
  }
}

export const inputCls =
  "mt-2 block min-h-12 w-full rounded-ui border border-line bg-bg px-4 py-3 text-[17px] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-accent";

export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-semibold">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[13px] text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[14px] font-medium text-accent" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Unchecked by default and never required (KICKSTART 5.2.5). */
export function ConsentCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      <input
        id="consent"
        name="consent"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-6 w-6 shrink-0 accent-[var(--c-accent)]"
      />
      <label htmlFor="consent" className="text-[15px] leading-snug text-ink/85">
        {CONSENT_TEXT} <span className="text-muted">(Optional.)</span>{" "}
        <Ph>CONFIRM WITH ERIK: consent wording, have it reviewed</Ph>
      </label>
    </div>
  );
}

/** Hidden from people, tempting to bots. Any value = spam. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function DemoNotice() {
  return (
    <div role="status" className="rounded-ui border-2 border-accent bg-bg p-6 text-[18px] font-semibold leading-snug">
      {DEMO_MESSAGE}
    </div>
  );
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
export const isPhone = (s: string) => s.replace(/\D/g, "").length >= 10;

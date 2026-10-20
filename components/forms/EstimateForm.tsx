"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONSENT_TEXT,
  CONSENT_VERSION,
  ConsentCheckbox,
  DemoNotice,
  Field,
  Honeypot,
  inputCls,
  isEmail,
  isPhone,
  submitLead,
} from "./shared";

type Service = { slug: string; name: string };

const SCOPES = ["Interior", "Exterior", "Both", "Not sure yet"];
const TIMELINES = ["As soon as possible", "Within a month", "In 1–3 months", "Just planning"];
const STEP_TITLES = ["What do you need painted?", "Inside or outside?", "Where is the project?", "When would you like to start?", "How can we reach you?"];

/**
 * Multi-step estimate flow (KICKSTART 5.2.5): service → interior/exterior → ZIP → timeline → contact.
 * `isLaunch` and `phone` come from the server page as plain props.
 */
export function EstimateForm({ isLaunch, services, phone }: { isLaunch: boolean; services: Service[]; phone: { display: string; e164: string } }) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [scope, setScope] = useState("");
  const [zip, setZip] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "demo" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef<number>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const total = STEP_TITLES.length;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Move focus to the step heading when the step changes (screen readers + keyboard users).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 0 && !service) e.service = "Choose a service.";
    if (s === 1 && !scope) e.scope = "Choose one.";
    if (s === 2 && !/^\d{5}$/.test(zip.trim())) e.zip = "Enter a 5-digit ZIP code.";
    if (s === 3 && !timeline) e.timeline = "Choose a timeline.";
    if (s === 4) {
      if (!name.trim()) e.name = "Enter your name.";
      if (!isPhone(tel)) e.phone = "Enter a phone number with area code.";
      if (!isEmail(email)) e.email = "Enter a valid email.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => Math.min(s + 1, total - 1));
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (step < total - 1) return next();
    if (!validate(4)) return;
    setStatus("sending");
    const serviceName = services.find((s) => s.slug === service)?.name ?? service;
    const res = await submitLead(isLaunch, {
      form: "estimate",
      name: name.trim(),
      phone: tel.trim(),
      email: email.trim(),
      message: notes.trim(),
      service: serviceName,
      scope,
      zip: zip.trim(),
      timeline,
      consent,
      consentText: CONSENT_TEXT,
      consentVersion: CONSENT_VERSION,
      consentAt: new Date().toISOString(),
      startedAt: startedAt.current,
      website,
      pageUri: window.location.href,
      pageName: document.title,
    });
    if (!res.ok) {
      setStatus("error");
      setServerError(res.error);
    } else if (res.demo) setStatus("demo");
  }

  if (status === "demo") return <DemoNotice />;

  const optionCls = (active: boolean) =>
    `flex min-h-14 cursor-pointer items-center gap-3 rounded-ui border px-4 py-3 text-[16px] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
      active ? "border-accent bg-accent/5 text-ink" : "border-line bg-bg hover:border-ink/40"
    }`;

  const radioGroup = (
    name: string,
    legend: string,
    options: { value: string; label: string }[],
    value: string,
    set: (v: string) => void,
    cols = "sm:grid-cols-2",
  ) => (
    <fieldset aria-describedby={errors[name] ? `${name}-error` : undefined}>
      <legend className="sr-only">{legend}</legend>
      <div className={`grid gap-3 ${cols}`}>
        {options.map((o) => (
          <label key={o.value} className={optionCls(value === o.value)}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => set(o.value)} className="h-5 w-5 shrink-0 accent-[var(--c-accent)]" />
            {o.label}
          </label>
        ))}
      </div>
      {errors[name] && (
        <p id={`${name}-error`} role="alert" className="mt-3 text-[14px] font-medium text-accent">
          {errors[name]}
        </p>
      )}
    </fieldset>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="relative rounded-ui border border-line bg-bg p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)] md:p-10" aria-label="Free estimate request">
      {/* Progress */}
      <div className="flex items-center justify-between text-[13px] font-semibold text-muted">
        <span>
          Step {step + 1} of {total}
        </span>
        <span>Takes under 2 minutes</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Form progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1}>
        <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      <h2 ref={headingRef} tabIndex={-1} className="display mt-8 text-[clamp(1.7rem,3vw,2.3rem)] focus:outline-none">
        {STEP_TITLES[step]}
      </h2>

      <div className="mt-6">
        {step === 0 && radioGroup("service", "Service", services.map((s) => ({ value: s.slug, label: s.name })), service, setService, "sm:grid-cols-2 lg:grid-cols-3")}
        {step === 1 && radioGroup("scope", "Interior or exterior", SCOPES.map((s) => ({ value: s, label: s })), scope, setScope)}
        {step === 2 && (
          <Field id="zip" label="Project ZIP code" error={errors.zip}>
            <input
              id="zip"
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
              aria-invalid={!!errors.zip}
              aria-describedby={errors.zip ? "zip-error" : undefined}
              className={`${inputCls} max-w-[12rem] tabular-nums`}
            />
          </Field>
        )}
        {step === 3 && radioGroup("timeline", "Timeline", TIMELINES.map((s) => ({ value: s, label: s })), timeline, setTimeline)}
        {step === 4 && (
          <div className="grid gap-5">
            <Field id="name" label="Name" error={errors.name}>
              <input id="name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={inputCls} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="phone" label="Mobile phone" error={errors.phone}>
                <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={tel} onChange={(e) => setTel(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} className={inputCls} />
              </Field>
              <Field id="email" label="Email" error={errors.email}>
                <input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={inputCls} />
              </Field>
            </div>
            <Field id="notes" label="Notes (optional)" hint="Rooms, surfaces, colors, anything we should know.">
              <textarea id="notes" name="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} aria-describedby="notes-hint" className={inputCls} />
            </Field>
            {!isLaunch && (
              // Photo upload is SPEC only until Hunter approves where photos are stored (OPEN-QUESTIONS #20).
              <Field id="photos" label="Photos (optional)" hint="Demo: photos are not uploaded anywhere.">
                <input
                  id="photos"
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
                  aria-describedby="photos-hint"
                  className="mt-2 block min-h-12 w-full text-[15px] file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-ui file:border file:border-line file:bg-surface file:px-4 file:font-semibold"
                />
                {files.length > 0 && <p className="mt-2 text-[13px] text-muted">{files.join(", ")}</p>}
              </Field>
            )}
            <ConsentCheckbox checked={consent} onChange={setConsent} />
            <Honeypot value={website} onChange={setWebsite} />
          </div>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 text-[15px] font-medium text-accent">
          {serverError}{" "}
          <a href={`tel:${phone.e164}`} className="underline">
            {phone.display}
          </a>
        </p>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => { setErrors({}); setStep((s) => s - 1); }} className="inline-flex min-h-12 items-center justify-center rounded-ui px-4 text-[16px] font-semibold text-ink underline underline-offset-4 hover:text-accent">
            Back
          </button>
        ) : (
          <span />
        )}
        {step < total - 1 ? (
          <button type="button" onClick={next} className="inline-flex min-h-14 items-center justify-center rounded-ui bg-accent px-8 text-[17px] font-semibold text-on-accent transition-colors hover:bg-accent-hover">
            Next
          </button>
        ) : (
          <button type="submit" disabled={status === "sending"} className="inline-flex min-h-14 items-center justify-center rounded-ui bg-accent px-8 text-[17px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60">
            {isLaunch ? (status === "sending" ? "Sending…" : "Get My Free Estimate") : "Submit (demo)"}
          </button>
        )}
      </div>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_TEXT, CONSENT_VERSION, ConsentCheckbox, DemoNotice, Field, Honeypot, inputCls, isEmail, isPhone, submitLead } from "./shared";

/** Contact form. Same SPEC/LAUNCH behavior as the estimate flow. */
export function ContactForm({ isLaunch, phone }: { isLaunch: boolean; phone: { display: string; e164: string } }) {
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "demo" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Enter your name.";
    if (!isPhone(tel)) e.phone = "Enter a phone number with area code.";
    if (!isEmail(email)) e.email = "Enter a valid email.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    const res = await submitLead(isLaunch, {
      form: "contact",
      name: name.trim(),
      phone: tel.trim(),
      email: email.trim(),
      message: message.trim(),
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

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 rounded-ui border border-line bg-bg p-6 md:p-10" aria-label="Contact EA Pro Painters">
      <Field id="c-name" label="Name" error={errors.name}>
        <input id="c-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-error" : undefined} className={inputCls} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-phone" label="Mobile phone" error={errors.phone}>
          <input id="c-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={tel} onChange={(e) => setTel(e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "c-phone-error" : undefined} className={inputCls} />
        </Field>
        <Field id="c-email" label="Email" error={errors.email}>
          <input id="c-email" name="email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-error" : undefined} className={inputCls} />
        </Field>
      </div>
      <Field id="c-message" label="Message (optional)">
        <textarea id="c-message" name="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={inputCls} />
      </Field>
      <ConsentCheckbox checked={consent} onChange={setConsent} />
      <Honeypot value={website} onChange={setWebsite} />
      {status === "error" && (
        <p role="alert" className="text-[15px] font-medium text-accent">
          {serverError}{" "}
          <a href={`tel:${phone.e164}`} className="underline">
            {phone.display}
          </a>
        </p>
      )}
      <div>
        <button type="submit" disabled={status === "sending"} className="inline-flex min-h-14 w-full items-center justify-center rounded-ui bg-accent px-8 text-[17px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60 sm:w-auto">
          {isLaunch ? (status === "sending" ? "Sending…" : "Send Message") : "Submit (demo)"}
        </button>
      </div>
    </form>
  );
}

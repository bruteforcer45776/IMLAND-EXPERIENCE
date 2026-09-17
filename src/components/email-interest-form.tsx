import { FormEvent, useId, useState } from "react";
import { Link } from "@tanstack/react-router";

type EmailInterestFormProps = {
  subject: string;
  message: string;
  buttonLabel: string;
  consentLabel?: string;
};

export function EmailInterestForm({
  subject,
  message,
  buttonLabel,
  consentLabel = "Acconsento a ricevere aggiornamenti email da IMLAND.",
}: EmailInterestFormProps) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !consentAccepted) return;

    const body = `${message}\n\nEmail da avvisare: ${normalizedEmail}`;
    setSubmitted(true);
    window.setTimeout(() => {
      window.location.href = `mailto:imlandexperience@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 0);
  };

  return (
    <form noValidate onSubmit={onSubmit} className="mx-auto mt-7 w-full max-w-xl text-left">
      <label htmlFor={`${id}-email`} className="text-sm font-semibold text-foreground">
        Email
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={255}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nome@email.it"
          className="min-h-12 min-w-0 flex-1 rounded-xl border border-border bg-white px-4 text-base text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
        />
        <button
          type="submit"
          disabled={!consentAccepted || !email.trim()}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        >
          {buttonLabel}
        </button>
      </div>
      <label className="mt-3 flex items-start gap-3 rounded-2xl border border-border bg-background/75 p-3 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={consentAccepted}
          onChange={(event) => setConsentAccepted(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span>
          {consentLabel} Dichiaro di aver letto la{" "}
          <Link to="/privacy" className="font-semibold underline underline-offset-2">
            Privacy Policy
          </Link>
          . Posso revocare il consenso in qualsiasi momento.
        </span>
      </label>
      <p className="mt-3 min-h-5 text-center text-xs text-muted-foreground" role="status">
        {submitted ? "Grazie, la richiesta è pronta: inviala dalla tua app email." : "Ti avviseremo non appena ci saranno novità."}
      </p>
    </form>
  );
}

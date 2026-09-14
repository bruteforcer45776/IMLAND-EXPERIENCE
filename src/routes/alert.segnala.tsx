import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, LocateFixed, Save, X } from "lucide-react";
import { toast } from "sonner";

import { canonical } from "../lib/seo";
import { useAuth } from "@/hooks/use-auth";
import { useGeolocation } from "@/hooks/use-hub";
import { useAlertCategories, useSaveAlert } from "@/hooks/use-alerts";
import { submitAlert } from "@/lib/hub.functions";
import { HUB_COMUNI, HUB_PROVINCES } from "@/lib/hub";
import { fieldsForType, hasBlockingChecks, runAlertChecks } from "@/lib/alert";

export const Route = createFileRoute("/alert/segnala")({
  head: () => ({
    meta: [
      { title: "Invia una segnalazione dal territorio — ALERT" },
      {
        name: "description",
        content:
          "Segnala una notizia, un evento, una nuova attività o un problema del territorio. La redazione IMLAND verifica ogni segnalazione prima di pubblicarla.",
      },
      { property: "og:title", content: "Invia una segnalazione dal territorio — ALERT" },
      { property: "og:description", content: "Segnala ciò che accade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [canonical("/alert/segnala")],
  }),
  component: AlertSubmit,
});

/** chiavi delle schermate: una domanda per volta, come un sondaggio */
type QuestionKey = "type" | "title" | "body" | "extra" | "place" | "contact" | "review";

const inputClass =
  "h-14 w-full rounded-2xl border-2 border-border bg-background px-5 text-lg outline-none transition-colors focus:border-[var(--service-base)]";
const areaClass =
  "w-full rounded-2xl border-2 border-border bg-background px-5 py-4 text-lg outline-none transition-colors focus:border-[var(--service-base)]";

function AlertSubmit() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const geo = useGeolocation();
  const categories = useAlertCategories("user");
  const send = useServerFn(submitAlert);
  const saveAlert = useSaveAlert();

  const [step, setStep] = useState(0);
  const [code, setCode] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);

  const [form, setForm] = useState({
    alertType: "",
    title: "",
    body: "",
    comune: "",
    province: "",
    contactEmail: "",
    trap: "",
  });
  const [extra, setExtra] = useState<Record<string, string>>({});

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const categoryLabel =
    (categories.data ?? []).find((c) => c.slug === form.alertType)?.label ?? "";
  const dynamicFields = useMemo(() => fieldsForType(form.alertType), [form.alertType]);

  // La sequenza di domande si adatta alla tipologia scelta.
  const questions = useMemo<QuestionKey[]>(() => {
    const base: QuestionKey[] = ["type", "title", "body"];
    if (dynamicFields.length > 0) base.push("extra");
    base.push("place", "contact", "review");
    return base;
  }, [dynamicFields.length]);

  const current = questions[Math.min(step, questions.length - 1)]!;
  const total = questions.length;

  const draft = {
    alertType: form.alertType,
    title: form.title,
    body: form.body,
    comune: form.comune,
    province: form.province || null,
    contactEmail: form.contactEmail.trim() || profile?.email || null,
    payload: extra,
  };
  const checks = runAlertChecks(draft);
  const blocked = hasBlockingChecks(checks);

  const guestSubmit = useMutation({
    mutationFn: async () =>
      send({
        data: {
          alertType: form.alertType,
          category: categoryLabel || form.alertType,
          title: form.title.trim(),
          body: form.body.trim(),
          comune: form.comune,
          province: form.province || null,
          latitude: geo.coords?.lat ?? null,
          longitude: geo.coords?.lon ?? null,
          contactEmail: draft.contactEmail,
          payload: extra,
          trap: form.trap,
        },
      }),
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(
          result.reason === "limit"
            ? "Hai già inviato molte segnalazioni oggi. Riprova domani."
            : "Non è stato possibile inviare la segnalazione.",
        );
        return;
      }
      setCode(result.code);
      toast.success("Segnalazione ricevuta. Grazie!");
    },
    onError: () => toast.error("Non è stato possibile inviare la segnalazione."),
  });

  const persist = (state: "draft" | "submitted") =>
    saveAlert.mutate(
      {
        draft: {
          id: draftId,
          alertType: form.alertType,
          category: categoryLabel || form.alertType,
          title: form.title,
          body: form.body,
          comune: form.comune,
          province: form.province || null,
          latitude: geo.coords?.lat ?? null,
          longitude: geo.coords?.lon ?? null,
          contactEmail: draft.contactEmail,
          payload: extra,
        },
        state,
      },
      {
        onSuccess: (row) => {
          setDraftId(row.id);
          if (state === "draft") {
            toast.success("Bozza salvata. Puoi riprenderla quando vuoi.");
          } else {
            setCode(row.code);
            toast.success("Segnalazione inviata. Grazie!");
          }
        },
      },
    );

  const pending = guestSubmit.isPending || saveAlert.isPending;

  const canContinue = () => {
    if (current === "type") return Boolean(form.alertType);
    if (current === "title") return form.title.trim().length >= 5;
    if (current === "body") return form.body.trim().length >= 20;
    if (current === "extra")
      return dynamicFields.every((f) => !f.required || (extra[f.name] ?? "").trim().length > 0);
    if (current === "place") return Boolean(form.comune);
    return true;
  };

  // Il sondaggio occupa tutto lo schermo: blocchiamo lo scroll del sito sotto.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const goNext = () => {
    if (!canContinue()) return;
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const reset = () => {
    setCode(null);
    setDraftId(null);
    setStep(0);
    setForm({ alertType: "", title: "", body: "", comune: "", province: "", contactEmail: "", trap: "" });
    setExtra({});
  };

  const shell = (children: React.ReactNode) => (
    <section
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white"
      aria-label="Segnalazione dal territorio"
    >
      <header className="flex items-center justify-between gap-3 px-4 py-4 md:px-8">
        <span className="text-caption-im font-semibold uppercase tracking-[0.18em] text-[var(--service-ink)]">
          IMLAND ALERT
        </span>
        <button
          type="button"
          onClick={() => navigate({ to: "/alert" })}
          aria-label="Chiudi la segnalazione"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--service-border)] bg-white text-[var(--service-ink)] transition-colors hover:bg-[color-mix(in_oklab,var(--service-base)_10%,white)]"
        >
          <X size={20} />
        </button>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] md:px-8">
        <div className="w-full max-w-2xl">{children}</div>
      </div>
    </section>
  );

  if (code) {
    return shell(
      <div className="text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--service-base)] text-white">
          <Check size={30} />
        </span>
        <h1 className="mt-6 text-h1-im">Grazie, l'abbiamo ricevuta.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          La redazione verifica le informazioni prima di pubblicarle.
          <br />
          Conserva questo codice per seguire il percorso della tua segnalazione.
        </p>
        <p className="mt-6 inline-flex rounded-2xl border-2 border-[var(--service-border)] bg-white px-8 py-5 text-3xl font-semibold tracking-[0.14em]">
          {code}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/alert/stato"
            search={{ code }}
            className="rounded-full bg-[var(--service-base)] px-6 py-3 text-sm font-semibold text-[var(--service-on-color)]"
          >
            Segui la segnalazione
          </Link>
          {user ? (
            <Link to="/alert/mie" className="rounded-full border-2 border-[var(--service-border)] bg-white px-6 py-3 text-sm font-semibold">
              Le mie segnalazioni
            </Link>
          ) : null}
          <button
            type="button"
            onClick={reset}
            className="rounded-full border-2 border-[var(--service-border)] bg-white px-6 py-3 text-sm font-semibold"
          >
            Invia un'altra segnalazione
          </button>
        </div>
      </div>,
    );
  }

  const QUESTION_COPY: Record<QuestionKey, { eyebrow: string; question: string; hint: string }> = {
    type: {
      eyebrow: `Domanda 1 di ${total}`,
      question: "Di cosa vuoi parlarci?",
      hint: "Scegli la tipologia più vicina a ciò che vuoi segnalare.",
    },
    title: {
      eyebrow: `Domanda ${questions.indexOf("title") + 1} di ${total}`,
      question: "Come lo racconteresti in una frase?",
      hint: "Una frase breve e chiara, come un titolo.",
    },
    body: {
      eyebrow: `Domanda ${questions.indexOf("body") + 1} di ${total}`,
      question: "Raccontaci cosa succede.",
      hint: "Cosa, quando, chi è coinvolto: più dettagli, più veloce la verifica.",
    },
    extra: {
      eyebrow: `Domanda ${questions.indexOf("extra") + 1} di ${total}`,
      question: "Ci servono ancora poche informazioni.",
      hint: `Dettagli utili per una segnalazione di tipo ${categoryLabel || "selezionato"}.`,
    },
    place: {
      eyebrow: `Domanda ${questions.indexOf("place") + 1} di ${total}`,
      question: "Dove si trova?",
      hint: "Il territorio ci aiuta a capire chi coinvolgere.",
    },
    contact: {
      eyebrow: `Domanda ${questions.indexOf("contact") + 1} di ${total}`,
      question: "Come possiamo ricontattarti?",
      hint: "Solo per chiederti un chiarimento. Non viene mai pubblicata.",
    },
    review: {
      eyebrow: "Ultimo passaggio",
      question: "Controlla e invia.",
      hint: "Rileggi con calma: puoi tornare indietro e correggere.",
    },
  };

  const copy = QUESTION_COPY[current];

  return shell(
    <div>
      {/* avanzamento del sondaggio */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--service-base)_18%,white)]">
          <div
            className="h-full rounded-full bg-[var(--service-base)] transition-[width] duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label="Avanzamento della segnalazione"
          />
        </div>
        <span className="text-caption-im font-semibold text-[var(--service-ink)]">
          {step + 1}/{total}
        </span>
      </div>

      <p className="mt-8 text-caption-im font-semibold uppercase tracking-[0.18em] text-[var(--service-ink)]">
        {copy.eyebrow}
      </p>
      <h1 className="mt-2 text-h1-im">{copy.question}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{copy.hint}</p>

      <div className="mt-8">
        {current === "type" && (
          <fieldset>
            <legend className="sr-only">Tipologia di segnalazione</legend>
            {categories.isLoading ? (
              <p className="text-muted-foreground">Carico le tipologie…</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {(categories.data ?? []).map((c) => {
                  const selected = form.alertType === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setForm((f) => ({ ...f, alertType: c.slug }));
                        setStep((s) => Math.min(s + 1, total - 1));
                      }}
                      className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left text-base font-semibold transition-colors ${
                        selected
                          ? "border-[var(--service-base)] bg-[color-mix(in_oklab,var(--service-base)_12%,white)]"
                          : "border-border bg-white hover:border-[var(--service-base)]"
                      }`}
                    >
                      {c.label}
                      {selected ? <Check size={18} className="text-[var(--service-ink)]" /> : null}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
        )}

        {current === "title" && (
          <label className="block">
            <span className="sr-only">Titolo della segnalazione</span>
            <input
              value={form.title}
              onChange={set("title")}
              maxLength={160}
              autoFocus
              placeholder="Es. Nuova libreria aperta in centro"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  goNext();
                }
              }}
              className={inputClass}
            />
            <span className="mt-2 block text-caption-im text-muted-foreground">
              {form.title.trim().length < 5 ? "Almeno 5 caratteri." : `${form.title.length}/160`}
            </span>
          </label>
        )}

        {current === "body" && (
          <label className="block">
            <span className="sr-only">Racconto della segnalazione</span>
            <textarea
              value={form.body}
              onChange={set("body")}
              rows={8}
              maxLength={4000}
              autoFocus
              placeholder="Racconta cosa succede, dove e perché è importante per il territorio…"
              className={areaClass}
            />
            <span className="mt-2 block text-caption-im text-muted-foreground">
              {form.body.trim().length < 20 ? "Almeno 20 caratteri." : `${form.body.length}/4000`}
            </span>
          </label>
        )}

        {current === "extra" && (
          <div className="space-y-5">
            {dynamicFields.map((field) => (
              <label key={field.name} className="block space-y-2">
                <span className="text-base font-semibold">
                  {field.label}
                  {field.required ? " *" : ""}
                </span>
                {field.kind === "textarea" ? (
                  <textarea
                    value={extra[field.name] ?? ""}
                    onChange={(e) => setExtra((x) => ({ ...x, [field.name]: e.target.value }))}
                    rows={4}
                    maxLength={600}
                    className={areaClass}
                  />
                ) : (
                  <input
                    type={field.kind === "text" ? "text" : field.kind}
                    value={extra[field.name] ?? ""}
                    onChange={(e) => setExtra((x) => ({ ...x, [field.name]: e.target.value }))}
                    maxLength={600}
                    className={inputClass}
                  />
                )}
              </label>
            ))}
          </div>
        )}

        {current === "place" && (
          <div className="space-y-5">
            <label className="block space-y-2">
              <span className="text-base font-semibold">Comune *</span>
              <select value={form.comune} onChange={set("comune")} className={inputClass}>
                <option value="">Scegli il Comune</option>
                {HUB_COMUNI.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-base font-semibold">Provincia</span>
              <select value={form.province} onChange={set("province")} className={inputClass}>
                <option value="">—</option>
                {HUB_PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <div>
              <button
                type="button"
                onClick={geo.request}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[var(--service-border)] bg-white px-5 py-3 text-sm font-semibold"
              >
                <LocateFixed size={16} />
                {geo.coords ? "Posizione allegata" : geo.loading ? "Cerco la posizione…" : "Allega la posizione"}
              </button>
              {geo.error ? <p className="mt-2 text-sm text-muted-foreground">{geo.error}</p> : null}
            </div>
          </div>
        )}

        {current === "contact" && (
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="sr-only">Email per ricontattarti</span>
              <input
                type="email"
                value={form.contactEmail}
                onChange={set("contactEmail")}
                placeholder={profile?.email ?? "nome@email.it"}
                maxLength={255}
                autoFocus
                className={inputClass}
              />
            </label>
            {user ? (
              <p className="text-muted-foreground">
                Puoi allegare foto o documenti dopo l'invio, dalla pagina “Le mie segnalazioni”.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Puoi segnalare anche senza account.
                <br />
                Con un account tieni traccia di tutte le tue segnalazioni e puoi allegare foto.
              </p>
            )}
            {/* campo esca anti-spam: invisibile alle persone */}
            <input value={form.trap} onChange={set("trap")} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          </div>
        )}

        {current === "review" && (
          <div className="space-y-4">
            <div className="rounded-3xl border-2 border-[var(--service-border)] bg-white p-6">
              <p className="text-caption-im font-semibold uppercase tracking-wide text-[var(--service-ink)]">
                {categoryLabel || "Tipologia"} · {form.comune || "Comune da indicare"}
              </p>
              <h2 className="mt-1 text-xl font-semibold">{form.title || "Titolo da completare"}</h2>
              <p className="mt-2 whitespace-pre-line text-muted-foreground">{form.body}</p>
              {dynamicFields.length > 0 && (
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {dynamicFields.map((f) => (
                    <div key={f.name}>
                      <dt className="text-caption-im uppercase tracking-wide text-muted-foreground">{f.label}</dt>
                      <dd className="text-sm">{extra[f.name] || "—"}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {checks.length > 0 && (
              <ul className="space-y-2">
                {checks.map((c) => (
                  <li
                    key={`${c.level}-${c.message}`}
                    className={`flex items-start gap-2 rounded-2xl border-2 bg-white px-4 py-3 text-sm ${
                      c.level === "error" ? "border-destructive text-destructive" : "border-border text-muted-foreground"
                    }`}
                  >
                    {c.level === "error" ? <AlertTriangle size={16} className="mt-0.5" /> : <Check size={16} className="mt-0.5" />}
                    <span>{c.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[var(--service-border)] bg-white px-5 py-3 text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Indietro
          </button>
        )}
        {current !== "review" ? (
          <button
            type="button"
            disabled={!canContinue()}
            onClick={goNext}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--service-base)] px-7 py-3 text-sm font-semibold text-[var(--service-on-color)] disabled:opacity-50"
          >
            Continua <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            disabled={blocked || pending}
            onClick={() => (user ? persist("submitted") : guestSubmit.mutate())}
            className="inline-flex min-h-12 items-center rounded-full bg-[var(--service-base)] px-7 py-3 text-sm font-semibold text-[var(--service-on-color)] disabled:opacity-50"
          >
            {pending ? "Invio…" : "Invia la segnalazione"}
          </button>
        )}
        {user && step > 0 && (
          <button
            type="button"
            disabled={saveAlert.isPending || form.title.trim().length < 5 || form.body.trim().length < 20 || !form.comune}
            onClick={() => persist("draft")}
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[var(--service-border)] bg-white px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            <Save size={16} /> Salva bozza
          </button>
        )}
        <Link to="/alert/stato" className="text-sm font-semibold underline">
          Ho già un codice
        </Link>
      </div>
    </div>,
  );
}

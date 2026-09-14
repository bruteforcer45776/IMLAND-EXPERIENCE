import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { BadgeIcon, type BadgeName } from "@/components/badge-icon";
import { usePreferences } from "@/hooks/use-preferences";
import { useAuth } from "@/hooks/use-auth";
import { notifyError } from "@/lib/errors";

type Option = { value: string; badge: BadgeName; label?: string };

type Step = {
  key: "account_type" | "topics" | "provinces" | "listen_moment" | "formats" | "goal" | "notify";
  eyebrow: string;
  question: string;
  hint: string;
  multi: boolean;
  options: Option[];
};

const STEPS: Step[] = [
  {
    key: "account_type",
    eyebrow: "Chi sei",
    question: "Come vivi IMLAND?",
    hint: "Serve per organizzare la tua area personale.",
    multi: false,
    options: [
      { value: "ascoltatore", badge: "account", label: "Persona" },
      { value: "azienda", badge: "partner", label: "Membro" },
    ],
  },
  {
    key: "topics",
    eyebrow: "Interessi",
    question: "Quali temi ti interessano di più?",
    hint: "Scegline quanti vuoi: guidano i contenuti che ti proponiamo.",
    multi: true,
    options: [
      { value: "Business", badge: "aziende" },
      { value: "Cultura", badge: "cultura" },
      { value: "Cibo e vino", badge: "festa" },
      { value: "Tecnologia", badge: "onde" },
      { value: "Lifestyle", badge: "community" },
      { value: "Weekend ed eventi", badge: "calendario" },
      { value: "Notizie del territorio", badge: "news" },
      { value: "Musica", badge: "radio" },
    ],
  },
  {
    key: "provinces",
    eyebrow: "Territorio",
    question: "Dove segui il territorio?",
    hint: "Metteremo in evidenza notizie ed eventi della tua zona.",
    multi: true,
    options: [
      { value: "Vercelli", badge: "luogo" },
      { value: "Novara", badge: "luogo" },
      { value: "Biella", badge: "luogo" },
      { value: "Verbania", badge: "luogo" },
      { value: "Tutto il Piemonte", badge: "luogo" },
    ],
  },
  {
    key: "listen_moment",
    eyebrow: "Abitudini",
    question: "Quando ascolti di solito?",
    hint: "Ci aiuta a suggerire la durata giusta delle puntate.",
    multi: false,
    options: [
      { value: "La mattina", badge: "radio" },
      { value: "In pausa pranzo", badge: "cuffie" },
      { value: "La sera", badge: "podcast-mic" },
      { value: "Nel weekend", badge: "calendario" },
    ],
  },
  {
    key: "formats",
    eyebrow: "Formati",
    question: "Cosa vuoi trovare in primo piano?",
    hint: "Puoi selezionare più formati.",
    multi: true,
    options: [
      { value: "Podcast", badge: "podcast-mic" },
      { value: "Radio in diretta", badge: "radio" },
      { value: "Notizie", badge: "news" },
      { value: "Eventi", badge: "biglietto" },
    ],
  },
  {
    key: "goal",
    eyebrow: "Obiettivo",
    question: "Cosa vuoi ottenere da IMLAND?",
    hint: "Una sola risposta, la più vera per te.",
    multi: false,
    options: [
      { value: "Scoprire il territorio", badge: "luogo" },
      { value: "Restare aggiornato", badge: "news" },
      { value: "Fare rete", badge: "community" },
      { value: "Promuovere la mia attività", badge: "aziende" },
    ],
  },
  {
    key: "notify",
    eyebrow: "Notifiche",
    question: "Vuoi essere avvisato sulle nuove puntate?",
    hint: "Potrai cambiare idea in qualsiasi momento.",
    multi: false,
    options: [
      { value: "Sì, avvisami", badge: "annuncio" },
      { value: "No, guardo io", badge: "profilo" },
    ],
  },
];

/**
 * Domande di benvenuto: overlay full-screen usato sia dalla route /benvenuto
 * sia come gate globale subito dopo il primo accesso (mobile e desktop).
 */
export function OnboardingWizard({ onDone }: { onDone: (accountType: string) => void }) {
  const { user } = useAuth();
  const { save } = usePreferences();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => {
    const type = (user?.user_metadata as { account_type?: string } | undefined)?.account_type;
    const initial: Record<string, string[]> = {};
    if (type) initial.account_type = [type];
    return initial;
  });

  // Blocca lo scroll della pagina sotto l'overlay (importante su iOS e Android).
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const step = STEPS[index]!;
  const selected = answers[step.key] ?? [];
  const isLast = index === STEPS.length - 1;
  const progress = useMemo(() => Math.round(((index + 1) / STEPS.length) * 100), [index]);

  const pick = (value: string) => {
    setAnswers((prev) => {
      const current = prev[step.key] ?? [];
      if (step.multi) {
        return {
          ...prev,
          [step.key]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [step.key]: [value] };
    });
    if (!step.multi && !isLast) window.setTimeout(() => setIndex((i) => i + 1), 220);
  };

  const finish = async () => {
    const accountType = answers.account_type?.[0] ?? "ascoltatore";
    try {
      await save.mutateAsync({
        account_type: accountType,
        topics: answers.topics ?? [],
        provinces: answers.provinces ?? [],
        listen_moment: answers.listen_moment?.[0] ?? null,
        formats: answers.formats ?? [],
        goal: answers.goal?.[0] ?? null,
        notify_new_episodes: (answers.notify?.[0] ?? "Sì, avvisami").startsWith("Sì"),
        completed_at: new Date().toISOString(),
      });
    } catch (err) {
      notifyError(err, {
        fallback: "Non abbiamo potuto salvare le tue preferenze.",
        retry: () => void finish(),
      });

      return;
    }
    onDone(accountType);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Domande di benvenuto"
      className="fixed inset-0 z-[80] flex h-dvh flex-col overflow-y-auto overscroll-contain bg-background"
    >
      <div className="h-1 w-full bg-muted">
        <div className="h-full bg-signal transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">
            {step.eyebrow} · {index + 1} di {STEPS.length}
          </p>
          <h1 className="mx-auto mt-3 max-w-xl text-display-s">{step.question}</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">{step.hint}</p>

          <div
            className={`mx-auto mt-8 grid gap-3 ${
              step.options.length > 4 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2"
            }`}
          >
            {step.options.map((option) => {
              const active = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => pick(option.value)}
                  className={`flex flex-col items-center gap-2 sm:gap-3 rounded-3xl border px-3 py-4 text-center sm:px-4 sm:py-6 transition-colors ${
                    active ? "border-signal bg-signal/5" : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <BadgeIcon name={option.badge} alt="" className="h-12 w-12 sm:h-16 sm:w-16" />
                  <span className="text-sm font-semibold">{option.label ?? option.value}</span>
                  {active && <Check className="h-4 w-4 text-signal" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pb-[env(safe-area-inset-bottom)] sm:mt-10">
            {index > 0 && (
              <button
                type="button"
                onClick={() => setIndex((i) => i - 1)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" /> Indietro
              </button>
            )}
            {isLast ? (
              <button
                type="button"
                disabled={save.isPending}
                onClick={() => void finish()}
                className="inline-flex items-center gap-2 rounded-full bg-signal px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-60"
              >
                INIZIAMO <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={selected.length === 0}
                onClick={() => setIndex((i) => i + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
              >
                Continua <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

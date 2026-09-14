import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SectionDecor } from "../components/decor";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { describeError } from "@/lib/errors";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeIcon } from "@/components/badge-icon";

export const Route = createFileRoute("/accedi")({
  ssr: false,
  validateSearch: (
    search: Record<string, unknown>,
  ): { motivo?: string; ref?: string; tipo?: "ascoltatore" | "azienda" } => ({
    motivo: typeof search.motivo === "string" ? search.motivo : undefined,
    ref: typeof search.ref === "string" ? search.ref : undefined,
    tipo: search.tipo === "azienda" ? "azienda" : search.tipo === "ascoltatore" ? "ascoltatore" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Accedi all'Area Membri — IMLAND EXPERIENCE" },
      {
        name: "description",
        content:
          "Entra nell'Area Membri IMLAND: vantaggi, anticipazioni, eventi riservati e contenuti esclusivi per la community del territorio.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Accedi all'Area Membri — IMLAND EXPERIENCE" },
      { property: "og:description", content: "Vantaggi, anticipazioni ed eventi riservati ai Member IMLAND." },
    ],
    links: [{ rel: "canonical", href: "/accedi" }],
  }),
  component: AccediPage,
});

const signupSchema = z
  .object({
    first_name: z.string().trim().min(2, "Inserisci il tuo nome").max(60),
    last_name: z.string().trim().min(2, "Inserisci il tuo cognome").max(60),
    email: z.string().trim().email("Email non valida").max(255),
    password: z.string().min(8, "La password deve avere almeno 8 caratteri").max(72),
    confirm_password: z.string().min(1, "Conferma la password"),
    privacy_accepted: z.boolean().refine((v) => v === true, "Devi accettare Termini e Privacy"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Le password non coincidono",
    path: ["confirm_password"],
  });

const loginSchema = z.object({
  email: z.string().trim().email("Email non valida").max(255),
  password: z.string().min(1, "Inserisci la password").max(72),
});

const resetSchema = z.object({
  email: z.string().trim().email("Email non valida").max(255),
});

function AccediPage() {
  const navigate = useNavigate();
  const { motivo, ref: refParam, tipo } = Route.useSearch();
  const membershipDenied = motivo === "membership";
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [accountType, setAccountType] = useState<"ascoltatore" | "azienda">(tipo ?? "ascoltatore");
  const isBusiness = accountType === "azienda";
  const destination = isBusiness ? "/area-aziende" : "/ascoltatore";
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [ref, setRef] = useState("");

  useEffect(() => {
    if (refParam) {
      setRef(refParam);
      setMode("signup");
    }
  }, [refParam]);

  useEffect(() => {
    // Con membership negata non rimbalzare di nuovo verso /area
    if (!loading && session && !membershipDenied) navigate({ to: destination });
  }, [loading, session, membershipDenied, destination, navigate]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse({ ...form, privacy_accepted: privacyAccepted });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]!.message);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}${destination}`,
            data: {
              first_name: parsed.data.first_name,
              last_name: parsed.data.last_name,
              referral_code: ref || undefined,
              account_type: accountType,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Registrazione completata. Benvenuto in IMLAND.");
          navigate({ to: destination });
        } else {
          toast.success("Controlla la tua email per confermare l'account.");
          setMode("login");
        }
      } else if (mode === "reset") {
        const parsed = resetSchema.safeParse({ email: form.email });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]!.message);
          return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
          redirectTo: `${window.location.origin}/aggiorna-password`,
        });
        if (error) throw error;
        toast.success("Ti abbiamo inviato un'email per reimpostare la password.");
        setMode("login");
      } else {
        const parsed = loginSchema.safeParse({ email: form.email, password: form.password });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]!.message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        navigate({ to: destination });
      }
    } catch (err) {
      toast.error(describeError(err, "Operazione non riuscita."));
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Accesso con Google non riuscito.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: destination });
  };

  return (
    <section className="section-atmosphere decor-host overflow-hidden">
      <SectionDecor variant="default" />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 section-pad md:grid-cols-2 md:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            {isBusiness ? "Area Aziende" : "Area Membri"}
          </span>
          <h1 className="mt-6 text-display-l">
            {isBusiness ? (
              <>
                Entra nell'area <span className="font-semibold text-primary">aziende</span>.
                <br />
                Materiali, loghi e il tuo referente.
              </>
            ) : (
              <>
                Entra nella <span className="font-semibold text-primary">community</span>.
                <br />
                Vantaggi, anticipazioni ed eventi riservati.
              </>
            )}
          </h1>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            {isBusiness ? (
              <>
                <li>Loghi e materiali ufficiali scaricabili.</li>
                <li>Contatti diretti del tuo referente IMLAND.</li>
                <li>Stato delle attività e dei contenuti pubblicati.</li>
                <li>Richieste di modifica gestite in giornata.</li>
              </>
            ) : (
              <>
                <li>Anticipazioni prima della pubblicazione pubblica.</li>
                <li>Convenzioni e sconti nelle attività del territorio.</li>
                <li>Eventi riservati, posti VIP e prenotazioni anticipate.</li>
                <li>Member Card digitale con QR Code personale.</li>
              </>
            )}
          </ul>
          {isBusiness && (
            <Link
              to="/member"
              className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-primary"
            >
              Scopri Member
            </Link>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <fieldset className="mb-6">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Come vuoi entrare?
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  {
                    value: "ascoltatore",
                    label: "Persona",
                    desc: "Ascolta, salva e riprendi le puntate",
                    badge: "account" as const,
                    badgeAlt: "Bollino persona",

                  },
                  {
                    value: "azienda",
                    label: "Membro",
                    desc: "Area riservata ai Membri",
                    badge: "partner" as const,
                    badgeAlt: "Bollino Membro",
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={accountType === opt.value}
                  onClick={() => setAccountType(opt.value)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    accountType === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <BadgeIcon
                    name={opt.badge}
                    alt={opt.badgeAlt}
                    className="h-10 w-10"
                    eager
                  />
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold">{opt.label}</span>
                    <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </fieldset>

          {membershipDenied && (
            <div className="mb-6 rounded-2xl border border-border bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Membership non attiva.</p>
              <p className="mt-1">
                Il tuo account non ha ancora una membership attiva. Se hai appena richiesto
                l'attivazione, riprova più tardi o contattaci.
              </p>
            </div>
          )}
          {mode !== "reset" && (
            <div className="mb-6 flex gap-2 rounded-full bg-muted p-1">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {m === "login" ? "Accedi" : "Registrati"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">Nome</Label>
                  <Input id="first_name" maxLength={60} value={form.first_name} onChange={update("first_name")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Cognome</Label>
                  <Input id="last_name" maxLength={60} value={form.last_name} onChange={update("last_name")} />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" maxLength={255} value={form.email} onChange={update("email")} />
            </div>
            {mode !== "reset" && (
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  maxLength={72}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={form.password}
                  onChange={update("password")}
                />
              </div>
            )}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="confirm_password">Conferma password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  maxLength={72}
                  autoComplete="new-password"
                  value={form.confirm_password}
                  onChange={update("confirm_password")}
                />
              </div>
            )}
            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="text-xs text-muted-foreground underline hover:text-foreground"
                >
                  Password dimenticata?
                </button>
              </div>
            )}
            {mode === "signup" && (
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(c) => setPrivacyAccepted(Boolean(c))}
                  className="mt-0.5"
                />
                <Label htmlFor="privacy" className="text-xs font-normal leading-relaxed text-muted-foreground">
                  Accetto i{" "}
                  <Link to="/termini" className="underline">
                    Termini di servizio
                  </Link>{" "}
                  e la{" "}
                  <Link to="/privacy" className="underline">
                    Privacy Policy
                  </Link>{" "}
                  e autorizzo il trattamento dei dati personali.
                </Label>
              </div>
            )}
            {ref && (
              <p className="text-xs text-muted-foreground">
                Stai usando l'invito <span className="font-medium text-foreground">{ref}</span>.
              </p>
            )}
            <Button type="submit" disabled={busy} className="w-full rounded-full">
              {mode === "login"
                ? "Accedi"
                : mode === "reset"
                ? "Invia email di reset"
                : "Crea il mio account Member"}
            </Button>
            {mode === "reset" && (
              <button
                type="button"
                onClick={() => setMode("login")}
                className="block w-full text-center text-xs text-muted-foreground underline hover:text-foreground"
              >
                Torna al login
              </button>
            )}
          </form>

          {mode !== "reset" && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                oppure
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={onGoogle}
                className="w-full rounded-full"
              >
                Continua con Google
              </Button>

              <p className="mt-5 text-xs text-muted-foreground">
                Registrandoti con Google accetti i{" "}
                <Link to="/termini" className="underline">
                  Termini
                </Link>{" "}
                e la{" "}
                <Link to="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/aggiorna-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reimposta password — IMLAND EXPERIENCE" },
      { name: "description", content: "Imposta una nuova password per il tuo account IMLAND." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/aggiorna-password" }],
  }),
  component: AggiornaPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, "La password deve avere almeno 8 caratteri").max(72),
    confirm: z.string().min(1, "Conferma la password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Le password non coincidono",
    path: ["confirm"],
  });

function AggiornaPasswordPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
      setError("Link di recupero non valido o scaduto.");
      return;
    }
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error: exchangeError }) => {
        if (exchangeError) {
          setError("Link di recupero non valido o scaduto.");
        }
      })
      .catch(() => setError("Link di recupero non valido o scaduto."));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    toast.success("Password aggiornata. Accedi con le nuove credenziali.");
    navigate({ to: "/accedi" });
  };

  return (
    <section className="section-atmosphere overflow-hidden">
      <div className="mx-auto max-w-md px-4 section-pad">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h1 className="text-display-s">Nuova password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Scegli una password sicura di almeno 8 caratteri.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
              <div className="mt-2">
                <Link to="/accedi" className="underline">
                  Torna al login
                </Link>
              </div>
            </div>
          )}

          {!error && (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Nuova password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Conferma password</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full rounded-full">
                Salva password
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

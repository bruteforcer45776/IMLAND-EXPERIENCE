import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AreaShell } from "@/components/member/area-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { exportMyData, deleteMyAccount } from "@/lib/account.functions";
import { INTERESTS, PROVINCES, formatDate } from "@/lib/member-area";


export const Route = createFileRoute("/_authenticated/area/profilo")({
  head: () => ({
    meta: [
      { title: "Profilo Member — IMLAND EXPERIENCE" },
      { name: "description", content: "Gestisci dati, città, interessi e preferenze di notifica del tuo profilo Member." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfiloPage,
});

const schema = z.object({
  first_name: z.string().trim().min(2, "Nome troppo corto").max(60),
  last_name: z.string().trim().min(2, "Cognome troppo corto").max(60),
  city: z.string().trim().max(80),
  province: z.string().trim().max(40),
  avatar_url: z.string().trim().max(500),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "La password deve avere almeno 8 caratteri").max(72),
    confirm: z.string().min(1, "Conferma la password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Le password non coincidono",
    path: ["confirm"],
  });

function ProfiloPage() {
  const { profile, user, refresh, signOut } = useAuth();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    city: "",
    province: "",
    avatar_url: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [pwdForm, setPwdForm] = useState({ password: "", confirm: "" });

  useEffect(() => {
    if (!profile) return;
    setForm({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      city: profile.city ?? "",
      province: profile.province ?? "",
      avatar_url: profile.avatar_url ?? "",
    });
    setInterests(profile.interests ?? []);
    setNotifyInApp(profile.notify_in_app);
    setNotifyEmail(profile.notify_email);
  }, [profile]);

  const save = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Devi accedere");
      const parsed = schema.safeParse(form);
      if (!parsed.success) throw new Error(parsed.error.issues[0]!.message);
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: parsed.data.first_name,
          last_name: parsed.data.last_name,
          city: parsed.data.city || null,
          province: parsed.data.province || null,
          avatar_url: parsed.data.avatar_url || null,
          interests,
          notify_in_app: notifyInApp,
          notify_email: notifyEmail,
        })
        .eq("id", user.id);
      if (error) throw error;
      await refresh();
    },
    onSuccess: () => toast.success("Profilo aggiornato."),
    onError: (err) => toast.error(err instanceof Error ? err.message : "Salvataggio non riuscito"),
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      const parsed = passwordSchema.safeParse(pwdForm);
      if (!parsed.success) throw new Error(parsed.error.issues[0]!.message);
      const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
      if (error) throw error;
    },
    onSuccess: () => {
      setPwdForm({ password: "", confirm: "" });
      toast.success("Password aggiornata.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Aggiornamento non riuscito"),
  });

  const runExport = useServerFn(exportMyData);
  const runDelete = useServerFn(deleteMyAccount);

  const exportData = useMutation({
    mutationFn: async () => runExport({ data: {} as never }),
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `imland-dati-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Esportazione completata.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Esportazione non riuscita"),
  });

  const deleteAccount = useMutation({
    mutationFn: async () => runDelete({ data: { confirm: deleteConfirm } }),
    onSuccess: async () => {
      toast.success("Account eliminato.");
      await signOut();
      navigate({ to: "/" });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Eliminazione non riuscita"),
  });



  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <AreaShell title="Profilo." lead="Dati personali, città, interessi e preferenze di notifica.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">Nome</Label>
              <Input id="first_name" maxLength={60} value={form.first_name} onChange={update("first_name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last_name">Cognome</Label>
              <Input id="last_name" maxLength={60} value={form.last_name} onChange={update("last_name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">Città</Label>
              <Input id="city" maxLength={80} value={form.city} onChange={update("city")} />
            </div>
            <div className="space-y-1.5">
              <Label>Provincia</Label>
              <div className="flex flex-wrap gap-2">
                {PROVINCES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, province: f.province === p ? "" : p }))}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      form.province === p
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="avatar_url">Foto profilo (URL)</Label>
              <Input id="avatar_url" maxLength={500} value={form.avatar_url} onChange={update("avatar_url")} />
            </div>
          </div>

          <div className="mt-6">
            <Label>Interessi</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
                  }
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    interests.includes(i)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/50 p-4">
              <div>
                <p className="text-sm font-medium">Notifiche nell'area</p>
                <p className="text-xs text-muted-foreground">Novità su vantaggi, eventi e contenuti.</p>
              </div>
              <Switch checked={notifyInApp} onCheckedChange={setNotifyInApp} />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/50 p-4">
              <div>
                <p className="text-sm font-medium">Notifiche email</p>
                <p className="text-xs text-muted-foreground">Riepiloghi e comunicazioni importanti.</p>
              </div>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>
          </div>

          <Button className="mt-6 rounded-full" disabled={save.isPending} onClick={() => save.mutate()}>
            Salva modifiche
          </Button>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-h3-im">Iscrizione.</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">ID Member</dt>
                <dd className="font-medium">{profile?.member_id ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Stato</dt>
                <dd className="font-medium capitalize">{profile?.membership_status ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Member dal</dt>
                <dd className="font-medium">{formatDate(profile?.member_since)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium break-all">{profile?.email ?? user?.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Codice invito</dt>
                <dd className="font-medium">{profile?.referral_code ?? "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-h3-im">Sicurezza.</h2>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">Nuova password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={pwdForm.password}
                  onChange={(e) => setPwdForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Conferma password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={pwdForm.confirm}
                  onChange={(e) => setPwdForm((f) => ({ ...f, confirm: e.target.value }))}
                />
              </div>
              <Button
                className="w-full rounded-full"
                disabled={changePassword.isPending}
                onClick={() => changePassword.mutate()}
              >
                Aggiorna password
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-h3-im">Privacy e dati.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Scarica una copia dei tuoi dati oppure richiedi l'eliminazione definitiva dell'account.
            </p>
            <div className="mt-4 space-y-4">
              <Button
                variant="outline"
                className="w-full rounded-full"
                disabled={exportData.isPending}
                onClick={() => exportData.mutate()}
              >
                Esporta i miei dati (JSON)
              </Button>

              <div className="space-y-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-sm font-medium text-destructive">Elimina account</p>
                <p className="text-xs text-muted-foreground">
                  Operazione irreversibile: profilo, prenotazioni, preferiti e codici verranno rimossi.
                  Scrivi <strong>ELIMINA</strong> per confermare.
                </p>
                <Input
                  aria-label="Conferma eliminazione"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value.toUpperCase())}
                  placeholder="ELIMINA"
                />
                <Button
                  variant="destructive"
                  className="w-full rounded-full"
                  disabled={deleteConfirm !== "ELIMINA" || deleteAccount.isPending}
                  onClick={() => deleteAccount.mutate()}
                >
                  Elimina definitivamente
                </Button>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </AreaShell>
  );
}

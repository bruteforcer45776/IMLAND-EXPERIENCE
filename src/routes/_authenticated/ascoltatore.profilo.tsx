import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { BentoCard, BentoGrid } from "@/components/bento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { usePreferences } from "@/hooks/use-preferences";
import { useFavorites } from "@/hooks/use-favorites";
import { useCollections, useFollows, useShares } from "@/hooks/use-listener";
import { deleteMyAccount, exportMyData } from "@/lib/account.functions";
import { INTERESTS, PROVINCES } from "@/lib/member-area";
import { notifyError } from "@/lib/errors";

export const Route = createFileRoute("/_authenticated/ascoltatore/profilo")({
  head: () => ({
    meta: [
      { title: "Profilo — Area Persona IMLAND" },
      {
        name: "description",
        content: "Gestisci i tuoi dati, gli interessi, le notifiche e la privacy della tua area personale.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfiloPersonaPage,
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
  .refine((d) => d.password === d.confirm, { message: "Le password non coincidono", path: ["confirm"] });

function ProfiloPersonaPage() {
  const { profile, user, refresh, signOut } = useAuth();
  const { preferences, save: savePreferences } = usePreferences();
  const { favorites } = useFavorites();
  const { collections } = useCollections();
  const { follows } = useFollows();
  const { shares, totalClicks } = useShares();
  const navigate = useNavigate();

  const [form, setForm] = useState({ first_name: "", last_name: "", city: "", province: "", avatar_url: "" });
  const [interests, setInterests] = useState<string[]>([]);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyEpisodes, setNotifyEpisodes] = useState(true);
  const [pwdForm, setPwdForm] = useState({ password: "", confirm: "" });
  const [deleteConfirm, setDeleteConfirm] = useState("");

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

  useEffect(() => {
    if (!preferences) return;
    setNotifyEpisodes(preferences.notify_new_episodes);
    if (preferences.topics?.length) setInterests((prev) => (prev.length ? prev : preferences.topics));
  }, [preferences]);

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
      await savePreferences.mutateAsync({ topics: interests, notify_new_episodes: notifyEpisodes });
      await refresh();
    },
    onSuccess: () => toast.success("Profilo aggiornato."),
    onError: (err) => notifyError(err, { fallback: "Salvataggio non riuscito", retry: () => save.mutate() }),
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
    onError: (err) => notifyError(err, { fallback: "Aggiornamento non riuscito" }),
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
    onError: (err) => notifyError(err, { fallback: "Esportazione non riuscita" }),
  });

  const deleteAccount = useMutation({
    mutationFn: async () => runDelete({ data: { confirm: deleteConfirm } }),
    onSuccess: async () => {
      toast.success("Account eliminato.");
      await signOut();
      void navigate({ to: "/", replace: true });
    },
    onError: (err) => notifyError(err, { fallback: "Eliminazione non riuscita" }),
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const initials = `${form.first_name.charAt(0)}${form.last_name.charAt(0)}`.trim().toUpperCase();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-signal">Profilo</p>
      <h1 className="mt-2 text-display-s">La tua area personale.</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Aggiorna i tuoi dati, scegli gli interessi e decidi come vuoi essere avvisato.
      </p>

      <BentoGrid className="mt-8">
        <BentoCard tone="podcast" span={3}>
          <div className="flex items-center gap-4">
            {form.avatar_url ? (
              <img
                src={form.avatar_url}
                alt=""
                className="h-14 w-14 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="grid h-14 w-14 place-items-center rounded-full bg-signal text-base font-bold text-white">
                {initials || "IM"}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-title-m">
                {[form.first_name, form.last_name].filter(Boolean).join(" ") || "Persona IMLAND"}
              </h2>
              <p className="truncate text-[13px] text-muted-foreground">{profile?.email ?? user?.email ?? "—"}</p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
            {[
              { label: "Preferiti", value: favorites.length },
              { label: "Raccolte", value: collections.length },
              { label: "Canali seguiti", value: follows.length },
              { label: "Condivisioni", value: `${shares.length} · ${totalClicks} raggiunte` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-card px-3 py-2">
                <dt className="text-muted-foreground">{stat.label}</dt>
                <dd className="mt-0.5 font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </BentoCard>
      </BentoGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-title-l">Dati personali</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                    aria-pressed={form.province === p}
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
                  aria-pressed={interests.includes(i)}
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
            {[
              {
                title: "Nuove puntate",
                desc: "Avvisi quando esce una puntata dei canali che segui.",
                checked: notifyEpisodes,
                set: setNotifyEpisodes,
              },
              {
                title: "Notifiche nell'area",
                desc: "Novità su contenuti, eventi e iniziative.",
                checked: notifyInApp,
                set: setNotifyInApp,
              },
              {
                title: "Notifiche email",
                desc: "Riepiloghi e comunicazioni importanti.",
                checked: notifyEmail,
                set: setNotifyEmail,
              },
            ].map((row) => (
              <div
                key={row.title}
                className="flex items-center justify-between gap-4 rounded-2xl bg-muted/50 p-4"
              >
                <div>
                  <p className="text-sm font-medium">{row.title}</p>
                  <p className="text-xs text-muted-foreground">{row.desc}</p>
                </div>
                <Switch checked={row.checked} onCheckedChange={row.set} />
              </div>
            ))}
          </div>

          <Button className="mt-6 rounded-full" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? "Salvataggio…" : "Salva modifiche"}
          </Button>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-title-m">Password</h2>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="password">Nuova password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={pwdForm.password}
                  onChange={(e) => setPwdForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Conferma password</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={pwdForm.confirm}
                  onChange={(e) => setPwdForm((f) => ({ ...f, confirm: e.target.value }))}
                />
              </div>
              <Button
                variant="outline"
                className="w-full rounded-full"
                disabled={changePassword.isPending}
                onClick={() => changePassword.mutate()}
              >
                {changePassword.isPending ? "Aggiornamento…" : "Aggiorna password"}
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-title-m">Privacy</h2>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Scarica i tuoi dati o elimina definitivamente l'account.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full rounded-full"
              disabled={exportData.isPending}
              onClick={() => exportData.mutate()}
            >
              {exportData.isPending ? "Esportazione…" : "Esporta i miei dati"}
            </Button>
            <div className="mt-5 space-y-2">
              <Label htmlFor="delete-confirm">Scrivi ELIMINA per confermare</Label>
              <Input
                id="delete-confirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="ELIMINA"
              />
              <Button
                variant="destructive"
                className="w-full rounded-full"
                disabled={deleteConfirm !== "ELIMINA" || deleteAccount.isPending}
                onClick={() => deleteAccount.mutate()}
              >
                {deleteAccount.isPending ? "Eliminazione…" : "Elimina account"}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

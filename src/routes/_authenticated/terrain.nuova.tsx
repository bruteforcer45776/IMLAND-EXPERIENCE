import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { BentoGrid, BentoCard } from "../../components/bento";
import { useCreatePlace, useGeolocation, useMyPlaces } from "@/hooks/use-hub";
import {
  HUB_COMUNI,
  HUB_PROVINCES,
  HUB_STATUS_LABEL,
  TERRAIN_CATEGORIES,
  formatHubDate,
} from "@/lib/hub";

export const Route = createFileRoute("/_authenticated/terrain/nuova")({
  head: () => ({
    meta: [
      { title: "Proponi una scheda del territorio — TERRAIN" },
      {
        name: "description",
        content:
          "Proponi un'attività, un'associazione o un luogo del territorio: la redazione IMLAND verifica i dati prima della pubblicazione su TERRAIN.",
      },
      { property: "og:title", content: "Proponi una scheda del territorio — TERRAIN" },
      { property: "og:description", content: "Tutto il territorio, vicino a te." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewPlace,
});

function NewPlace() {
  const navigate = useNavigate();
  const create = useCreatePlace();
  const mine = useMyPlaces();
  const geo = useGeolocation();

  const [form, setForm] = useState({
    name: "",
    category: "",
    comune: "",
    province: "",
    address: "",
    description: "",
    phone: "",
    email: "",
    website: "",
  });

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category || !form.comune) {
      toast.error("Nome, categoria e Comune sono obbligatori.");
      return;
    }
    create.mutate(
      {
        name: form.name.trim(),
        category: form.category,
        comune: form.comune,
        province: form.province || null,
        address: form.address.trim() || null,
        description: form.description.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        website: form.website.trim() || null,
        latitude: geo.coords?.lat ?? null,
        longitude: geo.coords?.lon ?? null,
      },
      {
        onSuccess: () => {
          toast.success("Scheda inviata. La redazione la verifica prima della pubblicazione.");
          setForm({
            name: "",
            category: "",
            comune: "",
            province: "",
            address: "",
            description: "",
            phone: "",
            email: "",
            website: "",
          });
          void navigate({ to: "/terrain/nuova" });
        },
      },
    );
  };

  return (
    <div className="container-im section-pad-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        TERRAIN
      </p>
      <h1 className="mt-2 text-h1-im">Proponi una scheda.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Racconta un'attività, un'associazione o un luogo che merita di essere trovato.
        <br />
        La redazione verifica i dati e poi la scheda entra nella mappa del territorio.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Nome *</span>
          <input
            value={form.name}
            onChange={set("name")}
            maxLength={120}
            required
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Categoria *</span>
          <select
            value={form.category}
            onChange={set("category")}
            required
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
          >
            <option value="">Scegli una categoria</option>
            {TERRAIN_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Comune *</span>
          <select
            value={form.comune}
            onChange={set("comune")}
            required
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
          >
            <option value="">Scegli il Comune</option>
            {HUB_COMUNI.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Provincia</span>
          <select
            value={form.province}
            onChange={set("province")}
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
          >
            <option value="">—</option>
            {HUB_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Indirizzo</span>
          <input
            value={form.address}
            onChange={set("address")}
            maxLength={200}
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Descrizione</span>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={5}
            maxLength={3000}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Telefono</span>
          <input
            value={form.phone}
            onChange={set("phone")}
            maxLength={40}
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            maxLength={255}
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
          />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Sito web</span>
          <input
            value={form.website}
            onChange={set("website")}
            maxLength={300}
            placeholder="https://"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
          />
        </label>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={geo.request}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium"
          >
            {geo.coords
              ? "Posizione registrata"
              : geo.loading
                ? "Cerco la posizione…"
                : "Usa la posizione attuale"}
          </button>
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {create.isPending ? "Invio…" : "Invia la scheda"}
          </button>
        </div>
      </form>

      <h2 className="mt-14 text-h3-im">Le tue schede</h2>
      {mine.isLoading ? (
        <p className="mt-3 text-sm text-muted-foreground">Carico le tue schede…</p>
      ) : (mine.data ?? []).length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Non hai ancora proposto nessuna scheda.
          <br />
          Quando la redazione approva una scheda la trovi pubblicata su TERRAIN.
        </p>
      ) : (
        <BentoGrid className="mt-6">
          {(mine.data ?? []).map((place) => (
            <BentoCard key={place.id} tone="terrain" span={2}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {place.category}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{place.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {HUB_STATUS_LABEL[place.status] ?? place.status} · inviata il{" "}
                {formatHubDate(place.created_at)}
              </p>
              {place.status === "published" && (
                <Link
                  to="/terrain/$slug"
                  params={{ slug: place.slug }}
                  className="mt-3 inline-flex text-sm underline"
                >
                  Vedi la scheda pubblica
                </Link>
              )}
              {place.moderation_note && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Nota della redazione: {place.moderation_note}
                </p>
              )}
            </BentoCard>
          ))}
        </BentoGrid>
      )}
    </div>
  );
}

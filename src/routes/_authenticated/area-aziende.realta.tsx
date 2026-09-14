import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { BusinessShell } from "@/components/member/business-shell";
import { BentoCard, BentoGrid } from "@/components/bento";
import {
  useCreateOrganization,
  useMyOrganizations,
  useRequestVerification,
  useUpdateOrganization,
} from "@/hooks/use-organizations";
import { ORG_KINDS, ORG_ROLE_LABEL, ORG_STATUS_LABEL, canPublish, type OrgKind } from "@/lib/org";
import { HUB_PROVINCES } from "@/lib/hub";

export const Route = createFileRoute("/_authenticated/area-aziende/realta")({
  head: () => ({
    meta: [
      { title: "La tua realtà — Area Aziende IMLAND" },
      {
        name: "description",
        content: "Dati, contatti e verifica della tua attività dentro l'Hub IMLAND.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrgPage,
});

const inputClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary";

function OrgPage() {
  const orgs = useMyOrganizations();
  const list = orgs.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const current = list.find((o) => o.id === selectedId) ?? list[0] ?? null;

  return (
    <BusinessShell
      title="La tua realtà"
      lead="Un'attività esiste una sola volta: schede, opportunità ed eventi si collegano a questa identità."
    >
      {orgs.isLoading ? (
        <p className="text-muted-foreground">Caricamento…</p>
      ) : list.length === 0 ? (
        <CreateOrgForm />
      ) : (
        <div className="flex flex-col gap-6">
          {list.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {list.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedId(o.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium ${
                    current?.id === o.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {o.name}
                </button>
              ))}
            </div>
          )}
          {current && <OrgDetail org={current} />}
        </div>
      )}
    </BusinessShell>
  );
}

function OrgDetail({
  org,
}: {
  org: NonNullable<ReturnType<typeof useMyOrganizations>["data"]>[number];
}) {
  const update = useUpdateOrganization(org.id);
  const verification = useRequestVerification(org.id);
  const [form, setForm] = useState({
    contact_name: org.contact_name ?? "",
    contact_email: org.contact_email ?? "",
    contact_phone: org.contact_phone ?? "",
    comune: org.comune ?? "",
    province: org.province ?? "",
    address: org.address ?? "",
    website: org.website ?? "",
    description: org.description ?? "",
  });
  const [note, setNote] = useState("");

  const requests = verification.list.data ?? [];
  const pending = requests.some((r) => r.outcome === "pending");

  return (
    <BentoGrid>
      <BentoCard tone="aziende" span={4}>
        <h2 className="text-h3-im">{org.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ruolo: {ORG_ROLE_LABEL[org.role]} · Stato: {ORG_STATUS_LABEL[org.status]}
        </p>
        {!canPublish(org) && (
          <p className="mt-3 rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
            Finché la verifica non è completata puoi preparare i contenuti, ma la pubblicazione
            resta in attesa della redazione.
          </p>
        )}

        <form
          className="mt-5 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            update.mutate(
              {
                contact_name: form.contact_name || null,
                contact_email: form.contact_email || null,
                contact_phone: form.contact_phone || null,
                comune: form.comune || null,
                province: form.province || null,
                address: form.address || null,
                website: form.website || null,
                description: form.description || null,
              },
              { onSuccess: () => toast.success("Dati aggiornati.") },
            );
          }}
        >
          <Field label="Referente">
            <input
              className={inputClass}
              value={form.contact_name}
              onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
            />
          </Field>
          <Field label="Email di contatto">
            <input
              type="email"
              className={inputClass}
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
            />
          </Field>
          <Field label="Telefono">
            <input
              className={inputClass}
              value={form.contact_phone}
              onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
            />
          </Field>
          <Field label="Sito">
            <input
              className={inputClass}
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </Field>
          <Field label="Comune">
            <input
              className={inputClass}
              value={form.comune}
              onChange={(e) => setForm({ ...form, comune: e.target.value })}
            />
          </Field>
          <Field label="Provincia">
            <select
              className={inputClass}
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
            >
              <option value="">—</option>
              {HUB_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Indirizzo" full>
            <input
              className={inputClass}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Field>
          <Field label="Descrizione" full>
            <textarea
              rows={4}
              className={inputClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={update.isPending}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {update.isPending ? "Salvataggio…" : "Salva i dati"}
            </button>
          </div>
        </form>
      </BentoCard>

      <BentoCard tone="aziende" span={2}>
        <h2 className="text-h3-im">Verifica</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La verifica conferma che la realtà è reale e che chi la gestisce è autorizzato.
          <br />
          Puoi aggiungere una nota per la redazione.
        </p>
        {pending ? (
          <p className="mt-4 rounded-2xl bg-muted p-3 text-sm">
            Richiesta in valutazione. Ti avvisiamo appena è conclusa.
          </p>
        ) : (
          <form
            className="mt-4 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              verification.request.mutate(
                { note: note || null, documentPath: null },
                {
                  onSuccess: () => {
                    setNote("");
                    toast.success("Richiesta inviata alla redazione.");
                  },
                },
              );
            }}
          >
            <textarea
              rows={3}
              className={inputClass}
              placeholder="Nota per la redazione (facoltativa)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              type="submit"
              disabled={verification.request.isPending}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {verification.request.isPending ? "Invio…" : "Richiedi la verifica"}
            </button>
          </form>
        )}

        {requests.length > 0 && (
          <ul className="mt-5 space-y-2 text-sm">
            {requests.map((r) => (
              <li key={r.id} className="rounded-2xl border border-border p-3">
                <p className="font-semibold">
                  {r.outcome === "pending"
                    ? "In valutazione"
                    : r.outcome === "approved"
                      ? "Approvata"
                      : r.outcome === "rejected"
                        ? "Non approvata"
                        : "Servono altre informazioni"}
                </p>
                {r.review_note && <p className="mt-1 text-muted-foreground">{r.review_note}</p>}
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
    </BentoGrid>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function CreateOrgForm() {
  const create = useCreateOrganization();
  const [form, setForm] = useState({
    name: "",
    kind: "azienda" as OrgKind,
    vatNumber: "",
    comune: "",
    province: "",
    contactEmail: "",
    description: "",
  });

  return (
    <BentoGrid>
      <BentoCard tone="aziende" span={4}>
        <h2 className="text-h3-im">Registra la tua realtà</h2>
        <p className="mt-2 text-muted-foreground">
          Inserisci i dati una sola volta.
          <br />
          Da qui potrai gestire scheda, opportunità, eventi e risposte alle recensioni.
        </p>
        <form
          className="mt-5 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate(
              {
                name: form.name.trim(),
                kind: form.kind,
                vatNumber: form.vatNumber || null,
                taxCode: null,
                contactName: null,
                contactEmail: form.contactEmail || null,
                contactPhone: null,
                comune: form.comune || null,
                province: form.province || null,
                address: null,
                website: null,
                description: form.description || null,
              },
              { onSuccess: () => toast.success("Realtà registrata: la verifica è in corso.") },
            );
          }}
        >
          <Field label="Nome">
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Tipo">
            <select
              className={inputClass}
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value as OrgKind })}
            >
              {ORG_KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Partita IVA o codice fiscale">
            <input
              className={inputClass}
              value={form.vatNumber}
              onChange={(e) => setForm({ ...form, vatNumber: e.target.value })}
            />
          </Field>
          <Field label="Email di contatto">
            <input
              type="email"
              className={inputClass}
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            />
          </Field>
          <Field label="Comune">
            <input
              className={inputClass}
              value={form.comune}
              onChange={(e) => setForm({ ...form, comune: e.target.value })}
            />
          </Field>
          <Field label="Provincia">
            <select
              className={inputClass}
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
            >
              <option value="">—</option>
              {HUB_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Descrizione" full>
            <textarea
              rows={4}
              className={inputClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={create.isPending}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {create.isPending ? "Invio…" : "Registra la realtà"}
            </button>
          </div>
        </form>
      </BentoCard>
    </BentoGrid>
  );
}

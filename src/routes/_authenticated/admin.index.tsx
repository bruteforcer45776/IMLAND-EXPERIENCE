import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { AdminResource, type Field } from "@/components/member/admin-resource";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  BENEFIT_TYPES,
  DISCOVERY_CATEGORIES,
  EXCLUSIVE_TYPES,
  INTERESTS,
  NOTIF_TYPES,
  PREVIEW_TYPES,
  PROVINCES,
  formatDate,
} from "@/lib/member-area";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Pannello admin — IMLAND EXPERIENCE" },
      {
        name: "description",
        content: "Gestione contenuti, vantaggi, eventi e notifiche dell'Area Membri IMLAND.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const previewFields: Field[] = [
  { name: "title", label: "Titolo", kind: "text", required: true },
  { name: "content_type", label: "Tipo", kind: "select", options: PREVIEW_TYPES, required: true },
  { name: "excerpt", label: "Estratto", kind: "text" },
  { name: "body", label: "Testo", kind: "textarea" },
  { name: "cover_url", label: "Copertina (URL)", kind: "text" },
  { name: "media_url", label: "Media (URL)", kind: "text" },
  { name: "member_publish_at", label: "Pubblicazione Member", kind: "datetime", required: true },
  { name: "public_publish_at", label: "Pubblicazione pubblica", kind: "datetime" },
  { name: "is_published", label: "Pubblicato", kind: "bool" },
];

const benefitFields: Field[] = [
  { name: "business_name", label: "Attività", kind: "text", required: true },
  {
    name: "benefit_type",
    label: "Tipo vantaggio",
    kind: "select",
    options: BENEFIT_TYPES,
    required: true,
  },
  { name: "discount_percent", label: "Sconto %", kind: "number" },
  { name: "description", label: "Descrizione", kind: "textarea" },
  { name: "logo_url", label: "Logo (URL)", kind: "text" },
  { name: "city", label: "Città", kind: "text" },
  { name: "province", label: "Provincia", kind: "select", options: PROVINCES },
  { name: "address", label: "Indirizzo", kind: "text" },
  { name: "conditions", label: "Condizioni", kind: "textarea" },
  { name: "expires_at", label: "Scadenza", kind: "datetime" },
  { name: "is_published", label: "Pubblicato", kind: "bool" },
];

const eventFields: Field[] = [
  { name: "title", label: "Titolo", kind: "text", required: true },
  { name: "description", label: "Descrizione", kind: "textarea" },
  { name: "cover_url", label: "Copertina (URL)", kind: "text" },
  { name: "starts_at", label: "Inizio", kind: "datetime", required: true },
  { name: "ends_at", label: "Fine", kind: "datetime" },
  { name: "venue", label: "Luogo", kind: "text" },
  { name: "city", label: "Città", kind: "text" },
  { name: "province", label: "Provincia", kind: "select", options: PROVINCES },
  { name: "capacity", label: "Capienza totale", kind: "number" },
  { name: "member_seats", label: "Posti Member", kind: "number" },
  { name: "member_price", label: "Prezzo Member", kind: "number" },
  { name: "public_price", label: "Prezzo pubblico", kind: "number" },
  { name: "member_booking_opens_at", label: "Apertura prenotazioni Member", kind: "datetime" },
  { name: "public_booking_opens_at", label: "Apertura prenotazioni pubblico", kind: "datetime" },
  { name: "perks", label: "Perks (separati da virgola)", kind: "list" },
  { name: "member_only", label: "Solo Member", kind: "bool" },
  { name: "is_published", label: "Pubblicato", kind: "bool" },
];

const exclusiveFields: Field[] = [
  { name: "title", label: "Titolo", kind: "text", required: true },
  { name: "content_type", label: "Tipo", kind: "select", options: EXCLUSIVE_TYPES, required: true },
  { name: "description", label: "Descrizione", kind: "text" },
  { name: "body", label: "Testo", kind: "textarea" },
  { name: "cover_url", label: "Copertina (URL)", kind: "text" },
  { name: "media_url", label: "Media (URL)", kind: "text" },
  { name: "download_url", label: "Download (URL)", kind: "text" },
  { name: "publish_at", label: "Pubblicazione", kind: "datetime", required: true },
  { name: "is_published", label: "Pubblicato", kind: "bool" },
];

const discoveryFields: Field[] = [
  { name: "title", label: "Titolo", kind: "text", required: true },
  {
    name: "category",
    label: "Categoria",
    kind: "select",
    options: DISCOVERY_CATEGORIES,
    required: true,
  },
  { name: "description", label: "Descrizione", kind: "textarea" },
  { name: "image_url", label: "Immagine (URL)", kind: "text" },
  { name: "link_url", label: "Link", kind: "text" },
  { name: "city", label: "Città", kind: "text" },
  { name: "province", label: "Provincia", kind: "select", options: PROVINCES },
  { name: "is_published", label: "Pubblicato", kind: "bool" },
];

const notificationFields: Field[] = [
  { name: "title", label: "Titolo", kind: "text", required: true },
  { name: "notif_type", label: "Tipo", kind: "select", options: NOTIF_TYPES, required: true },
  { name: "body", label: "Testo", kind: "textarea" },
  { name: "link_url", label: "Link", kind: "text" },
  { name: "target_province", label: "Provincia target", kind: "select", options: PROVINCES },
  { name: "target_interest", label: "Interesse target", kind: "select", options: INTERESTS },
  { name: "is_important", label: "Importante", kind: "bool" },
];

const tabs = [
  { key: "previews", label: "Anticipazioni" },
  { key: "benefits", label: "Vantaggi" },
  { key: "events", label: "Eventi" },
  { key: "exclusives", label: "Contenuti esclusivi" },
  { key: "discoveries", label: "Scopri" },
  { key: "notifications", label: "Notifiche" },
  { key: "members", label: "Membri" },
] as const;

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("previews");

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 section-pad text-center text-muted-foreground">
        Caricamento…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 section-pad text-center">
        <h1 className="text-h1-im">Accesso riservato.</h1>
        <p className="mt-3 text-muted-foreground">
          Questa area è disponibile solo allo staff IMLAND.
        </p>
        <Link
          to="/area"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Torna all'Area Membri
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <header className="mb-6">
        <h1 className="text-h1-im">Pannello admin.</h1>
        <p className="mt-2 text-muted-foreground">
          Gestisci contenuti, vantaggi, eventi, notifiche e membri.
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <Link to="/area" className="inline-flex text-sm font-medium text-primary">
            Vai all'Area Membri
          </Link>
          <Link
            to="/admin/news-automation"
            className="inline-flex text-sm font-medium text-primary"
          >
            Automazione News
          </Link>
          <Link to="/admin/feedback" className="inline-flex text-sm font-medium text-primary">
            Feedback del sito
          </Link>
          <Link to="/admin/alert" className="inline-flex text-sm font-medium text-primary">
            Segnalazioni ALERT
          </Link>
          <Link to="/admin/hub" className="inline-flex text-sm font-medium text-primary">
            Moderazione Hub
          </Link>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              tab === t.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "previews" && (
        <AdminResource
          table="previews"
          title="Anticipazioni"
          fields={previewFields}
          titleField="title"
          orderBy="member_publish_at"
        />
      )}
      {tab === "benefits" && (
        <AdminResource
          table="benefits"
          title="Vantaggi e convenzioni"
          fields={benefitFields}
          titleField="business_name"
          orderBy="created_at"
        />
      )}
      {tab === "events" && (
        <AdminResource
          table="member_events"
          title="Eventi"
          fields={eventFields}
          titleField="title"
          orderBy="starts_at"
        />
      )}
      {tab === "exclusives" && (
        <AdminResource
          table="exclusive_contents"
          title="Contenuti esclusivi"
          fields={exclusiveFields}
          titleField="title"
          orderBy="publish_at"
        />
      )}
      {tab === "discoveries" && (
        <AdminResource
          table="discoveries"
          title="Scopri il territorio"
          fields={discoveryFields}
          titleField="title"
          orderBy="created_at"
        />
      )}
      {tab === "notifications" && (
        <AdminResource
          table="notifications"
          title="Notifiche"
          fields={notificationFields}
          titleField="title"
          orderBy="created_at"
        />
      )}
      {tab === "members" && <MembersTable />}
    </div>
  );
}

function MembersTable() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id,member_id,first_name,last_name,email,city,province,membership_status,member_since",
        )
        .order("member_since", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-h3-im">Membri iscritti</h2>
      {isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Caricamento…</p>
      ) : data.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nessun membro registrato.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Territorio</th>
                <th className="py-2 pr-4">Stato</th>
                <th className="py-2">Iscritto il</th>
              </tr>
            </thead>
            <tbody>
              {data.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="py-2 pr-4 font-medium">{m.member_id}</td>
                  <td className="py-2 pr-4">
                    {`${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || "—"}
                  </td>
                  <td className="py-2 pr-4">{m.email ?? "—"}</td>
                  <td className="py-2 pr-4">
                    {[m.city, m.province].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="py-2 pr-4 capitalize">{m.membership_status}</td>
                  <td className="py-2">{formatDate(m.member_since)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, CalendarDays, Gift, Lock, Sparkles } from "lucide-react";

import { AreaShell, EmptyState } from "@/components/member/area-shell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatDateTime, fullName } from "@/lib/member-area";
import { BentoGrid, BentoLinkCard, type BentoTone } from "../../components/bento";

const AREA_TONES: BentoTone[] = ["radio", "podcast", "eventi", "member"];

export const Route = createFileRoute("/_authenticated/area/")({
  head: () => ({
    meta: [
      { title: "Dashboard Member — IMLAND EXPERIENCE" },
      {
        name: "description",
        content: "La tua dashboard Member IMLAND: anticipazioni, vantaggi ed eventi.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { profile } = useAuth();
  const nowIso = new Date().toISOString();

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [previews, benefits, events, contents, notifs, bookings] = await Promise.all([
        supabase
          .from("previews")
          .select("id,title,excerpt,content_type,member_publish_at")
          .lte("member_publish_at", nowIso)
          .order("member_publish_at", { ascending: false })
          .limit(3),
        supabase
          .from("benefits")
          .select("id,business_name,benefit_type,discount_percent,city")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("member_events")
          .select("id,title,starts_at,venue,city,member_only")
          .gte("starts_at", nowIso)
          .order("starts_at", { ascending: true })
          .limit(3),
        supabase
          .from("exclusive_contents")
          .select("id,title,content_type,publish_at")
          .lte("publish_at", nowIso)
          .order("publish_at", { ascending: false })
          .limit(3),
        supabase
          .from("notifications")
          .select("id,title,notif_type,created_at,is_important")
          .order("created_at", { ascending: false })
          .limit(4),
        supabase.from("event_bookings").select("id,event_id,seats,status"),
      ]);
      return {
        previews: previews.data ?? [],
        benefits: benefits.data ?? [],
        events: events.data ?? [],
        contents: contents.data ?? [],
        notifs: notifs.data ?? [],
        bookings: bookings.data ?? [],
      };
    },
  });

  const stats = [
    {
      label: "Anticipazioni disponibili",
      value: data?.previews.length ?? 0,
      icon: Sparkles,
      to: "/area/anticipazioni",
    },
    {
      label: "Vantaggi attivi",
      value: data?.benefits.length ?? 0,
      icon: Gift,
      to: "/area/vantaggi",
    },
    {
      label: "Eventi in arrivo",
      value: data?.events.length ?? 0,
      icon: CalendarDays,
      to: "/area/eventi",
    },
    {
      label: "Le tue prenotazioni",
      value: data?.bookings.length ?? 0,
      icon: BadgeCheck,
      to: "/area/eventi",
    },
  ] as const;

  return (
    <AreaShell
      title={`Ciao ${fullName(profile).split(" ")[0]}.`}
      lead={`Member dal ${formatDate(profile?.member_since)} · ID ${profile?.member_id ?? "—"}`}
    >
      <BentoGrid>
        {stats.map((s, i) => (
          <BentoLinkCard key={s.label} to={s.to} tone={AREA_TONES[i % AREA_TONES.length]} span={3}>
            <s.icon size={20} className="text-primary" />
            <p className="mt-3 font-display text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </BentoLinkCard>
        ))}
      </BentoGrid>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card title="Ultime anticipazioni" to="/area/anticipazioni">
          {data?.previews.length ? (
            <ul className="space-y-3">
              {data.previews.map((p) => (
                <li key={p.id} className="rounded-2xl bg-muted/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-primary">{p.content_type}</p>
                  <p className="mt-1 font-medium">{p.title}</p>
                  {p.excerpt && <p className="mt-1 text-sm text-muted-foreground">{p.excerpt}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Nessuna anticipazione disponibile al momento." />
          )}
        </Card>

        <Card title="Prossimi eventi" to="/area/eventi">
          {data?.events.length ? (
            <ul className="space-y-3">
              {data.events.map((e) => (
                <li key={e.id} className="rounded-2xl bg-muted/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-primary">
                    {formatDateTime(e.starts_at)}
                  </p>
                  <p className="mt-1 font-medium">{e.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[e.venue, e.city].filter(Boolean).join(" · ") || "Luogo da definire"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Nessun evento in programma." />
          )}
        </Card>

        <Card title="Vantaggi in evidenza" to="/area/vantaggi">
          {data?.benefits.length ? (
            <ul className="space-y-3">
              {data.benefits.map((b) => (
                <li key={b.id} className="rounded-2xl bg-muted/50 p-4">
                  <p className="font-medium">{b.business_name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {b.benefit_type}
                    {b.discount_percent ? ` · -${b.discount_percent}%` : ""}
                    {b.city ? ` · ${b.city}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Nessun vantaggio pubblicato." />
          )}
        </Card>

        <Card title="Contenuti esclusivi" to="/area/esclusivi">
          {data?.contents.length ? (
            <ul className="space-y-3">
              {data.contents.map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4">
                  <Lock size={16} className="text-primary" />
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-sm text-muted-foreground">{c.content_type}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="Nessun contenuto esclusivo pubblicato." />
          )}
        </Card>
      </div>

      {data?.notifs.length ? (
        <div className="mt-8 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-h3-im">Ultime comunicazioni</h2>
          <ul className="mt-4 space-y-2">
            {data.notifs.map((n) => (
              <li key={n.id} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {n.notif_type}
                </span>
                <span className="font-medium">{n.title}</span>
                <span className="text-muted-foreground">{formatDateTime(n.created_at)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </AreaShell>
  );
}

function Card({
  title,
  to,
  children,
}: {
  title: string;
  to: "/area/anticipazioni" | "/area/vantaggi" | "/area/eventi" | "/area/esclusivi";
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-h3-im">{title}</h2>
        <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          Vedi tutto <ArrowRight size={14} />
        </Link>
      </div>
      {children}
    </section>
  );
}

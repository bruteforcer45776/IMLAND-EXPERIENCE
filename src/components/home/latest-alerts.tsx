import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { ALERT_STATUS_LABEL, formatHubDate } from "@/lib/hub";
import { BadgeIcon } from "@/components/badge-icon";
import { Reveal } from "@/components/reveal";

type AlertRow = {
  id: string;
  title: string;
  category: string | null;
  comune: string;
  status: string | null;
  created_at: string;
};

/** Ultime segnalazioni pubbliche del territorio. */
function useLatestAlerts() {
  return useQuery({
    queryKey: ["home", "alerts", "latest"],
    enabled: isSupabaseConfigured(),
    staleTime: 60_000,
    queryFn: async (): Promise<AlertRow[]> => {
      const { data, error } = await supabase
        .from("territory_alerts")
        .select("id, title, category, comune, status, created_at")
        .eq("state", "published")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return (data ?? []) as AlertRow[];
    },
  });
}

export function LatestAlerts() {
  const { data, isLoading } = useLatestAlerts();
  const alerts = data ?? [];

  return (
    <section className="bg-white section-pad-sm">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--color-surface-alert)]">
                Da qui parte tutto
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.03em] text-ink-950">
                Le ultime <span className="im-gradient-text">segnalazioni</span>.
              </h2>
              <p className="mt-5 text-lg text-ink-600">
                Ogni voce del territorio inizia con una segnalazione.
                <br />
                Da ALERT passa a Terrain, Eventi, News e Radio.
              </p>
            </div>
            <Link
              to="/alert"
              className="inline-flex h-11 items-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-ink-800 transition-colors hover:bg-muted"
            >
              Vai ad ALERT
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-[24px] bg-black/5" />
            ))}

          {!isLoading && alerts.length === 0 && (
            <div className="rounded-[24px] border border-border bg-white p-6 sm:col-span-2 lg:col-span-4">
              <p className="font-display text-lg font-bold text-ink-950">
                Nessuna segnalazione pubblica in questo momento.
              </p>
              <p className="mt-1 text-sm text-ink-600">
                Puoi essere tu a segnalare quello che accade vicino a te.
              </p>
            </div>
          )}

          {alerts.map((a) => (
            <Link
              key={a.id}
              to="/alert"
              className="group flex h-full flex-col rounded-[24px] border border-border bg-white p-6 transition-all duration-fast hover:-translate-y-1 hover:shadow-[var(--elevation-2)]"
            >
              <BadgeIcon name="alert" tone="alert" className="h-11 w-11" />
              <p className="mt-4 line-clamp-2 font-display text-base font-bold leading-snug text-ink-950">
                {a.title}
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-ink-600">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {a.comune}
              </p>
              <p className="mt-1 text-xs text-ink-600">
                {a.category ?? "Segnalazione"} ·{" "}
                {ALERT_STATUS_LABEL[a.status ?? ""] ?? "Pubblicata"}
              </p>
              <span className="mt-auto inline-flex w-fit items-center rounded-full border border-current/20 bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--color-surface-alert)]">
                {formatHubDate(a.created_at)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestAlerts;

import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Check } from "lucide-react";

import { AreaShell, EmptyState } from "@/components/member/area-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatDateTime } from "@/lib/member-area";

export const Route = createFileRoute("/_authenticated/area/notifiche")({
  head: () => ({
    meta: [
      { title: "Notifiche Member — IMLAND EXPERIENCE" },
      { name: "description", content: "Aggiornamenti su vantaggi, eventi e contenuti riservati ai Member IMLAND." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotifichePage,
});

function NotifichePage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const [notifs, reads] = await Promise.all([
        supabase.from("notifications").select("*").order("created_at", { ascending: false }),
        supabase.from("notification_reads").select("*"),
      ]);
      if (notifs.error) throw notifs.error;
      return { notifs: notifs.data, reads: reads.data ?? [] };
    },
  });

  const markRead = useMutation({
    mutationFn: async (ids: string[]) => {
      if (!user || ids.length === 0) return;
      const { error } = await supabase
        .from("notification_reads")
        .insert(ids.map((id) => ({ notification_id: id, user_id: user.id })));
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notifications"] });
      void qc.invalidateQueries({ queryKey: ["notif-unread"] });
    },
  });

  const readIds = new Set((data?.reads ?? []).map((r) => r.notification_id));
  const notifs = data?.notifs ?? [];
  const unread = notifs.filter((n) => !readIds.has(n.id));

  return (
    <AreaShell title="Notifiche." lead="Nuovi vantaggi, anticipazioni, eventi e comunicazioni.">
      {unread.length > 0 && (
        <Button
          className="mb-5 rounded-full"
          variant="outline"
          onClick={() => markRead.mutate(unread.map((n) => n.id))}
        >
          Segna tutte come lette
        </Button>
      )}

      {isLoading ? (
        <EmptyState text="Caricamento…" />
      ) : notifs.length === 0 ? (
        <EmptyState text="Nessuna notifica per ora." />
      ) : (
        <ul className="space-y-3">
          {notifs.map((n) => {
            const read = readIds.has(n.id);
            return (
              <li
                key={n.id}
                className={`rounded-2xl border p-4 ${
                  read ? "border-border bg-card" : "border-primary/40 bg-primary/5"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {n.notif_type}
                  </span>
                  {n.is_important && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                      <AlertCircle size={13} /> Importante
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{formatDateTime(n.created_at)}</span>
                  {read && <Check size={14} className="text-muted-foreground" />}
                </div>
                <p className="mt-2 font-medium">{n.title}</p>
                {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
                <div className="mt-3 flex flex-wrap gap-3">
                  {n.link_url && (
                    <a href={n.link_url} className="text-sm font-medium text-primary">
                      Apri
                    </a>
                  )}
                  {!read && (
                    <button
                      onClick={() => markRead.mutate([n.id])}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Segna come letta
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AreaShell>
  );
}

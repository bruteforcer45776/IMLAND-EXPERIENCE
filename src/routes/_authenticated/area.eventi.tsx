import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Heart, MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AreaShell, EmptyState } from "@/components/member/area-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { formatDateTime } from "@/lib/member-area";
import { BentoGrid, BentoCard } from "../../components/bento";

export const Route = createFileRoute("/_authenticated/area/eventi")({
  head: () => ({
    meta: [
      { title: "Eventi Member — IMLAND EXPERIENCE" },
      { name: "description", content: "Eventi riservati, prenotazioni anticipate e posti VIP per i Member IMLAND." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EventiMemberPage,
});

function EventiMemberPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { isFavorite, toggle } = useFavorites();

  const { data, isLoading } = useQuery({
    queryKey: ["member-events"],
    queryFn: async () => {
      const [events, bookings] = await Promise.all([
        supabase.from("member_events").select("*").order("starts_at", { ascending: true }),
        supabase.from("event_bookings").select("*"),
      ]);
      if (events.error) throw events.error;
      return { events: events.data, bookings: bookings.data ?? [] };
    },
  });

  const book = useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error("Devi accedere");
      const { error } = await supabase
        .from("event_bookings")
        .insert({ event_id: eventId, user_id: user.id, seats: 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["member-events"] });
      toast.success("Prenotazione confermata.");
    },
    onError: () => toast.error("Prenotazione non riuscita."),
  });

  const cancel = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase.from("event_bookings").delete().eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["member-events"] });
      toast.success("Prenotazione annullata.");
    },
    onError: () => toast.error("Operazione non riuscita."),
  });

  const events = data?.events ?? [];

  return (
    <AreaShell title="Eventi." lead="Prenotazioni anticipate, prezzi Member e posti riservati.">
      {isLoading ? (
        <EmptyState text="Caricamento…" />
      ) : events.length === 0 ? (
        <EmptyState text="Nessun evento pubblicato al momento." />
      ) : (
        <BentoGrid>
          {events.map((e) => {
            const booking = (data?.bookings ?? []).find((b) => b.event_id === e.id);
            const opensAt = e.member_booking_opens_at ? new Date(e.member_booking_opens_at).getTime() : 0;
            const open = opensAt <= Date.now();
            return (
              <BentoCard key={e.id} tone="eventi" span={3} className="!p-0 overflow-hidden block">
                {e.cover_url && (
                  <img src={e.cover_url} alt={e.title} className="h-44 w-full object-cover" loading="lazy" />
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-primary">
                        <CalendarDays size={13} /> {formatDateTime(e.starts_at)}
                      </p>
                      <h2 className="mt-2 text-h3-im">{e.title}</h2>
                    </div>
                    <button
                      onClick={() => toggle.mutate({ item_id: e.id, item_type: "evento", label: e.title })}
                      aria-label="Salva"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Heart size={18} fill={isFavorite(e.id, "evento") ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={13} />
                    {[e.venue, e.city, e.province].filter(Boolean).join(" · ") || "Luogo da definire"}
                  </p>
                  {e.description && <p className="mt-3 text-sm text-muted-foreground">{e.description}</p>}

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {e.member_only && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                        Solo Member
                      </span>
                    )}
                    {e.member_price !== null && (
                      <span className="rounded-full bg-muted px-2.5 py-1">Member € {e.member_price}</span>
                    )}
                    {e.public_price !== null && (
                      <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground line-through">
                        € {e.public_price}
                      </span>
                    )}
                    {e.member_seats !== null && (
                      <span className="rounded-full bg-muted px-2.5 py-1">{e.member_seats} posti Member</span>
                    )}
                  </div>

                  {e.perks.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      {e.perks.map((p) => (
                        <li key={p} className="flex items-center gap-1.5">
                          <Sparkles size={13} className="text-primary" /> {p}
                        </li>
                      ))}
                    </ul>
                  )}

                  {booking ? (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                        Prenotato · {booking.seats} posto/i
                      </span>
                      <Button
                        variant="outline"
                        className="rounded-full"
                        disabled={cancel.isPending}
                        onClick={() => cancel.mutate(booking.id)}
                      >
                        Annulla
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="mt-4 rounded-full"
                      disabled={!open || book.isPending}
                      onClick={() => book.mutate(e.id)}
                    >
                      {open
                        ? "Prenota come Member"
                        : `Prenotazioni Member dal ${formatDateTime(e.member_booking_opens_at)}`}
                    </Button>
                  )}
                </div>
              </BentoCard>
            );
          })}
        </BentoGrid>
      )}
    </AreaShell>
  );
}

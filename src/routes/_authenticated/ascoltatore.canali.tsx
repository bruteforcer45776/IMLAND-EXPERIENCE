import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bell, BellRing, Check } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/bento";
import { ListenerEpisodeCard } from "@/components/listener/episode-card";
import { useEpisodeNotifications, useFollows } from "@/hooks/use-listener";
import { podcastProgramList } from "@/data/podcast-programs";

export const Route = createFileRoute("/_authenticated/ascoltatore/canali")({
  head: () => ({
    meta: [
      { title: "Canali e notifiche — Area Persona IMLAND" },
      {
        name: "description",
        content: "Segui i canali e ricevi le nuove puntate appena pubblicate.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CanaliPage,
});

function CanaliPage() {
  const { isFollowing, toggle } = useFollows();
  const { notifications, unread, markSeen } = useEpisodeNotifications();

  // Segnare come viste le notifiche quando la pagina resta aperta.
  useEffect(() => {
    if (unread === 0) return;
    const timer = window.setTimeout(() => markSeen.mutate(undefined), 4000);
    return () => window.clearTimeout(timer);
  }, [unread, markSeen]);

  const newOnes = notifications.filter((n) => n.isNew);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-signal">Notifiche</p>
      <h1 className="mt-2 text-display-s">Segui i canali che ti piacciono.</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Quando esce una nuova puntata di un canale seguito la trovi qui, in cima.
      </p>

      <section className="mt-8">
        <h2 className="text-title-l">Nuove puntate {unread > 0 ? `(${unread})` : ""}</h2>
        {newOnes.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-border bg-card p-6 text-muted-foreground">
            Nessuna nuova puntata dai canali che segui.
          </div>
        ) : (
          <BentoGrid className="mt-4">
            {newOnes.slice(0, 9).map((n) => (
              <ListenerEpisodeCard key={n.episode.slug} ref_={n} badge="Nuova" />
            ))}
          </BentoGrid>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-title-l">Tutti i canali</h2>
        <BentoGrid className="mt-4">
          {podcastProgramList.map((program) => {
            const following = isFollowing(program.slug);
            return (
              <BentoCard key={program.slug} tone="podcast" span={2}>
                <h3 className="text-title-m">{program.name}</h3>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {program.episodes.length} puntate
                </p>
                <button
                  type="button"
                  onClick={() => toggle.mutate(program.slug)}
                  className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                    following ? "bg-signal text-white" : "border border-border hover:bg-muted"
                  }`}
                >
                  {following ? <Check className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                  {following ? "Segui già" : "Segui canale"}
                </button>
              </BentoCard>
            );
          })}
        </BentoGrid>
      </section>

      {notifications.length > 0 && (
        <p className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <BellRing className="h-3.5 w-3.5" /> Le notifiche si aggiornano ad ogni nuova
          pubblicazione.
        </p>
      )}
    </div>
  );
}

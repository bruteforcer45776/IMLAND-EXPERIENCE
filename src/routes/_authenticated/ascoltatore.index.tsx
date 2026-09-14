import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Headphones,
  Heart,
  ListMusic,
  Play,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { fullName } from "@/lib/member-area";
import { BentoGrid, BentoCard, BentoLinkCard } from "@/components/bento";
import { WHATSAPP_MEMBER_URL } from "@/lib/whatsapp";
import { usePreferences } from "@/hooks/use-preferences";
import { rankEpisodes } from "@/lib/personalize";
import { ListenerEpisodeCard } from "@/components/listener/episode-card";
import {
  useCollections,
  useEpisodeNotifications,
  useFollows,
  useListenerProgress,
  useShares,
} from "@/hooks/use-listener";
import { episodeBySlug, formatEpisodeDate } from "@/lib/listener-catalog";

export const Route = createFileRoute("/_authenticated/ascoltatore/")({
  head: () => ({
    meta: [
      { title: "Area Persona — IMLAND EXPERIENCE" },
      {
        name: "description",
        content: "Riprendi le puntate lasciate in pausa, ritrova i contenuti che ti piacciono e condividili.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AscoltatorePage,
});

function StatCard({
  icon: Icon,
  value,
  label,
  to,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        <Icon className="h-4 w-4 text-signal" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-title-m leading-none">{value}</span>
        <span className="block truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </span>
    </Link>
  );
}

function SectionHead({
  title,
  hint,
  to,
  cta,
}: {
  title: string;
  hint?: string;
  to?: string;
  cta?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-title-l">{title}</h2>
        {hint && <p className="mt-1 text-[15px] text-muted-foreground">{hint}</p>}
      </div>
      {to && cta && (
        <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          {cta} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-5 text-[15px] text-muted-foreground">
      {children}
    </div>
  );
}

function AscoltatorePage() {
  const { profile } = useAuth();
  const { preferences } = usePreferences();
  const { rows, byEpisode } = useListenerProgress();
  const { favorites } = useFavorites();
  const { collections, items } = useCollections();
  const { follows } = useFollows();
  const { notifications, unread } = useEpisodeNotifications();
  const { shares, totalClicks } = useShares();

  const inProgress = rows
    .filter((row) => !row.completed && Number(row.position_seconds) > 5)
    .map((row) => {
      const ref = episodeBySlug(row.episode_slug);
      return ref ? { ref, row } : null;
    })
    .filter((entry): entry is { ref: NonNullable<ReturnType<typeof episodeBySlug>>; row: typeof rows[number] } =>
      Boolean(entry),
    )
    .slice(0, 3);

  const suggested = rankEpisodes(preferences?.topics ?? [], 3);
  const news = notifications.filter((n) => n.isNew).slice(0, 3);
  const recentFavorites = favorites.slice(0, 4);

  return (
    <div>
      <header>
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          Area Persona
        </span>
        <h1 className="mt-4 text-display-m">
          Ciao {fullName(profile) || "persona"}.
          <br />
          Riprendi da dove hai lasciato.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Puntate in pausa, raccolte, canali seguiti e condivisioni: tutto in un unico posto.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={Play} value={inProgress.length} label="In ascolto" to="/ascoltatore/puntate" />
        <StatCard icon={Heart} value={favorites.length} label="Preferiti" to="/ascoltatore/raccolte" />
        <StatCard icon={ListMusic} value={collections.length} label="Raccolte" to="/ascoltatore/raccolte" />
        <StatCard icon={Bell} value={follows.length} label="Canali seguiti" to="/ascoltatore/canali" />
        <StatCard icon={Share2} value={shares.length} label="Condivisioni" to="/ascoltatore/condivisioni" />
      </div>

      <section className="mt-12">
        <SectionHead
          title="Continua l'ascolto"
          hint="Le puntate che hai lasciato a metà."
          to="/ascoltatore/puntate"
          cta="Tutte le puntate"
        />
        {inProgress.length === 0 ? (
          <Empty>
            Non hai puntate in pausa.{" "}
            <Link to="/podcast" className="font-semibold text-primary underline">
              Scegli un programma
            </Link>{" "}
            e lo ritroverai qui.
          </Empty>
        ) : (
          <BentoGrid className="mt-4">
            {inProgress.map(({ ref, row }) => (
              <ListenerEpisodeCard
                key={`prog-${row.episode_slug}`}
                ref_={ref}
                position={Number(row.position_seconds) || 0}
                duration={row.duration_seconds}
                badge="Riprendi"
              />
            ))}
          </BentoGrid>
        )}
      </section>

      <section className="mt-12">
        <SectionHead
          title="Novità dai canali che segui"
          hint={
            follows.length === 0
              ? "Segui i tuoi canali preferiti per ricevere le nuove puntate."
              : `${unread} nuove puntate da vedere.`
          }
          to="/ascoltatore/canali"
          cta="Gestisci canali"
        />
        {news.length === 0 ? (
          <Empty>
            {follows.length === 0
              ? "Non segui ancora nessun canale."
              : "Nessuna nuova puntata dall'ultima visita."}
          </Empty>
        ) : (
          <BentoGrid className="mt-4">
            {news.map((n) => (
              <ListenerEpisodeCard
                key={`new-${n.episode.slug}`}
                ref_={{ program: n.program, episode: n.episode }}
                position={byEpisode.get(n.episode.slug)?.position_seconds ?? 0}
                duration={byEpisode.get(n.episode.slug)?.duration_seconds ?? null}
                badge="Nuova"
              />
            ))}
          </BentoGrid>
        )}
      </section>

      <section className="mt-12">
        <SectionHead
          title="Consigliati per te"
          hint={
            preferences?.topics?.length
              ? `In base ai tuoi interessi: ${preferences.topics.join(", ")}.`
              : "Completa il questionario di benvenuto per contenuti su misura."
          }
          to="/ascoltatore/profilo"
          cta="Aggiorna interessi"
        />
        <BentoGrid className="mt-4">
          {suggested.map((ref_) => (
            <ListenerEpisodeCard
              key={`sugg-${ref_.episode.slug}`}
              ref_={ref_}
              position={byEpisode.get(ref_.episode.slug)?.position_seconds ?? 0}
              duration={byEpisode.get(ref_.episode.slug)?.duration_seconds ?? null}
            />
          ))}
        </BentoGrid>
      </section>

      <section className="mt-12">
        <SectionHead
          title="Preferiti recenti"
          hint="I contenuti che hai salvato con il cuore."
          to="/ascoltatore/raccolte"
          cta="Vedi raccolte"
        />
        {recentFavorites.length === 0 ? (
          <Empty>Usa il cuore sulle puntate e sugli articoli per ritrovarli qui.</Empty>
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {recentFavorites.map((fav) => (
              <li key={fav.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {fav.item_type.replace("_", " ")}
                  </p>
                  <p className="truncate text-[15px] font-semibold">{fav.label ?? fav.item_id}</p>
                </div>
                {fav.link_url && (
                  <a
                    href={fav.link_url}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold hover:bg-muted"
                  >
                    Apri <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <SectionHead
          title="Le tue raccolte"
          hint="Organizza le puntate come vuoi tu."
          to="/ascoltatore/raccolte"
          cta="Apri raccolte"
        />
        {collections.length === 0 ? (
          <Empty>Non hai ancora creato raccolte. Puoi crearne una direttamente da una puntata.</Empty>
        ) : (
          <BentoGrid className="mt-4">
            {collections.slice(0, 3).map((c) => {
              const count = items.filter((i) => i.collection_id === c.id).length;
              return (
                <BentoLinkCard key={c.id} to="/ascoltatore/raccolte" tone="podcast" span={2}>
                  <ListMusic className="h-6 w-6 text-[var(--color-icon-podcast)]" />
                  <h3 className="mt-3 text-title-m">{c.name}</h3>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    {count} {count === 1 ? "puntata" : "puntate"}
                  </p>
                </BentoLinkCard>
              );
            })}
          </BentoGrid>
        )}
      </section>

      <section className="mt-12">
        <SectionHead
          title="Le tue condivisioni"
          hint={`Hai raggiunto ${totalClicks} persone con le puntate che hai condiviso.`}
          to="/ascoltatore/condivisioni"
          cta="Vedi tutte"
        />
        {shares.length === 0 ? (
          <Empty>Condividi una puntata per farla ascoltare ai tuoi contatti.</Empty>
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {shares.slice(0, 3).map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold">{s.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatEpisodeDate(s.created_at)} · {s.channel}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                  {s.click_count} raggiunte
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <SectionHead title="Continua a scoprire" />
        <BentoGrid className="mt-4">
          <BentoLinkCard to="/podcast" tone="podcast" span={2}>
            <Headphones className="h-6 w-6 text-[var(--color-icon-podcast)]" />
            <h3 className="mt-3 text-title-m">Podcast</h3>
            <p className="mt-1 text-[15px] text-muted-foreground">Programmi e puntate del territorio.</p>
          </BentoLinkCard>
          <BentoLinkCard to="/radio" tone="radio" span={2}>
            <Play className="h-6 w-6 text-[var(--color-icon-radio)]" />
            <h3 className="mt-3 text-title-m">Radio in diretta</h3>
            <p className="mt-1 text-[15px] text-muted-foreground">Ascolta IMLAND Radio ovunque.</p>
          </BentoLinkCard>
          <BentoLinkCard to="/ascoltatore/profilo" tone="news" span={2}>
            <UserRound className="h-6 w-6 text-[var(--color-icon-news)]" />
            <h3 className="mt-3 text-title-m">Il tuo profilo</h3>
            <p className="mt-1 text-[15px] text-muted-foreground">Dati, interessi e notifiche.</p>
          </BentoLinkCard>
          <BentoCard tone="member" span={6}>
            <Sparkles className="h-6 w-6 text-[var(--color-icon-member)]" />
            <h3 className="mt-3 text-title-m">Hai un'azienda?</h3>
            <p className="mt-1 max-w-2xl text-[15px] text-muted-foreground">
              I Member sono le aziende partner IMLAND: vantaggi, visibilità e dashboard dedicata.
            </p>
            <a
              href={WHATSAPP_MEMBER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-white"
            >
              Diventa azienda Member <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </BentoCard>
        </BentoGrid>
      </section>
    </div>
  );
}

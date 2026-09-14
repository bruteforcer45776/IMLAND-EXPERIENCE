import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { BentoGrid } from "@/components/bento";
import { ListenerEpisodeCard } from "@/components/listener/episode-card";
import { useListenerProgress } from "@/hooks/use-listener";
import { useFavorites } from "@/hooks/use-favorites";
import { allEpisodes, parseEpisodeDate } from "@/lib/listener-catalog";
import { podcastProgramList } from "@/data/podcast-programs";
import { getSavedPositions } from "@/components/podcast-audio";

export const Route = createFileRoute("/_authenticated/ascoltatore/puntate")({
  head: () => ({
    meta: [
      { title: "Puntate — Area Persona IMLAND" },
      {
        name: "description",
        content: "Cerca e filtra le puntate per canale, data e stato di ascolto.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PuntatePage,
});

type Status = "tutte" | "riprese" | "nuove" | "preferiti" | "completate";
type Order = "recenti" | "meno-recenti" | "titolo";

function PuntatePage() {
  const { byEpisode } = useListenerProgress();
  const { isFavorite } = useFavorites();
  const [q, setQ] = useState("");
  const [program, setProgram] = useState("tutti");
  const [status, setStatus] = useState<Status>("tutte");
  const [order, setOrder] = useState<Order>("recenti");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const local = useMemo(() => getSavedPositions(), []);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    const list = allEpisodes().filter(({ program: p, episode }) => {
      if (program !== "tutti" && p.slug !== program) return false;
      if (term && !`${episode.title} ${p.name}`.toLowerCase().includes(term)) return false;

      const date = parseEpisodeDate(episode.date);
      if (fromDate && (!date || date < fromDate)) return false;
      if (toDate && (!date || date > toDate)) return false;

      const remote = byEpisode.get(episode.slug);
      const position = remote?.position_seconds ?? local[episode.audio] ?? 0;
      const completed = remote?.completed ?? false;

      if (status === "riprese") return position > 5 && !completed;
      if (status === "completate") return completed;
      if (status === "nuove") return position <= 5;
      if (status === "preferiti") return isFavorite(episode.slug, "podcast_episode");
      return true;
    });

    return list.sort((a, b) => {
      if (order === "titolo") return a.episode.title.localeCompare(b.episode.title);
      const da = parseEpisodeDate(a.episode.date)?.getTime() ?? 0;
      const db = parseEpisodeDate(b.episode.date)?.getTime() ?? 0;
      return order === "recenti" ? db - da : da - db;
    });
  }, [q, program, status, order, from, to, byEpisode, local, isFavorite]);

  const visible = rows.slice(0, 60);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-signal">Archivio</p>
      <h1 className="mt-2 text-display-s">Cerca la puntata giusta.</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Filtra per canale, periodo e stato di ascolto: riprese, nuove, preferite o completate.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <label className="relative md:col-span-2 lg:col-span-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca puntata o canale…"
            aria-label="Cerca puntata"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-4 text-sm"
          />
        </label>
        <select
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          aria-label="Filtra per canale"
          className="rounded-full border border-border bg-card px-4 py-2.5 text-sm"
        >
          <option value="tutti">Tutti i canali</option>
          {podcastProgramList.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          aria-label="Filtra per stato"
          className="rounded-full border border-border bg-card px-4 py-2.5 text-sm"
        >
          <option value="tutte">Tutti gli stati</option>
          <option value="riprese">Da riprendere</option>
          <option value="nuove">Nuove per me</option>
          <option value="preferiti">Preferite</option>
          <option value="completate">Completate</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as Order)}
          aria-label="Ordina"
          className="rounded-full border border-border bg-card px-4 py-2.5 text-sm"
        >
          <option value="recenti">Più recenti</option>
          <option value="meno-recenti">Meno recenti</option>
          <option value="titolo">Titolo A-Z</option>
        </select>
        <label className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <span className="text-muted-foreground">Dal</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-transparent"
          />
        </label>
        <label className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <span className="text-muted-foreground">Al</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-transparent"
          />
        </label>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {rows.length} puntate trovate
        {rows.length > visible.length ? ` · mostrate le prime ${visible.length}` : ""}
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-border bg-card p-6 text-muted-foreground">
          Nessuna puntata con questi filtri. Prova ad allargare la ricerca.
        </div>
      ) : (
        <BentoGrid className="mt-6">
          {visible.map((ref_) => {
            const remote = byEpisode.get(ref_.episode.slug);
            const position = remote?.position_seconds ?? local[ref_.episode.audio] ?? 0;
            return (
              <ListenerEpisodeCard
                key={ref_.episode.slug}
                ref_={ref_}
                position={position}
                duration={remote?.duration_seconds ?? null}
                badge={
                  remote?.completed ? "Completata" : position > 5 ? "Da riprendere" : undefined
                }
              />
            );
          })}
        </BentoGrid>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/bento";
import { useCollections } from "@/hooks/use-listener";
import { episodeBySlug } from "@/lib/listener-catalog";
import { EpisodePlayButton } from "@/components/podcast-audio";
import { podcastProgramList } from "@/data/podcast-programs";

export const Route = createFileRoute("/_authenticated/ascoltatore/raccolte")({
  head: () => ({
    meta: [
      { title: "Raccolte — Area Persona IMLAND" },
      {
        name: "description",
        content: "Organizza le puntate preferite in raccolte ordinabili e filtrabili per canale.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RaccoltePage,
});

function RaccoltePage() {
  const { collections, items, createCollection, deleteCollection, removeItem, moveItem } =
    useCollections();
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("tutti");

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-signal">Playlist</p>
      <h1 className="mt-2 text-display-s">Le tue raccolte.</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Crea playlist tematiche, riordinale e filtrale per canale.
      </p>

      <form
        className="mt-6 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createCollection.mutate({ name });
          setName("");
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome della raccolta"
          aria-label="Nome della raccolta"
          className="min-w-[220px] flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Crea raccolta
        </button>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
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
      </form>

      {collections.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-muted-foreground">
          Non hai ancora raccolte. Creane una e aggiungi le puntate dal pulsante “Raccolta”.
        </div>
      ) : (
        <BentoGrid className="mt-8">
          {collections.map((collection) => {
            const list = items
              .filter((i) => i.collection_id === collection.id)
              .filter((i) => channel === "tutti" || i.program_slug === channel)
              .sort((a, b) => a.sort_order - b.sort_order);
            return (
              <BentoCard key={collection.id} tone="podcast" span={3}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-title-m">{collection.name}</h2>
                    <p className="mt-1 text-[13px] text-muted-foreground">{list.length} puntate</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Elimina ${collection.name}`}
                    onClick={() => deleteCollection.mutate(collection.id)}
                    className="rounded-full border border-border p-2 hover:bg-muted"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <ul className="mt-4 space-y-2">
                  {list.length === 0 && (
                    <li className="text-[13px] text-muted-foreground">
                      Nessuna puntata con questo filtro.
                    </li>
                  )}
                  {list.map((item) => {
                    const ref_ = episodeBySlug(item.episode_slug);
                    return (
                      <li
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card px-3 py-2"
                      >
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                          {item.label ?? item.episode_slug}
                        </span>
                        <span className="flex items-center gap-1">
                          {ref_ && (
                            <EpisodePlayButton
                              track={{
                                audio: ref_.episode.audio,
                                title: ref_.episode.title,
                                program: ref_.program.name,
                                programSlug: ref_.program.slug,
                                episodeSlug: ref_.episode.slug,
                                cover: ref_.episode.cover,
                              }}
                            />
                          )}
                          <button
                            type="button"
                            aria-label="Sposta su"
                            onClick={() =>
                              moveItem.mutate({
                                id: item.id,
                                collectionId: collection.id,
                                direction: -1,
                              })
                            }
                            className="rounded-full border border-border p-2 hover:bg-muted"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Sposta giù"
                            onClick={() =>
                              moveItem.mutate({
                                id: item.id,
                                collectionId: collection.id,
                                direction: 1,
                              })
                            }
                            className="rounded-full border border-border p-2 hover:bg-muted"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Rimuovi dalla raccolta"
                            onClick={() => removeItem.mutate(item.id)}
                            className="rounded-full border border-border p-2 hover:bg-muted"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </BentoCard>
            );
          })}
        </BentoGrid>
      )}
    </div>
  );
}

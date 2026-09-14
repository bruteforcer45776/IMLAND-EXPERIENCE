import { Heart, Loader2 } from "lucide-react";

import { BentoCard } from "@/components/bento";
import { EpisodePlayButton, fmtTime } from "@/components/podcast-audio";
import { CollectionPicker } from "@/components/listener/collection-picker";
import { ShareEpisodeDialog } from "@/components/listener/share-dialog";
import { useFavorites } from "@/hooks/use-favorites";
import { episodeLink, formatEpisodeDate } from "@/lib/listener-catalog";
import type { EpisodeRef } from "@/lib/listener-catalog";

type Props = {
  ref_: EpisodeRef;
  position?: number;
  duration?: number | null;
  badge?: string;
  span?: 2 | 3 | 4 | 6;
};

export function ListenerEpisodeCard({ ref_, position = 0, duration, badge, span = 3 }: Props) {
  const { program, episode } = ref_;
  const { isFavorite, isPending, toggle } = useFavorites();
  const liked = isFavorite(episode.slug, "podcast_episode");
  const busy = isPending(episode.slug, "podcast_episode");
  const label = `${program.name} — ${episode.title}`;
  const pct = duration && duration > 0 ? Math.min(100, Math.round((position / duration) * 100)) : 0;

  return (
    <BentoCard tone="podcast" span={span}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {program.name}
        </p>
        {badge && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-2 text-title-m">{episode.title}</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">
        {formatEpisodeDate(episode.date)}
        {position > 5 && ` · ripreso a ${fmtTime(position)}`}
      </p>
      {pct > 0 && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-signal" style={{ width: `${pct}%` }} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <EpisodePlayButton
          track={{
            audio: episode.audio,
            title: episode.title,
            program: program.name,
            programSlug: program.slug,
            episodeSlug: episode.slug,
            cover: episode.cover,
          }}
          label={position > 5 ? "Riprendi" : "Ascolta"}
        />
        <button
          type="button"
          disabled={busy}
          aria-busy={busy}
          aria-pressed={liked}
          aria-label={liked ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          onClick={() =>
            toggle.mutate({
              item_id: episode.slug,
              item_type: "podcast_episode",
              label,
              link_url: episodeLink(program.slug, episode.slug),
            })
          }
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current text-signal" : ""}`} />
          )}
          {busy ? "Salvo…" : liked ? "Preferito" : "Mi piace"}
        </button>
        <CollectionPicker programSlug={program.slug} episodeSlug={episode.slug} label={label} />
        <ShareEpisodeDialog
          programSlug={program.slug}
          programName={program.name}
          episodeSlug={episode.slug}
          title={episode.title}
          cover={episode.cover}
          date={episode.date}
        />
      </div>
    </BentoCard>
  );
}

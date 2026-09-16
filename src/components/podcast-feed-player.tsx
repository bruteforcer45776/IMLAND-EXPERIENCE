import { useEffect, useState } from "react";

import {
  getLatestPodcastTrack,
  type LatestPodcastTrack,
} from "@/lib/podcast-feed.functions";
import { EpisodePlayButton } from "@/components/podcast-audio";

export function PodcastFeedPlayer({
  slug,
  name,
  cover,
  showArtwork = false,
  initialTrack = null,
}: {
  slug: string;
  name?: string;
  cover?: string;
  showArtwork?: boolean;
  initialTrack?: LatestPodcastTrack | null;
}) {
  const [track, setTrack] = useState<LatestPodcastTrack | null>(initialTrack);
  const [loading, setLoading] = useState(!initialTrack);

  useEffect(() => {
    if (initialTrack) {
      setTrack(initialTrack);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    getLatestPodcastTrack({ data: { slug } })
      .then((result) => active && setTrack(result))
      .catch(() => active && setTrack(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [initialTrack, slug]);

  if (loading) {
    return (
      <div className="space-y-4" aria-label="Caricamento player">
        {showArtwork && <div className="aspect-square animate-pulse rounded-2xl bg-muted" />}
        <div className="h-12 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!track) {
    return (
      <div className="space-y-4">
        {showArtwork && (
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-signal/40 bg-signal/5 p-6 text-center text-sm font-semibold text-signal">
            IMMAGINE IN ARRIVO
          </div>
        )}
        <p className="text-sm text-muted-foreground">Nuove puntate in arrivo.</p>
      </div>
    );
  }

  return (
    <div>
      {showArtwork && (
        track.image || cover ? (
          <img
            src={track.image || cover || ""}
            alt={`Copertina di ${track.title}`}
            loading="lazy"
            className="mb-5 aspect-square w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="mb-5 flex aspect-square items-center justify-center rounded-2xl border border-dashed border-signal/40 bg-signal/5 p-6 text-center text-sm font-semibold text-signal">
            IMMAGINE IN ARRIVO
          </div>
        )
      )}
      <p className="mb-3 line-clamp-2 text-sm font-semibold">{track.title}</p>
      <EpisodePlayButton
        track={{
          audio: track.audio,
          title: track.title,
          program: name ?? "Podcast IMLAND",
          programSlug: slug,
          episodeSlug: track.slug,
          cover: track.image || cover || "",
        }}
        className="min-h-11"
        label="Ascolta l’ultima puntata"
      />
    </div>
  );
}

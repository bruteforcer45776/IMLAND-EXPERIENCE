import { SpotlightCard } from "./spotlight-card";
import { useNowPlaying } from "@/hooks/use-now-playing";
import { usePlayer } from "./player-context";

export function NowPlaying({ compact = false }: { compact?: boolean }) {
  const { setOpen } = usePlayer();
  const { data: np } = useNowPlaying();
  const title = np?.trackTitle ?? "Voci di quartiere";
  const subtitle = np?.trackArtist
    ? `${np.trackArtist} · ${np?.stationName ?? "IMLAND Radio"}`
    : "Rubrica del mattino · fino alle 11:00";
  const artwork = np?.trackImage ?? np?.stationImage ?? null;

  return (
    <SpotlightCard
      onClick={() => setOpen(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      className={`flex items-center gap-4 rounded-full glass-panel px-4 py-3 shadow-sm transition hover:scale-[1.01] hover:shadow-md cursor-pointer ${compact ? "" : "md:px-5 md:py-4"}`}
    >
      {artwork ? (
        <img
          src={artwork}
          alt=""
          className="relative h-11 w-11 shrink-0 rounded-full border border-border object-cover"
          loading="lazy"
        />
      ) : (
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal text-signal-foreground">
          <span className="absolute inset-0 animate-ping rounded-full bg-signal/40" />
          <svg viewBox="0 0 24 24" className="relative h-5 w-5 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-citrus" />
          <span className="text-xs font-semibold uppercase tracking-wider text-citrus">On air</span>
        </div>
        <p className="truncate text-sm font-semibold">{title}</p>
        {!compact && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="hidden items-center gap-1 sm:flex">
        {[3, 6, 4, 7, 5, 8, 4].map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-foreground/70"
            style={{ height: `${h * 2}px` }}
          />
        ))}
      </div>
    </SpotlightCard>
  );
}

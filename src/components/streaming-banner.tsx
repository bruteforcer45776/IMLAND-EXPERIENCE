import { cn } from "@/lib/utils";

export const streamingPlatforms = [
  {
    name: "Spotify",
    icon: "https://cdn.simpleicons.org/spotify/1DB954",
    url: "https://open.spotify.com/search?q=IMLAND",
  },
  {
    name: "Apple Podcasts",
    icon: "https://cdn.simpleicons.org/applepodcasts/9933FF",
    url: "https://podcasts.apple.com/search?term=IMLAND",
  },
  {
    name: "YouTube Music",
    icon: "https://cdn.simpleicons.org/youtubemusic/FF0000",
    url: "https://music.youtube.com/search?q=IMLAND",
  },
  {
    name: "Amazon Music",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/amazonmusic.svg",
    url: "https://music.amazon.it/search/IMLAND",
  },
];

export function StreamingBanner({
  className,
  label = "Ascoltaci su:",
  iconClassName = "h-7 w-auto",
}: {
  className?: string;
  label?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {streamingPlatforms.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={p.name}
            className="transition-transform hover:scale-110"
          >
            <img
              src={p.icon}
              alt={p.name}
              className={cn("opacity-85 hover:opacity-100", iconClassName)}
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

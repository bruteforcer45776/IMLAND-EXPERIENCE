import { cn } from "@/lib/utils";
import { useState } from "react";

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
  {
    name: "TuneIn",
    icon: "/assets/tunin-logo.jpeg",
    url: "https://tunein.com/radio/Imland-Radio-s357176/",
  },
  {
    name: "myTuner Radio",
    icon: "https://mytuner-radio.com/favicon.ico",
    url: "https://mytuner-radio.com/it/radio/imland-radio-508202/",
  },
];

function StreamingPlatformLogo({
  platform,
  iconClassName,
}: {
  platform: (typeof streamingPlatforms)[number];
  iconClassName: string;
}) {
  const [logoAvailable, setLogoAvailable] = useState(true);
  if (!platform.icon || !logoAvailable) return null;

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform.name}
      className="transition-transform hover:scale-110"
    >
      <img
        src={platform.icon}
        alt={platform.name}
        className={cn("object-contain opacity-85 hover:opacity-100", iconClassName)}
        loading="lazy"
        onError={() => setLogoAvailable(false)}
      />
    </a>
  );
}

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
        {streamingPlatforms.map((platform) => (
          <StreamingPlatformLogo
            key={platform.name}
            platform={platform}
            iconClassName={iconClassName}
          />
        ))}
      </div>
    </div>
  );
}

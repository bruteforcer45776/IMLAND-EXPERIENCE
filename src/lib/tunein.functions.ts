import { createServerFn } from "@tanstack/react-start";

type TuneInFeed = {
  Header?: { Title?: string; Subtitle?: string };
  Primary?: { Image?: string; Title?: string; Subtitle?: string };
  Secondary?: { Image?: string; Title?: string; Subtitle?: string };
  Ttl?: number;
};

export type NowPlayingData = {
  stationName: string | null;
  stationImage: string | null;
  trackTitle: string | null;
  trackArtist: string | null;
  trackImage: string | null;
  ttl: number;
  raw?: TuneInFeed;
};

function splitArtistTitle(subtitle: string | null | undefined) {
  if (!subtitle) return { artist: null, title: null };
  const parts = subtitle.split(" - ");
  if (parts.length >= 2) {
    return { artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() };
  }
  return { artist: null, title: subtitle.trim() };
}

function toHttps(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace(/^http:\/\//i, "https://");
}

export const getNowPlaying = createServerFn({ method: "GET" }).handler(
  async (): Promise<NowPlayingData> => {
    const res = await fetch("https://feed.tunein.com/profiles/s357176/nowPlaying", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; IMLANDRadio/1.0; +https://imlandradio.it)",
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`TuneIn ${res.status}`);
    }
    const data = (await res.json()) as TuneInFeed;
    const secSub = data.Secondary?.Title ?? data.Header?.Subtitle ?? null;
    const { artist, title } = splitArtistTitle(secSub);
    return {
      stationName: data.Primary?.Title ?? data.Header?.Title ?? null,
      stationImage: toHttps(data.Primary?.Image),
      trackTitle: title,
      trackArtist: artist,
      trackImage: toHttps(data.Secondary?.Image),
      ttl: typeof data.Ttl === "number" ? data.Ttl : 20,
    };
  },
);

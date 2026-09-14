import { createServerFn } from "@tanstack/react-start";

import { podcastPrograms } from "@/data/podcast-programs";

export type LatestPodcastTrack = {
  title: string;
  audio: string;
  image: string | null;
};

export type PodcastFeedEpisode = LatestPodcastTrack & {
  slug: string;
  subtitle: string | null;
  date: string | null;
  duration?: string;
};

const decodeXml = (value: string) =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const slugify = (value: string) =>
  decodeXml(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const formatPubDate = (value: string | undefined) => {
  if (!value) return null;
  const date = new Date(decodeXml(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-");
};

const parseFeedItem = (item: string, fallbackTitle: string, index: number): PodcastFeedEpisode | null => {
  const audio =
    item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']audio\//i)?.[1] ??
    item.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1] ??
    null;
  if (!audio) return null;

  const title = item.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const description =
    item.match(/<itunes:subtitle[^>]*>([\s\S]*?)<\/itunes:subtitle>/i)?.[1] ??
    item.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1];
  const image =
    item.match(/<itunes:image[^>]+href=["']([^"']+)["']/i)?.[1] ??
    item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] ??
    null;
  const guid = item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1];
  const pubDate = item.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1];
  const duration = item.match(/<itunes:duration[^>]*>([\s\S]*?)<\/itunes:duration>/i)?.[1];
  const cleanTitle = title ? decodeXml(title) : fallbackTitle;

  return {
    slug: slugify(guid ?? cleanTitle) || `episodio-${index + 1}`,
    title: cleanTitle,
    subtitle: description ? decodeXml(description) : null,
    audio: decodeXml(audio),
    image: image ? decodeXml(image) : null,
    date: formatPubDate(pubDate),
    duration: duration ? decodeXml(duration) : undefined,
  };
};

export const getLatestPodcastTrack = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<LatestPodcastTrack | null> => {
    const program = podcastPrograms[data.slug];
    if (!program) return null;

    const response = await fetch(program.rssUrl, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });
    if (!response.ok) return null;

    const xml = await response.text();
    const item = xml.match(/<item\b[\s\S]*?<\/item>/i)?.[0];
    if (!item) return null;

    const audio =
      item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']audio\//i)?.[1] ??
      item.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1] ??
      null;
    if (!audio) return null;

    const title = item.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    const image =
      item.match(/<itunes:image[^>]+href=["']([^"']+)["']/i)?.[1] ??
      item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] ??
      null;

    return {
      title: title ? decodeXml(title) : program.name,
      audio: decodeXml(audio),
      image: image ? decodeXml(image) : null,
    };
  });

export const getPodcastFeedEpisodes = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; limit?: number }) => data)
  .handler(async ({ data }): Promise<PodcastFeedEpisode[]> => {
    const program = podcastPrograms[data.slug];
    if (!program) return [];

    const response = await fetch(program.rssUrl, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });
    if (!response.ok) return [];

    const xml = await response.text();
    const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
    return items
      .map((item, index) => parseFeedItem(item, program.name, index))
      .filter((item): item is PodcastFeedEpisode => Boolean(item))
      .slice(0, data.limit ?? 24);
  });

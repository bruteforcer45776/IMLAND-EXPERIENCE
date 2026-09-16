import { createServerFn } from "@tanstack/react-start";

import {
  podcastPrograms,
  podcastProgramList,
  type PodcastGroup,
} from "@/data/podcast-programs";

export type LatestPodcastTrack = {
  slug: string;
  title: string;
  audio: string;
  image: string | null;
};

export type PodcastFeedEpisode = LatestPodcastTrack & {
  subtitle: string | null;
  date: string | null;
  publishedAt: string | null;
  duration?: string;
};

export type PodcastCatalogItem = {
  slug: string;
  cover: string;
  publishedEpisodes: number;
  latestPublishedAt: string | null;
};

export type HomePodcastPreview = PodcastFeedEpisode & {
  programSlug: string;
  programName: string;
};

const FEED_CACHE_TTL = 10 * 60 * 1000;
const feedCache = new Map<string, { expires: number; xml: string }>();

async function getPodcastFeedXml(slug: string, rssUrl: string) {
  const now = Date.now();
  const cached = feedCache.get(slug);
  if (cached && cached.expires > now) return cached.xml;

  const response = await fetch(rssUrl, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
  });
  if (!response.ok) return null;

  const xml = await response.text();
  feedCache.set(slug, { xml, expires: now + FEED_CACHE_TTL });
  return xml;
}

const decodeXml = (value: string) =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
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

const urlSlug = (value: string | undefined) => {
  if (!value) return null;
  try {
    const pathname = new URL(decodeXml(value)).pathname;
    return pathname.split("/").filter(Boolean).at(-1)?.replace(/\.[a-z0-9]+$/i, "") ?? null;
  } catch {
    return null;
  }
};

const channelImage = (xml: string) =>
  xml.match(/<channel>[\s\S]*?<itunes:image[^>]+href=["']([^"']+)["']/i)?.[1] ??
  xml.match(/<channel>[\s\S]*?<image>[\s\S]*?<url[^>]*>([\s\S]*?)<\/url>/i)?.[1] ??
  null;

const formatPubDate = (value: string | undefined) => {
  if (!value) return null;
  const date = new Date(decodeXml(value));
  if (Number.isNaN(date.getTime())) return null;
  return date
    .toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
    .replace(/\//g, "-");
};

const publishedAt = (value: string | undefined) => {
  if (!value) return null;
  const date = new Date(decodeXml(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const parseFeedItem = (
  item: string,
  fallbackTitle: string,
  fallbackImage: string | null,
  index: number,
): PodcastFeedEpisode | null => {
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
    item.match(/<media:content[^>]+(?:url|href)=["']([^"']+)["'][^>]*medium=["']image/i)?.[1] ??
    null;
  const guid = item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1];
  const link = item.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1];
  const pubDate = item.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1];
  const duration = item.match(/<itunes:duration[^>]*>([\s\S]*?)<\/itunes:duration>/i)?.[1];
  const cleanTitle = title ? decodeXml(title) : fallbackTitle;

  return {
    slug:
      urlSlug(link) ??
      urlSlug(guid) ??
      (slugify(guid ?? cleanTitle) || `episodio-${index + 1}`),
    title: cleanTitle,
    subtitle: description ? decodeXml(description) : null,
    audio: decodeXml(audio),
    image: image ? decodeXml(image) : fallbackImage,
    date: formatPubDate(pubDate),
    publishedAt: publishedAt(pubDate),
    duration: duration ? decodeXml(duration) : undefined,
  };
};

const parseFeed = (xml: string, fallbackTitle: string) => {
  const fallbackImage = channelImage(xml);
  const decodedFallback = fallbackImage ? decodeXml(fallbackImage) : null;
  return (xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [])
    .map((item, index) => parseFeedItem(item, fallbackTitle, decodedFallback, index))
    .filter((item): item is PodcastFeedEpisode => Boolean(item))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
};

export const getLatestPodcastTrack = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<LatestPodcastTrack | null> => {
    const program = podcastPrograms[data.slug];
    if (!program) return null;
    const xml = await getPodcastFeedXml(program.slug, program.rssUrl);
    if (!xml) return null;
    return parseFeed(xml, program.name)[0] ?? null;
  });

export const getPodcastFeedEpisodes = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string; limit?: number }) => data)
  .handler(async ({ data }): Promise<PodcastFeedEpisode[]> => {
    const program = podcastPrograms[data.slug];
    if (!program) return [];
    const xml = await getPodcastFeedXml(program.slug, program.rssUrl);
    if (!xml) return [];
    return parseFeed(xml, program.name).slice(0, data.limit ?? 100);
  });

export const getPodcastCatalog = createServerFn({ method: "GET" })
  .inputValidator((data: { group: PodcastGroup }) => data)
  .handler(async ({ data }): Promise<PodcastCatalogItem[]> => {
    const rows = await Promise.all(
      podcastProgramList
        .filter((program) => program.group === data.group)
        .map(async (program) => {
          const xml = await getPodcastFeedXml(program.slug, program.rssUrl);
          if (!xml) {
            return {
              slug: program.slug,
              cover: program.cover,
              publishedEpisodes: program.publishedEpisodes,
              latestPublishedAt: null,
            };
          }
          const episodes = parseFeed(xml, program.name);
          return {
            slug: program.slug,
            cover: episodes[0]?.image ?? program.cover,
            publishedEpisodes: episodes.length,
            latestPublishedAt: episodes[0]?.publishedAt ?? null,
          };
        }),
    );
    return rows.sort((a, b) =>
      (b.latestPublishedAt ?? "").localeCompare(a.latestPublishedAt ?? ""),
    );
  });

/** Gli episodi editoriali più recenti, ricavati esclusivamente dai feed RSS ufficiali. */
export const getLatestHomePodcastEpisodes = createServerFn({ method: "GET" })
  .handler(async (): Promise<HomePodcastPreview[]> => {
    const rows = await Promise.all(
      podcastProgramList
        .filter((program) => program.group === "podcast")
        .map(async (program) => {
          const xml = await getPodcastFeedXml(program.slug, program.rssUrl);
          if (!xml) return [];
          return parseFeed(xml, program.name).map((episode) => ({
            ...episode,
            programSlug: program.slug,
            programName: program.name,
          }));
        }),
    );

    return rows
      .flat()
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
      .slice(0, 2);
  });

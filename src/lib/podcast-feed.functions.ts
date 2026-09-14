import { createServerFn } from "@tanstack/react-start";

import { podcastPrograms } from "@/data/podcast-programs";

export type LatestPodcastTrack = {
  title: string;
  audio: string;
  image: string | null;
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

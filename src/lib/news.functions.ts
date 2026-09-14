import { createServerFn } from "@tanstack/react-start";

export type TerritoryNewsItem = {
  id: string;
  tag: string;
  title: string;
  abstract: string;
  link: string;
  publishedAt: string | null;
  /** Quante testate del feed trattano lo stesso tema. */
  related: number;
};

export type TerritoryNewsPage = {
  items: TerritoryNewsItem[];
  trending: TerritoryNewsItem[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  topic: string;
};

export const NEWS_TOPICS = {
  territorio: "Piemonte OR Langhe OR Biella territorio",
  eventi: "Piemonte eventi OR sagre OR festival",
  cultura: "Piemonte cultura OR musica OR teatro",
  economia: "Piemonte imprese OR economia OR turismo",
} as const;

export type NewsTopic = keyof typeof NEWS_TOPICS;

function feedUrl(topic: NewsTopic) {
  return (
    "https://news.google.com/rss/search?q=" +
    encodeURIComponent(NEWS_TOPICS[topic]) +
    "&hl=it&gl=IT&ceid=IT:it"
  );
}

function decodeOnce(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, d: string) => String.fromCharCode(Number(d)));
}

function decodeEntities(input: string): string {
  return decodeOnce(decodeOnce(input))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decodeEntities(m[1]) : null;
}

const STOPWORDS = new Set([
  "della",
  "dello",
  "delle",
  "degli",
  "dell",
  "nella",
  "nello",
  "sulla",
  "sullo",
  "sono",
  "come",
  "dopo",
  "anche",
  "tutti",
  "tutte",
  "tutto",
  "oggi",
  "anni",
  "anno",
  "primo",
  "prima",
  "contro",
  "verso",
  "senza",
  "ancora",
  "nuovo",
  "nuova",
  "nuove",
  "nuovi",
  "quando",
  "perche",
  "perché",
  "essere",
  "questa",
  "questo",
  "gran",
  "grande",
  "piu",
  "più",
  "sarà",
  "sara",
  "stato",
  "stata",
  "ecco",
  "ora",
  "con",
  "per",
  "dal",
  "dai",
]);

function keywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zàèéìòóù\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w));
}

export const getTerritoryNews = createServerFn({ method: "GET" })
  .inputValidator((input: { limit?: number; offset?: number; topic?: string } | undefined) => ({
    limit: Math.min(24, Math.max(1, Math.trunc(input?.limit ?? 4))),
    offset: Math.max(0, Math.trunc(input?.offset ?? 0)),
    topic: (input?.topic && input.topic in NEWS_TOPICS ? input.topic : "territorio") as NewsTopic,
  }))
  .handler(async ({ data }): Promise<TerritoryNewsPage> => {
    const res = await fetch(feedUrl(data.topic), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; IMLANDExperience/1.0; +https://imland-experience-hub-territoriale.area-di-lavo-2221.chatgpt.site)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });
    if (!res.ok) throw new Error(`News feed ${res.status}`);
    const xml = await res.text();

    const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const all: TerritoryNewsItem[] = [];

    for (const block of blocks) {
      const rawTitle = pick(block, "title");
      const link = pick(block, "link");
      if (!rawTitle || !link) continue;

      const source = pick(block, "source");
      const sepIndex = rawTitle.lastIndexOf(" - ");
      const title = sepIndex > 20 ? rawTitle.slice(0, sepIndex).trim() : rawTitle;
      const rawDescription = pick(block, "description") ?? "";
      const pubDate = pick(block, "pubDate");

      // Google News duplicates the title inside the description: drop it.
      let description = rawDescription;
      if (description.toLowerCase().startsWith(title.toLowerCase())) {
        description = description.slice(title.length).replace(/^[\s\-–—|]+/, "");
      }
      if (source) {
        description = description.replace(new RegExp(`${source}\\s*$`, "i"), "").trim();
      }

      all.push({
        id: link,
        tag: source ?? "Territorio",
        title: title.endsWith(".") ? title : `${title}.`,
        abstract:
          description.length > 160 ? `${description.slice(0, 157).trimEnd()}...` : description,
        link,
        publishedAt: pubDate,
        related: 1,
      });
    }

    // Quante testate coprono lo stesso tema: proxy di "notizia più discussa".
    const freq = new Map<string, number>();
    for (const item of all) {
      for (const w of new Set(keywords(item.title))) {
        freq.set(w, (freq.get(w) ?? 0) + 1);
      }
    }
    for (const item of all) {
      const words = [...new Set(keywords(item.title))];
      const best = words.reduce((max, w) => Math.max(max, freq.get(w) ?? 1), 1);
      item.related = best;
    }

    const trending = [...all].sort((a, b) => b.related - a.related).slice(0, 5);

    const items = all.slice(data.offset, data.offset + data.limit);
    return {
      items,
      trending,
      total: all.length,
      offset: data.offset,
      limit: data.limit,
      hasMore: data.offset + data.limit < all.length,
      topic: data.topic,
    };
  });

import { createHash } from "crypto";

export const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "ttclid",
  "ref",
  "source",
  "medium",
];

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    for (const p of TRACKING_PARAMS) u.searchParams.delete(p);
    u.hash = "";
    return u.toString();
  } catch {
    return url.split("?")[0] ?? url;
  }
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function contentHash(title: string, excerpt: string, url: string): string {
  return sha256(
    `${normalizeUrl(url)}::${title.trim().toLowerCase()}::${excerpt.trim().toLowerCase()}`,
  );
}

export function urlHash(url: string): string {
  return sha256(normalizeUrl(url));
}

export function decodeEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, d: string) => String.fromCharCode(Number(d)))
    .replace(/\s+/g, " ")
    .trim();
}

export function pick(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decodeEntities(m[1]) : null;
}

export function parseRssItems(xml: string): Array<{
  title: string;
  link: string;
  description: string;
  pubDate: string | null;
  source: string | null;
  author: string | null;
}> {
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const items: ReturnType<typeof parseRssItems> = [];
  for (const block of blocks) {
    const rawTitle = pick(block, "title");
    const link = pick(block, "link");
    if (!rawTitle || !link) continue;
    const sepIndex = rawTitle.lastIndexOf(" - ");
    const title = sepIndex > 20 ? rawTitle.slice(0, sepIndex).trim() : rawTitle;
    let description = pick(block, "description") ?? "";
    if (description.toLowerCase().startsWith(title.toLowerCase())) {
      description = description
        .slice(title.length)
        .replace(/^[\s\-–—|]+/, "")
        .trim();
    }
    items.push({
      title,
      link: normalizeUrl(link),
      description,
      pubDate: pick(block, "pubDate"),
      source: pick(block, "source"),
      author: pick(block, "author") ?? pick(block, "dc:creator"),
    });
  }
  return items;
}

export function parseIsoOrRfcDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function isWithinHours(value: string | null, hours: number): boolean {
  if (!value) return true;
  const d = new Date(value);
  if (isNaN(d.getTime())) return true;
  return Date.now() - d.getTime() <= hours * 60 * 60 * 1000;
}

import type { ReactElement, ReactNode } from "react";

export const SITE_URL = "https://www.imlandradio.it";

export const SITE_NAME = "IMLAND EXPERIENCE";

export const GEO_CITIES = ["Vercelli", "Verbania", "Novara", "Biella"] as const;

export const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/P0C1ClGWD4YD0lkRvi88JtyEBWr2/social-images/social-1783652683370-Gemini_Generated_Image_7lk1k17lk1k17lk1-removebg-preview.webp";

/** Absolute canonical URL for a route path ("/radio"). */
export const canonical = (path: string) => ({
  rel: "canonical",
  href: `${SITE_URL}${path === "/" ? "/" : path.replace(/\/$/, "")}`,
});

/** JSON-LD script entry for a route head(). */
export const jsonLd = (data: unknown) => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});

const areaServed = GEO_CITIES.map((city) => ({
  "@type": "City",
  name: city,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Piemonte",
    addressCountry: "IT",
  },
}));

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "IMLAND Radio",
  url: SITE_URL,
  logo: `${SITE_URL}/imland-logo-black.png`,
  image: OG_IMAGE,
  description:
    "IMLAND EXPERIENCE è l'hub di musica, radio, podcast ed eventi del Piemonte nord-orientale: Vercelli, Verbania, Novara e Biella.",
  areaServed,
  knowsAbout: [
    "musica",
    "radio locale",
    "podcast",
    "eventi",
    "Vercelli",
    "Verbania",
    "Novara",
    "Biella",
    "Piemonte",
  ],
  address: {
    "@type": "PostalAddress",
    addressRegion: "Piemonte",
    addressCountry: "IT",
  },
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "it-IT",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/news?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const radioStationLd = {
  "@context": "https://schema.org",
  "@type": "RadioStation",
  "@id": `${SITE_URL}/radio#station`,
  name: "IMLAND Radio",
  url: `${SITE_URL}/radio`,
  parentOrganization: { "@id": `${SITE_URL}/#organization` },
  description:
    "Radio locale in diretta 24 ore su 24 con musica, programmi e voci del territorio tra Vercelli, Verbania, Novara e Biella.",
  broadcastAffiliateOf: { "@id": `${SITE_URL}/#organization` },
  genre: ["Musica", "Talk", "Territorio"],
  areaServed,
  inLanguage: "it-IT",
};

export const podcastSeriesLd = {
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  "@id": `${SITE_URL}/podcast#series`,
  name: "Podcast IMLAND EXPERIENCE",
  url: `${SITE_URL}/podcast`,
  description:
    "Podcast su musica, imprese, cultura ed eventi del territorio piemontese: Vercelli, Verbania, Novara e Biella.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "it-IT",
  about: ["musica", "radio", "territorio", "Piemonte"],
};

export const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "@id": `${SITE_URL}/eventi#business`,
  name: `${SITE_NAME} — Eventi e animazione`,
  url: `${SITE_URL}/eventi`,
  description:
    "Animazione e intrattenimento per eventi con musica dal vivo, dj set e radio in tour a Vercelli, Verbania, Novara e Biella.",
  parentOrganization: { "@id": `${SITE_URL}/#organization` },
  areaServed,
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Piemonte",
    addressCountry: "IT",
  },
};

export const memberProgramLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/member#service`,
  name: "IMLAND Member",
  serviceType: "Comunicazione territoriale per aziende, professionisti e associazioni",
  url: `${SITE_URL}/member`,
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed,
  description:
    "Rete territoriale con spot radio, podcast, eventi e visibilità locale nelle province di Vercelli, Novara, Biella e Verbania.",
};

export const newsCollectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/news#collection`,
  name: "News del territorio e dei Member",
  url: `${SITE_URL}/news`,
  inLanguage: "it-IT",
  about: ["Vercelli", "Novara", "Biella", "Verbania", "Piemonte", "imprese locali"],
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const podcastProgramLd = (program: {
  slug: string;
  name: string;
  tagline: string;
  cat: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  "@id": `${SITE_URL}/podcast/${program.slug}#series`,
  name: program.name,
  description: program.tagline,
  url: `${SITE_URL}/podcast/${program.slug}`,
  genre: program.cat,
  inLanguage: "it-IT",
  publisher: { "@id": `${SITE_URL}/#organization` },
});

export const podcastEpisodeLd = (opts: {
  programSlug: string;
  programName: string;
  episodeSlug: string;
  title: string;
  description?: string | null;
  audio: string;
  date?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "PodcastEpisode",
  "@id": `${SITE_URL}/podcast/${opts.programSlug}/${opts.episodeSlug}#episode`,
  name: opts.title,
  description: opts.description || undefined,
  url: `${SITE_URL}/podcast/${opts.programSlug}/${opts.episodeSlug}`,
  associatedMedia: { "@type": "MediaObject", contentUrl: opts.audio },
  datePublished: opts.date || undefined,
  partOfSeries: {
    "@type": "PodcastSeries",
    name: opts.programName,
    url: `${SITE_URL}/podcast/${opts.programSlug}`,
  },
  inLanguage: "it-IT",
});

function reactNodeToString(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(reactNodeToString).join("");
  if (typeof node === "object" && "props" in node) {
    const children = (node as ReactElement<{ children?: ReactNode }>).props.children;
    return reactNodeToString(children);
  }
  return "";
}

export const faqLd = (items: { q: string; a: string | ReactNode }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: reactNodeToString(it.a) },
  })),
});

export const newsArticleLd = (opts: {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: string;
  modifiedAt?: string;
  category?: string;
  keywords?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: opts.title,
  description: opts.description,
  url: opts.url,
  image: opts.image ? [opts.image] : undefined,
  datePublished: opts.publishedAt,
  dateModified: opts.modifiedAt ?? opts.publishedAt,
  author: { "@type": "Organization", name: "Redazione IMLAND Experience" },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/imland-logo-black.png` },
  },
  articleSection: opts.category,
  keywords: opts.keywords?.join(", "),
  inLanguage: "it-IT",
});

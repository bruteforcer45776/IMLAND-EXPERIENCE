import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { z } from "zod";

import { canonical } from "../lib/seo";
import { searchAll, searchKindLabel, type SearchItem, type SearchKind } from "../data/search-index";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/cerca")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Cerca su IMLAND Experience — podcast, eventi, news e partner" },
      {
        name: "description",
        content:
          "Una sola ricerca per tutto IMLAND: canali podcast, episodi, eventi del territorio, aziende partner e sezioni del sito.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Cerca su IMLAND Experience" },
      { property: "og:description", content: "Podcast, episodi, eventi, aziende partner e sezioni: tutto in un'unica ricerca." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [canonical("/cerca")],
  }),
  component: SearchPage,
});

const filters: { key: SearchKind | "tutti"; label: string }[] = [
  { key: "tutti", label: "Tutto" },
  { key: "podcast", label: "Canali" },
  { key: "episodio", label: "Episodi" },
  { key: "evento", label: "Eventi" },
  { key: "partner", label: "Partner" },
  { key: "pagina", label: "Sezioni" },
];

function ResultLink({ item, children }: { item: SearchItem; children: React.ReactNode }) {
  const className =
    "block rounded-2xl border border-outline bg-card p-5 transition-shadow hover:shadow-[var(--elevation-2)]";

  if (item.route?.path === "podcast") {
    return (
      <Link to="/podcast/$slug" params={{ slug: item.route.slug }} className={className}>
        {children}
      </Link>
    );
  }
  if (item.route?.path === "episodio" && item.route.episode) {
    return (
      <Link
        to="/podcast/$slug/$episode"
        params={{ slug: item.route.slug, episode: item.route.episode }}
        className={className}
      >
        {children}
      </Link>
    );
  }
  if (item.route?.path === "evento") {
    return (
      <Link to="/eventi/$slug" params={{ slug: item.route.slug }} className={className}>
        {children}
      </Link>
    );
  }
  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  if (item.to) {
    return (
      <Link to={item.to} className={className}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
}

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [value, setValue] = useState(q ?? "");
  const [kind, setKind] = useState<SearchKind | "tutti">("tutti");

  const query = q ?? "";
  const results = useMemo(() => searchAll(query, 60), [query]);
  const shown = kind === "tutti" ? results : results.filter((r) => r.kind === kind);

  return (
    <div className="container-im section-pad-sm">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">Cerca</span>
      </nav>

      <h1 className="mt-6 text-h1-im">
        Cerca in tutto <span className="im-gradient-text">IMLAND</span>.
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Podcast, episodi, eventi, aziende partner e sezioni del sito.
        <br />
        Una sola barra per tutti i contenuti.
      </p>

      <form
        role="search"
        className="mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-outline bg-card px-5 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ search: { q: value } });
        }}
      >
        <Search size={20} className="shrink-0 text-muted-foreground" aria-hidden />
        <label htmlFor="global-search" className="sr-only">Cerca su IMLAND</label>
        <input
          id="global-search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Cerca podcast, eventi, news, aziende…"
          className="h-11 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          autoComplete="off"
        />
        <button type="submit" className="shrink-0 rounded-full btn-blue px-5 py-2.5 text-sm">
          Cerca
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setKind(f.key)}
            aria-pressed={kind === f.key}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              kind === f.key
                ? "border-transparent btn-blue"
                : "border-outline bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {query.trim().length < 2 ? (
          <p className="text-muted-foreground">Scrivi almeno due lettere per iniziare.</p>
        ) : shown.length === 0 ? (
          <div className="rounded-3xl border border-outline bg-card p-8">
            <h2 className="text-h3-im">Nessun risultato per “{query}”.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prova con un altro termine oppure parti dalle sezioni principali.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/podcast" className="rounded-full btn-blue px-5 py-2.5 text-sm">Podcast</Link>
              <Link to="/radio" className="rounded-full border border-outline px-5 py-2.5 text-sm font-semibold">Radio</Link>
              <Link to="/eventi" className="rounded-full border border-outline px-5 py-2.5 text-sm font-semibold">Eventi</Link>
              <Link to="/news" className="rounded-full border border-outline px-5 py-2.5 text-sm font-semibold">News</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {shown.length} risultat{shown.length === 1 ? "o" : "i"} per “{query}”.
            </p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {shown.map((item, i) => (
                <li key={`${item.kind}-${item.title}-${i}`}>
                  <ResultLink item={item}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                      {searchKindLabel[item.kind]}
                      {item.meta ? ` · ${item.meta}` : ""}
                    </p>
                    <h2 className="mt-2 text-h3-im leading-snug">{item.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.subtitle}</p>
                  </ResultLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

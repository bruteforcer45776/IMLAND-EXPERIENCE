import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, ArrowRight, Megaphone } from "lucide-react";
import { canonical } from "../lib/seo";
import { getPublishedArticles } from "../lib/news-automation/public.functions";
import { NewsCover } from "../components/news-cover";
import { NewsDisclaimerModal } from "../components/news-disclaimer-modal";
import { curatedNews, type CuratedNewsItem } from "../data/curated-news";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News del territorio e dei Member — IMLAND EXPERIENCE" },
      { name: "description", content: "Notizie dal territorio e aggiornamenti delle realtà Member di IMLAND Experience." },
    ],
    links: [canonical("/news")],
  }),
  loader: async () => {
    try {
      return await getPublishedArticles({ data: { scope: "all", limit: 24, offset: 0 } });
    } catch {
      return { articles: [], count: 0 };
    }
  },
  component: NewsPage,
});

type Article = Awaited<ReturnType<typeof getPublishedArticles>>["articles"][number];

function isMemberNews(article: Article) {
  const structured = article.structured_data as { member_news?: boolean; audience?: string } | null;
  return article.category_slug === "member" || structured?.member_news === true || structured?.audience === "member";
}

function NewsCard({ article, member = false }: { article: Article; member?: boolean }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })
    : null;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-sm">
      <NewsCover src={article.cover_image_url} alt={article.cover_image_alt || article.title} className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-600">
          <span>{member ? "News dei Member" : article.category_slug || "Territorio"}</span>
          {date ? <span aria-hidden>·</span> : null}
          {date ? <time dateTime={article.published_at || undefined}>{date}</time> : null}
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink-950">{article.title}</h3>
        {article.summary ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">{article.summary}</p> : null}
        <Link to="/news/$slug" params={{ slug: article.slug }} className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-signal">
          Leggi la news <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function AdvCard() {
  return (
    <article className="theme-member flex min-h-[320px] flex-col justify-between rounded-[28px] border border-signal/30 bg-signal p-6 text-signal-foreground">
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-black/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]"><Megaphone className="h-4 w-4" aria-hidden /> ADV</span>
      <div>
        <h3 className="font-display text-2xl font-bold leading-tight">Comunica le novità della tua attività? Questo spazio può essere tuo.</h3>
        <Link to="/contatti" className="mt-5 inline-flex items-center gap-1 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink-950">Contattaci <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </article>
  );
}

function CuratedNewsCard({ item, priority = false }: { item: CuratedNewsItem; priority?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const date = new Date(item.publishedAt).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="relative block overflow-hidden">
        {imageFailed ? (
          <div className="flex aspect-[16/10] w-full items-center justify-center bg-neutral-100 px-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-600">
            Copertina non disponibile
          </div>
        ) : (
          <img
            src={item.image}
            alt=""
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onError={() => setImageFailed(true)}
            className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        )}
        <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          Anteprima: {item.source}
        </span>
      </a>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-600">
          <span className="text-signal">{item.source}</span>
          <span aria-hidden>·</span>
          <span>{item.province}</span>
          <span aria-hidden>·</span>
          <time dateTime={item.publishedAt}>{date}</time>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink-950">{item.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">{item.summary}</p>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-signal"
          aria-label={`Leggi su ${item.source}: ${item.title}`}
        >
          Leggi su {item.source} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </a>
      </div>
    </article>
  );
}

function NewsPage() {
  const { articles } = Route.useLoaderData();
  const memberNews = articles.filter(isMemberNews);
  const territoryNews = articles.filter((article) => !isMemberNews(article));
  const latestCuratedNews = [...curatedNews].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return (
    <main className="min-w-0 overflow-x-clip">
      <NewsDisclaimerModal />
      <header className="hero-frame min-w-0 section-pad px-6 text-center md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">IMLAND News</p>
        <h1 className="mx-auto mt-4 max-w-4xl break-words text-display-m text-ink-950">Le notizie che raccontano il territorio.</h1>
      </header>
      <section className="section-canvas">
        <div className="container-im min-w-0 section-pad-sm">
          <h2 className="break-words text-h2-im text-ink-950">Le ultime dal Piemonte.</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-600">Una selezione aggiornata dalle principali testate regionali. Le notizie si leggono sempre sulla fonte originale.</p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestCuratedNews.map((item, index) => <CuratedNewsCard key={item.url} item={item} priority={index < 2} />)}
            {territoryNews.map((article) => <NewsCard key={article.id} article={article} />)}
          </div>
        </div>
      </section>
      <section className="theme-member section-editorial">
        <div className="container-im section-pad-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-signal">News dei Member</p><h2 className="mt-3 text-h2-im text-ink-950">Lo spazio esclusivo dedicato ai Member.</h2></div>
            <span className="rounded-full bg-signal px-4 py-2 text-xs font-bold uppercase tracking-wider text-signal-foreground">Esclusivo Member</span>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {memberNews.map((article) => <NewsCard key={article.id} article={article} member />)}
            {!memberNews.length ? <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-border bg-white p-8 text-center text-ink-600">Le novità dei Member saranno pubblicate in questo spazio dedicato.</div> : null}
            <AdvCard />
          </div>
        </div>
      </section>
    </main>
  );
}

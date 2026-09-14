import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical } from "../lib/seo";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { NewsletterBanner } from "../components/newsletter-banner";
import CardSwap, { Card } from "../components/card-swap";
import { getTerritoryNews } from "@/lib/news.functions";
import { getPublishedArticles, getNewsCategories } from "@/lib/news-automation/public.functions";
import { HeroBanner } from "../components/hero-banner";

import { SectionSearch } from "../components/section-search";
import { NewsDisclaimerModal } from "../components/news-disclaimer-modal";
import { NewsCover } from "../components/news-cover";
import heroNews from "@/assets/hero-news-v3.webp";
import heroNewsMobile from "@/assets/hero-news-mobile.webp";
import { PageRails } from "../components/decor";
import { BentoGrid, BentoLinkCard, BentoAnchorCard } from "../components/bento";

const TOPICS = [
  { key: "territorio", label: "Territorio" },
  { key: "eventi", label: "Eventi" },
  { key: "cultura", label: "Cultura" },
  { key: "economia", label: "Economia" },
] as const;

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "long" });
}

function relativeTime(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 60) return `${Math.max(1, mins)} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h`;
  return `${Math.round(hours / 24)} g`;
}

function GeneratedArticlesSection() {
  const fetchArticles = useServerFn(getPublishedArticles);
  const fetchCategories = useServerFn(getNewsCategories);
  const [scope, setScope] = useState<"all" | "piemonte" | "italia">("all");
  const { data: articlesData } = useQuery({
    queryKey: ["generated-articles", scope],
    queryFn: () => fetchArticles({ data: { scope, limit: 9 } }),
    staleTime: 5 * 60_000,
  });
  const { data: categories } = useQuery({
    queryKey: ["news-categories"],
    queryFn: () => fetchCategories(),
    staleTime: 60 * 60_000,
  });

  const articles = articlesData?.articles ?? [];
  if (articles.length === 0) return null;

  const categoryLabel = (slug: string | null) =>
    categories?.find((c) => c.slug === slug)?.label ?? slug ?? "News";

  return (
    <section className="section-canvas px-4 section-pad md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Dalla redazione IMLAND
            </p>
            <h2 className="mt-4 text-h2-im">
              Notizie <span className="im-gradient-text">elaborate</span> per il territorio.
            </h2>
          </div>
          <div className="flex gap-2">
            {(["all", "piemonte", "italia"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`rounded-full border px-3 py-1 text-sm ${scope === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
              >
                {s === "all" ? "Tutte" : s === "piemonte" ? "Piemonte" : "Italia"}
              </button>
            ))}
          </div>
        </div>
        <BentoGrid className="mt-10">
          {articles.map((a) => (
            <BentoLinkCard
              key={a.id}
              to="/news/$slug"
              params={{ slug: a.slug }}
              tone="news"
              span={2}
              className="group flex flex-col"
            >
              <NewsCover
                src={a.cover_image_url}
                alt={a.cover_image_alt ?? a.title}
                className="mb-5 aspect-[16/9] w-full"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex w-fit items-center rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
                  {categoryLabel(a.category_slug)}
                </span>
                {a.published_at && (
                  <span className="text-xs text-muted-foreground/70">
                    {new Date(a.published_at).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-h3-im leading-snug">{a.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{a.summary}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-signal transition group-hover:translate-x-1">
                Leggi <ArrowRight className="h-4 w-4" />
              </span>
            </BentoLinkCard>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News dal territorio: Vercelli, Novara, Biella e Verbania" },
      {
        name: "description",
        content:
          "Ultime notizie da Vercelli, Novara, Biella e Verbania: territorio, musica, eventi, cultura ed economia, aggiornate dalle testate locali.",
      },
      {
        name: "keywords",
        content:
          "news Vercelli, news Novara, news Biella, news Verbania, notizie Piemonte, eventi, musica",
      },
      { name: "geo.region", content: "IT-PIE" },
      { property: "og:title", content: "News dal territorio: Vercelli, Novara, Biella e Verbania" },
      {
        property: "og:description",
        content:
          "Ultime notizie, storie più discusse e appuntamenti del Piemonte, aggiornati in tempo reale.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [canonical("/news")],
  }),
  component: NewsPage,
});

const PAGE_SIZE = 9;

function NewsPage() {
  const fetchNews = useServerFn(getTerritoryNews);
  const [topic, setTopic] = useState<(typeof TOPICS)[number]["key"]>("territorio");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { data, isPending, isError, isFetching } = useQuery({
    queryKey: ["territory-news", topic, limit],
    queryFn: () => fetchNews({ data: { limit, offset: 0, topic } }),
    staleTime: 5 * 60_000,
  });

  const items = data?.items ?? [];
  const featured = items.slice(0, 4);
  const trending = data?.trending ?? [];
  const canLoadMore = Boolean(data?.hasMore) && limit < 24;

  function changeTopic(next: typeof topic) {
    setTopic(next);
    setLimit(PAGE_SIZE);
  }

  return (
    <>
      <NewsDisclaimerModal />
      <PageRails variant="news" />
      <HeroBanner
        src={heroNews}
        srcMobile={heroNewsMobile}
        alt="Le notizie che danno voce al territorio — IMLAND News"
        ctaTop="64%"
        flush
        mobileBg="#7C3AED"
      >
        {TOPICS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => changeTopic(t.key)}
            aria-pressed={topic === t.key}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition ${
              topic === t.key ? "bg-signal text-white" : "bg-white text-ink-950 hover:bg-white/90"
            }`}
          >
            {t.label}
          </button>
        ))}
      </HeroBanner>

      <div className="page-inverted news-inverted">
        {/* In evidenza */}
        <section className="section-focus px-4 pt-6 pb-[var(--space-section)] md:px-8 md:pt-10 md:pb-[var(--space-section-lg)]">
          <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                In evidenza
              </p>
              <h2 className="mt-4 text-h2-im">
                Le storie che <span className="im-gradient-text">contano</span>.
              </h2>
              <p className="mt-6 whitespace-pre-line text-base text-muted-foreground md:text-lg">
                Una selezione dai titoli più recenti.
                {"\n"}Aggiornata ogni volta che il territorio si muove.
              </p>
              <div className="mt-6">
                <SectionSearch label="news" placeholder="Cerca una news, un podcast, un evento…" />
              </div>
              {isError && (
                <p className="mt-3 text-sm text-muted-foreground/70">
                  Aggiornamento non disponibile in questo momento.
                </p>
              )}
              <div className="hidden">
                <Link
                  to="/contatti"
                  className="inline-flex items-center justify-center rounded-full btn-blue px-6 py-3 text-sm"
                >
                  Proponi una news
                </Link>
                <Link
                  to="/radio"
                  className="inline-flex items-center justify-center rounded-full btn-ghost-glass px-6 py-3 text-sm"
                >
                  Ascolta la radio
                </Link>
              </div>
            </div>

            <div className="relative h-[420px] md:h-[460px]">
              {isPending || featured.length === 0 ? (
                <div className="absolute inset-0" />
              ) : (
                <CardSwap
                  key={`${topic}-${featured.length}`}
                  width={420}
                  height={300}
                  cardDistance={50}
                  verticalDistance={58}
                  delay={3500}
                  pauseOnHover
                  easing="elastic"
                >
                  {featured.map((n) => (
                    <Card key={n.id} className="p-6">
                      <a
                        href={n.link || "#"}
                        target={n.link ? "_blank" : undefined}
                        rel="noreferrer"
                        className="flex h-full flex-col"
                      >
                        <span className="inline-flex w-fit items-center rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
                          {n.tag}
                        </span>
                        <h3 className="mt-5 text-h3-im">{n.title}</h3>
                        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                          {n.abstract}
                        </p>
                        {formatDate(n.publishedAt) && (
                          <span className="mt-auto pt-4 text-xs text-muted-foreground/70">
                            {formatDate(n.publishedAt)}
                          </span>
                        )}
                      </a>
                    </Card>
                  ))}
                </CardSwap>
              )}
            </div>
          </div>
        </section>

        <GeneratedArticlesSection />

        {/* Ultime notizie */}
        <section className="section-canvas px-4 section-pad md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Le notizie dei protagonisti del nostro territorio
                </p>
                <h2 className="mt-4 text-h2-im">
                  Tutto quello che <span className="im-gradient-text">accade</span>.
                </h2>
              </div>
              {data && (
                <p className="text-xs text-muted-foreground/70">
                  {items.length} news su {data.total} disponibili.
                </p>
              )}
            </div>

            {isPending ? <div className="mt-10" /> : null}

            <BentoGrid className="mt-10">
              {isPending
                ? null
                : items.map((n) => (
                    <BentoAnchorCard
                      key={n.id}
                      href={n.link || "#"}
                      target={n.link ? "_blank" : undefined}
                      rel="noreferrer"
                      tone="news"
                      span={2}
                      className="group flex flex-col"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex w-fit items-center rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
                          {n.tag}
                        </span>
                        {relativeTime(n.publishedAt) && (
                          <span className="text-xs text-muted-foreground/70">
                            {relativeTime(n.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-5 text-h3-im leading-snug">{n.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                        {n.abstract}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-signal transition group-hover:translate-x-1">
                        Leggi <ArrowRight className="h-4 w-4" />
                      </span>
                    </BentoAnchorCard>
                  ))}
            </BentoGrid>

            {canLoadMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  disabled={isFetching}
                  onClick={() => setLimit((l) => Math.min(24, l + PAGE_SIZE))}
                  className="inline-flex items-center justify-center rounded-full btn-ghost-glass px-6 py-3 text-sm disabled:opacity-60"
                >
                  {isFetching ? "Carico…" : "Mostra altre news"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Le più discusse */}

        <section className="section-editorial relative isolate overflow-hidden px-4 section-pad md:px-8">
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Le più condivise
              </p>
              <h2 className="mt-4 text-h2-im">
                I temi più <span className="im-gradient-text">discussi</span>.
              </h2>
              <p className="mt-6 whitespace-pre-line text-base text-muted-foreground md:text-lg">
                Le notizie riprese dal maggior numero di testate.
                {"\n"}Il termometro di ciò di cui si parla davvero.
              </p>
            </div>

            <ol className="divide-y divide-border/60 overflow-hidden glass-panel rounded-3xl">
              {trending.map((n, i) => (
                <li key={n.id}>
                  <a
                    href={n.link || "#"}
                    target={n.link ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-start gap-4 p-5 transition hover:bg-muted/40"
                  >
                    <span className="mt-0.5 font-display text-2xl font-bold text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-base font-semibold leading-snug">
                        {n.title}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{n.tag}</span>
                        {n.related > 1 && <span>{n.related} testate ne parlano</span>}
                        {relativeTime(n.publishedAt) && <span>{relativeTime(n.publishedAt)}</span>}
                      </span>
                    </span>
                    <span className="pt-1 text-signal transition group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <NewsletterBanner
          eyebrow="Newsletter"
          title="Il territorio, ogni settimana."
          lead="Iscriviti: ti mandiamo le notizie e gli appuntamenti che contano."
        />
      </div>
    </>
  );
}

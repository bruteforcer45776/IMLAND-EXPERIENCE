import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Calendar, MapPin, Share2, AlertCircle } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { useMemo } from "react";
import type { Database } from "@/integrations/supabase/types";
import { canonical, jsonLd, newsArticleLd, SITE_URL } from "@/lib/seo";
import {
  getPublishedArticleBySlug,
  getNewsCategories,
} from "@/lib/news-automation/public.functions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NewsDisclaimerModal } from "@/components/news-disclaimer-modal";
import { NewsCover } from "@/components/news-cover";
import { RelatedContent } from "@/components/related-content";

type ArticleRow = Database["public"]["Tables"]["news_articles"]["Row"];
type SourceRow = Database["public"]["Tables"]["news_article_sources"]["Row"];
type ArticlePageData = {
  article: ArticleRow;
  sources: SourceRow[];
  related: Pick<ArticleRow, "id" | "title" | "slug" | "category_slug" | "published_at">[];
};

function SanitizedBody({ html }: { html: string | null }) {
  const clean = useMemo(() => {
    if (!html) return "";
    const source = /<[a-z][\s\S]*>/i.test(html)
      ? html
      : html
          .split(/\n{2,}/)
          .map((block) => `<p>${block.split(/\n/).join("<br />")}</p>`)
          .join("");
    return DOMPurify.sanitize(source, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "a",
        "blockquote",
        "span",
        "img",
        "figure",
        "figcaption",
      ],
      ALLOWED_ATTR: ["href", "title", "alt", "src", "class", "target", "rel"],
      FORBID_ATTR: ["style"],
    });
  }, [html]);
  return (
    <div
      className="prose prose-lg mt-10 max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export const Route = createFileRoute("/news/$slug")({
  head: ({ loaderData }) => {
    const data = loaderData as ArticlePageData | undefined;
    const article = data?.article;
    const title = article?.seo_title || article?.title || "News — IMLAND EXPERIENCE";
    const description =
      article?.seo_description ||
      article?.summary ||
      "Notizie dal territorio piemontese — IMLAND Experience.";
    const url = article ? `${SITE_URL}/news/${article.slug}` : `${SITE_URL}/news`;
    const image = article?.cover_image_url || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
        ...(article?.published_at
          ? [{ property: "article:published_time", content: article.published_at }]
          : []),
        ...(article?.updated_at
          ? [{ property: "article:modified_time", content: article.updated_at }]
          : []),
      ],
      links: [canonical(`/news/${article?.slug ?? ""}`)],
      scripts: article
        ? [
            jsonLd(
              newsArticleLd({
                title,
                description,
                url,
                image,
                publishedAt: article.published_at || undefined,
                modifiedAt: article.updated_at || undefined,
                category: article.category_slug || undefined,
              }),
            ),
          ]
        : [],
    };
  },
  loader: async ({ params }) => {
    const data = await getPublishedArticleBySlug({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  component: ArticlePage,
  errorComponent: ArticleErrorState,
  notFoundComponent: ArticleNotFound,
});

function ArticleNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-h2-im">Articolo non trovato</h1>
      <p className="mt-3 text-muted-foreground">
        La notizia che cerchi non è disponibile o non è più pubblicata.
      </p>
      <Link
        to="/news"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Torna alle news
      </Link>
    </div>
  );
}

function ArticleErrorState({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-h2-im">Contenuto non disponibile</h1>
      <p className="mt-3 text-muted-foreground">Riprova tra qualche istante.</p>
      <Link
        to="/news"
        className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Torna alle news
      </Link>
    </div>
  );
}

function ArticlePage() {
  const params = useParams({ from: "/news/$slug" });
  const initial = Route.useLoaderData();
  const fetchArticle = useServerFn(getPublishedArticleBySlug);
  const fetchCategories = useServerFn(getNewsCategories);

  const { data } = useQuery<ArticlePageData>({
    queryKey: ["news-article", params.slug],
    queryFn: () => fetchArticle({ data: { slug: params.slug } }) as Promise<ArticlePageData>,
    initialData: initial as unknown as ArticlePageData,
    staleTime: 5 * 60_000,
  });

  const { data: categories } = useQuery({
    queryKey: ["news-categories"],
    queryFn: () => fetchCategories(),
    staleTime: 60 * 60_000,
  });

  if (!data) return null;
  const { article, sources, related } = data;
  const categoryLabel =
    categories?.find((c) => c.slug === article.category_slug)?.label ??
    article.category_slug ??
    "News";
  const inUpdate = (article.structured_data as { in_update?: boolean })?.in_update === true;
  const publishedAt = article.published_at
    ? new Date(article.published_at).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const updatedAt = article.updated_at
    ? new Date(article.updated_at).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const shareUrl = `https://imland-experience-hub-territoriale.area-di-lavo-2221.chatgpt.site/news/${article.slug}`;
  const shareText = encodeURIComponent(article.title);

  return (
    <>
      <NewsDisclaimerModal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            newsArticleLd({
              title: article.title,
              description: article.seo_description || article.summary || "",
              url: shareUrl,
              image: article.cover_image_url || undefined,
              publishedAt: article.published_at ?? undefined,
              modifiedAt: article.updated_at ?? undefined,
              category: categoryLabel,
              keywords: article.focus_keywords ?? [],
            }),
          ),
        }}
      />
      <nav className="mx-auto max-w-4xl px-4 pt-4 md:px-8" aria-label="breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/news">News</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{article.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <article className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
        <Link
          to="/news"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Torna alle news
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
              {categoryLabel}
            </span>
            {article.geographic_scope && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {article.geographic_scope === "piemonte"
                  ? "Piemonte"
                  : article.geographic_scope === "italia"
                    ? "Italia"
                    : (article.province ?? article.geographic_scope)}
              </span>
            )}
          </div>
          <h1 className="mt-4 text-h1-im">{article.title}</h1>
          {article.subtitle && (
            <p className="mt-3 text-xl text-muted-foreground">{article.subtitle}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {publishedAt && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Pubblicato il {publishedAt}
              </span>
            )}
            {updatedAt && updatedAt !== publishedAt && (
              <span>Ultimo aggiornamento: {updatedAt}</span>
            )}
          </div>
        </header>

        {article.summary && (
          <div className="mt-8 rounded-2xl border-l-4 border-signal bg-muted/40 p-6 text-lg leading-relaxed">
            {article.summary}
          </div>
        )}

        {inUpdate && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning-foreground">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Notizia in aggiornamento. I dettagli potrebbero variare man mano che nuove fonti
              confermano l'informazione.
            </p>
          </div>
        )}

          <figure className="mt-8">
            <NewsCover
              src={article.cover_image_url}
              alt={article.cover_image_alt || article.title}
              className="aspect-[16/9] w-full"
              priority
            />
          </figure>

        <SanitizedBody html={article.body} />

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Contenuto elaborato dalla redazione IMLAND sulla base delle fonti indicate.
          </p>
        </div>

        {sources.length > 0 && (
          <section className="mt-10 rounded-2xl border border-border bg-muted/30 p-6">
            <h2 className="text-h3-im">Fonti e approfondimenti</h2>
            <ul className="mt-4 space-y-3">
              {sources.map((s: SourceRow) => (
                <li key={s.id} className="text-sm">
                  <a
                    href={s.original_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {s.source_name}
                  </a>
                  {s.original_title && (
                    <span className="block text-muted-foreground">{s.original_title}</span>
                  )}
                  {s.published_at && (
                    <span className="block text-xs text-muted-foreground/70">
                      {new Date(s.published_at).toLocaleDateString("it-IT")}
                    </span>
                  )}
                  {s.author && (
                    <span className="block text-xs text-muted-foreground/70">di {s.author}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Condividi:</span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border p-2 text-muted-foreground hover:bg-muted"
          >
            <Share2 className="h-4 w-4" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border p-2 text-muted-foreground hover:bg-muted"
          >
            X
          </a>
          <a
            href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border p-2 text-muted-foreground hover:bg-muted"
          >
            WA
          </a>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-h2-im">Articoli correlati</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((r: ArticlePageData["related"][number]) => (
                <Link
                  key={r.id}
                  to="/news/$slug"
                  params={{ slug: r.slug }}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-signal/50"
                >
                  <span className="inline-flex w-fit items-center rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
                    {categories?.find((c) => c.slug === r.category_slug)?.label ??
                      r.category_slug ??
                      "News"}
                  </span>
                  <h3 className="mt-3 text-base font-semibold leading-snug">{r.title}</h3>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-signal transition group-hover:translate-x-1">
                    Leggi <ArrowLeft className="h-4 w-4 rotate-180" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
        <RelatedContent kind="news" id={article.id} />
      </article>
    </>
  );
}

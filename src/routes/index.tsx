import { lazy, Suspense } from "react";
import { canonical, jsonLd, organizationLd, websiteLd, SITE_URL } from "../lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Radio } from "lucide-react";

import { HeroCinematic } from "../components/home/hero-cinematic";
import { Reveal } from "../components/reveal";
import { PageRails, BauhausStrip } from "../components/decor";
import { AdvSlot } from "../components/adv-slot";

const PartnerLoop = lazy(() =>
  import("../components/partner-bar/PartnerLoop").then((module) => ({
    default: module.PartnerLoop,
  })),
);
const NewsletterBanner = lazy(() =>
  import("../components/newsletter-banner").then((m) => ({ default: m.NewsletterBanner })),
);
const DownloadAppBanner = lazy(() =>
  import("../components/download-app-banner").then((m) => ({ default: m.DownloadAppBanner })),
);
import { seoFaq } from "../data/seo-faq";
import { formatEventDate, formatEventTime, upcomingEvents } from "../data/events";
import { latestEpisodes, programs } from "../data/podcast-derived";
import heroMoleLcp from "@/assets/home-mole-torino-opt.webp";

const featuredEpisode = latestEpisodes[0];

const newsPreviews = [
  {
    tag: "Territorio",
    title: "Le Langhe si raccontano.",
    abstract:
      "Cantine, borghi e strade panoramiche.\nUn itinerario per scoprire il cuore del Piemonte.",
  },
  {
    tag: "Eventi",
    title: "La stagione degli appuntamenti.",
    abstract: "Festival, sagre e concerti in arrivo.\nTutto quello che accade vicino a te.",
  },
  {
    tag: "Radio",
    title: "Nuove voci in diretta.",
    abstract: "Conduttori che vivono qui.\nProgrammi pensati per la community.",
  },
];

const homeToneForTag = (tag: string) =>
  tag === "Eventi" ? "theme-eventi" : tag === "Radio" ? "theme-radio" : "theme-news";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Musica, radio e podcast a Vercelli, Novara, Biella e Verbania" },
      {
        name: "description",
        content:
          "IMLAND EXPERIENCE: radio locale in diretta 24/7, musica, podcast ed eventi tra Vercelli, Novara, Biella e Verbania. Ascolta ora e scopri il territorio.",
      },
      {
        name: "keywords",
        content:
          "musica, radio, radio Vercelli, radio Novara, radio Biella, radio Verbania, podcast Piemonte, eventi Piemonte",
      },
      {
        property: "og:title",
        content: "Musica, radio e podcast a Vercelli, Novara, Biella e Verbania",
      },
      {
        property: "og:description",
        content:
          "Radio in diretta 24/7, musica, podcast ed eventi del territorio piemontese in un'unica piattaforma.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Musica, radio e podcast a Vercelli, Novara, Biella e Verbania",
      },
      {
        name: "twitter:description",
        content: "Radio in diretta 24/7, musica, podcast ed eventi del territorio piemontese.",
      },
      { name: "geo.region", content: "IT-PIE" },
      { name: "geo.placename", content: "Vercelli, Novara, Biella, Verbania" },
    ],
    links: [
      canonical("/"),
      { rel: "preload", as: "image", href: heroMoleLcp, fetchPriority: "high" },
    ],

    scripts: [jsonLd(organizationLd), jsonLd(websiteLd)],
  }),
});

const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.16em] text-im-blue";
const h2 =
  "mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.03em] text-ink-950";
const keyword = "im-gradient-text";
const shell = "mx-auto w-full max-w-[1200px] px-4 md:px-8";

function Home() {
  return (
    <div className="home-glass-stack imland-night text-foreground">
      <PageRails variant="default" />
      <HeroCinematic />

      {/* PARTNER — I nostri partner ufficiali */}
      <section className="home-partners relative overflow-hidden border-y border-black/10 bg-white section-pad-sm">
        <div className="relative container-im">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-black/55">
            Members e realtà del territorio:
          </p>
        </div>
        <Suspense fallback={<div className="h-16" />}>
          <PartnerLoop fadeOutColor="#ffffff" />
        </Suspense>
      </section>

      {/* ECOSISTEMA EDITORIALE — timeline Radio, Podcast, Eventi e News */}
      <AdvSlot position="alto" />
      <section className="home-ecosystem relative overflow-hidden section-pad">
        <div className={shell}>
          <p className={eyebrow}>L'ecosistema IMLAND</p>
          <h2 className={`${h2} mt-3`}>
            Una linea diretta con il <span className={keyword}>territorio</span>.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-ink-600">
            Dalla diretta all'ascolto on demand, dagli appuntamenti alle notizie: ogni contenuto è
            parte della stessa esperienza territoriale.
          </p>

          <div className="relative mt-14 pl-9 md:pl-0">
            <div
              aria-hidden
              className="absolute bottom-0 left-[14px] top-0 w-[3px] rounded-full bg-black/10 md:left-1/2 md:-translate-x-1/2"
            />
            <ol className="relative space-y-14 md:space-y-20">
              <li className="theme-radio relative md:grid md:grid-cols-2 md:gap-14">
                <span
                  aria-hidden
                  className="absolute -left-9 top-10 h-7 w-7 rounded-full border-4 border-white bg-signal shadow-md md:left-1/2 md:-translate-x-1/2"
                />
                <Reveal>
                  <div className="md:pr-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                      Radio · 24/7
                    </p>
                    <h2 className={h2}>La voce del territorio, sempre accesa.</h2>
                    <p className="mt-5 text-lg text-ink-600">
                      Musica, programmi e dirette accompagnano il territorio 24 ore su 24, sette
                      giorni su sette.
                    </p>
                    <Link
                      to="/radio"
                      className="mt-7 inline-flex h-12 items-center rounded-full btn-blue px-7 text-[15px]"
                    >
                      Vai alla Radio <span className="btn-arrow">→</span>
                    </Link>
                  </div>
                </Reveal>
                <Reveal delay={90}>
                  <div className="mt-7 md:col-start-2 md:mt-0 md:pl-7">
                    <div className="card-im rounded-[28px] bg-white p-7">
                      <Radio className="h-10 w-10 text-signal" aria-hidden />
                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                        In diretta ogni giorno
                      </p>
                      <h3 className="mt-3 text-h3-im text-ink-950">
                        Programmi, musica e voci locali.
                      </h3>
                      <p className="mt-3 text-sm text-ink-600">
                        Ascolta il flusso live e scopri il palinsesto completo nell'area Radio.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>

              <li className="theme-podcast relative md:grid md:grid-cols-2 md:gap-14">
                <span
                  aria-hidden
                  className="absolute -left-9 top-10 h-7 w-7 rounded-full border-4 border-white bg-signal shadow-md md:left-1/2 md:-translate-x-1/2"
                />
                <Reveal>
                  <div className="md:col-start-2 md:pl-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                      Podcast · on demand
                    </p>
                    <h2 className={h2}>Le storie continuano oltre la diretta.</h2>
                    <p className="mt-5 text-lg text-ink-600">
                      Serie, episodi e approfondimenti da ascoltare quando vuoi.
                    </p>
                    <Link
                      to="/podcast"
                      className="mt-7 inline-flex h-12 items-center rounded-full btn-blue px-7 text-[15px]"
                    >
                      Vai ai Podcast <span className="btn-arrow">→</span>
                    </Link>
                  </div>
                </Reveal>
                <div className="mt-7 grid gap-4 md:col-start-1 md:row-start-1 md:mt-0 md:pr-7">
                  {featuredEpisode && (
                    <Link
                      to="/podcast/$slug/$episode"
                      params={{
                        slug: featuredEpisode.program.slug,
                        episode: featuredEpisode.ep.slug,
                      }}
                      className="card-im flex h-full flex-col rounded-[28px] bg-white p-7"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                        Ultimo episodio · {featuredEpisode.program.name}
                      </p>
                      <h3 className="mt-3 text-h3-im leading-snug text-ink-950">
                        {featuredEpisode.ep.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm text-ink-600">
                        {featuredEpisode.ep.subtitle ?? featuredEpisode.program.tagline}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-signal">
                        Ascolta l'episodio <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {programs.slice(0, 2).map((program) => (
                      <Link
                        key={program.slug}
                        to="/podcast"
                        className="group flex h-full flex-col rounded-[24px] border border-border bg-white p-5 transition-all duration-fast hover:-translate-y-1 hover:shadow-[var(--elevation-2)]"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                          Podcast
                        </p>
                        <h3 className="mt-3 font-display text-lg font-bold leading-tight text-ink-950">
                          {program.name}
                        </h3>
                        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-signal">
                          Scopri <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              <li className="theme-eventi relative md:grid md:grid-cols-2 md:gap-14">
                <span
                  aria-hidden
                  className="absolute -left-9 top-10 h-7 w-7 rounded-full border-4 border-white bg-signal shadow-md md:left-1/2 md:-translate-x-1/2"
                />
                <Reveal>
                  <div className="md:pr-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                      Eventi · dal vivo
                    </p>
                    <h2 className={h2}>Il territorio si incontra.</h2>
                    <p className="mt-5 text-lg text-ink-600">
                      Festival, appuntamenti, incontri e iniziative da vivere vicino a te.
                    </p>
                    <Link
                      to="/eventi"
                      className="mt-7 inline-flex h-12 items-center rounded-full btn-blue px-7 text-[15px]"
                    >
                      Vai agli Eventi <span className="btn-arrow">→</span>
                    </Link>
                  </div>
                </Reveal>
                <div className="mt-7 grid gap-4 md:col-start-2 md:mt-0 md:pl-7">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.slice(0, 2).map((e) => (
                      <Link
                        key={e.slug}
                        to="/eventi/$slug"
                        params={{ slug: e.slug }}
                        className="card-im group relative flex h-full flex-col rounded-[28px] bg-white p-7"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="rounded-2xl bg-signal/15 px-4 py-2.5 text-center">
                            <span className="block font-display text-2xl font-bold leading-none text-ink-950">
                              {new Date(e.start).getDate()}
                            </span>
                            <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.16em] text-ink-800">
                              {new Date(e.start).toLocaleDateString("it-IT", { month: "short" })}
                            </span>
                          </div>
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink-600">
                            {e.category}
                          </span>
                        </div>
                        <h3 className="mt-6 text-h3-im leading-snug text-ink-950">{e.title}</h3>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-600">
                          <MapPin className="h-3.5 w-3.5" />
                          {e.place} · {e.territory}
                        </p>
                        <p className="mt-3 text-xs text-ink-600">
                          {formatEventDate(e.start)} · ore {formatEventTime(e.start)}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <Link to="/eventi" className="card-im rounded-[28px] bg-white p-7">
                      <h3 className="text-h3-im text-ink-950">Appuntamenti presto in arrivo.</h3>
                      <p className="mt-3 text-sm text-ink-600">
                        Scopri i format e proponi il tuo evento.
                      </p>
                    </Link>
                  )}
                </div>
              </li>

              <li className="theme-news relative md:grid md:grid-cols-2 md:gap-14">
                <span
                  aria-hidden
                  className="absolute -left-9 top-10 h-7 w-7 rounded-full border-4 border-white bg-signal shadow-md md:left-1/2 md:-translate-x-1/2"
                />
                <Reveal>
                  <div className="md:col-start-2 md:pl-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                      News · territorio
                    </p>
                    <h2 className={h2}>Le ultime voci diventano notizia.</h2>
                    <p className="mt-5 text-lg text-ink-600">
                      Storie, novità e informazioni selezionate dalla redazione IMLAND.
                    </p>
                    <Link
                      to="/news"
                      className="mt-7 inline-flex h-12 items-center rounded-full btn-blue px-7 text-[15px]"
                    >
                      Vai alle News <span className="btn-arrow">→</span>
                    </Link>
                  </div>
                </Reveal>
                <div className="mt-7 grid gap-4 md:col-start-1 md:row-start-1 md:mt-0 md:pr-7">
                  {newsPreviews.map((n) => (
                    <Link
                      key={n.title}
                      to="/news"
                      className={`${homeToneForTag(n.tag)} group block`}
                    >
                      <div className="card-im relative flex h-full flex-col rounded-[24px] bg-white p-6">
                        <span className="inline-flex w-fit items-center rounded-full bg-signal/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-signal">
                          {n.tag}
                        </span>
                        <h3 className="mt-4 text-h3-im text-ink-950">{n.title}</h3>
                        <p className="mt-2 whitespace-pre-line text-sm text-ink-600">
                          {n.abstract}
                        </p>
                        <ArrowRight className="mt-5 h-4 w-4 self-end text-signal transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <AdvSlot position="medio" />

      {/* PARTNER / MEMBER */}
      <section className="theme-member bg-white section-pad">
        <div className={shell}>
          <Reveal>
            <div className="theme-member relative overflow-hidden rounded-[32px] bg-signal p-8 text-signal-foreground md:p-12">
              <div className="max-w-3xl">
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  Aziende e professionisti
                </p>
                <h2 className="mt-4 text-h2-im text-white">Dai più voce alla tua attività.</h2>
                <p className="mt-4 max-w-2xl text-lg text-white/85">
                  Entra nella rete IMLAND Member e porta la tua realtà in radio, nei podcast, negli
                  eventi e nei contenuti del territorio. Più visibilità, nuove relazioni e servizi
                  pensati per comunicare in modo continuativo.
                </p>
                <Link
                  to="/member"
                  className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-ink-950 transition-all duration-fast hover:bg-white/90 active:scale-[0.98]"
                >
                  Sei un'azienda o un professionista? Diventa partner
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-white section-pad">
        <div className={shell}>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <Reveal>
              <div>
                <p className={eyebrow}>Domande frequenti</p>
                <h2 className={h2}>
                  Tutto quello che ti serve <span className={keyword}>sapere</span>.
                </h2>
                <Link
                  to="/faq"
                  className="mt-8 inline-flex h-11 items-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-ink-800 transition-colors hover:bg-muted"
                >
                  Vai alle FAQ
                  <span className="btn-arrow">→</span>
                </Link>
              </div>
            </Reveal>
            <div className="space-y-3">
              {seoFaq.slice(0, 4).map((f, i) => (
                <Reveal key={f.q} delay={i * 90}>
                  <details className="card-im group rounded-[22px] bg-white px-6 py-5">
                    <summary className="cursor-pointer list-none font-display text-base font-bold text-ink-950 marker:hidden">
                      {f.q}
                    </summary>
                    <p className="mt-3 text-sm text-ink-600">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ADV — banner pubblicitario basso */}
      <AdvSlot position="basso" />

      {/* NEWSLETTER */}
      <section className="relative isolate overflow-hidden bg-white section-pad">
        <div className={shell}>
          <Reveal>
            <Suspense fallback={<div className="h-48" />}>
              <NewsletterBanner />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {/* APP */}
      <Reveal>
        <Suspense fallback={<div className="h-64" />}>
          <DownloadAppBanner />
        </Suspense>
      </Reveal>

      {/* CONTATTI */}
      <section className="section-focus section-pad-sm">
        <div className={shell}>
          <Reveal>
            <div className="card-im flex flex-col gap-7 rounded-[28px] bg-white p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div className="max-w-2xl">
                <p className={eyebrow}>Contatti</p>
                <h2 className="mt-3 text-h2-im text-ink-950">
                  Hai una storia, un progetto o un evento da raccontare?
                </h2>
                <p className="mt-4 text-lg text-ink-600">
                  Parla con la redazione o scopri come portare la tua realtà nell'ecosistema IMLAND.
                </p>
              </div>
              <Link
                to="/contatti"
                className="inline-flex h-12 shrink-0 items-center rounded-full btn-blue px-7 text-[15px]"
              >
                Contattaci <span className="btn-arrow">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

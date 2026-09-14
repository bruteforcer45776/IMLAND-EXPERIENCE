import { lazy, Suspense } from "react";
import { canonical, jsonLd, organizationLd, websiteLd, SITE_URL } from "../lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";

import { HeroCinematic } from "../components/home/hero-cinematic";
import { Reveal } from "../components/reveal";
import { PageRails, BauhausStrip } from "../components/decor";
import { quickLinks } from "../data/home-quick-links";
import { BadgeIcon } from "../components/badge-icon";
import { AdvSlot } from "../components/adv-slot";
import { BentoGrid, BentoLinkCard } from "../components/bento";

const PartnerLoop = lazy(() =>
  import("../components/partner-bar/PartnerLoop").then((m) => ({ default: m.PartnerLoop })),
);
const NewsletterBanner = lazy(() =>
  import("../components/newsletter-banner").then((m) => ({ default: m.NewsletterBanner })),
);
const DownloadAppBanner = lazy(() =>
  import("../components/download-app-banner").then((m) => ({ default: m.DownloadAppBanner })),
);
import { seoFaq } from "../data/seo-faq";
import {
  eventTerritories,
  formatEventDate,
  formatEventTime,
  nextEvent,
  upcomingEvents,
} from "../data/events";
import { latestEpisodes, programs, totalEpisodes } from "../data/podcast-derived";
import { partnerLogos } from "../data/partner-logos";
import heroMoleLcp from "@/assets/home-mole-torino-opt.webp";
import { WHATSAPP_MEMBER_URL } from "@/lib/whatsapp";

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

const memberBenefits = [
  { k: "Radio", v: "Crea il tuo spot o la tua rubrica in onda." },
  { k: "Podcast", v: "Produci la tua serie con il nostro studio." },
  { k: "Eventi", v: "Porta il tuo evento nel calendario IMLAND." },
  { k: "Community", v: "Entra tra le voci che raccontano il territorio." },
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
    <div className="imland-night text-foreground">
      <PageRails variant="default" />
      <HeroCinematic />

      {/* PARTNER — I nostri partner ufficiali */}
      <section className="relative overflow-hidden border-y border-black/10 bg-white section-pad-sm">
        <div className="relative container-im">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-black/55">
            Membri e realtà del territorio:
          </p>
        </div>
        <Suspense fallback={<div className="h-16" />}>
          <PartnerLoop fadeOutColor="#ffffff" />
        </Suspense>
      </section>

      {/* QUICK LINKS — i nostri servizi */}

      <section className="decor-host relative isolate overflow-hidden bg-white section-pad-sm">
        <div className={`relative ${shell}`}>
          <p className={eyebrow}>I nostri servizi</p>
          <h2 className={`${h2} mt-3`}>
            Tutti i modi per vivere il <span className={keyword}>territorio</span>.
          </h2>
          <BentoGrid className="mt-10">
            {quickLinks.map((q) => (
              <BentoLinkCard key={q.label} to={q.to} tone={q.tone} span={q.span} className="group">
                <BadgeIcon
                  name={q.badge}
                  tone={q.tone}
                  className="h-14 w-14 transition-transform duration-300 group-hover:scale-105"
                />

                <p className="mt-5 font-display text-lg font-bold text-ink-950">{q.label}</p>
                <p className="mt-0.5 text-sm text-ink-600">{q.desc}</p>
                <ArrowRight className="mt-5 h-4 w-4 text-[var(--bento-tone)] transition-transform duration-300 group-hover:translate-x-1" />
              </BentoLinkCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* ECOSISTEMA — filo rouge tra i servizi */}
      {/* ADV — banner pubblicitario alto */}
      <AdvSlot position="alto" />

      {/* IN EVIDENZA ORA — podcast + evento + news */}
      <section className="bg-white section-pad-sm">
        <div className={shell}>
          <p className={eyebrow}>In evidenza ora</p>
          <h2 className={`${h2} mt-3`}>
            Fresco di <span className={keyword}>oggi</span>.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredEpisode && (
              <Link
                to="/podcast/$slug/$episode"
                params={{ slug: featuredEpisode.program.slug, episode: featuredEpisode.ep.slug }}
                className="theme-podcast card-im flex h-full flex-col rounded-[28px] bg-white p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                  Ultimo podcast · {featuredEpisode.program.name}
                </p>
                <h3 className="mt-3 text-h3-im leading-snug text-ink-950">
                  {featuredEpisode.ep.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-ink-600">
                  {featuredEpisode.ep.subtitle ?? featuredEpisode.program.tagline}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-signal">
                  Ascolta l'episodio <ArrowRight className="inline h-4 w-4" />
                </span>
              </Link>
            )}

            {nextEvent ? (
              <Link
                to="/eventi/$slug"
                params={{ slug: nextEvent.slug }}
                className="theme-eventi card-im flex h-full flex-col rounded-[28px] bg-white p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                  Prossimo evento · {nextEvent.territory}
                </p>
                <h3 className="mt-3 text-h3-im leading-snug text-ink-950">{nextEvent.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{formatEventDate(nextEvent.start)}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-signal">
                  Scopri l'evento <ArrowRight className="inline h-4 w-4" />
                </span>
              </Link>
            ) : (
              <Link
                to="/eventi"
                className="theme-eventi card-im flex h-full flex-col rounded-[28px] bg-white p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                  Eventi
                </p>
                <h3 className="mt-3 text-h3-im leading-snug text-ink-950">
                  Le prossime date stanno arrivando.
                </h3>
                <p className="mt-2 text-sm text-ink-600">
                  Stiamo chiudendo il calendario con i territori.
                  <br />
                  Guarda i format e proponi il tuo evento.
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-signal">
                  Vai agli eventi <ArrowRight className="inline h-4 w-4" />
                </span>
              </Link>
            )}

            <Link to="/news" className="theme-news card-im flex h-full flex-col rounded-[28px] bg-white p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                Ultime news
              </p>
              <h3 className="mt-3 text-h3-im leading-snug text-ink-950">
                Le notizie del territorio, aggiornate ogni giorno.
              </h3>
              <p className="mt-2 text-sm text-ink-600">
                Vercelli, Novara, Biella e Verbania.
                <br />
                Selezionate dalla redazione IMLAND.
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-signal">
                Leggi le news <ArrowRight className="inline h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* IL TERRITORIO */}
      <section className="section-focus section-pad-sm">
        <div className={shell}>
          <p className={eyebrow}>Il territorio</p>
          <h2 className={`${h2} mt-3`}>
            Quattro province, una sola <span className={keyword}>voce</span>.
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {eventTerritories.map((t) => (
              <Link
                key={t}
                to="/cerca"
                search={{ q: t }}
                className="group flex h-full flex-col rounded-[24px] border border-border bg-white p-6 transition-all duration-fast hover:-translate-y-1 hover:shadow-[var(--elevation-2)]"
              >
                <MapPin className="h-6 w-6 text-im-blue" aria-hidden />
                <p className="mt-4 font-display text-lg font-bold text-ink-950">{t}</p>
                <p className="mt-1 text-sm text-ink-600">Radio, podcast ed eventi in zona.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-white section-pad-sm">
        <div className={shell}>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { v: "24/7", k: "Radio in diretta" },
              { v: `${programs.length}`, k: "Canali podcast" },
              { v: `${totalEpisodes}`, k: "Episodi pubblicati" },
              { v: `${partnerLogos.length}`, k: "Aziende partner" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-[24px] border border-border bg-white p-6 text-center"
              >
                <dt className="sr-only">{s.k}</dt>
                <dd>
                  <span className="block font-display text-3xl font-bold text-ink-950">{s.v}</span>
                  <span className="mt-1 block text-sm text-ink-600">{s.k}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ADV — banner pubblicitario medio */}
      <AdvSlot position="medio" />

      {/* NEWS */}
      <section className="theme-news brand-grid relative section-pad">
        <div className={shell}>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <div>
                <p className={eyebrow}>News</p>
                <h2 className={h2}>
                  Le ultime voci dal <span className={keyword}>territorio</span>.
                </h2>
                <p className="mt-5 max-w-lg text-lg text-ink-600">
                  Storie, eventi e voci raccolte dove accadono.
                  <br />
                  Un flusso di notizie per chi vive il Piemonte.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/news"
                    className="group inline-flex h-12 items-center gap-2 rounded-full btn-blue px-7 text-[15px]"
                  >
                    Vai alle news
                    <span className="btn-arrow">→</span>
                  </Link>
                  <Link
                    to="/contatti"
                    className="inline-flex h-12 items-center rounded-full border border-border bg-white px-6 text-[15px] font-semibold text-ink-800 transition-colors hover:bg-muted"
                  >
                    Proponi una news
                  </Link>
                </div>
              </div>
            </Reveal>

            <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:mt-0 md:flex-col md:overflow-visible md:pb-0">
              {newsPreviews.map((n, i) => (
                <Reveal key={n.tag} delay={i * 120}>
                  <Link
                    to="/news"
                    className={`${homeToneForTag(n.tag)} group block min-w-[82vw] snap-center sm:min-w-[320px] md:min-w-0`}
                  >
                    <div className="card-im relative flex h-full flex-col rounded-[24px] bg-white p-6">
                      <span className="inline-flex w-fit items-center rounded-full bg-signal/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-signal">
                        {n.tag}
                      </span>
                      <h3 className="mt-4 text-h3-im text-ink-950">{n.title}</h3>
                      <p className="mt-2 whitespace-pre-line text-sm text-ink-600">{n.abstract}</p>
                      <span className="mt-6 ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-signal/10 text-signal transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PODCAST */}
      <section className="theme-podcast section-focus section-pad">
        <div className={shell}>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className={eyebrow}>Podcast · on demand</p>
                <h2 className={h2}>
                  Ascolta i nostri <span className={keyword}>podcast</span>.
                </h2>
                <p className="mt-5 text-lg text-ink-600">
                  Business, cultura, cibo e tecnologia.
                  <br />
                  Le voci del territorio, quando vuoi tu.
                </p>
              </div>
              <Link
                to="/podcast"
                className="inline-flex h-11 items-center rounded-full border border-signal bg-white px-5 text-sm font-semibold text-signal transition-colors hover:bg-signal/5"
              >
                Tutte le serie
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </Reveal>
        </div>

        <div className={`${shell} mt-12`}>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {programs.slice(0, 4).map((program) => (
              <Link
                key={program.slug}
                to="/podcast"
                className="group flex h-full flex-col rounded-[28px] border border-border bg-white p-6 transition-all duration-fast hover:-translate-y-1 hover:shadow-[var(--elevation-2)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-im-blue">
                  Podcast
                </p>
                <h3 className="mt-4 font-display text-xl font-bold leading-tight text-ink-950">
                  {program.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm text-ink-600">{program.tagline}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-im-blue">
                  Ascolta la serie <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTI */}
      <section className="theme-eventi decor-host bg-white section-pad">
        <div className={shell}>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className={eyebrow}>Eventi · dal vivo</p>
                <h2 className={h2}>
                  Prossimi <span className={keyword}>eventi</span>.
                </h2>
              </div>
              <Link
                to="/eventi"
                className="inline-flex h-11 items-center rounded-full border border-signal bg-white px-5 text-sm font-semibold text-signal transition-colors hover:bg-signal/5"
              >
                Vedi tutti
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          </Reveal>

          {upcomingEvents.length > 0 ? (
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {upcomingEvents.slice(0, 3).map((e, i) => (
                <Reveal key={e.slug} delay={i * 100}>
                  <div className="card-im group relative flex h-full flex-col rounded-[28px] bg-white p-7">
                    <div className="flex items-start justify-between">
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
                    <h3 className="mt-8 text-h3-im leading-snug text-ink-950">{e.title}</h3>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-600">
                      <MapPin className="h-3.5 w-3.5" />
                      {e.place} · {e.territory}
                    </p>
                    <p className="mt-3 text-xs text-ink-600">
                      Inizio ore {formatEventTime(e.start)}
                    </p>
                    <div className="mt-auto pt-7">
                      <Link
                        to="/eventi/$slug"
                        params={{ slug: e.slug }}
                        className="inline-flex h-10 items-center rounded-full btn-blue px-4 text-xs"
                      >
                        Dettagli
                        <span className="btn-arrow">→</span>
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="card-im mt-14 rounded-[28px] bg-white p-8">
                <h3 className="text-h3-im text-ink-950">Appuntamenti presto in arrivo.</h3>
                <p className="mt-3 max-w-xl text-sm text-ink-600">
                  Stiamo definendo le prossime date con i territori.
                  <br />
                  Intanto scopri i format e proponi il tuo evento.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/eventi"
                    className="inline-flex h-11 items-center rounded-full btn-blue px-5 text-sm"
                  >
                    Scopri gli eventi
                    <span className="btn-arrow">→</span>
                  </Link>
                  <Link
                    to="/contatti"
                    className="inline-flex h-11 items-center rounded-full border border-border bg-white px-5 text-sm font-semibold text-ink-800"
                  >
                    Proponi un evento
                  </Link>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* COMMUNITY BANNER */}
      <section className="bg-white section-pad">
        <div className={shell}>
          <Reveal>
            <div className="theme-member relative overflow-hidden rounded-[32px] bg-signal p-8 text-signal-foreground md:p-12">
              <div className="max-w-3xl">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    La community
                  </p>
                  <h2 className="mt-4 text-h2-im text-white">Un posto per chi ama raccontare.</h2>
                  <p className="mt-4 max-w-md text-lg text-white/85">
                    Entra nel network di voci che danno vita al territorio.
                    <br />
                    Radio, podcast, eventi e persone.
                  </p>
                  <Link
                    to="/member"
                    className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-ink-950 transition-all duration-fast hover:bg-white/90 active:scale-[0.98]"
                  >
                    Unisciti alla community
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DUAL TRACK — cittadino vs azienda */}
      <section className="section-focus section-pad-sm">
        <div className={shell}>
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="theme-radio flex h-full flex-col rounded-[28px] border border-border bg-white p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-im-blue">
                  Sei una persona
                </p>
                <h3 className="mt-3 text-h3-im text-ink-950">Ascolta, partecipa, racconta.</h3>
                <p className="mt-3 text-sm text-ink-600">
                  Radio in diretta, podcast on demand ed eventi vicino a te.
                  <br />
                  Tutto gratuito, tutto del territorio.
                </p>
                <div className="mt-auto pt-7">
                  <Link
                    to="/radio"
                    className="inline-flex h-12 items-center rounded-full btn-blue px-6 text-[15px]"
                  >
                    Ascolta la radio
                    <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="theme-member flex h-full flex-col rounded-[28px] border border-border bg-white p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-800">
                  Sei un'azienda
                </p>
                <h3 className="mt-3 text-h3-im text-ink-950">Dai voce alla tua attività.</h3>
                <p className="mt-3 text-sm text-ink-600">
                  Visibilità in radio, podcast e eventi con pacchetti chiari.
                  <br />
                  Diventa Membro ufficiale di IMLAND Experience.
                </p>
                <div className="mt-auto pt-7">
                  <Link
                    to="/member"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-citrus px-6 text-[15px] font-semibold text-ink-950"
                  >
                    Diventa Partner
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
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
      <section className="section-focus pt-20">
        <Reveal>
          <Suspense fallback={<div className="h-64" />}>
            <DownloadAppBanner />
          </Suspense>
        </Reveal>
      </section>

      {/* CTA FINALE — Member */}
      <section className="bg-white section-pad">
        <div className={shell}>
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-[#e0a800] p-10 text-[#0b0c0f] md:p-16">
              <div className="relative z-10 max-w-3xl">
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#0b0c0f]/70">
                  IMLAND Member
                </p>
                <h2 className="mt-4 text-h2-im text-[#0b0c0f]">
                  Non ascoltare <span className="text-[#0b0c0f]">soltanto</span>.
                </h2>
                <p className="mt-5 text-lg text-[#0b0c0f]/70">
                  Diventa Member.
                  <br />
                  Sblocchi radio, podcast ed eventi come creatore, non solo come pubblico.
                </p>

                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                  {memberBenefits.map((b) => (
                    <li
                      key={b.k}
                      className="flex items-start gap-3 rounded-2xl border border-[#0b0c0f]/10 bg-[#0b0c0f]/[0.05] px-4 py-3"
                    >
                      <span className="mt-0.5 rounded-full bg-[#0b0c0f]/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0b0c0f]">
                        {b.k}
                      </span>
                      <span className="text-sm text-[#0b0c0f]/80">{b.v}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-11 flex flex-wrap gap-3">
                  <a
                    href={WHATSAPP_MEMBER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-[15px] font-semibold text-ink-950 transition-all duration-fast hover:bg-white/90 active:scale-[0.98]"
                  >
                    Diventa Member
                    <span className="btn-arrow">→</span>
                  </a>
                  <Link
                    to="/chi-siamo"
                    className="inline-flex h-12 items-center rounded-full border border-[#0b0c0f]/20 px-7 text-[15px] font-semibold text-[#0b0c0f] transition-colors hover:bg-[#0b0c0f]/10"
                  >
                    Chi siamo
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

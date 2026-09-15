import { canonical, jsonLd, podcastSeriesLd } from "../lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ProposalForm } from "../components/proposal-form";
import { NewsletterBanner } from "../components/newsletter-banner";
import { SpotlightCard } from "../components/spotlight-card";
import { StreamingBanner } from "../components/streaming-banner";
import { BadgeIcon, type BadgeName } from "../components/badge-icon";
import { HeroBanner } from "../components/hero-banner";

import { SectionSearch } from "../components/section-search";
import { BentoGrid, BentoLinkCard } from "../components/bento";
import heroPodcast from "@/assets/hero-podcast-v3.webp";
import heroPodcastMobile from "@/assets/hero-podcast-mobile.webp";
import { PageRails } from "../components/decor";
import {
  programs,
  totalEpisodes,
  categoryStats,
  curatedEpisodes,
  allEpisodes,
  type ProgramCard,
} from "../data/podcast-derived";
import {
  EpisodePlayButton,
  PodcastMiniPlayer,
  getSavedPosition,
  fmtTime,
} from "../components/podcast-audio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

/** Un bollino per categoria: colore pieno e simbolo coerente col tema. */
const categoryBadge: Record<string, BadgeName> = {
  Business: "aziende",
  Cultura: "cultura",
  Cibo: "festa",
  Tecnologia: "onde",
  Lifestyle: "community",
  Weekend: "calendario",
};

export const Route = createFileRoute("/podcast/")({
  head: () => ({
    meta: [
      { title: "Podcast del territorio: musica, imprese e storie del Piemonte" },
      {
        name: "description",
        content:
          "Podcast IMLAND: musica, radio, imprese e storie da Vercelli, Novara, Biella e Verbania. Interviste e inchieste dal territorio piemontese.",
      },
      {
        name: "keywords",
        content:
          "podcast, musica, podcast Vercelli, podcast Novara, podcast Biella, podcast Verbania, podcast Piemonte",
      },
      { name: "geo.region", content: "IT-PIE" },
      {
        property: "og:title",
        content: "Podcast del territorio: musica, imprese e storie del Piemonte",
      },
      {
        property: "og:description",
        content: "Musica, imprese e storie da Vercelli, Novara, Biella e Verbania.",
      },
    ],
    links: [canonical("/podcast")],
    scripts: [jsonLd(podcastSeriesLd)],
  }),
  component: PodcastPage,
});

const categories = ["Tutti", "Business", "Cultura", "Cibo", "Tecnologia", "Weekend"];

type Program = ProgramCard;

const catColor: Record<string, string> = {
  Business: "var(--signal)",
  Cultura: "var(--horizon)",
  Cibo: "var(--citrus)",
  Tecnologia: "var(--signal)",
  Lifestyle: "var(--meadow)",
  Weekend: "var(--horizon)",
};

function PodcastTile({ name, cat }: { name: string; cat: string }) {
  return (
    <div
      className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-5 text-white"
      style={{ background: catColor[cat] || "var(--signal)" }}
    >
      <span className="text-center text-sm font-bold uppercase tracking-[0.16em]">IMMAGINE IN ARRIVO</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
          IMLAND Radio
        </p>
        <p className="mt-2 text-2xl font-bold leading-tight">{name}</p>
      </div>
    </div>
  );
}

function ChannelArtwork({ program }: { program: Program }) {
  if (program.cover) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-signal">
        <img
          src={program.cover}
          alt={`Grafica del canale ${program.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
          {program.cat}
        </span>
      </div>
    );
  }

  return <PodcastTile name={program.name} cat={program.cat} />;
}

function PodcastPage() {
  const [active, setActive] = useState("Tutti");
  const gridRef = useRef<HTMLDivElement>(null);
  const normalizedPrograms = programs.map((p) => ({
    ...p,
    cat: p.name.toLowerCase().includes("istruzioni per l'uso")
      ? "Business"
      : p.name.toLowerCase().includes("casual nerd")
        ? "Tecnologia"
        : p.cat,
  }));
  const list = normalizedPrograms.filter((p) => active === "Tutti" || p.cat === active);

  const selectCategory = (c: string) => {
    setActive(c);
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const [inProgress, setInProgress] = useState<typeof allEpisodes>([]);
  useEffect(() => {
    const found = allEpisodes.filter((e) => getSavedPosition(e.ep.audio) > 5).slice(0, 4);
    setInProgress(found);
  }, []);

  return (
    <>
      <PageRails variant="podcast" />
      <HeroBanner
        src={heroPodcast}
        srcMobile={heroPodcastMobile}
        alt="Il territorio ha storie da raccontare — IMLAND Podcast"
        ctaTop="64%"
        flush
        mobileBg="#1646D8"
      >
        <a href="#programmi" className="cta-light px-6 py-3.5 text-sm">
          Esplora i programmi
        </a>
      </HeroBanner>

      <div className="page-inverted podcast-inverted">
        {/* Categorie */}
        <section className="container-im section-focus pt-4 md:pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Categorie
              </p>
              <h2 className="mt-2 text-h2-im">Scegli un tema.</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Seleziona una categoria per arrivare direttamente ai programmi coerenti.
              </p>
            </div>
            <SectionSearch label="podcast" placeholder="Cerca un podcast o un episodio…" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories
              .filter((c) => c !== "Tutti")
              .map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={active === c}
                  onClick={() => selectCategory(c)}
                  className={`flex flex-col items-center gap-2 rounded-3xl border px-3 py-4 text-center transition-colors ${
                    active === c
                      ? "border-signal bg-signal/5"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <BadgeIcon name={categoryBadge[c]} alt={`Categoria ${c}`} className="h-14 w-14" />
                  <span className="text-sm font-semibold">{c}</span>
                </button>
              ))}
          </div>
        </section>

        <section className="container-im section-focus section-pad-sm">
          <div className="grid gap-5 lg:grid-cols-2">
            <Link
              to="/podcast"
              className="group rounded-[32px] border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-xl md:p-10"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">Podcast</p>
              <h2 className="mt-3 text-h2-im">I podcast di IMLAND</h2>
              <p className="mt-4 text-base text-muted-foreground">
                I nostri podcast fanno parte della programmazione editoriale di IMLAND Experience.
                Sono format ideati e prodotti dalla nostra redazione per raccontare aziende,
                persone, territori, cultura, tecnologia, enogastronomia e storie che meritano di
                essere conosciute.
              </p>
              <p className="mt-6 text-sm font-semibold text-signal">
                StuzzicAziende · Istruzioni per l’Uso · Carta Canta · Assaggi · Grigliata Mista ·
                Terra di Diamanti · Casual Nerd · IMWeekend
              </p>
            </Link>
            <Link
              to="/my-podcast"
              className="group rounded-[32px] border border-signal/30 bg-signal p-7 text-white transition hover:-translate-y-1 hover:shadow-xl md:p-10"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-white/75">My Podcast</p>
              <h2 className="mt-3 text-h2-im">Un progetto completamente tuo</h2>
              <p className="mt-4 text-base text-white/85">
                Se un’azienda o un’organizzazione vuole raccontarsi attraverso un progetto
                completamente proprio, IMLAND mette a disposizione microfoni, studio, competenze e
                produzione. Costruiamo un podcast su misura: dall’idea alla registrazione, fino alla
                produzione e pubblicazione.
              </p>
              <p className="mt-6 text-sm font-semibold text-white">
                TEDx Biella · Biella Città Creativa
              </p>
            </Link>
          </div>
        </section>

        {/* Canali podcast */}
        <section id="programmi" ref={gridRef} className="container-im section-canvas section-pad-sm">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Canali podcast
              </p>
              <h2 className="mt-2 text-h2-im">Scegli il canale dell'azienda.</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Ogni canale ha la sua grafica dedicata. Aprilo per vedere la pagina del progetto e
                tutte le puntate pubblicate.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {list.length} canali · {totalEpisodes} puntate nei feed
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => {
              const stats = categoryStats[c];
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`rounded-full border px-4 py-2 min-h-10 text-sm font-medium transition glow-orange-hover ${
                    active === c
                      ? "border-transparent bg-signal text-white glow-orange"
                      : "glass-panel text-foreground hover:bg-muted"
                  }`}
                >
                  {c}
                  {stats && <span className="ml-1.5 opacity-70">({stats.programs})</span>}
                </button>
              );
            })}
          </div>

          <BentoGrid className="mt-8">
            {list.map((p) => {
              const cardInner = (
                <div className="group h-full">
                  <ChannelArtwork program={p} />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider">
                        {p.cat}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-3 text-h3-im leading-snug">{p.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.tagline}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-signal">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Apri canale
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {p.episodes}
                      </span>
                    </div>
                  </div>
                </div>
              );
              return (
                <BentoLinkCard
                  key={p.slug}
                  to="/podcast/$slug"
                  params={{ slug: p.slug }}
                  tone="podcast"
                  span={2}
                  className="!p-0 overflow-hidden"
                >
                  {cardInner}
                </BentoLinkCard>
              );
            })}
            {list.length === 0 && (
              <p className="col-span-full rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Nessun programma in questa categoria.
              </p>
            )}
          </BentoGrid>
        </section>

        {/* Continua ad ascoltare */}
        {inProgress.length > 0 && (
          <section className="container-im section-canvas pb-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Continua ad ascoltare
              </p>
              <h2 className="mt-2 text-h2-im">Riprendi da dove avevi lasciato.</h2>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {inProgress.map(({ ep, program }) => (
                <li key={`resume-${program.slug}-${ep.slug}`}>
                  <SpotlightCard className="flex items-center gap-4 glass-panel rounded-3xl p-4">
                    <img
                      src={program.cover}
                      alt=""
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {program.name}
                      </p>
                      <h3 className="mt-1 truncate text-sm font-semibold">{ep.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Ripreso a {fmtTime(getSavedPosition(ep.audio))}
                      </p>
                    </div>
                    <EpisodePlayButton
                      track={{
                        audio: ep.audio,
                        title: ep.title,
                        program: program.name,
                        programSlug: program.slug,
                        episodeSlug: ep.slug,
                        cover: program.cover,
                      }}
                    />
                  </SpotlightCard>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Consigliati dalla redazione */}
        <section className="hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">Redazione</p>
            <h2 className="mt-2 text-h2-im">Consigliati dalla redazione.</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Un episodio per categoria, scelto tra i canali più attivi del momento.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {curatedEpisodes.map(({ ep, program }) => (
              <Link
                key={`curated-${program.slug}-${ep.slug}`}
                to="/podcast/$slug/$episode"
                params={{ slug: program.slug, episode: ep.slug }}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 rounded-3xl"
              >
                <SpotlightCard className="flex h-full gap-4 glass-panel rounded-3xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <img
                    src={program.cover}
                    alt=""
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold uppercase tracking-wider">
                      {program.cat}
                    </span>
                    <h3 className="mt-2 text-sm font-semibold leading-snug line-clamp-2">
                      {ep.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {program.name}
                      {ep.date ? ` · ${ep.date.split("-").join("/")}` : ""}
                    </p>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Piattaforme */}
        <section className="section-canvas">
          <div className="container-im section-pad-sm">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Ascolta ovunque
              </p>
              <h2 className="mt-3 text-4xl font-bold md:text-6xl">
                Segui i nostri podcast sulla tua app preferita
              </h2>
            </div>
            <div className="mt-8 flex justify-center">
              <StreamingBanner className="w-full max-w-3xl" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container-im section-editorial section-pad-sm">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Domande frequenti
            </p>
            <h2 className="mt-2 text-h2-im">
              Tutto sui nostri <span className="im-gradient-text">podcast.</span>
            </h2>
            <Accordion type="single" collapsible className="mt-8 glass-panel rounded-3xl px-6">
              <AccordionItem value="q1">
                <AccordionTrigger>Dove posso ascoltare i podcast IMLAND?</AccordionTrigger>
                <AccordionContent>
                  Direttamente da questo sito, oppure su Spotify, Apple Podcasts, YouTube Music e
                  Amazon Music: i link sono nella sezione "Ascolta ovunque" qui sopra.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Ogni quanto escono nuovi episodi?</AccordionTrigger>
                <AccordionContent>
                  Dipende dal programma: alcuni canali pubblicano ogni settimana, altri in occasione
                  di eventi o speciali. La sezione "Ultimi episodi" mostra sempre le uscite più
                  recenti in ordine cronologico.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>
                  Posso scaricare gli episodi per ascoltarli offline?
                </AccordionTrigger>
                <AccordionContent>
                  Sì, ogni pagina episodio ha un pulsante "Scarica MP3" per salvare la puntata sul
                  tuo dispositivo.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger>
                  Come propongo un ospite o una storia da raccontare?
                </AccordionTrigger>
                <AccordionContent>
                  Scrivici a onair@imland.it o usa il modulo "Proponi una serie" qui sotto: la
                  redazione valuta ogni proposta e, se coerente con un canale esistente, organizza
                  una puntata pilota.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger>
                  Il player ricorda da dove ho interrotto l'ascolto?
                </AccordionTrigger>
                <AccordionContent>
                  Sì, il player salva automaticamente la posizione di ogni episodio nel browser: la
                  trovi nella sezione "Continua ad ascoltare" quando torni sul sito.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Pitch CTA */}

        <section className="hidden">
          <SpotlightCard className="relative grid gap-8 glass-panel rounded-[36px] p-10 md:grid-cols-[1.2fr_1fr] md:p-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Proponi una serie
              </p>
              <h2 className="mt-3 text-h2-im">
                Hai una storia che vale un <span className="im-gradient-text">podcast</span>?
              </h2>
              <p className="mt-4 text-muted-foreground">
                La redazione IMLAND produce insieme ad autori, associazioni e studenti. Mandaci
                un'idea, valutiamo insieme se costruire una puntata pilota.
              </p>
            </div>
            <div className="grid gap-3 self-center text-sm">
              <ul className="grid gap-3">
                {[
                  "Idea in 5 righe: da dove nasce, chi ci parla",
                  "Un episodio pilota registrato in studio",
                  "Distribuzione su tutte le piattaforme",
                ].map((s) => (
                  <li key={s} className="flex gap-3 rounded-2xl bg-white/5 px-4 py-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                    {s}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:onair@imland.it"
                className="mt-2 btn-blue rounded-full px-5 py-3 text-center text-sm font-semibold justify-center hover:opacity-90"
              >
                Proponi la tua serie
              </a>
            </div>
          </SpotlightCard>
        </section>

        <ProposalForm kind="podcast" />

        <NewsletterBanner
          eyebrow="Newsletter podcast"
          title="Nuove puntate, prima di tutti."
          lead="Ti avvisiamo quando esce una nuova puntata e ti consigliamo le serie da ascoltare."
        />

        <PodcastMiniPlayer />
      </div>
    </>
  );
}

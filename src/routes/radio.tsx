import { createFileRoute } from "@tanstack/react-router";
import { canonical, jsonLd, radioStationLd } from "../lib/seo";
import { useState } from "react";
import { usePlayer } from "../components/player-context";
import { ProposalForm } from "../components/proposal-form";
import { NewsletterBanner } from "../components/newsletter-banner";
import { SpotlightCard } from "../components/spotlight-card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../components/ui/dialog";
import { Play } from "lucide-react";
import { HeroBanner } from "../components/hero-banner";

import heroRadio from "@/assets/hero-radio-team-desktop.webp";
import heroRadioMobile from "@/assets/hero-radio-team-mobile.webp";
import barInOndaCover from "@/assets/bar-in-onda.webp";
import schemaLiberoCover from "@/assets/schema-libero.webp";
import musicalBoxCover from "@/assets/musical-box.webp";
import seCiSeiCover from "@/assets/se-ci-sei-batti-un-colpo.webp";
import imlandChartsCover from "@/assets/imland-charts.webp";
import { PageRails } from "../components/decor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Reveal } from "../components/reveal";
import { BadgeIcon, badgeForIcon, toneForBadge } from "../components/badge-icon";
import { BentoGrid, BentoCard } from "../components/bento";
import { StreamingBanner } from "../components/streaming-banner";

export const Route = createFileRoute("/radio")({
  head: () => ({
    meta: [
      { title: "Radio locale in diretta 24/7 a Vercelli, Novara, Biella, Verbania" },
      {
        name: "description",
        content:
          "Ascolta IMLAND Radio in diretta 24 ore su 24: musica, programmi e conduttori del territorio tra Vercelli, Novara, Biella e Verbania.",
      },
      {
        name: "keywords",
        content:
          "radio, musica, radio online Vercelli, radio Novara, radio Biella, radio Verbania, radio Piemonte in diretta",
      },
      { name: "geo.region", content: "IT-PIE" },
      { name: "geo.placename", content: "Vercelli, Novara, Biella, Verbania" },
      {
        property: "og:title",
        content: "Radio locale in diretta 24/7 a Vercelli, Novara, Biella, Verbania",
      },
      { property: "og:description", content: "In diretta dal territorio, 24 ore su 24." },
    ],
    links: [canonical("/radio")],
    scripts: [jsonLd(radioStationLd)],
  }),
  component: RadioPage,
});

const daysLong = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì"];
// JS getDay(): 0=Sun..6=Sat → map to our 0=Mon..6=Sun
const todayIndex = (() => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
})();

type Entry = { time: string; show: string };

const schedule: Entry[][] = [
  [{ time: "18:00–19:00", show: "Barionda" }],
  [{ time: "18:00–19:00", show: "Schema Libero" }],
  [{ time: "18:00–19:00", show: "Musical Box" }],
  [{ time: "18:00–19:00", show: "Se ci sei batti un colpo" }],
  [{ time: "18:00–19:00", show: "IMLAND CHARTS" }],
];

// Programmi live (non music selection): descrizioni ufficiali da imlandradio.it
const shows = [
  {
    name: "Barionda",
    desc: "In onda il lunedì dalle 18:00 alle 19:00.",
    tag: "Talk",
    cover: barInOndaCover,
  },
  {
    name: "Schema Libero",
    desc: "In onda il martedì dalle 18:00 alle 19:00.",
    tag: "Talk",
    cover: schemaLiberoCover,
  },
  {
    name: "Musical Box",
    desc: "In onda il mercoledì dalle 18:00 alle 19:00.",
    tag: "Musica",
    cover: musicalBoxCover,
  },
  {
    name: "Se ci sei batti un colpo",
    desc: "In onda il giovedì dalle 18:00 alle 19:00.",
    tag: "Radio",
    cover: seCiSeiCover,
  },
  {
    name: "IMLAND CHARTS",
    desc: "In onda il venerdì dalle 18:00 alle 19:00.",
    tag: "Musica",
    cover: imlandChartsCover,
  },
];

const faqs = [
  {
    q: "Come faccio ad ascoltare IMLAND Radio in diretta?",
    a: 'Puoi ascoltarci gratuitamente dal player in alto sul sito, dall\'app IMLAND, oppure via smart speaker chiedendo di riprodurre "IMLAND Radio". Il segnale è disponibile 24 ore su 24, sette giorni su sette.',
  },
  {
    q: "I programmi vanno in onda anche in podcast?",
    a: "Sì. Le rubriche principali diventano episodi disponibili on demand nella sezione Podcast, così puoi recuperarle quando vuoi, anche offline.",
  },
  {
    q: "Posso proporre un brano o un argomento da trattare in diretta?",
    a: "Certo: puoi scriverci in diretta durante le trasmissioni live, mandarci un messaggio o usare il modulo qui sotto. Molte rubriche nascono proprio dai suggerimenti di chi ci ascolta.",
  },
  {
    q: "Come si diventa conduttori o collaboratori di IMLAND Radio?",
    a: "Cerchiamo continuamente nuove voci del territorio. Raccontaci chi sei e cosa vorresti raccontare tramite il modulo di proposta: la redazione valuta ogni progetto insieme a te.",
  },
  {
    q: "La programmazione musicale è sempre la stessa?",
    a: "No, la selezione musicale viene aggiornata regolarmente e alterna generi ed epoche diverse.",
  },
];

function RadioPage() {
  const { setOpen } = usePlayer();
  const [selectedShow, setSelectedShow] = useState<(typeof shows)[number] | null>(null);

  return (
    <>
      <PageRails variant="radio" />
      <HeroBanner
        src={heroRadio}
        srcMobile={heroRadioMobile}
        alt="Ascolta le voci del territorio — IMLAND Radio"
        claim="La radio che non c'era."
        claimClassName="hero-cta-claim-editorial"
        ctaTop="34%"
        mobileCtaTop="17%"
        className="radio-team-hero"
        flush
        mobileBg="#16BFF2"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hero-cta-radio-play inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
        >
          <Play className="h-4 w-4 fill-current" />
          Ascolta ora
        </button>
        <a href="#palinsesto" className="hero-cta-radio-schedule inline-flex rounded-full px-6 py-3.5 text-sm font-semibold">
          Vedi il palinsesto
        </a>
      </HeroBanner>

      <div className="page-inverted radio-inverted">
        {/* Palinsesto settimanale */}
        <Palinsesto />

        {/* Come ascoltarci */}
        <section className="section-editorial">
          <div className="container-im section-pad-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Canali radio
            </p>
            <h2 className="mt-3 text-h2-im">
              Come ascoltarci.
              <br />
              Scegli il tuo <span className="im-gradient-text">canale</span>.
            </h2>
            <BentoGrid className="mt-8">
              {[
                {
                  icon: "globo" as const,
                  title: "Sito e streaming",
                  desc: "Player sempre attivo in alto su ogni pagina del sito, senza registrazione.",
                  span: 3 as const,
                },
                {
                  icon: "smartphone" as const,
                  title: "App IMLAND",
                  desc: "Diretta, palinsesto e podcast in un'unica app, per ascoltare anche in mobilità.",
                  span: 3 as const,
                },
                {
                  icon: "onde_radio" as const,
                  title: "Smart speaker",
                  desc: 'Basta dire "riproduci IMLAND Radio" al tuo assistente vocale preferito.',
                  span: 3 as const,
                },
                {
                  icon: "waveform" as const,
                  title: "In auto",
                  desc: "Colleghi lo smartphone al bluetooth dell'auto o cerchi IMLAND tra le radio web del tuo sistema di bordo.",
                  span: 3 as const,
                },
              ].map((c) => (
                <BentoCard
                  key={c.title}
                  tone={toneForBadge(badgeForIcon(c.icon, "radio"))}
                  span={c.span}
                >
                  <BadgeIcon name={badgeForIcon(c.icon, "radio")} className="h-14 w-14" />
                  <h3 className="mt-4 text-h3-im text-base">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
            <div className="mt-8 rounded-3xl border border-border bg-white/5 px-5 py-6">
              <StreamingBanner label="Ascolta IMLAND anche su:" />
            </div>
          </div>
        </section>

        <section className="section-canvas">
          <div className="container-im section-pad-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">Programmi</p>
            <h2 className="mt-3 text-h2-im">Rubriche in evidenza.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {shows.map((s) => (
                <SpotlightCard key={s.name} className="glass-panel rounded-3xl p-5">
                  <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-950/5">
                    {s.cover ? (
                      <button
                        type="button"
                        onClick={() => setSelectedShow(s)}
                        className="group relative h-full w-full cursor-zoom-in overflow-hidden rounded-2xl p-0"
                      >
                        <img
                          src={s.cover}
                          alt={`Copertina ${s.name}`}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      </button>
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Grafica in arrivo.
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    {s.tag}
                  </span>
                  <h3 className="mt-4 text-h3-im">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        <Dialog
          open={selectedShow !== null}
          onOpenChange={(open) => !open && setSelectedShow(null)}
        >
          <DialogContent className="fixed inset-4 z-50 flex max-w-none translate-x-0 translate-y-0 flex-col items-center justify-center rounded-3xl border border-signal/30 bg-background/95 p-4 shadow-2xl backdrop-blur-xl data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 sm:inset-6 md:inset-10">
            <DialogTitle className="sr-only">{selectedShow?.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Copertina a tutto schermo del programma {selectedShow?.name}.
            </DialogDescription>
            {selectedShow?.cover && (
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
                <img
                  loading="lazy"
                  decoding="async"
                  src={selectedShow.cover}
                  alt={`Copertina ${selectedShow.name}`}
                  className="max-h-[calc(100vh-8rem)] max-w-[calc(100vw-4rem)] rounded-2xl object-contain shadow-cta-lg"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* FAQ */}
        <section className="section-canvas">
          <div className="container-im section-pad-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Domande frequenti
            </p>
            <h2 className="mt-3 text-h2-im">
              Tutto quello che serve sapere.
              <br />
              Prima di <span className="im-gradient-text">sintonizzarti</span>.
            </h2>
            <div className="mt-8 max-w-3xl">
              <Accordion type="single" collapsible className="glass-panel rounded-3xl px-6">
                {faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="text-base font-semibold text-foreground">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Partecipa */}

        <section className="container-im section-editorial section-pad">
          <div className="relative overflow-hidden glass-panel rounded-[36px] p-10 md:p-14">
            <div className="relative z-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Sei in onda
              </p>
              <h2 className="mt-3 text-h2-im">
                La radio si fa <span className="im-gradient-text">insieme</span>.
              </h2>
              <p className="mt-4 text-base text-foreground/70">
                Chiamaci durante una diretta o proponi il brano che vuoi sentire suonare. Le voci
                del territorio sono le tue.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="tel:+390000000000" className="rounded-full btn-blue px-6 py-3.5 text-sm">
                  Parlaci in diretta
                </a>
                <a
                  href="mailto:onair@imland.it"
                  className="rounded-full btn-ghost-glass px-6 py-3.5 text-sm"
                >
                  Proponi un brano
                </a>
              </div>
            </div>
          </div>
        </section>

        <ProposalForm kind="spot" />

        <NewsletterBanner
          eyebrow="Newsletter radio"
          title="Non perderti un programma."
          lead="Palinsesto, ospiti della settimana e nuove rubriche direttamente in casella."
        />
      </div>
    </>
  );
}

function Palinsesto() {
  return (
    <section id="palinsesto" className="container-im section-canvas section-pad-sm">
      <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">Palinsesto</p>
          <h2 className="mt-2 text-h2-im">La settimana in radio.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Il palinsesto completo di IMLAND Radio, sempre visibile dal lunedì alla domenica.
          </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-7" aria-label="Palinsesto settimanale IMLAND Radio">
        {schedule.map((entries, di) => (
          <article
            key={daysLong[di]}
            className={`rounded-3xl border p-4 text-center ${di === todayIndex ? "border-signal bg-signal/10" : "glass-panel"}`}
          >
            <div className="flex min-h-11 items-center justify-center gap-2 xl:flex-col xl:gap-1">
              <h3 className="font-display text-base font-bold">{daysLong[di]}</h3>
              {di === todayIndex ? (
                <span className="rounded-full bg-signal px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">Oggi</span>
              ) : null}
            </div>
            <ul className="mt-3 space-y-2">
              {entries.map((entry) => (
                <li
                  key={`${entry.time}-${entry.show}`}
                  className="rounded-2xl bg-signal px-3 py-3 text-white"
                >
                  <time className="block font-mono text-xs font-semibold tabular-nums">{entry.time}</time>
                  <span className="mt-1 block text-xs font-semibold leading-snug">{entry.show}</span>
                  <span className="mt-1 block text-xs font-bold uppercase tracking-wider opacity-75">Live</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

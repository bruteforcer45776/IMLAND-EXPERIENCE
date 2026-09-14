import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical, jsonLd, radioStationLd } from "../lib/seo";
import { useState } from "react";
import { usePlayer } from "../components/player-context";
import { ProposalForm } from "../components/proposal-form";
import { NewsletterBanner } from "../components/newsletter-banner";
import { SpotlightCard } from "../components/spotlight-card";
import { PackagesSection } from "../components/packages-section";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../components/ui/dialog";
import { ArrowRight, Play } from "lucide-react";
import { HeroBanner } from "../components/hero-banner";

import heroRadio from "@/assets/hero-radio-v3.webp";
import heroRadioMobile from "@/assets/hero-radio-mobile.webp";
import { PageRails } from "../components/decor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Reveal } from "../components/reveal";
import { teamMembers } from "../data/team-members";
import { totalEpisodes, programs } from "../data/podcast-derived";
import { BadgeIcon, badgeForIcon, toneForBadge } from "../components/badge-icon";
import { BentoGrid, BentoCard } from "../components/bento";

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

const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const daysLong = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];
// JS getDay(): 0=Sun..6=Sat → map to our 0=Mon..6=Sun
const todayIndex = (() => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
})();

type Entry = { time: string; show: string; music?: boolean };

// Palinsesto ufficiale IMLAND Radio — fonte: imlandradio.it
const schedule: Entry[][] = [
  // Lunedì
  [
    { time: "07:00 – 08:00", show: "Se ci sei batti un colpo" },
    { time: "08:00 – 18:00", show: "Imland Music Selection", music: true },
    { time: "18:00 – 19:00", show: "Barinonda" },
    { time: "19:00 – 23:59", show: "Imland Music Selection", music: true },
  ],
  // Martedì
  [
    { time: "00:00 – 18:00", show: "Imland Music Selection", music: true },
    { time: "18:00 – 19:00", show: "Schema Libero" },
    { time: "19:00 – 23:59", show: "Imland Music Selection", music: true },
  ],
  // Mercoledì
  [
    { time: "00:00 – 18:00", show: "Imland Music Selection", music: true },
    { time: "18:00 – 19:00", show: "Musical Box" },
    { time: "19:00 – 23:59", show: "Imland Music Selection", music: true },
  ],
  // Giovedì
  [
    { time: "00:00 – 18:00", show: "Imland Music Selection", music: true },
    { time: "18:00 – 19:00", show: "Assaggi" },
    { time: "19:00 – 23:59", show: "Imland Music Selection", music: true },
  ],
  // Venerdì
  [
    { time: "00:00 – 18:00", show: "Imland Music Selection", music: true },
    { time: "18:00 – 19:00", show: "IMLAND Charts" },
    { time: "19:00 – 20:00", show: "Made in 80s" },
    { time: "20:00 – 23:59", show: "Imland Music Selection", music: true },
  ],
  // Sabato
  [
    { time: "00:00 – 13:00", show: "Imland Music Selection", music: true },
    { time: "13:00 – 14:00", show: "IMLAND Charts" },
    { time: "14:00 – 23:59", show: "Imland Music Selection", music: true },
  ],
  // Domenica
  [{ time: "00:00 – 23:59", show: "Imland Music Selection", music: true }],
];

// Programmi live (non music selection): descrizioni ufficiali da imlandradio.it
const shows = [
  {
    name: "Barinonda",
    desc: "Le notizie del territorio raccontate a modo nostro, con satira e un goccio di sana follia. Con Maio, Max Biasu e Sellino.",
    tag: "Talk",
    cover: "",
  },
  {
    name: "Schema Libero",
    desc: "Assaggi e riflessioni di vita tra emozioni e sentimenti: la filosofia incontra la vita quotidiana.",
    tag: "Talk",
    cover: "",
  },
  {
    name: "Musical Box",
    desc: "Il programma che racconta la musica. Con Roberto, Celeste e Marty tra successi, curiosità e aneddoti.",
    tag: "Musica",
    cover: "",
  },
  {
    name: "Assaggi",
    desc: "Enogastronomia del territorio: prodotti, allevamento e gastronomia raccontati da chi ci ha dedicato la vita.",
    tag: "Cibo",
    cover: "",
  },
  {
    name: "Se ci sei batti un colpo",
    desc: "Il risveglio in radio: musica, umore e territorio per iniziare la giornata.",
    tag: "Morning",
    cover: "",
  },
  {
    name: "IMLAND Charts",
    desc: "La classifica IMLAND: i brani più suonati e votati della settimana.",
    tag: "Musica",
    cover: "",
  },
  {
    name: "Made in 80s",
    desc: "Un'ora dedicata al meglio degli anni Ottanta, tra hit internazionali e italiane.",
    tag: "Musica",
    cover: "",
  },
];

// Voci selezionate per la radio: chi conduce le rubriche live in palinsesto
const radioHostSlugs = [
  "davide-de-lisa",
  "massimo-biasini",
  "matteo-sella",
  "davide-maiorano",
  "celeste-miolo",
  "mattia-tassar",
];
const radioHosts = radioHostSlugs
  .map((slug) => teamMembers.find((m) => m.slug === slug))
  .filter((m): m is (typeof teamMembers)[number] => Boolean(m));

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
    a: "No, la Imland Music Selection viene aggiornata regolarmente e alterna generi ed epoche diverse, mentre nelle fasce serali e weekend lasciamo spazio alle rubriche condotte in diretta dal nostro team.",
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
        ctaTop="64%"
        flush
        mobileBg="#16BFF2"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cta-light px-6 py-3.5 text-sm"
        >
          <Play className="h-4 w-4 fill-current" />
          Ascolta ora
        </button>
        <a href="#palinsesto" className="cta-dark px-6 py-3.5 text-sm">
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
              Ovunque tu sia
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
          </div>
        </section>

        {/* Le nostre voci */}
        <section className="section-canvas">
          <div className="container-im section-pad-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              La redazione
            </p>
            <h2 className="mt-3 text-h2-im">
              Le nostre voci.
              <br />
              Persone del <span className="im-gradient-text">territorio</span>.
            </h2>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Dietro ogni rubrica ci sono volti conosciuti: chi lavora in vigna, chi insegna, chi fa
              impresa. Scopri chi conduce cosa.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {radioHosts.map((m) => {
                const fullName = [m.firstName, m.lastName].filter(Boolean).join(" ");
                return (
                  <Link
                    key={m.slug}
                    to="/team/$slug"
                    params={{ slug: m.slug }}
                    className="group glass-panel flex items-center gap-4 rounded-3xl p-4 transition hover:bg-white/5"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-inset ring-border">
                      <img
                        src={m.photo}
                        alt={fullName}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-base font-semibold text-foreground group-hover:text-signal">
                        {fullName}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{m.role}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6">
              <Link
                to="/chi-siamo"
                className="inline-flex items-center gap-1 text-sm font-semibold text-signal hover:underline"
              >
                Scopri tutto il team <ArrowRight className="inline h-4 w-4" />
              </Link>
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
                  <div className="relative mb-5 aspect-square overflow-hidden rounded-2xl bg-muted">
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
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/15">
                          <span className="flex scale-75 items-center justify-center rounded-full bg-background/90 px-4 py-2 text-sm font-semibold text-foreground opacity-0 shadow-cta-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                            Apri
                          </span>
                        </span>
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
            <div className="absolute bottom-5 left-5 right-5 glass-panel rounded-2xl px-5 py-3 text-center backdrop-blur-md">
              <p className="font-display text-lg font-semibold text-foreground">
                {selectedShow?.name}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {selectedShow?.tag}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dietro le quinte / dati narrativi */}
        <section className="section-focus">
          <div className="container-im section-pad-sm">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Dietro le quinte
                </p>
                <h2 className="mt-3 text-h2-im">
                  La nostra redazione.
                  <br />
                  Un lavoro che non si <span className="im-gradient-text">ferma</span>.
                </h2>
                <p className="mt-4 text-base text-foreground/70">
                  Dietro ogni diretta c'è una squadra che scrive scalette, monta interviste, sceglie
                  la musica e risponde ai messaggi di chi ascolta. Non siamo un'emittente di
                  passaggio: viviamo Vercelli, Novara, Biella e Verbania, e li raccontiamo ogni
                  giorno da dentro.
                </p>
                <p className="mt-4 text-base text-foreground/70">
                  Direzione artistica, regia, tecnica di messa in onda, amministrazione, grafica e
                  ufficio commerciale: ogni ruolo è coperto da persone che hanno scelto di restare
                  sul territorio invece di lasciarlo, e che mettono la loro professione al servizio
                  della radio.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-6">
                <div className="glass-panel rounded-3xl p-6">
                  <p className="font-display text-3xl font-semibold text-signal">24/7</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    In onda ogni ora del giorno e della notte, senza interruzioni, con la Imland
                    Music Selection a colmare gli spazi tra una diretta e l'altra.
                  </p>
                </div>
                <div className="glass-panel rounded-3xl p-6">
                  <p className="font-display text-3xl font-semibold text-signal">
                    {totalEpisodes}+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Episodi già pubblicati tra i podcast delle nostre rubriche, disponibili on
                    demand per chi si perde una diretta.
                  </p>
                </div>
                <div className="glass-panel rounded-3xl p-6">
                  <p className="font-display text-3xl font-semibold text-signal">
                    {programs.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Programmi attivi tra talk, musica, cibo e attualità, raccontati da conduttrici e
                    conduttori del territorio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        <PackagesSection kind="radio" />

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
  const [expanded, setExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  return (
    <section id="palinsesto" className="container-im section-canvas section-pad-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">Palinsesto</p>
          <h2 className="mt-2 text-h2-im">
            {expanded ? "La settimana in radio" : `In onda ${daysLong[selectedDay].toLowerCase()}`}
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            {expanded
              ? "Dal lunedì alla domenica: la programmazione ufficiale di IMLAND Radio."
              : "La programmazione di oggi. Espandi per vedere tutta la settimana."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="rounded-full glass-panel px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-white/5"
        >
          {expanded ? "Torna al giorno" : "Vedi tutta la settimana"}
        </button>
      </div>

      {!expanded && (
        <div className="mt-6 flex flex-wrap gap-2">
          {days.map((d, i) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDay(i)}
              className={`rounded-full px-4 py-2 min-h-10 text-xs font-semibold uppercase tracking-wider transition glow-orange-hover ${
                i === selectedDay
                  ? "bg-signal text-white glow-orange"
                  : "glass-panel text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
              {i === todayIndex && <span className="ml-1.5 text-xs text-signal">oggi</span>}
            </button>
          ))}
        </div>
      )}

      {expanded ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schedule.map((entries, di) => (
            <div
              key={daysLong[di]}
              className={`rounded-3xl border p-5 ${di === todayIndex ? "border-signal bg-signal/5" : "glass-panel"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-h3-im">{daysLong[di]}</h3>
                {di === todayIndex && (
                  <span className="rounded-full bg-signal/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-signal">
                    Oggi
                  </span>
                )}
              </div>
              <ul className="mt-4 space-y-2">
                {entries.map((e) => (
                  <li
                    key={e.time}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm ${
                      e.music ? "bg-white/5 text-muted-foreground" : "bg-signal text-white"
                    }`}
                  >
                    <span className="w-28 shrink-0 font-mono text-xs tabular-nums">{e.time}</span>
                    <span className="flex-1 font-medium">{e.show}</span>
                    {!e.music && (
                      <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                        Live
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {schedule[selectedDay].map((e) => (
            <div
              key={e.time}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-4 md:px-6 ${
                e.music ? "glass-panel" : "border-transparent bg-signal/10"
              }`}
            >
              <div className="w-32 shrink-0 md:w-40">
                <p className="font-display text-sm font-semibold leading-tight tabular-nums">
                  {e.time}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {e.music ? "Musica" : "Live"}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{e.show}</p>
                {e.music && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Selezione musicale IMLAND</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Fonte: palinsesto ufficiale IMLAND Radio (imlandradio.it). Fuori dagli orari live va in onda
        Imland Music Selection.
      </p>
    </section>
  );
}

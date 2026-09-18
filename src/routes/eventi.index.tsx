import { createFileRoute, Link } from "@tanstack/react-router";
import { EventsCalendar } from "../components/events-calendar";

import { canonical, jsonLd, localBusinessLd } from "../lib/seo";
import { ProposalForm } from "../components/proposal-form";
import { NewsletterBanner } from "../components/newsletter-banner";
import { PageRails } from "../components/decor";
import { BrandIcon } from "../components/brand-icons";
import { BadgeIcon, badgeForIcon, toneForBadge } from "../components/badge-icon";
import { BentoGrid, BentoCard } from "../components/bento";
import { SpotlightCard } from "../components/spotlight-card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { HeroBanner } from "../components/hero-banner";


export const Route = createFileRoute("/eventi/")({
  head: () => ({
    meta: [
      { title: "Eventi e animazione con musica a Vercelli, Novara, Biella, Verbania" },
      {
        name: "description",
        content:
          "Animazione per eventi con musica, dj set e radio in tour a Vercelli, Novara, Biella e Verbania. Non siamo catering: facciamo intrattenimento.",
      },
      {
        name: "keywords",
        content:
          "eventi, musica, animazione eventi Vercelli, eventi Novara, eventi Biella, eventi Verbania, dj set Piemonte",
      },
      { name: "geo.region", content: "IT-PIE" },
      { name: "geo.placename", content: "Vercelli, Novara, Biella, Verbania" },
      {
        property: "og:title",
        content: "Eventi e animazione con musica a Vercelli, Novara, Biella, Verbania",
      },
      {
        property: "og:description",
        content:
          "Animazione per eventi, non catering. Portiamo intrattenimento e cultura al tuo evento.",
      },
    ],
    links: [canonical("/eventi")],
    scripts: [jsonLd(localBusinessLd)],
  }),
  component: EventiPage,
});

const formats = [
  {
    icon: "nota_musicale" as const,
    title: "Live e DJ set",
    desc: "Musica selezionata, dj set e momenti di ascolto costruiti sul pubblico dell'evento.",
  },
  {
    icon: "microfono" as const,
    title: "Conduzione e talk",
    desc: "Presentazione, interviste e micro-rubriche condotte dalle voci di IMLAND Radio.",
  },
  {
    icon: "onde_radio" as const,
    title: "Radio in diretta",
    desc: "Collegamenti live dal luogo dell'evento, con racconto in onda e sui podcast.",
  },
  {
    icon: "community" as const,
    title: "Workshop e laboratori",
    desc: "Attività partecipative per scuole, associazioni e community locali.",
  },
];

const steps = [
  {
    n: "01",
    title: "Ci racconti l'evento",
    desc: "Data, luogo, pubblico atteso e obiettivo della serata.",
  },
  {
    n: "02",
    title: "Costruiamo il format",
    desc: "Scegliamo insieme voci, musica e momenti di racconto.",
  },
  {
    n: "03",
    title: "Andiamo in scena",
    desc: "Il giorno dell'evento gestiamo animazione, palco e diretta.",
  },
];

const contexts = [
  { icon: "chiesa" as const, label: "Feste patronali" },
  { icon: "edificio" as const, label: "Eventi aziendali" },
  { icon: "montagna" as const, label: "Sagre e piazze" },
  { icon: "ticket" as const, label: "Rassegne culturali" },
  { icon: "community" as const, label: "Scuole e associazioni" },
  { icon: "faretto" as const, label: "Inaugurazioni" },
];

const packages = [
  {
    icon: "microfono" as const,
    name: "Formula Base",
    tagline: "Per serate e presentazioni brevi",
    duration: "Fino a 2 ore",
    includes: [
      "1 conduttore/animatore IMLAND",
      "Speakeraggio e gestione microfono",
      "Playlist musicale curata per il contesto",
      "Post e stories di lancio sui canali IMLAND",
    ],
  },
  {
    icon: "nota_musicale" as const,
    name: "Formula Live",
    tagline: "Per feste, piazze e serate danzanti",
    duration: "Da 3 a 5 ore",
    includes: [
      "Conduzione + dj set su misura",
      "Interviste e momenti di racconto dal vivo",
      "Collegamento radio in diretta o differita",
      "Copertura fotografica per i social IMLAND",
      "Articolo di recap sul sito e in podcast",
    ],
  },
  {
    icon: "onde_radio" as const,
    name: "Formula Radio in Tour",
    tagline: "Per rassegne, sagre e festival",
    duration: "Giornata intera o più giorni",
    includes: [
      "Postazione radio itinerante sul luogo",
      "Conduzione, interviste e ospiti in diretta",
      "Contenuti quotidiani su radio, podcast e social",
      "Coordinamento con enti locali e sponsor",
      "Report finale con numeri e materiali",
    ],
  },
];

const timeline = [
  {
    time: "H-14",
    title: "Sopralluogo e piano audio",
    desc: "Verifichiamo spazio, corrente e punti di ripresa insieme a chi organizza.",
  },
  {
    time: "H-1",
    title: "Arrivo e check",
    desc: "Montaggio microfoni, prova voce e test collegamento radio, se previsto.",
  },
  {
    time: "H0",
    title: "Apertura e accoglienza",
    desc: "Musica di ingresso, saluti al pubblico e presentazione del programma.",
  },
  {
    time: "H+1",
    title: "Momento clou",
    desc: "Talk, ospiti, premiazioni o dj set: il cuore della serata.",
  },
  {
    time: "H+2",
    title: "Chiusura e saluti",
    desc: "Ringraziamenti, ultima musica e raccolta contenuti per il racconto post-evento.",
  },
  {
    time: "H+24",
    title: "Racconto online",
    desc: "Recap su podcast, social e sito con foto e highlights dell'evento.",
  },
];

const clientTypes = [
  {
    icon: "edificio" as const,
    title: "Aziende",
    desc: "Team building, inaugurazioni, feste natalizie e convention con animazione su misura.",
  },
  {
    icon: "chiesa" as const,
    title: "Comitati e parrocchie",
    desc: "Feste patronali e sagre di paese con musica, speakeraggio e diretta radio.",
  },
  {
    icon: "community" as const,
    title: "Scuole e associazioni",
    desc: "Laboratori, open day e feste di fine anno con format partecipativi.",
  },
  {
    icon: "ticket" as const,
    title: "Enti e comuni",
    desc: "Rassegne culturali, festival e mercatini con presidio radio itinerante.",
  },
  {
    icon: "stretta_mano" as const,
    title: "Commercianti e consorzi",
    desc: "Vetrine, notti bianche e shopping night animate dal vivo.",
  },
  {
    icon: "profilo" as const,
    title: "Professionisti",
    desc: "Incontri, presentazioni e appuntamenti professionali con conduzione e contenuti.",
  },
  {
    icon: "microfono" as const,
    title: "Artisti",
    desc: "Showcase, live e momenti creativi raccontati e animati insieme al pubblico.",
  },
];

const activityExamples = [
  "Serate danzanti in piazza con dj set e conduzione dal palco",
  "Talk e interviste con ospiti locali durante fiere e rassegne",
  "Diretta radio da uno stand con collegamenti in tempo reale",
  "Animazione musicale per l'apertura di un nuovo punto vendita",
  "Laboratorio di podcast per studenti in occasione di un open day",
  "Quiz musicali e giochi a premi per il pubblico di una sagra",
];

const checklist = [
  "Spazio dedicato per postazione voce/regia (anche un tavolo)",
  "Corrente elettrica nelle vicinanze del punto di conduzione",
  "Impianto audio o disponibilità a integrarci con quello esistente",
  "Referente unico raggiungibile nei giorni precedenti l'evento",
  "Programma orario indicativo della giornata o serata",
  "Autorizzazioni comunali/SIAE già gestite da chi organizza",
];

const areas = [
  {
    icon: "mappa" as const,
    name: "Vercelli",
    desc: "Città e provincia, dalle piazze del centro alle sagre di risaia.",
  },
  {
    icon: "edificio" as const,
    name: "Novara",
    desc: "Eventi urbani, aziendali e rassegne del territorio novarese.",
  },
  {
    icon: "montagna" as const,
    name: "Biella",
    desc: "Feste di paese, eventi in Valle Elvo e Valsessera.",
  },
  {
    icon: "globo" as const,
    name: "Verbania e VCO",
    desc: "Eventi sul lago, in Val d'Ossola e sull'intero Verbano-Cusio-Ossola.",
  },
];

const faqs = [
  {
    q: "Siete un servizio di catering o allestimenti?",
    a: "No. IMLAND EXPERIENCE non gestisce buffet, tavoli, sedie o service tecnico. Ci occupiamo di intrattenimento: conduzione, musica, talk e diretta radio.",
  },
  {
    q: "Con quanto anticipo dobbiamo contattarvi?",
    a: "Consigliamo almeno 3-4 settimane prima per eventi standard, e 2 mesi per rassegne o festival su più giorni, così da costruire il format insieme.",
  },
  {
    q: "Portate voi l'impianto audio?",
    a: "Dipende dalla formula scelta. Per eventi piccoli possiamo integrarci con l'impianto già presente; per format più strutturati valutiamo insieme cosa serve.",
  },
  {
    q: "Potete fare una diretta radio dal nostro evento?",
    a: "Sì, è uno dei nostri format principali: collegamenti in diretta o contenuti registrati sul momento, poi rilanciati su radio, podcast e social.",
  },
  {
    q: "Lavorate anche fuori da Vercelli, Novara, Biella e Verbania?",
    a: "Il nostro cuore è il Piemonte nord-orientale, ma valutiamo richieste anche fuori area: scrivici e ti diciamo se siamo disponibili.",
  },
  {
    q: "Chi si occupa dei permessi comunali o SIAE?",
    a: "Restano in carico a chi organizza l'evento. Noi possiamo darti indicazioni di massima, ma la richiesta e la titolarità sono dell'organizzatore.",
  },
];

function EventiPage() {
  return (
    <>
      <PageRails variant="eventi" />
      {/* Hero */}
      <HeroBanner
        src="/assets/hero-eventi-member-2026.jpg"
        srcMobile="/assets/hero-eventi-member-2026.jpg"
        alt="Evento Member 2026 segnato sul calendario"
        className="eventi-calendar-hero"
        flush
        mobileBg="#f4f4f2"
      />

      <div className="page-inverted eventi-inverted">
        {/* Contesti */}
        <section className="border-y border-outline bg-card">
          <div className="container-im py-5">
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {contexts.map((c) => (
                <li
                  key={c.label}
                  className="eventi-context-chip inline-flex items-center gap-1.5 rounded-full border border-outline bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  <BrandIcon name={c.icon} className="h-4 w-4" aria-hidden />
                  {c.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Prossimo evento e calendario subito in apertura */}
        <EventsCalendar />

        {/* Formati */}
        <section className="section-focus">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">Formati</p>
              <h2 className="mt-3 text-h2-im">
                Cosa portiamo <span className="im-gradient-text">live</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Quattro moduli che si combinano tra loro.
                <br />
                Li adattiamo al luogo, al pubblico e alla durata dell'evento.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {formats.map((f, i) => (
                <BentoCard
                  key={f.title}
                  tone={toneForBadge(badgeForIcon(f.icon, "calendario"))}
                  span={3}
                >
                  <BadgeIcon name={badgeForIcon(f.icon, "calendario")} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Pacchetti / format dettagliati */}
        <section className="hidden">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Pacchetti
              </p>
              <h2 className="mt-3 text-h2-im">
                Tre formule, un solo <span className="im-gradient-text">metodo</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Ogni formula è un punto di partenza.
                <br />
                La componiamo su misura in base a durata, pubblico e obiettivo dell'evento.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {packages.map((p) => (
                <BentoCard
                  key={p.name}
                  tone={toneForBadge(badgeForIcon(p.icon, "biglietto"))}
                  span={2}
                >
                  <BadgeIcon name={badgeForIcon(p.icon, "biglietto")} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{p.name}</h3>
                  <p className="mt-1 text-sm text-signal">{p.tagline}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {p.duration}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {p.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <BrandIcon name="check" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Timeline di una serata tipo */}
        <section className="hidden">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Come si svolge
              </p>
              <h2 className="mt-3 text-h2-im">
                Una serata <span className="im-gradient-text">tipo</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Ogni evento è diverso, ma questo è lo schema che seguiamo più spesso.
              </p>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {timeline.map((t) => (
                <li key={t.time} className="glass-panel rounded-3xl p-6">
                  <span className="font-display text-sm font-bold text-signal">{t.time}</span>
                  <h3 className="mt-3 text-h3-im leading-snug">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Come lavoriamo */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Come lavoriamo
              </p>
              <h2 className="mt-3 text-h2-im">
                Tre passaggi, un solo <span className="im-gradient-text">percorso</span>.
              </h2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="glass-panel rounded-3xl p-6">
                  <span className="font-display text-sm font-bold text-signal">{s.n}</span>
                  <h3 className="mt-3 text-h3-im leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Per chi lavoriamo */}
        <section className="section-focus">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Per chi lavoriamo
              </p>
              <h2 className="mt-3 text-h2-im">
                Tipologie di <span className="im-gradient-text">clienti</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Da anni collaboriamo con realtà molto diverse tra loro: cambia il contesto, non il
                metodo.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {clientTypes.map((c, i) => (
                <BentoCard
                  key={c.title}
                  tone={toneForBadge(badgeForIcon(c.icon, "cultura"))}
                  span={i === 0 ? 3 : i === 1 ? 3 : 2}
                >
                  <BadgeIcon name={badgeForIcon(c.icon, "cultura")} className="h-14 w-14" />
                  <h3 className="mt-4 text-h3-im leading-snug">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Esempi di attività / checklist tecnica */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass-panel rounded-3xl p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">Esempi</p>
                <h2 className="mt-3 text-h2-im">
                  Cosa succede in <span className="im-gradient-text">scena</span>.
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Alcuni esempi reali di attività che portiamo, per tipologia di momento.
                </p>
                <ul className="mt-6 space-y-3">
                  {activityExamples.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <BrandIcon
                        name="nota_musicale"
                        className="mt-0.5 h-4 w-4 shrink-0"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-outline bg-surface-1 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Checklist tecnica
                </p>
                <h2 className="mt-3 text-h2-im">
                  Cosa serve da chi <span className="im-gradient-text">organizza</span>.
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Per lavorare al meglio, ci basta poco: ecco cosa chiediamo di solito.
                </p>
                <ul className="mt-6 space-y-3">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cosa facciamo / Cosa non facciamo */}
        <section className="section-editorial">
          <div className="container-im section-pad">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass-panel rounded-3xl p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Cosa facciamo
                </p>
                <h2 className="mt-3 text-h2-im">
                  Portiamo <span className="im-gradient-text">anima</span> al tuo evento.
                </h2>
                <ul className="mt-6 space-y-3">
                  {[
                    "Conduzione e animazione live",
                    "Talk, interviste e micro-rubriche",
                    "Musica, DJ set e momenti di ascolto",
                    "Collegamenti radio e contenuti dal luogo",
                    "Laboratori e workshop quando previsti",
                    "Service tecnico audio per produrre e diffondere il suono quando previsto",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <BrandIcon name="check" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-outline bg-surface-1 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cosa non facciamo
                </p>
                <h2 className="mt-3 text-h2-im">
                  Non siamo un <span className="im-gradient-text">catering</span>.
                </h2>
                <ul className="mt-6 space-y-3">
                  {[
                    "Catering, buffet, banqueting o ristorazione",
                    "Organizzazione complessiva dell’evento",
                    "Gestione delle pratiche e autorizzazioni dell’organizzatore",
                    "Fornitura del palco",
                    "Allestimento generale di tavoli, sedie e tensostrutture",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-muted-foreground">
                  Lavoriamo a fianco di chi organizza l’evento per curare la parte umana, culturale
                  e di intrattenimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Aree geografiche */}
        <section className="section-focus">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Dove operiamo
              </p>
              <h2 className="mt-3 text-h2-im">
                Il nostro <span className="im-gradient-text">territorio</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Il Piemonte nord-orientale è casa nostra. Ci muoviamo con la nostra postazione radio
                ovunque ci sia una storia da raccontare.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {areas.map((a) => (
                <BentoCard key={a.name} tone={toneForBadge(badgeForIcon(a.icon, "luogo"))} span={3}>
                  <BadgeIcon name={badgeForIcon(a.icon, "luogo")} className="h-14 w-14" />
                  <h3 className="mt-4 text-h3-im leading-snug">{a.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Cross-link verso radio e podcast */}
        <section className="hidden">
          <div className="container-im section-pad-sm">
            <div className="flex flex-col gap-6 rounded-3xl border border-outline bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Continua qui
                </p>
                <h2 className="mt-3 text-h2-im">
                  Ogni evento diventa <span className="im-gradient-text">racconto</span>.
                </h2>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                  Quello che accade in piazza finisce in onda e su podcast.
                  <br />
                  Riascolta le tappe e leggi le news del territorio.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Link to="/podcast" className="rounded-full btn-blue px-6 py-3.5 text-sm">
                  Vai ai podcast
                </Link>
                <Link
                  to="/news"
                  className="rounded-full border border-outline px-6 py-3.5 text-sm font-semibold"
                >
                  Leggi le news
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Domande frequenti
              </p>
              <h2 className="mt-3 text-h2-im">
                Le domande che ci fanno <span className="im-gradient-text">sempre</span>.
              </h2>
            </div>
            <div className="mt-10 glass-panel rounded-3xl p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`}>
                    <AccordionTrigger className="text-base font-display font-semibold">
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

        {/* CTA finale forte */}
        <section className="hidden">
          <div className="container-im section-pad-sm">
            <div className="glass-panel flex flex-col items-start gap-6 rounded-3xl p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Pronti a iniziare?
                </p>
                <h2 className="mt-3 text-h2-im max-w-xl">
                  Portiamo il nostro <span className="im-gradient-text">microfono</span> al tuo
                  evento.
                </h2>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                  Raccontaci data, luogo e obiettivo: ti proponiamo la formula più adatta entro
                  pochi giorni.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <a
                  href="#proponi-evento"
                  className="inline-flex items-center justify-center gap-2 rounded-full btn-blue px-6 py-3.5 text-sm"
                >
                  Proponi il tuo evento
                </a>
                <a
                  href="tel:+393514323003"
                  className="inline-flex items-center justify-center gap-2 rounded-full btn-ghost-glass px-6 py-3.5 text-sm"
                >
                  Chiamaci ora
                </a>
              </div>
            </div>
          </div>
        </section>

        <ProposalForm kind="evento" />

        <div id="newsletter-eventi">
          <NewsletterBanner
            eyebrow="Newsletter eventi"
            title="Il calendario, sempre aggiornato."
            lead="Ti mandiamo i prossimi live, talk e radio in piazza prima che finiscano i posti."
          />
        </div>
      </div>
    </>
  );
}

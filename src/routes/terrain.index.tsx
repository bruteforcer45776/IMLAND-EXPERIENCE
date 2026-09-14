import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router";
import { lazy } from "react";
import { canonical, jsonLd, organizationLd } from "../lib/seo";
import { HeroBanner } from "../components/hero-banner";

import { PageRails } from "../components/decor";
import { BadgeIcon, toneForBadge, type BadgeName } from "../components/badge-icon";
import { BentoGrid, BentoCard } from "../components/bento";
import { NewsletterBanner } from "../components/newsletter-banner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  MapPin,
  Search,
  Compass,
  Heart,
  Navigation,
  Phone,
  Calendar,
  FileText,
  ArrowRight,
} from "lucide-react";
import heroTerrain from "@/assets/hero-terrain.webp";
import heroTerrainMobile from "@/assets/hero-terrain-mobile.webp";

const TerrainLiveMap = lazy(() =>
  import("../components/terrain-live-map").then((m) => ({ default: m.TerrainLiveMap })),
);

export const Route = createFileRoute("/terrain/")({
  head: () => ({
    meta: [
      { title: "TERRAIN — Scopri il territorio di Vercelli, Novara, Biella e Verbania" },
      {
        name: "description",
        content:
          "TERRAIN è la mappa interattiva di IMLAND Experience: attività, luoghi, eventi e esperienze nelle province di Vercelli, Novara, Biella e Verbania.",
      },
      {
        name: "keywords",
        content: "territorio, mappa, attività, Vercelli, Novara, Biella, Verbania, eventi, luoghi",
      },
      { name: "geo.region", content: "IT-PIE" },
      { name: "geo.placename", content: "Vercelli, Novara, Biella, Verbania" },
      {
        property: "og:title",
        content: "TERRAIN — Scopri il territorio di Vercelli, Novara, Biella e Verbania",
      },
      { property: "og:description", content: "Tutto il territorio, vicino a te." },
    ],
    links: [canonical("/terrain")],
    scripts: [jsonLd(organizationLd)],
  }),
  component: TerrainPage,
});

const categories = [
  {
    badge: "negozio" as BadgeName,
    title: "Negozi e attività",
    desc: "Botteghe, artigiani e punti vendita del territorio.",
  },
  {
    badge: "negozio" as BadgeName,
    title: "Ristoranti e locali",
    desc: "Bar, ristoranti, agriturismi e locali per mangiare e bere.",
  },
  {
    badge: "edificio" as BadgeName,
    title: "Aziende e professionisti",
    desc: "Imprese, studi e servizi per privati e aziende.",
  },
  {
    badge: "membri" as BadgeName,
    title: "Membri ufficiali IMLAND",
    desc: "Partner della rete con badge e scheda verificata.",
  },
  {
    badge: "community" as BadgeName,
    title: "Associazioni",
    desc: "Realtà del terzo settore, sport, cultura e solidarietà.",
  },
  {
    badge: "cultura" as BadgeName,
    title: "Luoghi culturali",
    desc: "Musei, monumenti, attrazioni e itinerari da scoprire.",
  },
];

const userFeatures = [
  {
    badge: "mappa" as BadgeName,
    title: "Mappa interattiva",
    desc: "Esplora luoghi e attività su una mappa pensata per il territorio.",
  },
  {
    badge: "mappa" as BadgeName,
    title: "Geolocalizzazione",
    desc: "Trova ciò che ti sta intorno usando la tua posizione.",
  },
  {
    badge: "bussola" as BadgeName,
    title: "Ricerca e filtri",
    desc: "Cerca per nome, categoria, Comune o distanza fino a 50 km.",
  },
  {
    badge: "negozio" as BadgeName,
    title: "Preferiti",
    desc: "Salva le schede che ti interessano e tornaci quando vuoi.",
  },
  {
    badge: "bussola" as BadgeName,
    title: "Indicazioni stradali",
    desc: "Raggiungi ogni attività con un tap, senza uscire dalla piattaforma.",
  },
  {
    badge: "alert" as BadgeName,
    title: "Segnala errori",
    desc: "Aiutaci a tenere le informazioni corrette e aggiornate.",
  },
];

const cardFields = [
  "Nome e descrizione dell'attività",
  "Indirizzo e posizione sulla mappa",
  "Orari di apertura",
  "Contatti telefono, email e social",
  "Servizi disponibili e accessibilità",
  "Eventi organizzati e offerte in corso",
  "Articoli, interviste e podcast collegati",
  "Badge Membro ufficiale e data ultima verifica",
];

const verificationSteps = [
  {
    n: "01",
    title: "Validazione indirizzo",
    desc: "Verifichiamo che l'indirizzo esista e ne ricaviamo le coordinate.",
  },
  {
    n: "02",
    title: "Controlli automatici",
    desc: "Campi obbligatori, duplicati, immagini sospette e link non sicuri.",
  },
  {
    n: "03",
    title: "Revisione editoriale",
    desc: "La redazione controlla coerenza e completezza prima della pubblicazione.",
  },
  {
    n: "04",
    title: "Scheda online",
    desc: "Una volta approvata, la scheda è visibile sulla mappa e ricercabile.",
  },
];

const monetization = [
  {
    badge: "negozio" as BadgeName,
    title: "Scheda gratuita",
    desc: "Presenza base sulla mappa con informazioni essenziali.",
  },
  {
    badge: "scudo" as BadgeName,
    title: "Scheda verificata",
    desc: "Badge verifica e priorità nelle ricerche del territorio.",
  },
  {
    badge: "edificio" as BadgeName,
    title: "Profilo premium",
    desc: "Più immagini, servizi evidenziati e statistiche di contatto.",
  },
  {
    badge: "mappa" as BadgeName,
    title: "Posizione in evidenza",
    desc: "Apparire in cima ai risultati della propria categoria.",
  },
];

const faqs = [
  {
    q: "TERRAIN è già attiva?",
    a: "Stiamo costruendo la prima versione della mappa. Puoi già proporre la tua scheda: entrerai in revisione e sarai tra i primi visibili al lancio.",
  },
  {
    q: "Chi può inserire un'attività?",
    a: "Titolari di attività, professionisti, associazioni e anche cittadini che segnalano una realtà meritevole. Ogni scheda nuova passa per una verifica prima della pubblicazione.",
  },
  {
    q: "Quanto costa essere su TERRAIN?",
    a: "La scheda base è gratuita. Esistono profili verificati e premium con funzioni aggiuntive, oltre a pacchetti per Comuni e associazioni di categoria.",
  },
  {
    q: "Come funziona l'aggiornamento ogni 90/180 giorni?",
    a: "Il sistema chiede al titolare di confermare i dati. Se non risponde, invia promemoria, mostra un avviso di verifica e infine sospende la scheda, che resta comunque ripristinabile.",
  },
];

function TerrainPage() {
  return (
    <>
      <PageRails variant="terrain" />
      <HeroBanner
        src={heroTerrain}
        srcMobile={heroTerrainMobile}
        alt="TERRAIN — La mappa del territorio IMLAND"
        ctaTop="64%"
        flush
        mobileBg="#A0522D"
      >
        <Link to="/terrain/luoghi" className="cta-light px-6 py-3.5 text-sm">
          <MapPin className="h-4 w-4 fill-current" />
          Scopri la mappa
        </Link>
        <Link to="/terrain/nuova" className="cta-dark px-6 py-3.5 text-sm">
          Proponi una scheda
        </Link>
      </HeroBanner>

      <div className="page-inverted terrain-inverted">
        {/* Cosa è */}
        <section className="section-focus" id="mappa">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Altri prodotti IMLAND
              </p>
              <h2 className="mt-3 text-h2-im">
                La mappa del <span className="im-gradient-text">territorio</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                TERRAIN è la mappa interattiva di IMLAND Experience. Trova attività, luoghi,
                servizi, eventi ed esperienze nelle province di Vercelli, Biella, Novara e
                Verbano-Cusio-Ossola.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {categories.map((c) => (
                <BentoCard key={c.title} tone={toneForBadge(c.badge)} span={2}>
                  <BadgeIcon name={c.badge} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Funzioni per l'utente */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">Funzioni</p>
              <h2 className="mt-3 text-h2-im">
                Cosa puoi fare su <span className="im-gradient-text">TERRAIN</span>.
              </h2>
            </div>
            <BentoGrid className="mt-10">
              {userFeatures.map((f) => (
                <BentoCard key={f.title} tone={toneForBadge(f.badge)} span={3}>
                  <BadgeIcon name={f.badge} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Schede territoriali */}
        <section className="section-editorial">
          <div className="container-im section-pad">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Schede territoriali
                </p>
                <h2 className="mt-3 text-h2-im">
                  Ogni luogo ha la sua <span className="im-gradient-text">pagina</span>.
                </h2>
                <p className="mt-4 text-base text-foreground/70">
                  Ogni scheda raccoglie tutto ciò che serve per conoscere un'attività o un luogo:
                  descrizione, immagini, contatti, orari, servizi e contenuti collegati.
                </p>
                <ul className="mt-6 space-y-3">
                  {cardFields.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/70">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-center gap-6">
                <div className="glass-panel rounded-3xl p-6">
                  <p className="font-display text-3xl font-semibold text-signal">4 province</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Vercelli, Novara, Biella e Verbano-Cusio-Ossola: il territorio che raccontiamo
                    ogni giorno.
                  </p>
                </div>
                <div className="glass-panel rounded-3xl p-6">
                  <p className="font-display text-3xl font-semibold text-signal">50 km</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Raggio massimo di ricerca, con filtri a 5, 10, 25 e 50 chilometri dalla tua
                    posizione.
                  </p>
                </div>
                <div className="glass-panel rounded-3xl p-6">
                  <p className="font-display text-3xl font-semibold text-signal">
                    Membro ufficiale
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Badge per le attività verificate della rete IMLAND Member.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inserimento autonomo */}
        <section className="section-canvas" id="proponi">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Inserimento autonomo
              </p>
              <h2 className="mt-3 text-h2-im">
                Proponi la tua <span className="im-gradient-text">scheda</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Le attività possono registrarsi e proporre autonomamente la propria scheda. Il
                sistema esegue controlli automatici e la redazione verifica prima della
                pubblicazione.
              </p>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {verificationSteps.map((s) => (
                <li key={s.n} className="glass-panel rounded-3xl p-6">
                  <span className="font-display text-sm font-bold text-signal">{s.n}</span>
                  <h3 className="mt-3 text-h3-im leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Monetizzazione */}
        <section className="section-focus">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Monetizzazione
              </p>
              <h2 className="mt-3 text-h2-im">
                Cresci sulla <span className="im-gradient-text">mappa</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Dalla scheda gratuita ai pacchetti per Comuni e associazioni: TERRAIN offre diversi
                livelli di visibilità.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {monetization.map((m) => (
                <BentoCard key={m.title} tone={toneForBadge(m.badge)} span={3}>
                  <BadgeIcon name={m.badge} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{m.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Collegamenti */}
        <section className="section-editorial">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Integrazioni
              </p>
              <h2 className="mt-3 text-h2-im">
                Collegato a tutto l'<span className="im-gradient-text">hub</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Una scheda Terrain può ospitare articoli News, episodi Podcast, eventi in calendario
                e offerte di lavoro Jobs.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  to: "/news",
                  label: "News",
                  desc: "Articoli e interviste collegate al territorio.",
                },
                { to: "/podcast", label: "Podcast", desc: "Episodi dedicati a luoghi e persone." },
                {
                  to: "/eventi",
                  label: "Eventi",
                  desc: "Manifestazioni organizzate dalle attività.",
                },
                { to: "/jobs", label: "Jobs", desc: "Offerte di lavoro pubblicate dalle aziende." },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group glass-panel rounded-3xl p-6 transition hover:-translate-y-1"
                >
                  <h3 className="text-h3-im leading-snug group-hover:text-signal">{link.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{link.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal">
                    Scopri{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Mappa reale */}
        <section className="section-canvas" id="mappa-live">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Mappa dal vivo
              </p>
              <h2 className="mt-3 text-h2-im">
                Il territorio in tempo <span className="im-gradient-text">reale</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Segnalazioni pubblicate e schede verificate, tutte sulla stessa mappa. Filtra per
                vedere solo le segnalazioni oppure solo i luoghi del territorio.
              </p>
            </div>
            <div className="mt-10">
              <ClientOnly
                fallback={<div className="glass-panel h-[420px] rounded-3xl md:h-[520px]" />}
              >
                <TerrainLiveMap />
              </ClientOnly>
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
                Tutto su <span className="im-gradient-text">TERRAIN</span>.
              </h2>
            </div>
            <Accordion type="single" collapsible className="mt-10 space-y-3">
              {faqs.map((item) => (
                <AccordionItem
                  key={item.q}
                  value={item.q}
                  className="glass-panel rounded-3xl border-0 px-6"
                >
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <NewsletterBanner />
      </div>
    </>
  );
}

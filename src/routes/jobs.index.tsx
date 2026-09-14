import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Search, Briefcase, Building2, FileCheck, Clock, Bell, ArrowRight } from "lucide-react";
import heroJobs from "@/assets/hero-jobs.webp";
import heroJobsMobile from "@/assets/hero-jobs-mobile.webp";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "JOBS — Lavoro, formazione e opportunità nel territorio" },
      {
        name: "description",
        content:
          "JOBS è la piattaforma territoriale di IMLAND Experience per offerte di lavoro, tirocini, formazione e collaborazioni a Vercelli, Novara, Biella e Verbania.",
      },
      {
        name: "keywords",
        content:
          "lavoro, offerte lavoro, tirocinio, formazione, Vercelli, Novara, Biella, Verbania, opportunità",
      },
      { name: "geo.region", content: "IT-PIE" },
      { name: "geo.placename", content: "Vercelli, Novara, Biella, Verbania" },
      { property: "og:title", content: "JOBS — Lavoro, formazione e opportunità nel territorio" },
      { property: "og:description", content: "Trova la tua prossima opportunità." },
    ],
    links: [canonical("/jobs")],
    scripts: [jsonLd(organizationLd)],
  }),
  component: JobsPage,
});

const jobTypes = [
  {
    badge: "jobs" as BadgeName,
    title: "Offerte di lavoro",
    desc: "Dipendenti, part-time e full-time nel territorio.",
  },
  {
    badge: "cerca-profilo" as BadgeName,
    title: "Tirocini e apprendistato",
    desc: "Percorsi di inserimento per giovani e studenti.",
  },
  {
    badge: "stretta-mano" as BadgeName,
    title: "Collaborazioni",
    desc: "Progetti a termine, freelance e partnership.",
  },
  {
    badge: "community" as BadgeName,
    title: "Volontariato",
    desc: "Opportunità nel terzo settore e nelle associazioni.",
  },
  {
    badge: "calendario" as BadgeName,
    title: "Casting e eventi",
    desc: "Selezione per rassegne, spot, live e produzioni.",
  },
  {
    badge: "cv" as BadgeName,
    title: "Corsi e bandi",
    desc: "Formazione, concorsi e avvisi pubblici utili.",
  },
];

const seekerFeatures = [
  {
    badge: "cerca-profilo" as BadgeName,
    title: "Ricerca territoriale",
    desc: "Cerca per Comune, provincia o distanza dal tuo luogo.",
  },
  {
    badge: "cv" as BadgeName,
    title: "Filtri avanzati",
    desc: "Settore, tipo di contratto, modalità di lavoro e annunci attivi.",
  },
  {
    badge: "jobs" as BadgeName,
    title: "Salva opportunità",
    desc: "Tieni traccia delle offerte che ti interessano.",
  },
  {
    badge: "cv" as BadgeName,
    title: "Candidatura con CV",
    desc: "Allega il curriculum e candidati direttamente dalla piattaforma.",
  },
  {
    badge: "stretta-mano" as BadgeName,
    title: "Segui aziende",
    desc: "Ricevi aggiornamenti dalle realtà che ti interessano.",
  },
  {
    badge: "crescita" as BadgeName,
    title: "Notifiche personalizzate",
    desc: "Avvisami quando esce un'offerta nel marketing entro 25 km da Gattinara.",
  },
];

const companyChecks = [
  "Completezza dell'annuncio",
  "Esistenza dell'azienda e email aziendale",
  "Rilevamento annunci duplicati",
  "Blocco link pericolosi",
  "Rilevamento richieste di denaro",
  "Filtro antidiscriminazione",
  "Controllo dati personali pubblicati impropriamente",
  "Coerenza delle date e contenuti sospetti",
];

const durations = [
  { type: "Offerta di lavoro", days: "30 giorni" },
  { type: "Collaborazione", days: "30 giorni" },
  { type: "Tirocinio", days: "45 giorni" },
  { type: "Volontariato", days: "60 giorni" },
  { type: "Casting", days: "15 giorni" },
  { type: "Corso o bando", days: "Fino alla scadenza" },
];

const automations = [
  {
    badge: "articolo" as BadgeName,
    title: "Newsletter settimanale",
    desc: "Raccolta automatica delle opportunità del territorio.",
  },
  {
    badge: "microfono" as BadgeName,
    title: "Rubrica radiofonica",
    desc: "JOBS entra in diretta su IMLAND Radio e Podcast.",
  },
  {
    badge: "annuncio" as BadgeName,
    title: "Post social",
    desc: "Contenuti generati dalle offerte pubblicate.",
  },
  {
    badge: "alert" as BadgeName,
    title: "Notifiche territoriali",
    desc: "Alert per gli utenti interessati nella zona.",
  },
];

const faqs = [
  {
    q: "JOBS è già attiva?",
    a: "Stiamo raccogliendo le prime aziende e opportunità. Puoi iscriverti per essere avvisato al lancio o proporre un annuncio in anteprima.",
  },
  {
    q: "Chi può pubblicare un annuncio?",
    a: "Aziende, studi professionali, associazioni e enti che operano nel territorio. Gli account verificati pubblicano più rapidamente, i nuovi account passano per una revisione.",
  },
  {
    q: "Gli annunci hanno una scadenza?",
    a: "Sì, ogni annuncio ha una scadenza obbligatoria. Il sistema avvisa 7 e 3 giorni prima, poi lo archivia automaticamente conservando lo storico.",
  },
  {
    q: "Posso candidarmi senza registrarmi?",
    a: "Per candidarti e ricevere notifiche serve un account Persona su IMLAND Experience. La registrazione è gratuita.",
  },
];

function JobsPage() {
  return (
    <>
      <PageRails variant="jobs" />
      <HeroBanner
        src={heroJobs}
        srcMobile={heroJobsMobile}
        alt="JOBS — Opportunità di lavoro nel territorio"
        ctaTop="64%"
        flush
        mobileBg="#6B7280"
      >
        <Link to="/jobs/offerte" className="cta-light px-6 py-3.5 text-sm">
          <Search className="h-4 w-4" />
          Cerca un'opportunità
        </Link>
        <Link to="/jobs/pubblica" className="cta-dark px-6 py-3.5 text-sm">
          Pubblica annuncio
        </Link>
      </HeroBanner>

      <div className="page-inverted jobs-inverted">
        {/* Tipologie */}
        <section className="section-focus" id="opportunita">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Altri prodotti IMLAND
              </p>
              <h2 className="mt-3 text-h2-im">
                Non solo <span className="im-gradient-text">offerte</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                JOBS raccoglie tutte le opportunità utili per chi vive e lavora nel territorio.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {jobTypes.map((j) => (
                <BentoCard key={j.title} tone={toneForBadge(j.badge)} span={2}>
                  <BadgeIcon name={j.badge} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{j.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{j.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Funzioni cercatore */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Per chi cerca
              </p>
              <h2 className="mt-3 text-h2-im">
                Trova la tua prossima <span className="im-gradient-text">opportunità</span>.
              </h2>
            </div>
            <BentoGrid className="mt-10">
              {seekerFeatures.map((f) => (
                <BentoCard key={f.title} tone={toneForBadge(f.badge)} span={3}>
                  <BadgeIcon name={f.badge} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Member */}
        <section className="section-editorial" id="pubblica">
          <div className="container-im section-pad">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">Member</p>
                <h2 className="mt-3 text-h2-im">
                  Pubblica in modo <span className="im-gradient-text">sicuro</span>.
                </h2>
                <p className="mt-4 text-base text-foreground/70">
                  I Member possono pubblicare autonomamente un annuncio indicando titolo,
                  descrizione, sede, categoria, contratto, modalità di lavoro, requisiti e modalità
                  di candidatura.
                </p>
                <p className="mt-4 text-base text-foreground/70">
                  Prima della pubblicazione il sistema esegue controlli automatici; i Member
                  verificati pubblicano più rapidamente.
                </p>
              </div>
              <div className="rounded-3xl border border-outline bg-surface-1 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Controlli automatici
                </p>
                <h3 className="mt-3 text-h3-im">Cosa verifichiamo</h3>
                <ul className="mt-6 space-y-3">
                  {companyChecks.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Scadenza automatica */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Scadenza automatica
              </p>
              <h2 className="mt-3 text-h2-im">
                Ogni annuncio ha una <span className="im-gradient-text">data</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Il sistema avvisa l'azienda 7 e 3 giorni prima della scadenza, poi archivia
                l'annuncio conservando statistiche e storico.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {durations.map((d) => (
                <div key={d.type} className="glass-panel rounded-3xl p-6">
                  <Clock className="h-6 w-6 text-signal" />
                  <h3 className="mt-4 text-h3-im leading-snug">{d.type}</h3>
                  <p className="mt-2 text-sm font-semibold text-muted-foreground">{d.days}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Automazioni */}
        <section className="section-focus">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Automazioni editoriali
              </p>
              <h2 className="mt-3 text-h2-im">
                JOBS alimenta <span className="im-gradient-text">tutto l'hub</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Gli annunci vengono recuperati direttamente dal database per newsletter, social,
                rubriche radiofoniche e notifiche territoriali.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {automations.map((a) => (
                <BentoCard key={a.title} tone={toneForBadge(a.badge)} span={3}>
                  <BadgeIcon name={a.badge} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Monetizzazione / CTA */}
        <section className="section-editorial">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Monetizzazione
              </p>
              <h2 className="mt-3 text-h2-im">
                Soluzioni per ogni <span className="im-gradient-text">esigenza</span>.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Annuncio base", desc: "Gratuito e visibile nella ricerca territoriale." },
                { title: "In evidenza", desc: "Maggiore visibilità in cima ai risultati." },
                { title: "Pacchetti multipli", desc: "Sconti per chi pubblica più annunci." },
                {
                  title: "Recruiting territoriale",
                  desc: "Supporto dedicato per selezioni locali.",
                },
              ].map((m) => (
                <div key={m.title} className="glass-panel rounded-3xl p-6">
                  <h3 className="text-h3-im leading-snug">{m.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/jobs/pubblica" className="cta-light px-6 py-3.5 text-sm">
                <Briefcase className="h-4 w-4" />
                Pubblica un annuncio
              </Link>
              <Link to="/member" className="cta-dark px-6 py-3.5 text-sm">
                Member
              </Link>
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
                Tutto su <span className="im-gradient-text">JOBS</span>.
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

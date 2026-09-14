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
import { Megaphone, MapPin, Shield, Clock, FileText, ArrowRight, Bell } from "lucide-react";
import heroAlert from "@/assets/hero-alert.webp";
import heroAlertMobile from "@/assets/hero-alert-mobile.webp";

export const Route = createFileRoute("/alert/")({
  head: () => ({
    meta: [
      { title: "ALERT — Segnala ciò che accade nel territorio" },
      {
        name: "description",
        content:
          "ALERT è il punto d'ingresso di IMLAND Experience per notizie, eventi, problemi e storie dal territorio. Segnala ciò che accade a Vercelli, Novara, Biella e Verbania.",
      },
      {
        name: "keywords",
        content:
          "segnalazioni, territorio, notizie, eventi, problemi, Vercelli, Novara, Biella, Verbania",
      },
      { name: "geo.region", content: "IT-PIE" },
      { name: "geo.placename", content: "Vercelli, Novara, Biella, Verbania" },
      { property: "og:title", content: "ALERT — Segnala ciò che accade nel territorio" },
      { property: "og:description", content: "Segnala ciò che accade." },
    ],
    links: [canonical("/alert")],
    scripts: [jsonLd(organizationLd)],
  }),
  component: AlertPage,
});

const reportTypes = [
  {
    badge: "news" as BadgeName,
    title: "Notizia",
    desc: "Un fatto rilevante da raccontare nella redazione News.",
  },
  {
    badge: "calendario" as BadgeName,
    title: "Evento",
    desc: "Una manifestazione, una festa o un appuntamento da inserire in calendario.",
  },
  {
    badge: "negozio" as BadgeName,
    title: "Nuova attività",
    desc: "Una realtà da aggiungere alla mappa TERRAIN.",
  },
  {
    badge: "microfono" as BadgeName,
    title: "Persona o storia",
    desc: "Un protagonista da intervistare in Radio o Podcast.",
  },
  {
    badge: "jobs" as BadgeName,
    title: "Offerta di lavoro",
    desc: "Un'opportunità da pubblicare su JOBS.",
  },
  {
    badge: "alert-pin" as BadgeName,
    title: "Problema urbano",
    desc: "Una segnalazione da inoltrare al Comune convenzionato.",
  },
];

const reportSteps = [
  {
    n: "01",
    title: "Cosa vuoi segnalare",
    desc: "Scegli la tipologia tra notizia, evento, attività, offerta, problema o storia.",
  },
  {
    n: "02",
    title: "Dove e quando",
    desc: "Indica luogo, data e ora. Puoi usare indirizzo, GPS o la mappa TERRAIN.",
  },
  {
    n: "03",
    title: "Descrivi il fatto",
    desc: "Racconta ciò che hai visto, allega foto o documenti e indica la fonte.",
  },
  { n: "04", title: "Recapito", desc: "Lascia email o telefono e scegli se mostrare il tuo nome." },
];

const routing = [
  { type: "Notizia", dest: "Redazione News" },
  { type: "Evento", dest: "Area Eventi" },
  { type: "Nuova attività", dest: "TERRAIN" },
  { type: "Offerta di lavoro", dest: "JOBS" },
  { type: "Personaggio o storia", dest: "Radio e Podcast" },
  { type: "Errore su una scheda", dest: "Gestione TERRAIN" },
  { type: "Problema urbano", dest: "Comune convenzionato" },
  { type: "Contenuto sensibile", dest: "Revisione amministrativa" },
];

const statuses = [
  "Ricevuta",
  "In analisi",
  "Da verificare",
  "Assegnata",
  "In lavorazione",
  "In attesa di informazioni",
  "Verificata",
  "Pubblicata",
  "Inoltrata",
  "Risolta",
  "Respinta",
  "Archiviata",
];

const deadlines = [
  { label: "Eventi", desc: "Archiviati dopo la data di svolgimento." },
  { label: "Segnalazioni incomplete", desc: "Scadono dopo 14 giorni senza integrazioni." },
  { label: "Proposte editoriali", desc: "Archiviate dopo 90 giorni se non utilizzate." },
  { label: "Problemi irrisolti", desc: "Generano promemoria automatici." },
];

const security = [
  {
    badge: "scudo" as BadgeName,
    title: "Verifica email/telefono",
    desc: "Per ridurre abusi e segnalazioni false.",
  },
  {
    badge: "alert-phone" as BadgeName,
    title: "Limite di invii",
    desc: "Rate limiting per proteggere la piattaforma dallo spam.",
  },
  {
    badge: "alert-pin" as BadgeName,
    title: "Controllo allegati",
    desc: "Scan automatico di immagini e documenti.",
  },
  {
    badge: "alert" as BadgeName,
    title: "Filtro antispam",
    desc: "Rilevamento duplicati e link pericolosi.",
  },
];

const faqs = [
  {
    q: "ALERT è già attiva?",
    a: "Stiamo allestendo il sistema di smistamento e moderazione. Puoi già contattarci per segnalare una storia, un evento o un problema del territorio.",
  },
  {
    q: "Cosa succede dopo una segnalazione?",
    a: "Ricevi un codice univoco e puoi controllare lo stato. Il sistema smista automaticamente la segnalazione verso la redazione o l'ufficio competente.",
  },
  {
    q: "Le segnalazioni vengono pubblicate automaticamente?",
    a: "No. Le accuse verso persone o aziende, le emergenze e i contenuti sensibili passano sempre per una moderazione umana prima della pubblicazione.",
  },
  {
    q: "I Comuni possono usare ALERT?",
    a: "Sì, i Comuni convenzionati hanno accesso a una dashboard dedicata con segnalazioni geolocalizzate, assegnazione agli uffici, aggiornamento dello stato e report mensili.",
  },
];

function AlertPage() {
  return (
    <>
      <PageRails variant="alert" />
      <HeroBanner
        src={heroAlert}
        srcMobile={heroAlertMobile}
        alt="ALERT — Segnala ciò che accade nel territorio"
        ctaTop="64%"
        flush
        mobileBg="#FF0000"
      >
        <Link to="/alert/segnala" className="cta-light px-6 py-3.5 text-sm">
          <Megaphone className="h-4 w-4" />
          Fai una segnalazione
        </Link>
        <Link to="/alert/stato" className="cta-dark px-6 py-3.5 text-sm">
          Controlla stato
        </Link>
      </HeroBanner>

      <div className="page-inverted alert-inverted">
        {/* Cosa si può segnalare */}
        <section className="section-focus" id="segnala">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Altri prodotti IMLAND
              </p>
              <h2 className="mt-3 text-h2-im">
                Cosa puoi <span className="im-gradient-text">segnalare</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                ALERT è il punto d'ingresso per notizie, eventi, problemi, storie e informazioni dal
                territorio.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {reportTypes.map((r) => (
                <BentoCard key={r.title} tone={toneForBadge(r.badge)} span={2}>
                  <BadgeIcon name={r.badge} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Procedura */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Procedura
              </p>
              <h2 className="mt-3 text-h2-im">
                Quattro passaggi per <span className="im-gradient-text">segnalare</span>.
              </h2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {reportSteps.map((s) => (
                <li key={s.n} className="glass-panel rounded-3xl p-6">
                  <span className="font-display text-sm font-bold text-signal">{s.n}</span>
                  <h3 className="mt-3 text-h3-im leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Smistamento */}
        <section className="section-editorial">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Smistamento automatico
              </p>
              <h2 className="mt-3 text-h2-im">
                Ogni segnalazione arriva <span className="im-gradient-text">dove serve</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Il sistema riconosce la tipologia e indirizza la segnalazione verso la redazione o
                l'ufficio competente.
              </p>
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {routing.map((r) => (
                <div
                  key={r.type}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-outline bg-white px-5 py-3"
                >
                  <span className="font-semibold text-foreground">{r.type}</span>
                  <span className="text-sm text-muted-foreground">→ {r.dest}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stati */}
        <section className="section-canvas" id="stato">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">Stati</p>
              <h2 className="mt-3 text-h2-im">
                Segui la tua <span className="im-gradient-text">segnalazione</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Ogni segnalazione riceve un codice e passa attraverso stati trasparenti, fino alla
                conclusione.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {statuses.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-outline bg-white px-4 py-2 text-sm font-medium text-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Scadenze */}
        <section className="section-focus">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Scadenze automatiche
              </p>
              <h2 className="mt-3 text-h2-im">
                Nessuna segnalazione <span className="im-gradient-text">ferma</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Il sistema gestisce scadenze, promemoria e archiviazione per mantenere la
                piattaforma aggiornata.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {deadlines.map((d) => (
                <BentoCard key={d.label} tone="alert" span={3}>
                  <Clock className="h-8 w-8 text-signal" />
                  <h3 className="mt-5 text-h3-im leading-snug">{d.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Sicurezza */}
        <section className="section-editorial">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Sicurezza e moderazione
              </p>
              <h2 className="mt-3 text-h2-im">
                Proteggiamo persone e <span className="im-gradient-text">comunità</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Per impedire abusi usiamo verifica, controlli automatici, filtri antispam e
                moderazione umana sui contenuti sensibili.
              </p>
            </div>
            <BentoGrid className="mt-10">
              {security.map((s) => (
                <BentoCard key={s.title} tone={toneForBadge(s.badge)} span={3}>
                  <BadgeIcon name={s.badge} className="h-14 w-14" />
                  <h3 className="mt-5 text-h3-im leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Comuni */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Servizi per i Comuni
                </p>
                <h2 className="mt-3 text-h2-im">
                  Una dashboard per gli <span className="im-gradient-text">enti locali</span>.
                </h2>
                <p className="mt-4 text-base text-foreground/70">
                  I Comuni convenzionati possono gestire le segnalazioni geolocalizzate, assegnarle
                  agli uffici, aggiornare lo stato, comunicare con i cittadini e scaricare report
                  mensili.
                </p>
                <p className="mt-4 text-base text-foreground/70">
                  Per i cittadini ALERT rimane gratuito; i Comuni possono attivare un abbonamento
                  per dashboard avanzata, report e gestione dedicata.
                </p>
              </div>
              <div className="flex flex-col justify-center gap-6">
                {[
                  "Dashboard con mappa delle segnalazioni",
                  "Assegnazione agli uffici competenti",
                  "Aggiornamento stato in tempo reale",
                  "Report mensili esportabili",
                  "Categorie personalizzate",
                  "Comunicazioni ai cittadini",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-foreground/70">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-editorial">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Domande frequenti
              </p>
              <h2 className="mt-3 text-h2-im">
                Tutto su <span className="im-gradient-text">ALERT</span>.
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

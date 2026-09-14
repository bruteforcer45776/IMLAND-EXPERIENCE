import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical, faqLd, jsonLd } from "../lib/seo";
import { seoFaq } from "../data/seo-faq";
import { ArrowRight, Mail } from "lucide-react";

import { BrandIcon } from "../components/brand-icons";
import { BadgeIcon, badgeForIcon, toneForBadge } from "../components/badge-icon";
import { BentoCard } from "../components/bento";
import { PageHero } from "../components/page-hero";
import { SectionHeader } from "../components/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

type Category = {
  id: string;
  title: string;
  icon: Parameters<typeof BrandIcon>[0]["name"];
  tone: Parameters<typeof BrandIcon>[0]["tone"];
  intro: string;
  items: { q: string; a: string | ReactNode }[];
};

const categories: Category[] = [
  {
    id: "radio",
    title: "Radio",
    icon: "onde_radio",
    tone: "radio",
    intro: "Diretta 24/7, palinsesto e come sintonizzarti ovunque tu sia.",
    items: [
      {
        q: "Cos'è IMLAND EXPERIENCE?",
        a: "IMLAND è un hub territoriale che unisce radio, podcast, eventi e community per dare voce al Piemonte nord-orientale. Trasmettiamo 24/7 e organizziamo momenti live sul territorio.",
      },
      {
        q: "Come si ascolta la radio di IMLAND?",
        a: "La radio si ascolta gratuitamente online dal sito, dalla pagina Radio o dal player sempre attivo, oltre che dall'app installabile su iPhone, Android e desktop. La diretta è disponibile 24 ore su 24.",
      },
      {
        q: "Che musica trasmette IMLAND Radio?",
        a: "IMLAND Radio trasmette musica italiana e internazionale, classifiche settimanali, dj set e programmi musicali come IMLAND Charts e Musical Box, alternati a talk e interviste sul territorio.",
      },
      {
        q: "In quali città opera IMLAND EXPERIENCE?",
        a: "IMLAND opera principalmente a Vercelli, Novara, Biella e Verbania, e in generale nel Piemonte nord-orientale, con radio, podcast, news locali ed eventi.",
      },
      {
        q: "Come installo l'app della radio?",
        a: (
          <>
            IMLAND è una web app: si installa direttamente dal browser senza passare da App Store o
            Play Store. Su iPhone usa Condividi <ArrowRight className="inline h-4 w-4" /> "Aggiungi
            alla schermata Home" da Safari; su Android il menu di Chrome{" "}
            <ArrowRight className="inline h-4 w-4" /> "Installa app".
          </>
        ),
      },
      {
        q: "IMLAND è gratuita da ascoltare?",
        a: "Sì, ascoltare la radio, i podcast e leggere le news è completamente gratuito. Alcuni contenuti extra e vantaggi sono riservati ai Member.",
      },
    ],
  },
  {
    id: "podcast",
    title: "Podcast",
    icon: "cuffie",
    tone: "podcast",
    intro: "Serie originali su cibo, cultura, impresa e territorio.",
    items: [
      {
        q: "Di cosa parlano i podcast IMLAND?",
        a: "I podcast IMLAND raccontano musica, imprese, cultura, cibo ed eventi del territorio piemontese, con interviste a protagonisti locali di Vercelli, Novara, Biella e Verbania.",
      },
      {
        q: "Dove posso ascoltare i podcast?",
        a: "Tutti i podcast sono disponibili sul sito nella sezione Podcast, nell'app IMLAND e sulle principali piattaforme (Spotify, Apple Podcasts, Amazon Music).",
      },
      {
        q: "Ogni quanto uscite con nuovi episodi?",
        a: "La programmazione varia per serie. In media pubblichiamo nuovi episodi ogni settimana, li trovi sempre in home e nella sezione Podcast.",
      },
      {
        q: "Posso proporre un podcast o un ospite?",
        a: "Certo. Scrivici dalla pagina Contatti raccontandoci l'idea: valutiamo ogni proposta legata al territorio.",
      },
    ],
  },
  {
    id: "eventi",
    title: "Eventi",
    icon: "ticket",
    tone: "eventi",
    intro: "Radio in tour, dirette live e format su misura.",
    items: [
      {
        q: "Come partecipo agli eventi IMLAND?",
        a: "Trovi tutti gli eventi nella sezione Eventi con date, luogo e modalità di partecipazione. Alcuni sono gratuiti, altri richiedono prenotazione.",
      },
      {
        q: "IMLAND organizza eventi con musica a Vercelli, Novara, Biella e Verbania?",
        a: "Sì. IMLAND cura animazione e intrattenimento per eventi con musica dal vivo, dj set e radio in tour a Vercelli, Novara, Biella, Verbania e nei comuni vicini. Non fornisce catering né service tecnico.",
      },
      {
        q: "Organizzate eventi privati o su commissione?",
        a: "Sì, curiamo dirette, format live e serate su misura per aziende e istituzioni. Contattaci per un preventivo.",
      },
    ],
  },
  {
    id: "member",
    title: "Partners",
    icon: "tessera_member",
    tone: "member",
    intro: "Collaborazioni, adesione e opportunità per aziende e professionisti.",
    items: [
      {
        q: "Come si diventa Partner di IMLAND?",
        a: "Aziende, professionisti e associazioni possono entrare nel progetto dalla pagina Partners e costruire insieme a IMLAND la collaborazione più adatta.",
      },
      {
        q: "Cosa include la membership IMLAND?",
        a: "Contenuti riservati, sconti sugli eventi, spazi pubblicitari agevolati e accesso anticipato ai nuovi format. Trovi i dettagli nella pagina Member.",
      },
      {
        q: "Come posso sponsorizzare un programma?",
        a: "Radio, podcast, newsletter e banner sul sito: contattaci per un piano dedicato che valorizzi il tuo brand sul territorio.",
      },
      {
        q: "Posso disdire in qualsiasi momento?",
        a: "Sì, la membership è flessibile. Puoi disdire in qualsiasi momento senza costi aggiuntivi.",
      },
    ],
  },
  {
    id: "community",
    title: "Community e tecnica",
    icon: "community",
    tone: "news",
    intro: "News, newsletter e supporto tecnico su app e sito.",
    items: [
      {
        q: "Le news di IMLAND riguardano solo il Piemonte?",
        a: "Sì: la sezione News aggrega e seleziona notizie da Vercelli, Novara, Biella, Verbania e dal resto del Piemonte, con focus su territorio, musica, cultura ed economia locale.",
      },
      {
        q: "Come mi iscrivo alla newsletter?",
        a: "Trovi il modulo di iscrizione in fondo a ogni pagina del sito: bastano pochi secondi per ricevere gli aggiornamenti settimanali di IMLAND.",
      },
      {
        q: "Posso installare l'app anche su computer?",
        a: "Sì, dalla barra degli indirizzi di Chrome, Edge o Safari trovi l'icona per installare l'app su Mac, Windows e Linux.",
      },
      {
        q: "Ho un problema tecnico con il sito o l'app: a chi scrivo?",
        a: "Scrivici dalla pagina Contatti descrivendo il problema (dispositivo e browser usati): il team tecnico ti risponde in poche ore lavorative.",
      },
    ],
  },
];

const allFaqItems = [...seoFaq, ...categories.flatMap((c) => c.items)];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — radio, musica, podcast ed eventi in Piemonte" },
      {
        name: "description",
        content:
          "Domande frequenti su IMLAND: radio in diretta, musica, podcast, eventi e membership a Vercelli, Novara, Biella e Verbania.",
      },
      { property: "og:title", content: "FAQ · IMLAND EXPERIENCE" },
      {
        property: "og:description",
        content: "Tutte le risposte su radio, podcast, eventi e membership IMLAND.",
      },
    ],
    links: [canonical("/faq")],
    scripts: [jsonLd(faqLd(allFaqItems))],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Domande frequenti"
        badge="commento"
        title={<>Tutto quello che vuoi <span className="im-gradient-text">sapere</span>.</>}
        subtitle="Risposte chiare e ordinate su radio, podcast, eventi, partnership e assistenza."
      >
        <a href="#radio" className="rounded-full btn-blue px-6 py-3 text-sm">
          Vai alle risposte
        </a>
        <Link to="/contatti" className="rounded-full btn-ghost-glass px-6 py-3 text-sm">
          Scrivi alla redazione
        </Link>
      </PageHero>

      <section className="section-focus">
        <div className="container-im section-pad">
          <SectionHeader
            eyebrow="Argomenti"
            badge="news"
            title={
              <>
                Trova subito la <span className="im-gradient-text">risposta</span>.
              </>
            }
            description="Seleziona un argomento oppure scorri le domande organizzate per area."
          />

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="chip-im inline-flex items-center gap-1.5"
              >
                <BrandIcon name={cat.icon} className="h-4 w-4" tone={cat.tone} />
                {cat.title}
              </a>
            ))}
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-6">
            {categories.map((cat) => (
              <BentoCard
                key={cat.id}
                tone={cat.tone ?? toneForBadge(badgeForIcon(cat.icon))}
                span={12}
                className="scroll-mt-24"
                id={cat.id}
              >
                <div className="flex items-start gap-4 border-b border-border pb-5">
                  <BadgeIcon name={badgeForIcon(cat.icon)} className="h-14 w-14" />
                  <div>
                    <h2 className="text-h2-im">{cat.title}</h2>
                    <p className="mt-1 max-w-2xl text-base text-muted-foreground">{cat.intro}</p>
                  </div>
                </div>
                <Accordion type="single" collapsible className="mt-2">
                  {cat.items.map((item, idx) => (
                    <AccordionItem key={idx} value={`${cat.id}-${idx}`} className="border-border">
                      <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline md:text-lg">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground md:text-base">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-canvas">
        <div className="container-im section-pad">
          <div className="rounded-[28px] border border-border bg-signal p-8 text-signal-foreground md:p-12">
            <div className="grid gap-6 md:grid-cols-[1.4fr_auto] md:items-center">
              <div>
                <h2 className="text-h2-im">
                  Non hai trovato <br />
                  la tua risposta?
                </h2>
                <p className="mt-2 max-w-xl text-sm text-signal-foreground/85 md:text-base">
                  Scrivici: il team IMLAND ti risponde in poche ore lavorative.
                </p>
              </div>
              <Link
                to="/contatti"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-surface-1 px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface-2"
              >
                <Mail size={16} /> Contattaci
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

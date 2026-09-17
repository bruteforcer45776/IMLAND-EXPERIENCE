import { lazy, Suspense, useState } from "react";
import { canonical, jsonLd, memberProgramLd } from "../lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Users } from "lucide-react";
import todaroPhoto from "../assets/andrea-todaro.jpg.asset.json";
import motorhouseWhite from "../assets/motorhouse-white.png.asset.json";
import { NewsletterBanner } from "../components/newsletter-banner";
import { SpotlightCard } from "../components/spotlight-card";
import { PhotoBadge } from "../components/photo-badge";
import { HeroBanner } from "../components/hero-banner";
import { MEMBER_DETAILS, type MemberAddress } from "../data/member-details";

const DomeGallery = lazy(() => import("../components/dome-gallery"));
const ImLandMap = lazy(() =>
  import("../components/home/imland-map").then((m) => ({ default: m.ImLandMap })),
);

import { PageRails } from "../components/decor";
import { BentoGrid, BentoCard } from "../components/bento";
import { WHATSAPP_MEMBER_URL } from "@/lib/whatsapp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

export const Route = createFileRoute("/member")({
  head: () => {
    const preconnect = {
      rel: "preconnect" as const,
      href: "https://imlandradio.it",
      crossOrigin: "anonymous" as const,
    };
    const criticalLogos = memberWall.slice(0, 12).map((m) => ({
      rel: "preload" as const,
      as: "image" as const,
      href: m.cover,
    }));
    return {
      meta: [
        { title: "Diventa Member — IMLAND EXPERIENCE" },
        {
          name: "description",
          content:
            "Diventa IMLAND Member: spot radio, podcast ed eventi per farti conoscere a Vercelli, Novara, Biella e Verbania. Entra nella rete del territorio.",
        },
        { name: "geo.region", content: "IT-PIE" },
        { property: "og:title", content: "Diventa Member — IMLAND EXPERIENCE" },
        {
          property: "og:description",
          content: "Diventa IMLAND Member: la rete di chi dà voce al territorio.",
        },
      ],
      links: [canonical("/member"), preconnect, ...criticalLogos],
      scripts: [jsonLd(memberProgramLd)],
    };
  },
  component: MemberPage,
});

const whyBecome = [
  {
    k: "Visibilità",
    v: "Un canale locale che parla direttamente a chi vive e compra sul tuo territorio.",
  },
  {
    k: "Autorevolezza",
    v: "Non uno spot, una voce. La tua storia raccontata dai conduttori IMLAND.",
  },
  { k: "Rete", v: "Entri in una community di aziende, professionisti e associazioni della zona." },
];

const benefits = [
  {
    tag: "Radio",
    title: "Vai in onda",
    desc: "Crea il tuo spot o la tua rubrica sulla programmazione IMLAND Radio.",
  },
  {
    tag: "Podcast",
    title: "Produci la tua serie",
    desc: "Studio, montaggio e distribuzione: mettiamo la nostra macchina al tuo servizio.",
  },
  {
    tag: "Eventi",
    title: "Porta il tuo evento",
    desc: "Live, talk, radio in piazza: il tuo evento nel calendario IMLAND.",
  },
  {
    tag: "Community",
    title: "Rete territoriale",
    desc: "Entra in una rete di voci, redattori, artisti e curatori del territorio.",
  },
];

const whatYouGet = [
  "Spot radio geolocalizzati sul territorio delle 4 province",
  "Studio di registrazione dedicato per podcast e rubriche",
  "Distribuzione su Spotify, Apple Podcasts, Google Podcasts",
  "Presenza nel Member Wall e nella rete IMLAND",
  "Tariffe agevolate per campagne annuali e cross-canale",
  "Slot dedicato nella newsletter settimanale IMLAND",
  "Priorità sulla sponsorizzazione degli eventi in calendario",
  "Report periodico su ascolti, download e reach",
];

const memberEvents = [
  {
    date: "12 LUG",
    title: "Piazza aperta — voci dai borghi",
    place: "Rocca Malatestiana, Cesena",
    tag: "Live",
  },
  {
    date: "19 LUG",
    title: "Radio in tour: notte bianca",
    place: "Piazza del Popolo, Faenza",
    tag: "Broadcast",
  },
  {
    date: "27 LUG",
    title: "Podcast Lab — laboratorio aperto",
    place: "IMLAND HUB, Rimini",
    tag: "Workshop",
  },
];

const memberTestimonials = [
  {
    quote:
      "Da quando siamo Member IMLAND, quando ci presentiamo a un cliente lo abbiamo già sentito nominare. Il territorio ci riconosce prima ancora del preventivo.",
    name: "Sesia Soft",
    role: "Tecnologia",
  },
  {
    quote:
      "Il podcast che abbiamo prodotto con IMLAND ci ha portato tre clienti nuovi nel primo trimestre. È diventato il nostro miglior biglietto da visita.",
    name: "Andrea Todaro",
    role: "Consulente d'azienda",
  },
  {
    quote:
      "IMLAND ci ha dato una voce vera. Non un banner, non uno spot: una storia che continua ogni settimana.",
    name: "Travaini Carpenterie",
    role: "Industria",
  },
];

const memberFaqs = [
  {
    q: "Chi può diventare Member IMLAND?",
    a: "Aziende, professionisti, associazioni e attività locali del territorio tra Vercelli, Verbania, Biella e Novara. Valutiamo caso per caso: contattaci per capire se c'è affinità.",
  },
  {
    q: "Quanto dura la Membership?",
    a: "La Membership standard è annuale. Puoi rinnovarla o modificarla in qualsiasi momento in base alle campagne che stai portando avanti.",
  },
  {
    q: "Posso attivare solo un canale (es. solo radio)?",
    a: "Sì. Puoi partire con un solo canale e ampliare successivamente. Le Membership complete su radio + podcast + eventi hanno tariffe più vantaggiose.",
  },
  {
    q: "Quanto tempo passa tra iscrizione e primo contenuto in onda?",
    a: "Circa 10 giorni per uno spot radio, 3-4 settimane per un podcast serie con briefing, sceneggiatura e registrazione.",
  },
  {
    q: "Come vengono misurati i risultati?",
    a: "Report periodico con ascolti radio, download podcast, reach social ed engagement sugli eventi in calendario.",
  },
];

export type MemberWallEntry = {
  name: string;
  cover: string;
  url: string | null;
  category: string;
  desc: string;
  addresses: MemberAddress[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Fonte: https://imlandradio.it/members-wall/
const memberWallSource: Omit<MemberWallEntry, "desc" | "addresses">[] = [
  {
    name: "Travaini Carpenterie",
    cover: "https://imlandradio.it/wp-content/uploads/2025/10/travaini-Carpenterie.jpg",
    url: "https://travaini.it/",
    category: "Industria",
  },
  {
    name: "Arte Idea — Matteo Libanoro",
    cover: "https://imlandradio.it/wp-content/uploads/2026/01/arteidea-1.jpg",
    url: "https://www.matteolibanoro.it/presentazione/",
    category: "Arte & Design",
  },
  {
    name: "Cooperativa Alla Fonte",
    cover: "https://imlandradio.it/wp-content/uploads/2025/11/allafonte.jpg",
    url: "https://www.cooperativallafonte.it/",
    category: "Sociale",
  },
  {
    name: "Immobiliare Ponti",
    cover: "https://imlandradio.it/wp-content/uploads/2026/03/ponti.jpg",
    url: "https://www.immobiliareponti.it/",
    category: "Immobiliare",
  },
  {
    name: "Guglielmi",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/Guglielmi.png",
    url: "https://www.guglielmi.com/",
    category: "Industria",
  },
  {
    name: "Ali Lavoro",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/ali-lavoro.png",
    url: "https://alilavoro.it/",
    category: "HR & Lavoro",
  },
  {
    name: "A2G Maglificio",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/A2G-Maglificio.png",
    url: "https://www.a2gmaglificio.it/",
    category: "Moda",
  },
  {
    name: "Class Luxury Beauty PMU",
    cover: "https://imlandradio.it/wp-content/uploads/2026/04/class_beauty.jpg",
    url: "https://www.instagram.com/class_luxurybeauty_pmu",
    category: "Beauty",
  },
  {
    name: "Andrea Todaro — Consulente",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/Todaro.jpg",
    url: "https://andreatodaroconsulente.it/homepage/",
    category: "Consulenza",
  },
  {
    name: "Sesia Soft",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/sesia-soft.png",
    url: "https://sesiasoft.com/index.php",
    category: "Tecnologia",
  },
  {
    name: "CSC Infissi",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/CSC-infissi.png",
    url: "https://www.cscinfissi.it/",
    category: "Casa & Edilizia",
  },
  {
    name: "Bo.S.Co Gattinara",
    cover: "https://imlandradio.it/wp-content/uploads/2026/04/bo.s.co_.jpg",
    url: "https://www.google.com/search?q=bo.s.co+gattinara",
    category: "Ristorazione",
  },
  {
    name: "Sais Compensati",
    cover: "https://imlandradio.it/wp-content/uploads/2026/02/sais.jpg",
    url: "https://saiscompensati.com/",
    category: "Industria",
  },
  {
    name: "Barbi Green",
    cover: "https://imlandradio.it/wp-content/uploads/2025/12/Barbi-Green.jpg",
    url: "https://barbigreen.com/",
    category: "Green",
  },
  {
    name: "BGS Srl",
    cover: "https://imlandradio.it/wp-content/uploads/2026/06/bgs_logo.jpg",
    url: "https://www.bgssrl.com/#about",
    category: "Servizi",
  },
  {
    name: "Ai 3 Calici",
    cover: "https://imlandradio.it/wp-content/uploads/2026/05/ai-3-calici.jpg",
    url: "https://www.instagram.com/ai3calici",
    category: "Ristorazione",
  },
  {
    name: "Officine Grafiche",
    cover: "https://imlandradio.it/wp-content/uploads/2026/02/officine-grafiche.jpg",
    url: "https://www.officinegrafiche-srl.it/",
    category: "Stampa & Grafica",
  },
  {
    name: "L'Orizzo — SOS Genitori",
    cover: "https://imlandradio.it/wp-content/uploads/2026/03/lorizzo.jpg",
    url: "https://camminiprospettici.it/sos-genitori/",
    category: "Educazione",
  },
  {
    name: "Magnolia Ristorante Gattinara",
    cover: "https://imlandradio.it/wp-content/uploads/2026/01/Magnolia.jpg",
    url: "https://www.magnoliaristorantegattinara.com/",
    category: "Ristorazione",
  },
  {
    name: "SOS Nepal",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/SOS-Nepal.png",
    url: "https://www.sos-nepal.org/",
    category: "No profit",
  },
  {
    name: "Motorhouse",
    cover: motorhouseWhite.url,
    url: "https://motorh.it/",
    category: "Automotive",
  },
  {
    name: "Monterosa Immobiliare",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/Monterosa-Immobiliare.png",
    url: "https://www.monterosaimmobiliare.it/",
    category: "Immobiliare",
  },
  {
    name: "Ottica Zonco",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/Ottica-Zonco.png",
    url: "https://otticazonco.it/",
    category: "Ottica",
  },
  {
    name: "Cabboi",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/cabboi.png",
    url: "https://www.cabboi.com/",
    category: "Servizi",
  },
  {
    name: "Valpil Tetti",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/Valpil.png",
    url: "https://www.valpiltetti.com/",
    category: "Edilizia",
  },
  {
    name: "CP Studio Tecnico",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/CP-studio-tecnico.png",
    url: null,
    category: "Studio tecnico",
  },
  {
    name: "Crolla Telecom",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/crolla_logo-1.png",
    url: "https://www.crollatelecom.it/",
    category: "Telecomunicazioni",
  },
  {
    name: "Parafarmacia San Rocco",
    cover: "https://imlandradio.it/wp-content/uploads/2025/10/Paerafarmacia-Sanrocco.jpg",
    url: "https://www.parafarmaciasanrocco.it/",
    category: "Salute",
  },
  {
    name: "Multone",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/multone.png",
    url: "https://multone.it/",
    category: "Servizi",
  },
  {
    name: "CIS Spare Parts",
    cover: "https://imlandradio.it/wp-content/uploads/2025/12/CIS-member.jpg",
    url: "https://www.cis-spareparts.com/it/",
    category: "Ricambi industriali",
  },
  {
    name: "Malama",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/Malama.png",
    url: "https://share.google/q6ftMxGBUie3ntKx1",
    category: "Wellness",
  },
  {
    name: "Modularee",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/modularee.png",
    url: "https://www.modularee.eu/",
    category: "Arredamento",
  },
  {
    name: "Barberi",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/Barberi.png",
    url: "https://www.barberi.it/",
    category: "Industria",
  },
  {
    name: "RS Eventi",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/RS-eventi-1.png",
    url: "https://share.google/TG0bBADhYN15NJDv8",
    category: "Eventi",
  },
  {
    name: "Immobilsesia",
    cover: "https://imlandradio.it/wp-content/uploads/2026/04/immobilsesia.jpg",
    url: "https://www.immobilsesia.it/",
    category: "Immobiliare",
  },
  {
    name: "Motel Piranha",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/motel_piranha.jpg",
    url: "https://motelpiranha.com/",
    category: "Musica & Live",
  },
  {
    name: "Gozzi Arte",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/Gozzi.png",
    url: "https://gozziarte.com/",
    category: "Arte",
  },
  {
    name: "AG Autotrasporti",
    cover: "https://imlandradio.it/wp-content/uploads/2026/01/ag-autotrasporti.jpg",
    url: "https://www.agautotrasporti.it/",
    category: "Logistica",
  },
  {
    name: "OSM Partner Novara",
    cover: "https://imlandradio.it/wp-content/uploads/2026/04/Osm-Novara.jpg",
    url: "https://osmpartnernovara.it/",
    category: "Consulenza",
  },
  {
    name: "MGG — Magrega Padel",
    cover: "https://imlandradio.it/wp-content/uploads/2025/09/MGG.png",
    url: "https://www.instagram.com/magregapadel_/",
    category: "Sport",
  },
  {
    name: "Agricola La Quercia",
    cover: "https://imlandradio.it/wp-content/uploads/2026/04/la-quercia.jpg",
    url: "https://agricolalaquercia.com/",
    category: "Agricoltura",
  },
];

export const memberWall: MemberWallEntry[] = memberWallSource.map((member) => {
  const details = MEMBER_DETAILS[member.name];
  if (!details) {
    throw new Error(`Dati Member mancanti per ${member.name}`);
  }
  return { ...member, desc: details.description, addresses: details.addresses };
});

function MemberPage() {
  const [openedId, setOpenedId] = useState<string | null>(null);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    if (flippedId === id) {
      // 3rd click: close everything
      setFlippedId(null);
      setOpenedId(null);
      return;
    }
    if (openedId === id) {
      // 2nd click: flip
      setFlippedId(id);
      return;
    }
    // 1st click: open (and reset any previous flipped)
    setOpenedId(id);
    setFlippedId(null);
  };

  return (
    <>
      <PageRails variant="member" />
      {/* HERO */}
      <HeroBanner
        src="/assets/member-network-desktop.png"
        srcMobile="/assets/member-network-mobile.png"
        alt="I membri ufficiali di IMLAND Experience"
        claim="La rete che valorizza la conoscenza."
        claimClassName="hero-cta-claim-editorial"
        ctaTop="34%"
        mobileCtaTop="38%"
        flush
        mobileBg="#ffffff"
      >
        <a
          href={WHATSAPP_MEMBER_URL}
          target="_blank"
          rel="noreferrer"
          className="cta-light px-6 py-3.5 text-sm"
        >
          DIVENTA MEMBER
        </a>
        <Link to="/contatti" className="cta-dark px-6 py-3.5 text-sm">
          PARLA CON NOI
        </Link>
      </HeroBanner>

      <div className="page-inverted member-inverted">
        <section className="container-im section-editorial section-pad">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              I Partner ufficiali di IMLAND Experience
            </p>
            <h1 className="mt-3 text-h1-im">Perché diventare Member</h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              Diventare Member significa entrare nel cuore di una rete di imprenditori e
              professionisti del territorio, creare nuove relazioni, partecipare a eventi esclusivi
              e accedere a vantaggi dedicati. Una presenza continua nell’ecosistema IMLAND, con più
              occasioni per farsi conoscere, raccontare la propria realtà e dare visibilità a
              progetti, novità e iniziative attraverso radio, news e contenuti sul sito.
            </p>
            <a
              href={WHATSAPP_MEMBER_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex rounded-full btn-blue px-6 py-3.5 text-sm"
            >
              Sei un’azienda o un professionista? Diventa Member
            </a>
          </div>
        </section>
        {/* RETE MEMBER — DriftWall */}
        <section className="section-focus">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Rete Member
              </p>
              <h2 className="mt-2 text-h2-im">
                La <span className="im-gradient-text">rete</span> IMLAND Member.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Scorri e passa sopra i loghi per esplorare le realtà che compongono la nostra rete:
                le stesse che trovi nel Member Wall qui sotto.
              </p>
            </div>

            <div className="partner-dome relative mt-10 h-[clamp(25rem,58vw,44rem)] w-full overflow-hidden bg-transparent">
              <div className="relative z-10 h-full w-full">
                <Suspense fallback={<div className="h-full" />}>
                  <DomeGallery
                    images={memberWall.map((member) => ({
                      src: member.cover,
                      alt: member.name,
                      href: member.url ?? undefined,
                    }))}
                    grayscale={false}
                    overlayBlurColor="#ffffff"
                    imageBorderRadius="18px"
                    openedImageBorderRadius="24px"
                    minRadius={420}
                    fit={0.72}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* MEMBER WALL */}
        <section id="member-wall" className="section-editorial scroll-mt-24">
          <div className="container-im relative z-20 section-pad">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Rete Member
                </p>
                <h2 className="mt-2 text-h2-im text-foreground">
                  I nostri membri
                </h2>
                <p className="mt-4 text-foreground/70">
                  Aziende, professionisti e associazioni che fanno parte della rete IMLAND Member.
                  <br />
                  Clicca una copertina per scoprire la loro storia e i loro contatti.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-foreground/60">
              Clicca una copertina per aprirla · clicca ancora per scoprire la storia e i contatti.
            </p>

            <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {memberWall.map((m) => {
                const id = slugify(m.name);
                const isOpen = openedId === id;
                const isFlipped = flippedId === id;
                const displayHost = m.url
                  ? m.url.replace(/^https?:\/\//, "").replace(/\/.*/, "")
                  : null;
                return (
                  <li
                    key={m.name}
                    id={`member-${id}`}
                    className="scroll-mt-24 [perspective:1200px]"
                  >
                    {/* Contenitore non interattivo: i controlli reali sono i
                      bottoni/link dentro le due facce (nessun annidamento). */}
                    <div
                      onClick={() => handleCardClick(id)}
                      className={`group relative block h-full w-full text-left transition-transform duration-300 ${
                        isOpen && !isFlipped ? "-translate-y-1" : ""
                      }`}
                    >
                      <div
                        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
                        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                      >
                        {/* FRONT */}
                        <SpotlightCard
                          className={`flex h-full flex-col overflow-hidden glass-panel rounded-3xl text-foreground [backface-visibility:hidden] ${
                            isOpen ? "border-signal shadow-lg" : "border-border"
                          }`}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                            <img
                              src={m.cover}
                              alt={m.name}
                              loading="lazy"
                              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${
                                isOpen ? "scale-105" : "group-hover:scale-105"
                              }`}
                            />
                            {isOpen && !isFlipped && (
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/85 p-2 text-center">
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-signal px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                                  Storia <ArrowRight className="inline h-3 w-3" />
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col gap-1.5 p-3">
                            <span className="w-fit rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                              {m.category}
                            </span>
                            <h3 className="text-sm font-semibold leading-snug md:text-base">
                              {m.name}
                            </h3>
                            <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                              {m.desc}
                            </p>
                            <p className="line-clamp-2 text-[11px] leading-snug text-foreground/70">
                              <span className="font-semibold">{m.addresses[0].label}:</span>{" "}
                              {m.addresses[0].address}
                              {m.addresses.length > 1 ? ` · +${m.addresses.length - 1} sede` : ""}
                            </p>
                            {displayHost ? (
                              <span className="truncate text-[11px] text-signal">
                                {displayHost}
                              </span>
                            ) : (
                              <span className="text-[11px] text-muted-foreground">
                                Contatti su richiesta
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(id);
                              }}
                              aria-expanded={isOpen || isFlipped}
                              className="mt-auto w-full rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-foreground/5"
                            >
                              {isOpen ? (
                                <>
                                  Storia <ArrowRight className="inline h-3 w-3" />
                                </>
                              ) : (
                                "Apri"
                              )}
                              <span className="sr-only"> di {m.name}</span>
                            </button>
                          </div>
                        </SpotlightCard>

                        {/* BACK */}
                        <div
                          className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-3xl border border-signal bg-foreground p-3 text-foreground [backface-visibility:hidden]"
                          style={{ transform: "rotateY(180deg)" }}
                        >
                          {id === "andrea-todaro-consulente" ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                              <img
                                src={todaroPhoto.url}
                                alt={m.name}
                                loading="lazy"
                                className="h-24 w-24 object-cover"
                              />
                              <h3 className="mt-2 text-sm font-semibold leading-snug md:text-base">
                                {m.name}
                              </h3>
                              <p className="mt-2 text-[11px] leading-snug text-foreground/80">{m.desc}</p>
                              <div className="mt-2 space-y-1 text-[10px] leading-snug text-foreground/70">
                                {m.addresses.map((location) => (
                                  <p key={`${location.label}-${location.address}`}>
                                    <strong className="text-foreground">{location.label}:</strong>{" "}
                                    {location.address}
                                  </p>
                                ))}
                              </div>
                              <div className="mt-auto flex w-full flex-col gap-2 pt-3">
                                {m.url ? (
                                  <a
                                    href={m.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center justify-center gap-0.5 truncate rounded-full bg-signal px-2.5 py-1 text-center text-[11px] font-semibold text-signal-foreground hover:opacity-90"
                                  >
                                    Contattami <ArrowRight className="inline h-3 w-3" />
                                  </a>
                                ) : (
                                  <span className="block rounded-full border border-white/30 px-2.5 py-1 text-center text-[11px] text-foreground/70">
                                    Contatti su richiesta
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(id);
                                  }}
                                  className="text-center text-[11px] uppercase tracking-wider text-foreground/60 underline underline-offset-2 hover:text-foreground"
                                >
                                  Chiudi
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start gap-2.5">
                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
                                  <img
                                    src={m.cover}
                                    alt={m.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/80">
                                    {m.category}
                                  </span>
                                  <h3 className="mt-1 text-sm font-semibold leading-snug md:text-base">
                                    {m.name}
                                  </h3>
                                </div>
                              </div>
                              <p className="mt-2 font-serif text-[11px] italic font-medium leading-snug text-foreground/85">
                                {m.desc}
                              </p>
                              <div className="mt-2 space-y-1 text-[10px] leading-snug text-foreground/70">
                                {m.addresses.map((location) => (
                                  <p key={`${location.label}-${location.address}`}>
                                    <strong className="text-foreground">{location.label}:</strong>{" "}
                                    {location.address}
                                  </p>
                                ))}
                              </div>
                              <div className="mt-auto flex flex-col gap-2 pt-3">
                                {m.url ? (
                                  <a
                                    href={m.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center justify-center gap-0.5 truncate rounded-full bg-signal px-2.5 py-1 text-center text-[11px] font-semibold text-white hover:opacity-90"
                                  >
                                    Visita il sito <ArrowRight className="inline h-3 w-3" />
                                  </a>
                                ) : (
                                  <span className="block rounded-full border border-white/30 px-2.5 py-1 text-center text-[11px] text-foreground/70">
                                    Contatti su richiesta
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(id);
                                  }}
                                  className="text-center text-[11px] uppercase tracking-wider text-foreground/60 underline underline-offset-2 hover:text-foreground"
                                >
                                  Chiudi
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-8 text-xs text-foreground/60">
              {memberWall.length} Member attivi sul territorio · fonte:{" "}
              <a
                href="https://imlandradio.it/members-wall/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2"
              >
                imlandradio.it/members-wall
              </a>
            </p>
          </div>
        </section>
        <section className="container-im section-editorial section-pad">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Perché diventare Member
            </p>
            <h2 className="mt-2 text-h2-im">
              Il tuo brand ha bisogno di una <span className="im-gradient-text">voce.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Non un canale in più.
              <br />
              Un modo diverso di parlare a chi vive dove vivi tu.
            </p>
          </div>
          <BentoGrid className="mt-10">
            {whyBecome.map((w) => (
              <BentoCard key={w.k} tone="member" span={2}>
                <span className="self-start rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  {w.k}
                </span>
                <p className="mt-6 text-sm text-foreground/80">{w.v}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </section>

        {/* TUTTI I VANTAGGI */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Tutti i vantaggi
              </p>
              <h2 className="mt-2 text-h2-im">
                Quattro modi per <span className="im-gradient-text">esserci.</span>
              </h2>
            </div>
            <BentoGrid className="mt-10">
              {benefits.map((b) => (
                <BentoCard key={b.title} tone="member" span={3}>
                  <span className="self-start rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    {b.tag}
                  </span>
                  <h3 className="mt-8 text-h3-im">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* COSA RICEVI */}
        <section className="hidden">
          <div className="container-im section-pad">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Cosa ricevi
                </p>
                <h2 className="mt-2 text-h2-im">
                  Tutto dentro un unico <span className="im-gradient-text">pacchetto.</span>
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Ogni Member ha accesso a strumenti, spazi e servizi pensati per far arrivare la
                  propria voce dove serve.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {whatYouGet.map((w) => (
                  <li
                    key={w}
                    className="flex items-start gap-3 glass-panel rounded-2xl px-4 py-3 shadow-soft"
                  >
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                    <span className="text-sm text-foreground/85">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PACCHETTI MEMBER */}
        <section id="pacchetti" className="hidden">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Pacchetti Member
            </p>
            <h2 className="mt-2 text-h2-im">
              Scegli il tuo <span className="im-gradient-text">pacchetto.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Podcast e spot radio sono riservati ai Member.
              <br />
              Scegli il pacchetto più adatto alla tua realtà e attiva la voce del tuo brand su
              IMLAND.
            </p>
          </div>

          {/* SPOT RADIO */}
          <div className="mt-12">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
                Spot Radio
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  tier: "Base",
                  desc: "Il tuo primo spot in onda sulla programmazione IMLAND.",
                  feats: [
                    'Spot 30" prodotto in studio',
                    "Rotazione settimanale",
                    "Report mensile ascolti",
                  ],
                },
                {
                  tier: "Premium",
                  desc: "Presenza costante e capillare sul territorio.",
                  feats: [
                    'Spot 30" + 15" prodotti',
                    "Rotazione quotidiana",
                    "Geolocalizzazione 4 province",
                    "Report bisettimanale",
                  ],
                  featured: true,
                },
                {
                  tier: "Custom",
                  desc: "Piano su misura per campagne complesse e multi-brand.",
                  feats: [
                    "Format su misura",
                    "Sponsorship di rubriche",
                    "Cross-canale radio + podcast",
                    "Account dedicato",
                  ],
                },
              ].map((p) => (
                <SpotlightCard
                  key={`radio-${p.tier}`}
                  className={`flex h-full flex-col rounded-3xl border p-6 ${p.featured ? "glass-panel border-signal/50 shadow-lg ring-1 ring-signal/25" : "glass-panel"}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-h3-im">{p.tier}</h3>
                    {p.featured && (
                      <span className="rounded-full bg-signal px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                        Più scelto
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                  <ul className="mt-6 space-y-2">
                    {p.feats.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contatti"
                    className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                      p.featured
                        ? "bg-signal text-white hover:opacity-90"
                        : "border border-white/12 bg-white/5 hover:bg-white/5"
                    }`}
                  >
                    Contatta un commerciale
                  </Link>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* PODCAST */}
          <div className="mt-16">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
                Podcast
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  tier: "Base",
                  desc: "Un episodio pilota per raccontare la tua realtà.",
                  feats: [
                    "1 episodio prodotto",
                    "Studio + montaggio",
                    "Pubblicazione su Spotify e Apple",
                  ],
                },
                {
                  tier: "Premium",
                  desc: "Una serie completa distribuita su tutte le piattaforme.",
                  feats: [
                    "Serie da 6 episodi",
                    "Regia, montaggio e sound design",
                    "Distribuzione multipiattaforma",
                    "Clip social per ogni episodio",
                  ],
                  featured: true,
                },
                {
                  tier: "Custom",
                  desc: "Format su misura per brand, associazioni e progetti speciali.",
                  feats: [
                    "Format narrativo dedicato",
                    "Ospiti e conduzione su misura",
                    "Piano di comunicazione integrato",
                    "Account dedicato",
                  ],
                },
              ].map((p) => (
                <SpotlightCard
                  key={`podcast-${p.tier}`}
                  className={`flex h-full flex-col rounded-3xl border p-6 ${p.featured ? "glass-panel border-signal/50 shadow-lg ring-1 ring-signal/25" : "glass-panel"}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-h3-im">{p.tier}</h3>
                    {p.featured && (
                      <span className="rounded-full bg-signal px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                        Più scelto
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                  <ul className="mt-6 space-y-2">
                    {p.feats.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contatti"
                    className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                      p.featured
                        ? "bg-signal text-white hover:opacity-90"
                        : "border border-white/12 bg-white/5 hover:bg-white/5"
                    }`}
                  >
                    Contatta un commerciale
                  </Link>
                </SpotlightCard>
              ))}
            </div>
          </div>

          <p className="mt-10 text-xs text-muted-foreground">
            I contenuti podcast e gli spot radio sono riservati ai Member IMLAND.
            <br />
            Scrivici per un preventivo su misura: un commerciale ti risponde entro 24 ore.
          </p>
        </section>

        {/* EVENTI DEDICATI AI MEMBER */}
        <section className="hidden">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Eventi Member
              </p>
              <h2 className="mt-2 text-h2-im">
                Ci vediamo <span className="im-gradient-text">dal vivo.</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Ogni mese incontri, live e radio in piazza dedicati alla rete Member. Vieni a
                conoscere gli altri Member e a raccontare la tua realtà.
              </p>
            </div>
            <Link
              to="/eventi"
              className="inline-flex items-center gap-1 rounded-full glass-panel px-5 py-2.5 text-sm font-medium hover:bg-white/10"
            >
              Calendario completo <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {memberEvents.map((e) => (
              <SpotlightCard key={e.title} className="glass-panel rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-bold tracking-tight">{e.date}</span>
                  <span className="rounded-full bg-signal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
                    {e.tag}
                  </span>
                </div>
                <h3 className="mt-6 text-h3-im leading-snug">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.place}</p>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* TESTIMONIANZE */}
        <section className="section-canvas">
          <div className="container-im section-pad">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Testimonianze
              </p>
              <h2 className="mt-2 text-h2-im">
                Le voci dei nostri <span className="im-gradient-text">Member.</span>
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {memberTestimonials.map((t) => (
                <SpotlightCard
                  key={t.name}
                  className="flex h-full flex-col glass-panel rounded-3xl p-6"
                >
                  <p className="font-serif text-lg italic font-medium leading-snug text-foreground/90">
                    "{t.quote}"
                  </p>
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="font-display text-sm font-semibold">{t.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-focus mx-auto max-w-4xl px-4 section-pad md:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              FAQ Membership
            </p>
            <h2 className="mt-2 text-h2-im">
              Le domande più <span className="im-gradient-text">frequenti.</span>
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {memberFaqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="glass-panel rounded-2xl px-5 shadow-soft"
              >
                <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1 text-sm font-semibold text-signal underline-offset-4 hover:underline"
            >
              Vedi tutte le FAQ <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* COME FUNZIONA L'ADESIONE */}
        <section className="container-im section-focus section-pad">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Come funziona l'adesione
            </p>
            <h2 className="mt-3 text-h2-im">
              Tre passaggi, nessuna <span className="im-gradient-text">complicazione</span>.
            </h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Richiesta",
                d: "L’azienda o il professionista prende contatto con IMLAND e racconta la propria realtà e gli obiettivi.",
              },
              {
                n: "02",
                t: "Confronto",
                d: "Ci si sente direttamente per spiegare il funzionamento della Membership, i vantaggi e le opportunità più pertinenti.",
              },
              {
                n: "03",
                t: "Attivazione",
                d: "Ingresso nella rete Member e attivazione delle opportunità concordate.",
              },
            ].map((s) => (
              <li key={s.n} className="rounded-3xl border border-outline bg-card p-6">
                <span className="font-display text-2xl font-bold text-signal">{s.n}</span>
                <h3 className="mt-3 text-h3-im">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contatti" className="rounded-full btn-blue px-6 py-3.5 text-sm">
              Diventa Member
            </Link>
          </div>
        </section>

        {/* CTA FINALE */}

        <section className="hidden">
          <div className="glass-panel relative overflow-hidden rounded-[36px] p-10 md:p-14">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-h2-im">
                Pronto a unirti alla <span className="im-gradient-text">rete?</span>
              </h2>
              <p className="mt-4 text-base text-foreground/70">
                Attiviamo l'accesso a breve.
                <br />
                Diventa Member e ti scriviamo appena l'area riservata è online.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_MEMBER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full btn-blue px-6 py-3.5 text-sm"
                >
                  Diventa Member
                </a>
                <Link to="/contatti" className="rounded-full btn-ghost-glass px-6 py-3.5 text-sm">
                  Contattaci
                </Link>
              </div>
            </div>
          </div>
        </section>

        <NewsletterBanner
          eyebrow="Newsletter Member"
          title="Novità dalla rete IMLAND."
          lead="Nuove voci, format e opportunità per i Member: te le raccontiamo per prime."
        />

        <section className="container-im section-pad" aria-label="Mappa dei Member IMLAND">
          <Suspense fallback={<div className="h-[620px] rounded-[32px] bg-white/55" />}>
            <ImLandMap />
          </Suspense>
        </section>
      </div>
    </>
  );
}

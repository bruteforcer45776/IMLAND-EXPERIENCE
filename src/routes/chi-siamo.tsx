import { canonical, jsonLd, organizationLd } from "../lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BadgeIcon, badgeForIcon } from "../components/badge-icon";
import { BentoGrid, BentoCard, BentoLinkCard } from "../components/bento";
import { PageHero } from "../components/page-hero";
import { SectionHeader } from "../components/section-header";
import { teamMembers } from "../data/team-members";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — l'hub di musica e radio del Piemonte nord-orientale" },
      {
        name: "description",
        content:
          "IMLAND EXPERIENCE unisce musica, radio, podcast ed eventi a Vercelli, Novara, Biella e Verbania. Scopri il team e la nostra missione sul territorio.",
      },
      { name: "robots", content: "index, follow, noimageindex" },
      { name: "geo.region", content: "IT-PIE" },
      { property: "og:title", content: "Chi siamo — IMLAND EXPERIENCE" },
      {
        property: "og:description",
        content: "L'hub territoriale che dà voce alle comunità locali.",
      },
    ],
    links: [canonical("/chi-siamo")],
    scripts: [jsonLd(organizationLd)],
  }),
  component: ChiSiamoPage,
});

const timeline = [
  {
    y: "2022",
    t: "L'idea",
    d: "Un gruppo di appassionati di musica e territorio si ritrova a Gattinara per immaginare una radio nuova.",
  },
  {
    y: "2023",
    t: "Prima diretta",
    d: "IMLAND Radio va in onda 24/7. Nascono i primi programmi e la newsletter settimanale.",
  },
  {
    y: "2024",
    t: "Podcast Lab",
    d: "Prime stagioni di podcast originali su cibo, imprese e cultura del territorio.",
  },
  {
    y: "Oggi",
    t: "Hub aperto",
    d: "Radio, podcast, eventi e community Member crescono insieme, tra Vercelli, Novara, Biella e Verbania.",
  },
];

const whatWeDo = [
  {
    icon: "onde_radio" as const,
    title: "Radio",
    desc: "Diretta 24/7, musica italiana e internazionale, talk e interviste dal territorio.",
    href: "/radio",
    tone: "radio" as const,
  },
  {
    icon: "cuffie" as const,
    title: "Podcast",
    desc: "Serie originali su cibo, cultura, impresa e persone del Piemonte nord-orientale.",
    href: "/podcast",
    tone: "podcast" as const,
  },
  {
    icon: "ticket" as const,
    title: "Eventi",
    desc: "Radio in tour, dirette live e format su misura, in piazza e nei locali della zona.",
    href: "/eventi",
    tone: "eventi" as const,
  },
  {
    icon: "news" as const,
    title: "News del territorio",
    desc: "Notizie, persone e iniziative che raccontano ciò che accade nelle nostre province.",
    href: "/news",
    tone: "news" as const,
  },
];

const method = [
  {
    icon: "community" as const,
    title: "Ascolto del territorio",
    desc: "Ogni format nasce da una conversazione reale con chi vive Vercelli, Novara, Biella e Verbania.",
  },
  {
    icon: "microfono" as const,
    title: "Produzione in casa",
    desc: "Scriviamo, registriamo e montiamo internamente, con voci e strumenti del territorio.",
  },
  {
    icon: "stretta_mano" as const,
    title: "Collaborazione aperta",
    desc: "Aziende, associazioni e persone possono proporre contenuti ed entrare nel palinsesto.",
  },
  {
    icon: "check" as const,
    title: "Verifica e cura",
    desc: "Ogni episodio e ogni notizia passano da un controllo redazionale prima della pubblicazione.",
  },
];

function ChiSiamoPage() {
  return (
    <>
      <PageHero
        eyebrow="Il Progetto"
        title={
          <>
            Un hub aperto, radicato, <span className="im-gradient-text">indipendente</span>.
          </>
        }
        subtitle={
          "IMLAND Experience nasce per dare voce alle realtà dei nostri territori.\n\nViviamo in territori ricchi di imprese, persone, competenze ed eccellenze che spesso, proprio perché lontani dai grandi centri, non hanno gli stessi strumenti e le stesse occasioni per raccontarsi, farsi conoscere e creare relazioni.\n\nPer questo abbiamo costruito un luogo in cui il territorio possa avere voce: attraverso la radio, i contenuti, gli incontri e una community che mette in relazione aziende, professionisti e persone.\n\nRaccontiamo ciò che di valore esiste qui, perché possa essere conosciuto dentro e fuori dal territorio."
        }
      />

      {/* Missione */}
      <section className="section-canvas">
        <div className="container-im section-pad">
          <SectionHeader
            eyebrow="La missione"
            title={
              <>
                Dare voce al <span className="im-gradient-text">territorio</span>.
              </>
            }
            description="Crediamo che musica, informazione ed eventi locali abbiano bisogno di uno spazio comune, aperto e indipendente. IMLAND lo costruisce ogni giorno, con la radio come cuore."
          />
        </div>
      </section>

      {/* Cosa facciamo */}
      <section className="container-im section-editorial section-pad">
        <SectionHeader
          eyebrow="Cosa facciamo"
          title={
            <>
              Quattro spazi, <br />
              una <span className="im-gradient-text">redazione</span>.
            </>
          }
          description="Radio, podcast, eventi e news: quattro modi per stare dentro il territorio."
        />
        <BentoGrid className="mt-10">
          {whatWeDo.map((w) => (
            <BentoLinkCard
              key={w.title}
              to={w.href}
              tone={w.tone}
              span={3}
              className="group flex flex-col items-center text-center"
            >
              <BadgeIcon
                name={badgeForIcon(w.icon)}
                tone={w.tone}
                className="h-14 w-14 transition-transform duration-300 group-hover:scale-105"
              />
              <h3 className="mt-4 text-h3-im group-hover:text-signal">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal">
                Scopri di più <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </BentoLinkCard>
          ))}
        </BentoGrid>
      </section>

      {/* Metodo di lavoro */}
      <section className="section-canvas">
        <div className="container-im section-pad">
          <SectionHeader
            eyebrow="Il metodo"
            title={
              <>
                Come lavoriamo, <br />
                passo dopo <span className="im-gradient-text">passo</span>.
              </>
            }
            description="Dall'ascolto del territorio alla pubblicazione: quattro passaggi sempre uguali."
          />
          <BentoGrid className="mt-10">
            {method.map((m, i) => (
              <BentoCard key={m.title} span={3} className="flex flex-col items-center text-center">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-signal">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-display text-lg font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Team / Redazione */}
      <section className="section-atmosphere">
        <div className="container-im section-pad">
          <SectionHeader
            eyebrow="La redazione"
            align="center"
            title={
              <>
                Il TEAM <span className="im-gradient-text">IMLAND</span>.
              </>
            }
            description="Una squadra che vive il territorio e lo trasforma in racconto sonoro: speaker, produzione, member e organizzazione eventi."
          />

          <ul
            role="list"
            className="mx-auto mt-14 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {teamMembers.map((m) => {
              const fullName =
                [m.firstName, m.lastName].filter(Boolean).join(" ") ||
                m.slug
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
              const preview = m.description || m.bio.split("\n")[0];
              return (
                <li
                  key={m.slug}
                  className="group overflow-hidden rounded-2xl bg-card shadow-[0_16px_40px_rgba(15,23,42,0.10)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(15,23,42,0.16)]"
                >
                  <Link
                    to="/team/$slug"
                    params={{ slug: m.slug }}
                    aria-label={`Scopri il profilo di ${fullName}`}
                    className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-signal/40"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#059cff]">
                      {m.photo ? (
                        <img
                          src={m.photo}
                          alt={fullName}
                          loading="lazy"
                          width={800}
                          height={1000}
                          sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-8 text-center text-white">
                          <span className="font-display text-5xl font-bold tracking-[-0.03em]">
                            BIXONT.IT
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-h3-im leading-tight text-foreground transition-colors group-hover:text-signal">
                        {fullName}
                      </h3>
                      {m.nickname ? (
                        <p className="mt-1 im-gradient-text">&quot;{m.nickname}&quot;</p>
                      ) : null}
                      {m.role ? (
                        <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                          {m.role}
                        </p>
                      ) : null}
                      {preview ? (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                          {preview}
                        </p>
                      ) : null}
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-signal">
                        Scopri il profilo
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-editorial">
        <div className="container-im section-pad">
          <SectionHeader
            eyebrow="Percorso"
            title={
              <>
                Da una <span className="im-gradient-text">idea</span>, a una rete.
              </>
            }
            description="Le tappe che hanno portato IMLAND dalla prima diretta all'hub di oggi."
          />
          <BentoGrid className="mt-10">
            {timeline.map((s2, i) => (
              <BentoCard
                key={s2.y}
                tone={(["radio", "podcast", "eventi", "member"] as const)[i % 4]}
                span={3}
                className="flex flex-col items-center text-center"
              >
                <p className="font-display text-2xl font-bold text-signal">{s2.y}</p>
                <p className="mt-4 font-display text-lg font-semibold">{s2.t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s2.d}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Lavora con noi */}
      <section className="section-canvas">
        <div className="container-im section-pad">
          <div className="bento-card flex flex-col items-center p-8 text-center md:p-12">
            <div className="mx-auto max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-signal">
                Lavora con noi
              </p>
              <h2 className="mt-3 text-h2-im">Porta la tua voce in IMLAND.</h2>
              <p className="mt-3 text-base text-muted-foreground">
                Raccontaci le tue competenze e come vorresti contribuire al progetto.
              </p>
            </div>
            <Link
              to="/contatti"
              className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full btn-blue px-6 py-3 font-semibold"
            >
              Candidati <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

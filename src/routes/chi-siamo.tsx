import { canonical, jsonLd, organizationLd } from "../lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { NewsletterBanner } from "../components/newsletter-banner";
import { teamMembers } from "../data/team-members";
import { BadgeIcon, badgeForIcon, toneForBadge } from "../components/badge-icon";
import { BentoGrid, BentoCard, BentoLinkCard } from "../components/bento";
import { PageHero } from "../components/page-hero";
import { SectionHeader } from "../components/section-header";

const Lanyard = lazy(() => import("../components/lanyard"));

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi siamo — l'hub di musica e radio del Piemonte nord-orientale" },
      {
        name: "description",
        content:
          "IMLAND EXPERIENCE unisce musica, radio, podcast ed eventi a Vercelli, Novara, Biella e Verbania. Scopri il team e la nostra missione sul territorio.",
      },
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

const values = [
  {
    title: "Prossimità",
    desc: "Raccontiamo quello che possiamo toccare. Le storie iniziano dove viviamo.",
  },
  {
    title: "Ascolto",
    desc: "Prima di parlare, ascoltiamo. Le voci del territorio guidano l'agenda.",
  },
  {
    title: "Apertura",
    desc: "Il palinsesto è aperto: chiunque abbia qualcosa da dire, può proporlo.",
  },
  {
    title: "Cura",
    desc: "Produzione lenta, precisa, sostenibile. Nessuna storia consumata in fretta.",
  },
];

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
    icon: "tessera_member" as const,
    title: "Member",
    desc: "Aziende e professionisti diventano parte della community con visibilità e vantaggi dedicati.",
    href: "/member",
    tone: "member" as const,
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

const numbers = [
  { n: "24/7", l: "Diretta radio ininterrotta" },
  { n: "4", l: "Città presidiate: Vercelli, Novara, Biella, Verbania" },
  { n: "10+", l: "Serie podcast originali" },
  { n: "300+", l: "Episodi pubblicati" },
];

const collaborations = [
  "Regione Piemonte",
  "Comune di Gattinara",
  "Consorzio Tutela Gattinara Docg",
  "Istituto Alberghiero di Gattinara",
  "Confcommercio locale",
  "Realtà del territorio",
];

function ChiSiamoPage() {
  return (
    <>
      <PageHero
        eyebrow="Chi siamo"
        badge="community"
        title={
          <>
            Un hub aperto, <br />
            <span className="im-gradient-text">radicato</span>, indipendente.
          </>
        }
        subtitle="IMLAND EXPERIENCE nasce da un'idea semplice: il territorio non ha bisogno di essere spiegato da fuori. Ha bisogno di strumenti per raccontarsi. Siamo redazione, radio, community e piazza."
        aside={
          <div className="relative h-[520px] w-full">
            <Suspense fallback={null}>
              <Lanyard position={[0, 0, 18]} gravity={[0, -40, 0]} />
            </Suspense>
          </div>
        }
      >
        <Link to="/radio" className="rounded-full btn-blue px-6 py-3 text-sm">
          Ascolta la radio
        </Link>
        <Link to="/contatti" className="rounded-full btn-ghost-glass px-6 py-3 text-sm">
          Lavora con noi
        </Link>
      </PageHero>

      {/* Manifesto */}
      <section className="section-focus">
        <div className="container-im section-pad">
          <SectionHeader
            eyebrow="Il manifesto"
            badge="membri"
            title={
              <>
                Quattro parole, un <span className="im-gradient-text">metodo</span>.
              </>
            }
            description="I principi che guidano ogni programma, ogni episodio e ogni evento IMLAND."
          />
          <BentoGrid className="mt-10">
            {values.map((v, i) => (
              <BentoCard
                key={v.title}
                tone={(["radio", "podcast", "eventi", "member"] as const)[i % 4]}
                span={3}
              >
                <h3 className="text-h3-im">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Missione */}
      <section className="section-canvas">
        <div className="container-im section-pad">
          <SectionHeader
            eyebrow="La missione"
            badge="luogo"
            title={
              <>
                Dare voce a chi <br />
                vive il <span className="im-gradient-text">territorio</span>.
              </>
            }
            description="Crediamo che musica, informazione ed eventi locali abbiano bisogno di uno spazio comune, aperto e indipendente. IMLAND lo costruisce ogni giorno, con la radio come cuore."
          />
          <BentoGrid className="mt-10">
            {numbers.map((n, i) => (
              <BentoCard
                key={n.l}
                tone={(["radio", "podcast", "eventi", "news"] as const)[i % 4]}
                span={3}
              >
                <p className="font-display text-4xl font-bold text-signal">{n.n}</p>
                <p className="mt-3 text-sm text-muted-foreground">{n.l}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Cosa facciamo */}
      <section className="container-im section-editorial section-pad">
        <SectionHeader
          eyebrow="Cosa facciamo"
          badge="onde"
          title={
            <>
              Quattro spazi, <br />
              una <span className="im-gradient-text">redazione</span>.
            </>
          }
          description="Radio, podcast, eventi e community: quattro modi per stare dentro il territorio."
        />
        <BentoGrid className="mt-10">
          {whatWeDo.map((w, i) => (
            <BentoLinkCard
              key={w.title}
              to={w.href}
              tone={(["radio", "podcast", "eventi", "member", "news"] as const)[i % 5]}
              span={3}
              className="group"
            >
              <BadgeIcon
                name={badgeForIcon(w.icon)}
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
            badge="microfono"
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
              <BentoCard key={m.title} tone={toneForBadge(badgeForIcon(m.icon))} span={3}>
                <BadgeIcon name={badgeForIcon(m.icon)} className="h-12 w-12" />
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
            badge="profilo"
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
            className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2 lg:max-w-none"
          >
            {teamMembers.map((m) => {
              const fullName =
                [m.firstName, m.lastName].filter(Boolean).join(" ") ||
                m.slug
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
              const preview = m.description || m.bio.split("\n")[0];
              return (
                <li key={m.slug} className="flex flex-col items-start gap-x-8 gap-y-6 sm:flex-row">
                  <div className="flex-none">
                    <Link to="/team/$slug" params={{ slug: m.slug }}>
                      <div className="relative aspect-square w-40 overflow-hidden rounded-full bg-muted ring-1 ring-inset ring-border">
                        <img
                          src={m.photo}
                          alt={fullName}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="flex-auto">
                    <Link to="/team/$slug" params={{ slug: m.slug }}>
                      <h3 className="text-h3-im leading-9 text-foreground transition-colors hover:text-signal">
                        {fullName}
                      </h3>
                    </Link>
                    {m.nickname ? <p className="im-gradient-text">"{m.nickname}"</p> : null}
                    {m.role ? (
                      <p className="text-base leading-8 text-muted-foreground">{m.role}</p>
                    ) : null}
                    {preview ? (
                      <p className="mt-4 line-clamp-4 text-base leading-7 text-muted-foreground">
                        {preview}
                      </p>
                    ) : null}
                    <Link
                      to="/team/$slug"
                      params={{ slug: m.slug }}
                      className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-signal hover:underline"
                    >
                      Scopri il profilo <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
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
            badge="calendario"
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
              >
                <p className="font-display text-2xl font-bold text-signal">{s2.y}</p>
                <p className="mt-4 font-display text-lg font-semibold">{s2.t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s2.d}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Collaborazioni / Partner */}
      <section className="section-atmosphere">
        <div className="container-im section-pad-sm">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Collaborazioni e sostegno sul territorio
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {collaborations.map((n) => (
              <span
                key={n}
                className="font-display text-base font-semibold tracking-tight md:text-lg"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Lavora con noi */}
      <section className="section-focus">
        <div className="container-im section-pad">
          <SectionHeader
            eyebrow="Lavora con noi"
            badge="partner"
            title={
              <>
                Hai qualcosa <br />
                da <span className="im-gradient-text">raccontare</span>?
              </>
            }
            description="Cerchiamo sempre nuove voci, produttori, tecnici ed eventi da ospitare. Se vivi il territorio e vuoi contribuire, scrivici: leggiamo ogni proposta."
          />
          <BentoGrid className="mt-10">
            <BentoCard tone="podcast" span={3}>
              <BadgeIcon name={badgeForIcon("microfono")} className="h-12 w-12" />
              <p className="mt-4 font-display text-lg font-semibold">Proponi un format</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Radio, podcast o rubrica: raccontaci l'idea.
              </p>
            </BentoCard>
            <BentoCard tone="member" span={3}>
              <BadgeIcon name={badgeForIcon("stretta_mano")} className="h-12 w-12" />
              <p className="mt-4 font-display text-lg font-semibold">Collabora con noi</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Aziende, associazioni e professionisti del territorio.
              </p>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      {/* CTA */}
      <section className="container-im section-closing section-pad">
        <div className="rounded-[28px] border border-border bg-signal p-10 text-center text-signal-foreground md:p-14">
          <h2 className="text-h2-im">Vuoi collaborare con noi?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-signal-foreground/85 md:text-base">
            Proponi una storia, uno spazio, un progetto. Scriviamo insieme il prossimo capitolo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contatti"
              className="rounded-full bg-surface-1 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-2"
            >
              Scrivici
            </Link>
            <Link
              to="/member"
              className="rounded-full bg-surface-1 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-surface-2"
            >
              Diventa member
            </Link>
          </div>
        </div>
      </section>

      <NewsletterBanner />
    </>
  );
}

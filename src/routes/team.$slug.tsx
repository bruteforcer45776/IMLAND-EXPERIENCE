import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { SpotlightCard } from "../components/spotlight-card";
import { NewsletterBanner } from "../components/newsletter-banner";
import { BrandIcon } from "../components/brand-icons";
import { getTeamMember, teamMembers, type TeamMember } from "../data/team-members";
import { podcastPrograms, type PodcastProgram } from "../data/podcast-programs";
import { BentoGrid, BentoCard } from "../components/bento";

export const Route = createFileRoute("/team/$slug")({
  loader: ({ params }) => {
    const member = getTeamMember(params.slug);
    if (!member) throw notFound();
    return { member };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Profilo non trovato — IMLAND" }, { name: "robots", content: "noindex" }],
      };
    }
    const { member } = loaderData;
    const fullName = [member.firstName, member.lastName].filter(Boolean).join(" ") || "Membro Team";
    const title = `${fullName}${member.role ? ` — ${member.role}` : ""} | IMLAND`;
    const description =
      member.description ||
      member.bio.split("\n")[0] ||
      `Profilo di ${fullName} nel team IMLAND EXPERIENCE.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: member.photo },
      ],
      links: [{ rel: "canonical", href: `/team/${member.slug}` }],
    };
  },
  component: TeamMemberPage,
  notFoundComponent: TeamMemberNotFound,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 section-pad md:px-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-signal">Errore</p>
      <h1 className="mt-2 text-h1-im">Qualcosa non va.</h1>
      <p className="mt-4 text-muted-foreground">{error.message}</p>
      <Button asChild className="mt-8">
        <Link to="/chi-siamo">Torna al team</Link>
      </Button>
    </div>
  ),
});

function TeamMemberNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 section-pad md:px-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-signal">404</p>
      <h1 className="mt-2 text-h1-im">Profilo non trovato.</h1>
      <p className="mt-4 text-muted-foreground">Il membro che stai cercando non è disponibile.</p>
      <Button asChild className="mt-8">
        <Link to="/chi-siamo">Torna al team</Link>
      </Button>
    </div>
  );
}

/** Normalizza per confronto: minuscole, senza apostrofi/punteggiatura. */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’'`.]/g, "")
    .replace(/\s+/g, " ");

/** Deriva i programmi condotti dal membro, solo se il nome del programma compare nella sua bio/descrizione. */
function programsFor(member: TeamMember): PodcastProgram[] {
  const haystack = normalize(`${member.bio}\n${member.description}`);
  return Object.values(podcastPrograms).filter((p) => haystack.includes(normalize(p.name)));
}

function TeamMemberPage() {
  const { member } = Route.useLoaderData() as { member: TeamMember };
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(" ") || "Membro Team";

  const others = teamMembers.filter((m) => m.slug !== member.slug).slice(0, 4);
  const programs = programsFor(member);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="hero-frame section-atmosphere">
        <div className="container-im grid gap-10 hero-pad md:grid-cols-[380px_1fr]">
          <div className="overflow-hidden glass-panel rounded-2xl">
            <div className="aspect-[3/4] w-full overflow-hidden">
              <img
                src={member.photo}
                alt={fullName}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="uppercase tracking-wider">
                Homeland Experience
              </Badge>
              {member.role ? (
                <Badge variant="outline" className="uppercase tracking-wider text-orange">
                  {member.role}
                </Badge>
              ) : null}
            </div>
            <h1 className="mt-4 text-display-l">{fullName}</h1>
            {member.nickname ? (
              <p className="mt-2 font-display text-xl font-semibold text-signal">
                "{member.nickname}"
              </p>
            ) : null}
            {member.description ? (
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{member.description}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {member.contactEmail ? (
                <Button asChild>
                  <a href={`mailto:${member.contactEmail}`}>Contattami</a>
                </Button>
              ) : (
                <Button asChild>
                  <a href="mailto:hello@imland.it">Contattami</a>
                </Button>
              )}
              {member.bookingUrl ? (
                <Button asChild variant="secondary">
                  <a href={member.bookingUrl} target="_blank" rel="noreferrer">
                    Prenota un incontro
                  </a>
                </Button>
              ) : null}
              <Button asChild variant="outline">
                <Link to="/chi-siamo">Torna al Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CHI SONO */}
      <section className="container-im section-focus section-pad">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">Chi sono</p>
            <h2 className="mt-2 text-h2-im">
              La <span className="im-gradient-text">persona</span> dietro il ruolo.
            </h2>
          </div>
          <div className="space-y-6 text-muted-foreground">
            {member.bio.split("\n").map((p, i) => (
              <p key={i} className="text-base leading-relaxed">
                {p}
              </p>
            ))}
            <div className="glass-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Background
              </p>
              <p className="mt-2 text-foreground">{member.background}</p>
            </div>
            <div className="glass-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">Mission</p>
              <p className="mt-2 text-foreground">{member.mission}</p>
            </div>
            {member.keySkills.length ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {member.keySkills.map((k) => (
                  <Badge key={k} variant="outline">
                    {k}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ESPERIENZA — timeline */}
      <section className="section-canvas">
        <div className="container-im section-pad">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">Esperienza</p>
          <h2 className="mt-2 text-h2-im">
            Il <span className="im-gradient-text">percorso</span>.
          </h2>
          <BentoGrid className="mt-10">
            {member.timeline.map((t, i) => (
              <BentoCard key={i} tone="member" span={2}>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  {t.year}
                </p>
                <p className="mt-2 font-display text-lg font-semibold">{t.title}</p>
                {t.detail ? <p className="mt-2 text-sm text-muted-foreground">{t.detail}</p> : null}
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* RUOLO IN HOMELAND */}
      <section className="container-im section-editorial section-pad">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">In IMLAND</p>
            <h2 className="mt-2 text-h2-im">
              Il <span className="im-gradient-text">ruolo</span> in Homeland Experience.
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-muted-foreground">{member.homelandRole.responsibilities}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-panel rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">Ambiti</p>
                <ul className="mt-3 space-y-1 text-sm text-foreground">
                  {member.homelandRole.areas.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
              </div>
              <div className="glass-panel rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Progetti
                </p>
                <ul className="mt-3 space-y-1 text-sm text-foreground">
                  {member.homelandRole.projects.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMMI CONDOTTI */}
      {programs.length ? (
        <section className="section-canvas">
          <div className="container-im section-pad">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">In onda</p>
            <h2 className="mt-2 text-h2-im">
              I <span className="im-gradient-text">programmi</span> che conduce.
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <Link
                  key={p.slug}
                  to="/podcast/$slug"
                  params={{ slug: p.slug }}
                  className="group block"
                >
                  <SpotlightCard className="glass-panel h-full overflow-hidden rounded-2xl">
                    <div className="aspect-video w-full overflow-hidden bg-white/5">
                      <img
                        src={p.cover}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <Badge variant="outline" className="uppercase tracking-wider text-xs">
                        {p.cat}
                      </Badge>
                      <p className="mt-3 font-display text-lg font-semibold group-hover:text-signal">
                        {p.name}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                      <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal">
                        {p.episodes.length} episodi <ArrowRight className="h-4 w-4" aria-hidden />
                      </p>
                    </div>
                  </SpotlightCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* COMPETENZE */}
      <section className="section-canvas">
        <div className="container-im section-pad">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">Competenze</p>
          <h2 className="mt-2 text-h2-im">
            Cosa <span className="im-gradient-text">porto</span> al team.
          </h2>
          <BentoGrid className="mt-10">
            {member.skills.map((s) => (
              <BentoCard key={s.title} tone="podcast" span={2}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal/10 text-2xl">
                  {s.icon}
                </div>
                <p className="mt-4 font-display text-lg font-semibold">{s.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="container-im section-closing section-pad">
        <div className="glass-panel rounded-3xl p-10 text-center md:p-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">
            Prossimo passo
          </p>
          <h2 className="mt-2 text-h2-im">
            Parliamone <span className="im-gradient-text">insieme</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Hai un progetto, un'idea o vuoi collaborare? Scrivimi o prenota un incontro.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <a href={`mailto:${member.contactEmail || "hello@imland.it"}`}>Contattami</a>
            </Button>
            <Button asChild variant="secondary">
              <a
                href={member.bookingUrl || "mailto:hello@imland.it?subject=Prenota%20un%20incontro"}
              >
                Prenota un incontro
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/chi-siamo">Torna al Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ALTRI MEMBRI */}
      {others.length ? (
        <section className="section-canvas">
          <div className="container-im section-pad">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">Il team</p>
            <h2 className="mt-2 text-h2-im">
              Scopri <span className="im-gradient-text">altri</span> membri.
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {others.map((m) => {
                const name = [m.firstName, m.lastName].filter(Boolean).join(" ") || "Membro team";
                return (
                  <Link
                    key={m.slug}
                    to="/team/$slug"
                    params={{ slug: m.slug }}
                    className="group overflow-hidden glass-panel rounded-2xl transition-all hover:-translate-y-1 hover:border-signal/60"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-white/5">
                      <img
                        src={m.photo}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-4 py-3">
                      <p className="font-display text-sm font-semibold group-hover:text-signal">
                        {name}
                      </p>
                      {m.role ? <p className="text-xs text-orange">{m.role}</p> : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <NewsletterBanner />
    </div>
  );
}

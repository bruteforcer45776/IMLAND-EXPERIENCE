import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { getTeamMember, type TeamMember } from "../data/team-members";
import { canonical, OG_IMAGE } from "../lib/seo";

export const Route = createFileRoute("/team/$slug")({
  loader: ({ params }) => {
    const member = getTeamMember(params.slug);
    if (!member) throw notFound();
    return { member };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Profilo non trovato — IMLAND" }] };
    const { member } = loaderData;
    const fullName = [member.firstName, member.lastName].filter(Boolean).join(" ") || "Membro Team";
    const description = member.description || member.bio.split("\n")[0];
    return {
      meta: [
        { title: `${fullName}${member.role ? ` — ${member.role}` : ""} | IMLAND` },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, noimageindex" },
        { property: "og:title", content: `${fullName} | IMLAND` },
        { property: "og:description", content: description },
        { property: "og:image", content: OG_IMAGE },
      ],
      links: [canonical(`/team/${member.slug}`)],
    };
  },
  component: TeamMemberPage,
  notFoundComponent: TeamMemberNotFound,
});

function TeamMemberNotFound() {
  return (
    <main className="container-im section-pad text-center">
      <h1 className="text-h1-im">Profilo non trovato.</h1>
      <Button asChild className="mt-8"><Link to="/chi-siamo">Torna al team</Link></Button>
    </main>
  );
}

function TeamMemberPage() {
  const { member } = Route.useLoaderData() as { member: TeamMember };
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(" ") || "Membro Team";
  const paragraphs = (member.description || member.bio).split("\n").filter(Boolean);
  const profileHref = member.ctaHref || member.bookingUrl || `mailto:${member.contactEmail || "info@imlandradio.com"}`;
  const external = /^https?:\/\//.test(profileHref);

  return (
    <main className="section-atmosphere section-pad">
      <article className="container-im mx-auto grid max-w-5xl overflow-hidden rounded-2xl bg-card shadow-[0_20px_56px_rgba(15,23,42,0.14)] md:grid-cols-[minmax(280px,0.8fr)_1.2fr]">
        <div className="min-h-[420px] overflow-hidden bg-[#059cff] md:min-h-[680px]">
          {member.photo ? (
            <img src={member.photo} alt={fullName} className="h-full w-full object-cover object-top" loading="eager" width={1024} height={1536} />
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center px-8 text-center text-white">
              <span className="font-display text-5xl font-bold tracking-[-0.03em]">BIXONT.IT</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10 md:p-12">
          <h1 className="text-display-l">{fullName}</h1>
          {member.role ? <p className="mt-3 text-base font-semibold text-signal">{member.role}</p> : null}
          <div className="mt-7 space-y-4 text-base leading-relaxed text-muted-foreground">
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          <a href={profileHref} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="btn-blue mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
            Scopri il profilo <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </article>
    </main>
  );
}

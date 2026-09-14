import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { canonical } from "../lib/seo";
import { BentoGrid, BentoCard } from "../components/bento";
import {
  findEvent,

  formatEventDate,
  formatEventTime,
  googleCalendarUrl,
  upcomingEvents,
} from "../data/events";

export const Route = createFileRoute("/eventi/$slug")({
  loader: ({ params }) => {
    const event = findEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Evento non disponibile — IMLAND Experience" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { event } = loaderData;
    const title = `${event.title} — Eventi IMLAND Experience`;
    return {
      meta: [
        { title },
        { name: "description", content: event.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: event.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [canonical(`/eventi/${event.slug}`)],
    };
  },
  component: EventDetail,
  notFoundComponent: EventNotFound,
});

function EventNotFound() {
  return (
    <div className="container-im section-pad-sm">
      <h1 className="text-h1-im">Evento non trovato.</h1>
      <p className="mt-3 text-muted-foreground">
        La data che cerchi non è in calendario.
        <br />
        Guarda tutti gli appuntamenti in programma.
      </p>
      <Link to="/eventi" className="mt-6 inline-flex rounded-full btn-blue px-6 py-3 text-sm">
        Tutti gli eventi
      </Link>
    </div>
  );
}

function EventDetail() {
  const { event } = Route.useLoaderData();
  const others = upcomingEvents.filter((e) => e.slug !== event.slug).slice(0, 3);
  const mapQuery = encodeURIComponent(`${event.place}, ${event.territory}`);

  return (
    <div className="container-im hero-pad">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/eventi" className="hover:text-foreground">Eventi</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{event.title}</span>
      </nav>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-signal">
        {event.territory} · {event.category}
      </p>
      <h1 className="mt-3 text-h1-im">{event.title}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{event.summary}</p>

      <BentoGrid className="mt-8">
        <BentoCard tone="eventi" span={2}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data</p>
          <p className="mt-2 text-[15px] font-semibold">{formatEventDate(event.start)}</p>
        </BentoCard>
        <BentoCard tone="eventi" span={2}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orario</p>
          <p className="mt-2 text-[15px] font-semibold">{formatEventTime(event.start)}</p>
        </BentoCard>
        <BentoCard tone="eventi" span={2}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Luogo</p>
          <p className="mt-2 text-[15px] font-semibold">{event.place}</p>
        </BentoCard>
      </BentoGrid>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/contatti" className="rounded-full btn-blue px-6 py-3.5 text-sm">
          Prenota il tuo posto
        </Link>
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-outline bg-card px-6 py-3.5 text-sm font-semibold"
        >
          Aggiungi al calendario
        </a>
        <Link to="/member" className="rounded-full border border-outline bg-card px-6 py-3.5 text-sm font-semibold">
          Diventa sponsor dell'evento
        </Link>
      </div>

      {event.program && event.program.length > 0 && (
        <section className="mt-12">
          <h2 className="text-h2-im">Programma.</h2>
          <ul className="mt-5 divide-y divide-border rounded-3xl border border-outline bg-card">
            {event.program.map((p) => (
              <li key={`${p.time}-${p.label}`} className="flex gap-5 p-5">
                <span className="w-16 shrink-0 font-semibold text-signal">{p.time}</span>
                <span className="text-sm text-muted-foreground">{p.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {event.organizers && event.organizers.length > 0 && (
        <section className="mt-12">
          <h2 className="text-h2-im">Organizzatori e sponsor.</h2>
          <p className="mt-3 text-sm text-muted-foreground">{event.organizers.join(" · ")}</p>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-h2-im">Come arrivare.</h2>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-full border border-outline bg-card px-6 py-3.5 text-sm font-semibold"
        >
          Apri la mappa di {event.place}
        </a>
      </section>

      <section className="mt-12">
        <h2 className="text-h2-im">Continua ad ascoltare.</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {(event.related ?? []).map((r) => (
            <Link key={r.to} to={r.to} className="rounded-full border border-outline bg-card px-5 py-3 text-sm font-semibold">
              {r.label}
            </Link>
          ))}
          <Link to="/podcast" className="rounded-full border border-outline bg-card px-5 py-3 text-sm font-semibold">
            Il racconto in podcast
          </Link>
          <Link to="/news" className="rounded-full border border-outline bg-card px-5 py-3 text-sm font-semibold">
            Le news del territorio
          </Link>
        </div>
      </section>

      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="text-h2-im">Prossimi appuntamenti.</h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {others.map((e) => (
              <li key={e.slug}>
                <Link
                  to="/eventi/$slug"
                  params={{ slug: e.slug }}
                  className="block h-full rounded-2xl border border-outline bg-card p-5 transition-shadow hover:shadow-[var(--elevation-2)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                    {e.territory} · {e.category}
                  </p>
                  <h3 className="mt-2 text-h3-im leading-snug">{e.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{formatEventDate(e.start)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

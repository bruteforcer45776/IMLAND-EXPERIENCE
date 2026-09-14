import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  eventCategories,
  eventTerritories,
  formatEventDate,
  formatEventTime,
  googleCalendarUrl,
  nextEvent,
  pastEvents,
  upcomingEvents,
  type ImlandEvent,
} from "@/data/events";
import { BrandIcon } from "@/components/brand-icons";

function useCountdown(iso?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!iso) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [iso]);
  if (!iso) return null;
  const diff = Math.max(0, new Date(iso).getTime() - now);
  return {
    giorni: Math.floor(diff / 86_400_000),
    ore: Math.floor((diff % 86_400_000) / 3_600_000),
    minuti: Math.floor((diff % 3_600_000) / 60_000),
    secondi: Math.floor((diff % 60_000) / 1000),
  };
}

function EventCard({ event }: { event: ImlandEvent }) {
  return (
    <Link
      to="/eventi/$slug"
      params={{ slug: event.slug }}
      className="block h-full rounded-3xl border border-outline bg-card p-6 transition-shadow hover:shadow-[var(--elevation-2)]"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-signal">
        {event.territory} · {event.category}
      </p>
      <h3 className="mt-3 text-h3-im leading-snug">{event.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.summary}</p>
      <p className="mt-4 text-sm font-semibold">
        {formatEventDate(event.start)} · {formatEventTime(event.start)}
      </p>
      <p className="text-sm text-muted-foreground">{event.place}</p>
    </Link>
  );
}

/**
 * Calendario eventi: evento in evidenza con countdown, filtri per territorio
 * e categoria, griglia dei prossimi appuntamenti e recap degli eventi passati.
 */
export function EventsCalendar() {
  const [territory, setTerritory] = useState<string>("Tutti");
  const [category, setCategory] = useState<string>("Tutte");
  const countdown = useCountdown(nextEvent?.start);

  const filtered = useMemo(
    () =>
      upcomingEvents.filter(
        (e) =>
          (territory === "Tutti" || e.territory === territory) &&
          (category === "Tutte" || e.category === category),
      ),
    [territory, category],
  );

  return (
    <>
      {/* Evento in evidenza */}
      <section className="section-focus">
        <div className="container-im section-pad-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">
            Prossimo evento
          </p>

          {nextEvent && countdown ? (
            <div className="mt-4 rounded-3xl border border-outline bg-card p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-signal">
                    {nextEvent.territory} · {nextEvent.category}
                  </p>
                  <h2 className="mt-3 text-h2-im">{nextEvent.title}</h2>
                  <p className="mt-3 max-w-xl text-sm text-muted-foreground">{nextEvent.summary}</p>
                  <p className="mt-4 text-sm font-semibold">
                    {formatEventDate(nextEvent.start)} · {formatEventTime(nextEvent.start)} ·{" "}
                    {nextEvent.place}
                  </p>
                </div>
                <dl className="grid grid-cols-4 gap-3 text-center">
                  {Object.entries(countdown).map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-outline px-4 py-3">
                      <dt className="sr-only">{label}</dt>
                      <dd>
                        <span className="block font-display text-2xl font-bold">{value}</span>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          {label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/eventi/$slug"
                  params={{ slug: nextEvent.slug }}
                  className="rounded-full btn-blue px-6 py-3.5 text-sm"
                >
                  Prenota il tuo posto
                </Link>
                <a
                  href={googleCalendarUrl(nextEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-outline bg-card px-6 py-3.5 text-sm font-semibold"
                >
                  Aggiungi al calendario
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-start gap-6 rounded-3xl border border-outline bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-4">
                <BrandIcon name="calendario" className="h-10 w-10 shrink-0" aria-hidden />
                <div>
                  <h2 className="text-h2-im">Appuntamenti presto in arrivo.</h2>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    Stiamo chiudendo le prossime date con i territori.
                    <br />
                    Iscriviti alla newsletter per riceverle in anticipo.
                  </p>
                </div>
              </div>
              <a
                href="#newsletter-eventi"
                className="inline-flex shrink-0 items-center gap-2 rounded-full btn-blue px-6 py-3.5 text-sm"
              >
                Avvisami
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Calendario con filtri */}
      <section className="section-canvas">
        <div className="container-im section-pad-sm">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">Calendario</p>
            <h2 className="mt-3 text-h2-im">
              Gli appuntamenti, per <span className="im-gradient-text">territorio</span>.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Filtra per provincia e per tipo di evento.
              <br />
              Ogni data ha la sua pagina con programma, mappa e prenotazione.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Tutti", ...eventTerritories].map((t) => (
              <button
                key={t}
                onClick={() => setTerritory(t)}
                aria-pressed={territory === t}
                className={`rounded-full border px-4 py-2 min-h-10 text-sm font-semibold transition-colors ${
                  territory === t
                    ? "border-transparent btn-blue"
                    : "border-outline bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Tutte", ...eventCategories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-4 py-2 min-h-10 text-sm transition-colors ${
                  category === c
                    ? "border-signal text-signal"
                    : "border-outline text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((e) => (
                <li key={e.slug}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 rounded-3xl border border-outline bg-card p-8">
              <h3 className="text-h3-im">Il calendario sarà aggiornato presto.</h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Le prossime date arrivano prima in newsletter.
                <br />
                Nel frattempo puoi ascoltare la radio o proporci il tuo evento.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/radio" className="rounded-full btn-blue px-5 py-3 text-sm">
                  Ascolta la radio
                </Link>
                <a
                  href="#proponi-evento"
                  className="rounded-full border border-outline px-5 py-3 text-sm font-semibold"
                >
                  Proponi il tuo evento
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Eventi passati */}
      {pastEvents.length > 0 && (
        <section className="section-focus">
          <div className="container-im section-pad-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Eventi passati
            </p>
            <h2 className="mt-3 text-h2-im">
              Com'è andata, <span className="im-gradient-text">racconto</span> per racconto.
            </h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.slice(0, 6).map((e) => (
                <li key={e.slug}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

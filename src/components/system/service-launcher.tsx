/**
 * Launcher dei servizi in stile Google Apps: griglia di tutte le verticali
 * IMLAND con logo, colore e descrizione breve. Usato nell'header desktop e
 * nel menu fullscreen mobile.
 */
import { Link } from "@tanstack/react-router";
import { SECTIONS, type SectionConfig } from "@/config/sections";

export const SERVICE_ORDER = ["radio", "podcast", "eventi", "member", "news"] as const;

const DESCRIPTIONS: Record<string, string> = {
  radio: "La diretta del territorio",
  podcast: "Storie da ascoltare",
  eventi: "Cosa succede vicino a te",
  member: "Le aziende della rete",
  news: "Notizie verificate",
};

export function orderedServices(): SectionConfig[] {
  return SERVICE_ORDER.map((key) => SECTIONS.find((s) => s.key === key)).filter(
    (s): s is SectionConfig => Boolean(s),
  );
}

export function ServiceLauncher({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {orderedServices().map((service) => (
        <Link
          key={service.key}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          to={(service.prefix ?? "/") as any}
          onClick={onNavigate}
          className="group flex flex-col items-start gap-2 rounded-[var(--radius-md)] border border-border p-3 no-underline transition-standard hover:border-transparent"
          style={{
            // colore della verticale di destinazione
            ["--service-base" as string]: service.theme.signal,
            ["--service-ink" as string]: service.theme.signalInk,
          }}
        >
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: `color-mix(in oklab, ${service.theme.signal} 14%, white)` }}
          >
            <img
              src={service.logo.url}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              loading="lazy"
            />
          </span>
          <span className="text-label-im" style={{ color: service.theme.signalInk }}>
            {service.label}
          </span>
          <span className="text-caption-im text-muted-foreground">{DESCRIPTIONS[service.key]}</span>
        </Link>
      ))}
    </div>
  );
}

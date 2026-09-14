import { Link } from "@tanstack/react-router";
import { Sparkles, User, Users } from "lucide-react";
import { SpotlightCard } from "./spotlight-card";
import Pricing from "./ui/pricing";

type PackageKind = "member" | "radio" | "podcast";

type Tier = {
  name: string;
  tag: string;
  desc: string;
  features: string[];
  highlight?: boolean;
};

const CONTENT: Record<
  PackageKind,
  {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    note?: string;
    tiers: Tier[];
  }
> = {
  member: {
    eyebrow: "Pacchetti Member",
    title: "Entra nella rete",
    titleAccent: "IMLAND.",
    lead: "Per attivare spot radio, podcast ed eventi devi prima diventare Member.\nScegli il pacchetto che ti rappresenta.",
    tiers: [
      {
        name: "Base",
        tag: "Pacchetto Base",
        desc: "Il primo passo dentro la Member Community IMLAND.",
        features: [
          "Card NFC personalizzata",
          "Accesso Community WhatsApp Member",
          "Partecipazione eventi esclusivi",
          "Networking professionale",
          "Member's wall",
        ],
      },
      {
        name: "Custom",
        tag: "Su misura",
        desc: "Un percorso disegnato attorno al tuo brand.",
        features: [
          "Membership modellata sulle tue esigenze",
          "Mix personalizzato di radio, podcast ed eventi",
          "Referente dedicato IMLAND",
          "Piano editoriale annuale su misura",
        ],
        highlight: true,
      },
      {
        name: "Premium",
        tag: "Pacchetto Premium",
        desc: "Membership completa con spot radio inclusi.",
        features: [
          "Tutti i vantaggi Member Community",
          "3 spot radio al giorno inclusi",
          "Visibilità continuativa",
          "Condizioni riservate sui servizi audio",
        ],
      },
    ],
  },
  radio: {
    eyebrow: "Pacchetti Spot Radio",
    title: "Vai in onda con il tuo",
    titleAccent: "spot.",
    lead: "Spot radio da 15 secondi prodotti con standard professionali e trasmessi sulla rete IMLAND.\nRiservati ai Member.",
    note: "Riservato ai Member. Serve un pacchetto Member attivo (Base, Premium o Custom).",
    tiers: [
      {
        name: "Base",
        tag: "Tariffa Member",
        desc: "Il tuo spot in onda sul territorio.",
        features: [
          "Spot radio da 15 secondi",
          "Standard di produzione professionale",
          "Trasmissione sulla rete IMLAND",
          "Tariffa agevolata riservata ai Member",
        ],
      },
      {
        name: "Custom",
        tag: "Su misura",
        desc: "Campagna radio disegnata insieme.",
        features: [
          "Numero spot e frequenza personalizzati",
          "Rubrica o format brandizzato dedicato",
          "Voice talent e sound design custom",
          "Piano media annuale con obiettivi",
        ],
        highlight: true,
      },
      {
        name: "Premium",
        tag: "Più scelto",
        desc: "Presenza costante nel palinsesto.",
        features: [
          "Passaggi ricorrenti in palinsesto",
          "Fasce orarie di picco",
          "Sponsorship di rubrica dedicata",
          "Report ascolti e reach",
        ],
      },
    ],
  },
  podcast: {
    eyebrow: "Pacchetti Podcast",
    title: "Produci la tua serie",
    titleAccent: "podcast.",
    lead: "Produzione podcast professionale con distribuzione su tutte le principali piattaforme.\nRiservati ai Member IMLAND.",
    note: "Riservato ai Member. Serve un pacchetto Member attivo (Base, Premium o Custom).",
    tiers: [
      {
        name: "Base",
        tag: "Starter",
        desc: "Distribuzione sulle principali piattaforme.",
        features: [
          "Distribuzione Amazon Music",
          "Distribuzione Apple Music",
          "Distribuzione Spotify",
          "Pubblicazione su IMLAND Radio",
        ],
      },
      {
        name: "Custom",
        tag: "Su misura",
        desc: "Massima visibilità e produzione video.",
        features: [
          "Tutto quello incluso nel piano Premium",
          "Video professionale dedicato",
          "Promozione multicanale avanzata",
          "Massima visibilità del brand",
        ],
        highlight: true,
      },
      {
        name: "Premium",
        tag: "Più scelto",
        desc: "Distribuzione più promozione social dedicata.",
        features: [
          "Tutto quello incluso nel piano Base",
          "Post social dedicato",
          "60 giorni di sponsorizzazione post",
          "Promozione cartella podcast",
        ],
      },
    ],
  },
};

export function PackagesSection({ kind }: { kind: PackageKind }) {
  const c = CONTENT[kind];

  if (kind === "member") {
    return (
      <Pricing
        className="section-focus"
        eyebrow={c.eyebrow}
        title={
          <>
            {c.title} <span className="im-gradient-text">{c.titleAccent}</span>
          </>
        }
        description={c.lead}
        note={c.note ?? false}
        plans={c.tiers.map((t) => ({
          name: t.name,
          badge: t.tag,
          description: t.desc,
          features: t.features,
          icon:
            t.name === "Base" ? (
              <User className="size-5" />
            ) : t.name === "Premium" ? (
              <Users className="size-5" />
            ) : (
              <Sparkles className="size-5" />
            ),
          cta: {
            label: "Contatta un commerciale",
            href: "/contatti",
            variant: t.highlight ? "default" : "outline",
          },
          variant: t.highlight ? "glow-brand" : "glow",
        }))}
      />
    );
  }

  return (
    <section className="section-focus">
      <div className="container-im section-pad">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">{c.eyebrow}</p>
          <h2 className="mt-2 text-h2-im">
            {c.title} <span className="im-gradient-text">{c.titleAccent}</span>
          </h2>
          <p className="mt-4 whitespace-pre-line text-muted-foreground">{c.lead}</p>
          {c.note ? (
            <p className="mt-3 block w-full max-w-xl rounded-2xl glass-panel px-4 py-2 text-xs font-semibold uppercase tracking-wide">
              {c.note}
            </p>
          ) : null}
        </div>

        <div className="mt-10 grid items-center gap-4 md:grid-cols-3">
          {c.tiers.map((t, i) => (
            <SpotlightCard
              key={t.name}
              className={`flex h-full flex-col rounded-3xl border p-6 ${
                i === 1 ? "md:-translate-y-6 md:py-10 md:shadow-2xl md:z-10" : ""
              } ${t.highlight ? "border-transparent bg-signal text-white" : "glass-panel"}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    t.highlight ? "bg-white/15 text-white/85" : "bg-white/5 text-foreground/70"
                  }`}
                >
                  {t.tag}
                </span>
              </div>
              <h3 className="mt-6 text-h3-im">{t.name}</h3>
              <p
                className={`mt-2 text-sm ${t.highlight ? "text-white/75" : "text-muted-foreground"}`}
              >
                {t.desc}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className={t.highlight ? "text-horizon" : "text-signal"}>—</span>
                    <span className={t.highlight ? "text-white/85" : "text-foreground/80"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link
                  to="/contatti"
                  className={`side-blue inline-block w-full rounded-full px-5 py-3 text-center text-sm font-semibold ${
                    t.highlight
                      ? "btn-blue justify-center"
                      : "bg-signal text-white hover:opacity-90"
                  }`}
                >
                  Contatta un commerciale
                </Link>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

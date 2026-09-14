import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SpotlightCard } from "./spotlight-card";
import { BrandIcon } from "./brand-icons";

type Kind = "spot" | "podcast" | "evento";

const config: Record<
  Kind,
  {
    tag: string;
    title: string;
    highlight: string;
    lead: string;
    placeholder: string;
    fieldLabel: string;
    email: string;
    subject: string;
    types: string[];
    bullets: string[];
  }
> = {
  spot: {
    tag: "IMLAND Member · Spot Radio",
    title: "Proponi il tuo",
    highlight: "spot radio",
    lead: "Sei un IMLAND Member? Raccontaci il tuo progetto radiofonico: rubrica, spot, ospitata o format. Ti ricontattiamo per pianificarlo insieme.",
    placeholder: "Descrivi l'idea, il format, la durata e la periodicità che immagini…",
    fieldLabel: "Titolo dello spot / rubrica",
    email: "onair@imlandradio.com",
    subject: "Proposta spot radio",
    types: ["Spot pubblicitario", "Rubrica ricorrente", "Ospitata singola", "Format nuovo"],
    bullets: [
      "Registrazione e montaggio nel nostro studio",
      "Messa in onda nel palinsesto 24/7",
      "Rilancio su podcast e canali social",
    ],
  },
  podcast: {
    tag: "IMLAND Member · Podcast",
    title: "Proponi il tuo",
    highlight: "podcast",
    lead: "Hai un'idea di podcast, una serie o una puntata pilota? Come IMLAND Member puoi produrla con noi: attrezzatura, studio e distribuzione.",
    placeholder: "Descrivi il tema, il tono, gli ospiti previsti e la durata media delle puntate…",
    fieldLabel: "Titolo del podcast",
    email: "info@imlandradio.com",
    subject: "Proposta podcast",
    types: ["Serie a puntate", "Puntata singola", "Podcast di intervista", "Documentario audio"],
    bullets: [
      "Studio, microfoni e regia inclusi",
      "Editing, sigla e copertina del programma",
      "Distribuzione su Spotify, Apple e sito IMLAND",
    ],
  },
  evento: {
    tag: "IMLAND Member · Eventi",
    title: "Porta il tuo",
    highlight: "evento",
    lead: "Sei un IMLAND Member e vuoi organizzare un evento con noi? Facciamo animazione, live, talk e radio in diretta — non catering. Scrivici i dettagli.",
    placeholder: "Data, luogo, pubblico atteso, tipo di animazione che immagini…",
    fieldLabel: "Titolo dell'evento",
    email: "info@imlandradio.com",
    subject: "Proposta evento",
    types: ["Live / concerto", "Talk / incontro", "Radio in diretta", "Workshop / laboratorio"],
    bullets: [
      "Conduzione, musica e animazione live",
      "Collegamento radio dal tuo evento",
      "Racconto dell'evento su podcast e social",
    ],
  },
};

export function ProposalForm({ kind }: { kind: Kind }) {
  const c = config[kind];
  const [type, setType] = useState(c.types[0]);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", titolo: "", messaggio: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Fallback: apre il client email con la proposta precompilata.
    const body =
      `Nome: ${form.nome}\n` +
      `Email: ${form.email}\n` +
      `Tipo: ${type}\n` +
      `${c.fieldLabel}: ${form.titolo}\n\n` +
      `${form.messaggio}`;
    const href = `mailto:${c.email}?subject=${encodeURIComponent(`[Member] ${c.subject}: ${form.titolo || "senza titolo"}`)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  }

  return (
    <section id={`proponi-${kind}`} className="container-im section-canvas section-pad">
      <div className="grid gap-10 glass-panel rounded-[36px] p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
        <div className="self-start">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">{c.tag}</p>
          <h2 className="mt-3 text-h2-im">
            {c.title} <span className="im-gradient-text">{c.highlight}</span>.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">{c.lead}</p>
          <ul className="mt-6 space-y-3">
            {c.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground">
                <BrandIcon name="check" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Non sei ancora Member?{" "}
            <a
              href="/member"
              className="inline-flex items-center gap-1 font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Scopri come diventarlo <ArrowRight className="inline h-3.5 w-3.5" />
            </a>
          </p>
        </div>

        <SpotlightCard className="glass-panel rounded-3xl p-6 md:p-8">
          <form onSubmit={submit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <BrandIcon name="profilo" className="h-4 w-4" aria-hidden />
                  Nome
                </span>
                <input
                  required
                  maxLength={100}
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="field-im mt-2 rounded-full"
                  placeholder="Il tuo nome"
                />
              </label>
              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <BrandIcon name="email" className="h-4 w-4" aria-hidden />
                  Email
                </span>
                <input
                  required
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="field-im mt-2 rounded-full"
                  placeholder="nome@dominio.it"
                />
              </label>
            </div>

            <div className="mt-4">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tipologia
              </span>
              <div className="flex flex-wrap gap-2">
                {c.types.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`${type === t ? "chip-im-active" : "chip-im"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-4 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {c.fieldLabel}
              </span>
              <input
                required
                maxLength={120}
                value={form.titolo}
                onChange={(e) => setForm({ ...form, titolo: e.target.value })}
                className="field-im mt-2 rounded-full"
                placeholder="Come si chiama la tua proposta?"
              />
            </label>

            <label className="mt-4 block">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <BrandIcon name="messaggio" className="h-4 w-4" aria-hidden />
                Descrizione
              </span>
              <textarea
                required
                rows={5}
                maxLength={1500}
                value={form.messaggio}
                onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                className="field-im mt-2 rounded-3xl"
                placeholder={c.placeholder}
              />
            </label>

            <button
              type="submit"
              className="mt-6 w-full btn-blue rounded-full px-5 py-3.5 text-sm font-semibold hover:opacity-90"
            >
              Invia la proposta
            </button>

            {sent && (
              <p className="mt-4 rounded-2xl bg-meadow/20 px-4 py-3 text-center text-sm font-medium text-foreground">
                Grazie! Apriamo il tuo client email con la proposta precompilata verso {c.email}.
              </p>
            )}
          </form>
        </SpotlightCard>
      </div>
    </section>
  );
}

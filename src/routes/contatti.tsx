import { createFileRoute, Link } from "@tanstack/react-router";
import { canonical } from "../lib/seo";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BrandIcon } from "../components/brand-icons";
import { PageHero } from "../components/page-hero";
import { SectionHeader } from "../components/section-header";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { LegalConsent } from "../components/legal-consent";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — IMLAND EXPERIENCE" },
      {
        name: "description",
        content:
          "Scrivi alla redazione IMLAND EXPERIENCE: radio, musica, podcast ed eventi a Vercelli, Novara, Biella e Verbania. Proponi storie e collaborazioni.",
      },
      { name: "geo.region", content: "IT-PIE" },
      { property: "og:title", content: "Contatti — IMLAND EXPERIENCE" },
      { property: "og:description", content: "Scrivi alla redazione IMLAND." },
    ],
    links: [canonical("/contatti")],
  }),
  component: ContattiPage,
});

const topics = [
  "Storia / segnalazione",
  "Radio / podcast",
  "Evento / partnership",
  "Member",
  "Altro",
] as const;

const usefulLinks = [
  { to: "/eventi" as const, label: "Scopri gli eventi IMLAND" },
  { to: "/radio" as const, label: "Ascolta IMLAND Radio" },
  { to: "/podcast" as const, label: "Esplora i podcast" },
  { to: "/member" as const, label: "Diventa IMLAND Member" },
];

const miniFaqs = [
  {
    q: "In quanto tempo ricevo una risposta?",
    a: "Leggiamo ogni richiesta e la indirizziamo alla persona più adatta del team.",
  },
  {
    q: "Posso proporre una storia da raccontare in radio o podcast?",
    a: "Sì, è uno degli scopi principali di questo modulo: scrivici i dettagli nel box qui sotto o usa il form con argomento 'Storia / segnalazione'.",
  },
  {
    q: "Avete una sede fisica dove venire di persona?",
    a: "Lo studio è aperto lun–ven, 9:00–19:00. Scrivici o chiamaci prima di passare, così troviamo qualcuno disponibile ad accoglierti.",
  },
];

function ContattiPage() {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    topic: topics[0] as string,
    messaggio: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`[${form.topic}] Richiesta dal sito IMLAND`);
    const body = encodeURIComponent(
      `Nome: ${form.nome}\nEmail: ${form.email}\n\n${form.messaggio}`,
    );
    window.location.href = `mailto:info@imlandradio.com?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <PageHero
        eyebrow="Contatti"
        badge="commento"
        title={
          <>
            Mettiamoci in <span className="im-gradient-text">contatto</span>.
          </>
        }
        subtitle="Scrivici per proporre una storia, un progetto o semplicemente per dirci cosa ne pensi."
      >
        <a href="#scrivici" className="rounded-full btn-blue px-6 py-3 text-sm">
          Compila il form
        </a>
        <a
          href="mailto:info@imlandradio.com"
          className="rounded-full btn-ghost-glass px-6 py-3 text-sm"
        >
          Scrivi una email
        </a>
      </PageHero>

      <section
        id="scrivici"
        className="container-im section-focus grid gap-10 section-pad lg:grid-cols-[1.1fr_1fr]"
      >
        {/* Form */}
        <div
          className="bento-card p-6 md:p-8"
          style={{ "--bento-tone": "var(--color-icon-podcast)" } as React.CSSProperties}
        >
          <form onSubmit={submit}>
            <h2 className="flex items-center gap-2.5 text-h2-im">
              <BrandIcon name="fumetti" className="h-7 w-7" aria-hidden />
              Scrivici
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Raccontaci la tua richiesta.</p>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <BrandIcon name="profilo" className="h-4 w-4" aria-hidden />
                    Nome
                  </span>
                  <input
                    required
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
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="field-im mt-2 rounded-full"
                    placeholder="nome@territorio.it"
                  />
                </label>
              </div>
              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Argomento
                </span>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setForm({ ...form, topic: t })}
                      className={`${form.topic === t ? "chip-im-active" : "chip-im"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <BrandIcon name="messaggio" className="h-4 w-4" aria-hidden />
                  Messaggio
                </span>
                <textarea
                  required
                  rows={6}
                  value={form.messaggio}
                  onChange={(e) => setForm({ ...form, messaggio: e.target.value })}
                  className="field-im mt-2 rounded-3xl"
                  placeholder="Raccontaci cosa hai in mente…"
                />
              </label>
              <button
                type="submit"
                className="w-full btn-blue rounded-full px-5 py-3.5 text-sm font-semibold hover:opacity-90"
              >
                Invia messaggio
              </button>
              <LegalConsent
                id="contact-privacy"
                checked={privacyAccepted}
                onChange={setPrivacyAccepted}
              />
              <p className="text-center text-xs text-muted-foreground">
                Si aprirà la tua app email con il messaggio già compilato.
              </p>
            </div>
          </form>

          {/* Proponi una storia */}
          <div className="mt-6 rounded-3xl border border-outline bg-surface-1 p-6">
            <h3 className="flex items-center gap-2.5 text-h3-im">
              <BrandIcon name="megafono" className="h-6 w-6" aria-hidden />
              Proponi una storia
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Conosci una storia, un progetto o una persona del territorio che merita spazio in
              radio o podcast?
              <br />
              Scegli "Storia / segnalazione" come argomento e raccontacela: la valutiamo per il
              prossimo palinsesto.
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div
            className="bento-card p-6 md:p-8"
            style={{ "--bento-tone": "var(--color-icon-radio)" } as React.CSSProperties}
          >
            <h2 className="flex items-center gap-2.5 text-h2-im">
              <BrandIcon name="telefono" className="h-7 w-7" aria-hidden />
              Contatti diretti
            </h2>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 font-display text-base font-semibold">info@imlandradio.com</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Redazione, radio, eventi e community.
                  </p>
                </div>
                <a
                  href="mailto:info@imlandradio.com"
                  className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-1 px-4 py-2 text-xs font-medium hover:bg-surface-2"
                >
                  Scrivi <ArrowRight className="inline h-4 w-4" />
                </a>
              </li>
              <li className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Telefono
                  </p>
                  <p className="mt-1 font-display text-base font-semibold">+39 351 432 3003</p>
                  <p className="mt-1 text-xs text-muted-foreground">Chiamaci in orario studio.</p>
                </div>
                <a
                  href="tel:+393514323003"
                  className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-1 px-4 py-2 text-xs font-medium hover:bg-surface-2"
                >
                  Chiama <ArrowRight className="inline h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>

          <div
            className="bento-card p-6 md:p-8"
            style={{ "--bento-tone": "var(--color-icon-member)" } as React.CSSProperties}
          >
            <h3 className="flex items-center gap-2.5 text-h3-im">
              <BrandIcon name="orologio" className="h-6 w-6" aria-hidden />
              Orari di apertura dello studio
            </h3>
            <p className="mt-4 text-xs text-muted-foreground">
              Apertura studio: lun–ven, 9:00 – 19:00
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <BrandIcon name="pin" className="h-4 w-4" aria-hidden />
              Vercelli e provincia — territorio Piemonte nord-orientale
            </p>
          </div>

          <div
            className="bento-card p-6 md:p-8"
            style={{ "--bento-tone": "var(--color-icon-eventi)" } as React.CSSProperties}
          >
            <h3 className="flex items-center gap-2.5 text-h3-im">
              <BrandIcon name="verificato" className="h-6 w-6" aria-hidden />
              Dati societari & licenze
            </h3>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ragione sociale
                </dt>
                <dd className="mt-0.5">IMLAND EXPERIENCE SRL</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Partita IVA
                </dt>
                <dd className="mt-0.5">02802650024</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Licenza SIAE
                </dt>
                <dd className="mt-0.5">202500000226</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Licenza SCF
                </dt>
                <dd className="mt-0.5">116/5/24</dd>
              </div>
            </dl>
          </div>

          <div
            className="bento-card p-6 md:p-8"
            style={{ "--bento-tone": "var(--color-icon-news)" } as React.CSSProperties}
          >
            <h3 className="flex items-center gap-2.5 text-h3-im">
              <BrandIcon name="link" className="h-6 w-6" aria-hidden />
              Seguici su
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                {
                  name: "Instagram",
                  href: "https://www.instagram.com/imland_radio/",
                  icon: "https://cdn.simpleicons.org/instagram/E4405F",
                },
                {
                  name: "Facebook",
                  href: "https://www.facebook.com/imlandradio",
                  icon: "https://cdn.simpleicons.org/facebook/1877F2",
                },
                {
                  name: "LinkedIn",
                  href: "https://www.linkedin.com/company/imland-experience/",
                  icon: "https://cdn.simpleicons.org/linkedin/0A66C2",
                },
                {
                  name: "Spotify",
                  href: "https://open.spotify.com/search/imland%20radio",
                  icon: "https://cdn.simpleicons.org/spotify/1DB954",
                },
                {
                  name: "YouTube",
                  href: "https://www.youtube.com/results?search_query=imland+radio",
                  icon: "https://cdn.simpleicons.org/youtube/FF0000",
                },
                {
                  name: "Telegram",
                  href: "https://t.me/imlandradio",
                  icon: "https://cdn.simpleicons.org/telegram/26A5E4",
                },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="rounded-full border border-border bg-surface-1 p-3 hover:bg-surface-2"
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={s.icon}
                    alt={s.name}
                    className="h-6 w-6"
                  />
                </a>
              ))}
            </div>
          </div>

          <div
            className="bento-card p-6 md:p-8"
            style={{ "--bento-tone": "var(--color-icon-podcast)" } as React.CSSProperties}
          >
            <h3 className="flex items-center gap-2.5 text-h3-im">
              <BrandIcon name="bussola" className="h-6 w-6" aria-hidden />
              Link utili
            </h3>
            <ul className="mt-4 space-y-2">
              {usefulLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-1 px-4 py-2.5 text-sm font-medium hover:bg-surface-2"
                  >
                    {l.label}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="hidden">
        <div className="container-im section-pad">
          <SectionHeader
            eyebrow="Domande frequenti"
            badge="news"
            title={
              <>
                Prima di scriverci, <span className="im-gradient-text">forse</span> trovi già la
                risposta.
              </>
            }
            description="Le domande che riceviamo più spesso, con la risposta rapida della redazione."
          />
          <div
            className="mt-10 bento-card p-6 md:p-8"
            style={{ "--bento-tone": "var(--color-icon-news)" } as React.CSSProperties}
          >
            <Accordion type="single" collapsible className="w-full">
              {miniFaqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger className="text-base font-display font-semibold">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}

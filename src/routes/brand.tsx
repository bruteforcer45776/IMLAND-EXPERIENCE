import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Copy, Download, X } from "lucide-react";

import { SECTIONS, DEFAULT_SECTION } from "../config/sections";
import phoneMockup from "../assets/phone-mockup-imland-opt.webp";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [
      { title: "Brand & linee guida · IMLAND EXPERIENCE" },
      {
        name: "description",
        content:
          "Linee guida del brand IMLAND: i 5 loghi, dimensioni minime, area di rispetto, palette colori, favicon, icone app e mockup pronti da scaricare.",
      },
      { property: "og:title", content: "Brand & linee guida · IMLAND EXPERIENCE" },
      {
        property: "og:description",
        content:
          "Uso corretto dei loghi IMLAND: spaziature, dimensioni, colori ufficiali e asset scaricabili.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Brand & linee guida · IMLAND EXPERIENCE" },
      {
        name: "twitter:description",
        content: "Il sistema visivo IMLAND in una pagina: loghi, colori, icone e regole d'uso.",
      },
    ],
  }),
  component: BrandPage,
});

type Brand = {
  key: string;
  name: string;
  role: string;
  usage: string;
  color: string;
  fg: string;
  slug: string;
  route: string | null;
};

function sectionLogoUrl(slug: string): string {
  if (slug === "experience") return DEFAULT_SECTION.logo.url;
  return SECTIONS.find((s) => s.key === slug)?.logo.url ?? `/brand/imland-${slug}.webp`;
}

/** Variante scura AA-safe del colore di brand, per superfici con testo. */
const BRAND_SURFACE: Record<string, string> = {
  experience: "#1668d4",
  radio: "#077ea1",
  podcast: "#1646d8",
  member: "#e0a800",
  eventi: "#0e8728",
  news: "#6d1cce",
};
function brandSurface(b: { slug: string; color: string }) {
  return BRAND_SURFACE[b.slug] ?? b.color;
}

const BRANDS: Brand[] = [
  {
    key: "experience",
    name: "IMLAND EXPERIENCE",
    role: "Marchio istituzionale",
    usage:
      "Header della home, pagine editoriali, documenti, firme e comunicazioni ufficiali. È il logo di riferimento quando non si è dentro una sezione specifica.",
    color: DEFAULT_SECTION.theme.signal,
    fg: "#ffffff",
    slug: "experience",
    route: "/",
  },
  {
    key: "radio",
    name: "IMLAND RADIO",
    role: "Sezione radio",
    usage:
      "Tutto ciò che riguarda la diretta: pagina radio, player, palinsesto, promo dei programmi live.",
    color: SECTIONS.find((s) => s.key === "radio")!.theme.signal,
    fg: "#ffffff",
    slug: "radio",
    route: "/radio",
  },
  {
    key: "podcast",
    name: "IMLAND PODCAST",
    role: "Sezione podcast",
    usage: "Canali, episodi, copertine e distribuzione on demand su piattaforme esterne.",
    color: SECTIONS.find((s) => s.key === "podcast")!.theme.signal,
    fg: "#ffffff",
    slug: "podcast",
    route: "/podcast",
  },
  {
    key: "member",
    name: "IMLAND MEMBER",
    role: "Sezione membership",
    usage:
      "Area membri, member card, vantaggi, pacchetti e materiali dedicati alla rete di aziende e persone.",
    color: SECTIONS.find((s) => s.key === "member")!.theme.signal,
    fg: "#0b0c0f",
    slug: "member",
    route: "/member",
  },
  {
    key: "eventi",
    name: "IMLAND EVENTI",
    role: "Sezione eventi",
    usage:
      "Format live, animazione, sponsorizzazioni e materiali on site (banner, backdrop, badge).",
    color: SECTIONS.find((s) => s.key === "eventi")!.theme.signal,
    fg: "#ffffff",
    slug: "eventi",
    route: "/eventi",
  },
  {
    key: "news",
    name: "IMLAND NEWS",
    role: "Sezione news",
    usage:
      "Notizie dal territorio, rassegna stampa, breaking e card editoriali social della redazione.",
    color: SECTIONS.find((s) => s.key === "news")!.theme.signal,
    fg: "#ffffff",
    slug: "news",
    route: "/news",
  },
];

const NEUTRALS = [
  { name: "Ink 950 · testo primario", value: "#101114" },
  { name: "Ink 600 · testo secondario", value: "#5f6368" },
  { name: "Border", value: "#e3e5e8" },
  { name: "Surface 1", value: "#f7f9fc" },
  { name: "Background", value: "#ffffff" },
];

const ICON_SIZES = [
  { file: "favicon.ico", size: "16 · 32 · 48", use: "Tab del browser, bookmark legacy" },
  { file: "icons/favicon-16.png", size: "16×16", use: "Tab su schermi standard" },
  { file: "favicon.png", size: "32×32", use: "Tab su schermi retina" },
  { file: "icons/favicon-48.png", size: "48×48", use: "Shortcut desktop, Windows" },
  { file: "icons/favicon-96.png", size: "96×96", use: "Nuova scheda, PWA piccola" },
  { file: "apple-touch-icon.png", size: "180×180", use: "Home screen iOS / iPadOS" },
  { file: "icon-192.png", size: "192×192", use: "Android, manifest PWA" },
  { file: "icons/favicon-256.png", size: "256×256", use: "Windows tile, store" },
  { file: "icon-512.png", size: "512×512", use: "Splash screen e store listing" },
  { file: "icon-maskable-192.png", size: "192×192", use: "Adaptive icon Android (safe area 20%)" },
  { file: "icon-maskable-512.png", size: "512×512", use: "Adaptive icon Android grande" },
];

const DO = [
  "Usa sempre i file ufficiali di questa pagina, senza ridisegnarli o ricomporli.",
  "Mantieni l'area di rispetto: metà dell'altezza del simbolo su tutti i lati.",
  "Su fondi fotografici usa il logo su una superficie piena bianca o su un velo scuro uniforme.",
  "Abbina il logo di sezione al colore dominante della stessa sezione (CTA, link, accenti).",
  "Esporta in WebP per il web e in PNG a fondo trasparente per stampa e terze parti.",
];

const DONT = [
  "Non modificare proporzioni, non stirare, non ruotare il logo.",
  "Non cambiare i colori del simbolo né applicare ombre, contorni o effetti glow.",
  "Non usare il logo colorato su fondi dello stesso colore o a basso contrasto.",
  "Non mischiare simbolo di una sezione e wordmark di un'altra.",
  "Non inserire il logo dentro forme decorative, cerchi o cornici aggiuntive.",
];

function ColorSwatch({ name, value }: { name: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition-colors hover:bg-surface-1"
      aria-label={`Copia ${value}`}
    >
      <span
        className="h-11 w-11 shrink-0 rounded-xl border border-border"
        style={{ backgroundColor: value }}
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-foreground">{name}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          {value.toUpperCase()}
          {copied ? (
            <Check size={13} />
          ) : (
            <Copy size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </span>
      </span>
    </button>
  );
}

function BrandPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="hero-frame hero-pad px-6 text-center md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Brand system
        </p>
        <h1 className="mt-3 text-display-l">
          Un solo <span className="im-gradient-text">brand</span>, cinque voci.
          <br />
          Regole semplici per usarlo bene.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Qui trovi i loghi ufficiali IMLAND, le dimensioni minime, le spaziature, i colori e le
          icone per app e browser.
          <br />
          Tutto pronto da scaricare e usare senza rifare nulla a mano.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/brand/imland-experience.png"
            download
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Download size={16} /> Logo istituzionale
          </a>
          <Link
            to="/contatti"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-surface-1"
          >
            Richiedi un uso speciale
          </Link>
        </div>
      </section>

      {/* Loghi */}
      <section className="container-im section-pad-sm">
        <h2 className="text-h2-im">I cinque loghi.</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Ogni sezione del sito ha il proprio lockup: simbolo a fumetto colorato più wordmark.
          <br />
          Il colore identifica la sezione, la struttura resta sempre identica.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {BRANDS.map((b) => (
            <article
              key={b.key}
              className="overflow-hidden rounded-3xl border border-border bg-background"
            >
              <div
                className="flex items-center justify-center px-6 py-10"
                style={{ backgroundColor: `color-mix(in oklab, ${b.color} 8%, #ffffff)` }}
              >
                <img
                  src={sectionLogoUrl(b.slug)}
                  alt={`Logo ${b.name}`}
                  className="h-14 w-auto md:h-16"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: b.color }}
                  />
                  <h3 className="text-base font-semibold text-foreground">{b.name}</h3>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {b.role}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{b.usage}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-surface-1 p-3">
                    <dt className="text-muted-foreground">Colore dominante</dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      {b.color.toUpperCase()}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-surface-1 p-3">
                    <dt className="text-muted-foreground">Altezza in header</dt>
                    <dd className="mt-0.5 font-semibold text-foreground">
                      36 px mobile · 40 px desktop
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`/brand/imland-${b.slug}.webp`}
                    download
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-1"
                  >
                    <Download size={14} /> WebP
                  </a>
                  <a
                    href={`/brand/imland-${b.slug}.png`}
                    download
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-1"
                  >
                    <Download size={14} /> PNG
                  </a>
                  <a
                    href={`/brand/mark-${b.slug}.png`}
                    download
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-1"
                  >
                    <Download size={14} /> Solo simbolo
                  </a>
                  {b.route && (
                    <Link
                      to={b.route}
                      className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold text-primary hover:underline"
                    >
                      Vedi in uso <ArrowRight className="inline h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Dimensioni e spaziature */}
      <section className="section-surface section-pad-sm">
        <div className="container-im">
          <h2 className="text-h2-im">Dimensioni e area di rispetto.</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            La regola è una sola: intorno al logo lascia sempre uno spazio pari a metà
            dell&apos;altezza del simbolo.
            <br />
            Sotto le dimensioni minime il microfono dentro il simbolo non è più leggibile.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-background p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Area di rispetto
              </h3>
              <div className="mt-5 rounded-2xl bg-surface-1 p-4">
                <div className="relative mx-auto max-w-sm rounded-xl border-2 border-dashed border-primary/40 p-[calc(0.5*3.5rem)]">
                  <img
                    src="/brand/imland-experience.webp"
                    alt="Area di rispetto intorno al logo IMLAND EXPERIENCE"
                    className="h-14 w-auto"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Margine = 0,5 × altezza del simbolo (x). Nessun testo, bordo o immagine dentro
                  l&apos;area tratteggiata.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Dimensioni minime
              </h3>
              <ul className="mt-5 divide-y divide-border text-sm">
                {[
                  ["Header sito (mobile)", "36 px di altezza"],
                  ["Header sito (desktop)", "40 px di altezza"],
                  ["Lockup completo su schermo", "min. 24 px di altezza"],
                  ["Solo simbolo su schermo", "min. 16 px di altezza"],
                  ["Stampa lockup completo", "min. 12 mm di altezza"],
                  ["Stampa solo simbolo", "min. 6 mm di altezza"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between gap-4 py-3">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-semibold text-foreground">{v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-end gap-5 rounded-2xl bg-surface-1 p-4">
                {[16, 24, 40].map((h) => (
                  <div key={h} className="text-center">
                    <img
                      src="/brand/mark-experience.png"
                      alt={`Simbolo IMLAND a ${h} pixel`}
                      style={{ height: h }}
                      className="mx-auto w-auto"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="mt-2 block text-xs text-muted-foreground">{h}px</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Colori */}
      <section className="container-im section-pad-sm">
        <h2 className="text-h2-im">Colori ufficiali.</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Ogni sezione ha un colore dominante che guida CTA, link e accenti.
          <br />
          Clicca su una tonalità per copiare il valore esadecimale.
        </p>
        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Colori di sezione
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BRANDS.map((b) => (
            <ColorSwatch key={b.key} name={b.name} value={b.color} />
          ))}
        </div>
        <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Neutri di sistema
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NEUTRALS.map((c) => (
            <ColorSwatch key={c.value} name={c.name} value={c.value} />
          ))}
        </div>
      </section>

      {/* Tipografia */}
      <section className="section-surface section-pad-sm">
        <div className="container-im">
          <h2 className="text-h2-im">Tipografia.</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-background p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Titoli · Plus Jakarta Sans 800
              </p>
              <p className="mt-3 text-display-l">Dai voce al territorio.</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Titoli sempre in minuscolo di frase, mai tutto maiuscolo.
                <br />
                Dopo ogni punto si va a capo.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Testo · Inter 400/600
              </p>
              <p className="mt-3 text-base text-foreground/85">
                Corpo testo a 16 px, interlinea generosa, massimo 70 caratteri per riga.
                <br />
                La parola chiave nei titoli è una sola ed è evidenziata:{" "}
                <span className="im-gradient-text">radio</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Favicon e icone */}
      <section className="container-im section-pad-sm">
        <h2 className="text-h2-im">Favicon e icone app.</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Il set completo è generato dal simbolo, su fondo bianco, con margine del 6%.
          <br />
          Le versioni maskable hanno il 20% di area di sicurezza per Android.
        </p>

        <div className="mt-8 flex flex-wrap items-end gap-6 rounded-3xl border border-border bg-surface-1 p-6">
          {[16, 32, 48, 96, 180].map((s) => (
            <div key={s} className="text-center">
              <img
                src="/icons/favicon-192.png"
                alt={`Favicon IMLAND ${s}×${s}`}
                style={{ width: s, height: s }}
                className="rounded-[18%] border border-border bg-background"
                loading="lazy"
                decoding="async"
              />
              <span className="mt-2 block text-xs text-muted-foreground">{s}px</span>
            </div>
          ))}
          <div className="text-center">
            <img
              src="/icon-maskable-512.png"
              alt="Icona maskable IMLAND"
              className="h-[72px] w-[72px] rounded-full border border-border"
              loading="lazy"
              decoding="async"
            />
            <span className="mt-2 block text-xs text-muted-foreground">maskable</span>
          </div>
        </div>

        <div
          className="mt-6 overflow-x-auto rounded-3xl border border-border"
          tabIndex={0}
          role="region"
          aria-label="Tabella colori del brand"
        >
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-surface-1 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">File</th>
                <th className="px-4 py-3 font-semibold">Dimensione</th>
                <th className="px-4 py-3 font-semibold">Dove viene usato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {ICON_SIZES.map((i) => (
                <tr key={i.file}>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">/{i.file}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.size}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Icone di sezione
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BRANDS.filter((b) => b.key !== "experience").map((b) => (
            <a
              key={b.key}
              href={`/icons/${b.slug}-512.png`}
              download
              className="rounded-3xl border border-border bg-background p-5 text-center transition-colors hover:bg-surface-1"
            >
              <img
                src={`/icons/${b.slug}-192.png`}
                alt={`Icona app ${b.name}`}
                className="mx-auto h-16 w-16 rounded-2xl border border-border"
                loading="lazy"
                decoding="async"
              />
              <span className="mt-3 block text-xs font-semibold text-foreground">{b.name}</span>
              <span className="mt-1 block text-xs text-muted-foreground">192 · 512 · maskable</span>
            </a>
          ))}
        </div>
      </section>

      {/* Mockup */}
      <section className="section-surface section-pad-sm">
        <div className="container-im">
          <h2 className="text-h2-im">Mockup e applicazioni.</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Esempi reali di come il sistema vive su header, app e materiali.
            <br />
            Usali come riferimento prima di produrre qualcosa di nuovo.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {/* Header mockup */}
            <div className="rounded-3xl border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Header del sito
              </p>
              <div className="mt-4 space-y-3">
                {BRANDS.slice(0, 3).map((b) => (
                  <div
                    key={b.key}
                    className="flex items-center justify-between rounded-2xl border border-border bg-surface-1 px-4 py-3"
                  >
                    <img
                      src={sectionLogoUrl(b.slug)}
                      alt={`Header con logo ${b.name}`}
                      className="h-8 w-auto"
                      loading="lazy"
                      decoding="async"
                    />
                    <span
                      className="rounded-full px-3 py-1.5 text-xs font-semibold"
                      style={{ backgroundColor: brandSurface(b), color: b.fg }}
                    >
                      CTA
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Header alto 56 px, logo ritagliato senza margini interni, CTA nel colore della
                sezione.
              </p>
            </div>

            {/* App mockup */}
            <div className="rounded-3xl border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                App e home screen
              </p>
              <div className="mt-4 flex items-center gap-5 rounded-2xl bg-surface-1 p-4">
                <img
                  src={phoneMockup}
                  alt="Mockup dell'app IMLAND su smartphone"
                  className="h-40 w-auto"
                  loading="lazy"
                  decoding="async"
                />
                <div className="grid grid-cols-2 gap-3">
                  {BRANDS.slice(1).map((b) => (
                    <img
                      key={b.key}
                      src={`/icons/${b.slug}-192.png`}
                      alt={`Icona home screen ${b.name}`}
                      className="h-12 w-12 rounded-[22%] border border-border"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Icona sempre su fondo bianco: resta leggibile sia su wallpaper chiari sia scuri.
              </p>
            </div>

            {/* Cover mockup */}
            <div className="rounded-3xl border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Copertine e social
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {BRANDS.slice(1).map((b) => (
                  <div
                    key={b.key}
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl p-3"
                    style={{ backgroundColor: brandSurface(b) }}
                  >
                    <img
                      src={`/brand/mark-${b.slug}.png`}
                      alt={`Copertina ${b.name}`}
                      className="h-9 w-auto"
                      style={
                        b.fg === "#ffffff"
                          ? { filter: "brightness(0) invert(1)" }
                          : { filter: "brightness(0)" }
                      }
                      loading="lazy"
                      decoding="async"
                    />
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.16em]"
                      style={{ color: b.fg }}
                    >
                      {b.slug}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Copertine 1:1, fondo pieno nel colore di sezione, simbolo in bianco e titolo su
                banda chiara.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Do & Don't */}
      <section className="container-im section-pad-sm">
        <h2 className="text-h2-im">Cosa fare e cosa evitare.</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-background p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Check size={18} className="text-[#12a531]" /> Da fare
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {DO.map((d) => (
                <li key={d} className="flex gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-[#12a531]" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-background p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <X size={18} className="text-destructive" /> Da evitare
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {DONT.map((d) => (
                <li key={d} className="flex gap-2">
                  <X size={16} className="mt-0.5 shrink-0 text-destructive" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-im">
        <div className="rounded-3xl border border-border bg-surface-1 p-8 text-center md:p-12">
          <h2 className="text-h2-im">Ti serve un asset che qui non trovi?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Scrivici e prepariamo il file nel formato che ti serve, dal vettoriale per la stampa ai
            template social.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/contatti"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Contattaci
            </Link>
            <Link
              to="/chi-siamo"
              className="inline-flex items-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-surface-1"
            >
              Scopri il progetto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

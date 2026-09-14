import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import logoWhite from "@/assets/imland-logo-white.png.asset.json";

const provinces = ["Vercelli", "Novara", "Biella", "Verbania (VCO)"];

const columns = [
  {
    title: "Esplora",
    links: [
      { to: "/radio", label: "Radio" },
      { to: "/podcast", label: "Podcast" },
      { to: "/eventi", label: "Eventi" },
      { to: "/news", label: "News" },
      { to: "/member", label: "Membri" },
    ],
  },
  {
    title: "Altri prodotti IMLAND",
    links: [
      { to: "/terrain", label: "Terrain" },
      { to: "/jobs", label: "Jobs" },
      { to: "/alert", label: "Alert" },
    ],
  },
  {
    title: "Partecipa",
    links: [
      { to: "/contatti", label: "Proponi una storia" },
      { to: "/contatti", label: "Proponi un podcast" },
      { to: "/contatti", label: "Organizza un evento" },
      { to: "/member", label: "Member" },
      { to: "/contatti", label: "Assistenza ascolto" },
    ],
  },
  {
    title: "Il Progetto",
    links: [
      { to: "/chi-siamo", label: "Chi siamo" },
      { to: "/faq", label: "FAQ" },
      { to: "/brand", label: "Brand & loghi" },
      { to: "/scarica-app", label: "Scarica l'app" },
    ],
  },
  {
    title: "Informazioni",
    links: [
      { to: "/cerca", label: "Cerca sul sito" },
      { to: "/privacy", label: "Privacy" },
      { to: "/cookie", label: "Cookie" },
      { to: "/termini", label: "Termini e condizioni" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer data-surface="dark" className="bg-ink text-white/70">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center md:px-10">
          <div>
            <p className="font-display text-2xl font-bold text-white md:text-3xl">
              Le storie del territorio, nella tua inbox.
            </p>
            <p className="mt-2 max-w-md text-[15px] text-white/75">
              Un riepilogo di radio, podcast ed eventi una volta al mese. Niente spam.
            </p>
          </div>
          <form
            className="flex w-full max-w-md gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="footer-email" className="sr-only">La tua email</label>
            <input
              id="footer-email"
              type="email"
              placeholder="La tua email"
              className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-[15px] text-white placeholder:text-white/70 outline-none focus:border-white/40 focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              className="im-gradient-bg h-12 shrink-0 rounded-full px-6 text-[15px] font-semibold text-white transition-transform active:scale-[0.98]"
            >
              Iscriviti
            </button>
          </form>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 section-pad-sm md:grid-cols-3 lg:grid-cols-6 md:px-10">
        <div className="md:col-span-3 lg:col-span-2">
          <img loading="lazy" decoding="async"
            src={logoWhite.url}
            alt="IMLAND EXPERIENCE"
            className="h-10 w-auto"
            width={1248}
            height={1248}
          />
          <p className="mt-5 max-w-xs text-[15px] text-white/75">
            Dai voce al tuo territorio.
          </p>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/70">
            Radio, podcast, eventi e community delle province di Vercelli, Novara,
            Biella e Verbania.
          </p>
          <Link
            to="/member"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-citrus px-5 py-3 text-[14px] font-semibold text-ink"
          >
            Diventa Partner
          </Link>
        </div>


        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-white/70">
              {col.title}
            </h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-white/70">
            Seguici
          </h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li>
              <a
                href="https://www.instagram.com/imland_radio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
              >
                <Instagram size={18} /> Instagram
              </a>
            </li>
            <li>
              <a
                href="mailto:info@imlandradio.com"
                className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
              >
                <Mail size={18} /> info@imlandradio.com
              </a>
            </li>
            <li>
              <a
                href="tel:+393514323003"
                className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
              >
                <Phone size={18} /> +39 351 432 3003
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Provinces */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-2 gap-y-1 px-4 py-5 text-[13px] text-white/70 md:px-10">
          <span className="mr-1">Siamo nel territorio di</span>
          {provinces.map((p, i) => (
            <span key={p} className="flex items-center gap-2">
              <span className="text-white/75">{p}</span>
              {i < provinces.length - 1 && <span>·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Legal bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-6 text-[13px] text-white/70 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="space-y-1">
            <p className="text-white/75">IMLAND EXPERIENCE SRL · P.IVA 02802650024</p>
            <p>Licenza SIAE 202500000226 · Licenza SCF 116/5/24</p>
            <p>
              Sito Web realizzato da ·{" "}
              <a
                href="https://www.bixont.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 underline underline-offset-2 transition-colors hover:text-white"
              >
                www.bixont.it
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link to="/cookie" className="transition-colors hover:text-white">Cookie</Link>
            <Link to="/termini" className="transition-colors hover:text-white">Termini</Link>
            <Link to="/cookie" className="transition-colors hover:text-white">Preferenze cookie</Link>
          </div>
        </div>
      </div>

      {/* Final message */}
      <div className="mx-auto max-w-[1280px] px-4 pb-10 md:px-10">
        <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-center">
          <div className="im-gradient-rule w-16" />
          <p className="font-display text-lg font-semibold text-white">
            Dai voce al tuo territorio.
          </p>
          <p className="text-[13px] text-white/70">
            © {new Date().getFullYear()} IMLAND EXPERIENCE. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import logoBlack from "@/assets/imland-experience-principale.png";

const provinces = ["Vercelli", "Novara", "Biella", "Verbania (VCO)"];

const themeForLink = (to: string) => {
  if (to.startsWith("/radio")) return "theme-radio";
  if (to.startsWith("/podcast") || to.startsWith("/my-podcast")) return "theme-podcast";
  if (to.startsWith("/eventi")) return "theme-eventi";
  if (to.startsWith("/news")) return "theme-news";
  if (to.startsWith("/member")) return "theme-member";
  return "";
};

const columns = [
  {
    title: "Esplora",
    links: [
      { to: "/radio", label: "Radio" },
      { to: "/podcast", label: "Podcast" },
      { to: "/my-podcast", label: "My Podcast" },
      { to: "/eventi", label: "Eventi" },
      { to: "/news", label: "News" },
      { to: "/member", label: "Partner" },
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
    <footer className="site-footer bg-white text-ink-700">
      {/* Newsletter strip */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-5 px-4 py-8 md:flex-row md:items-center md:px-10">
          <div>
            <p className="font-display text-2xl font-bold text-ink-950 md:text-3xl">
              Le storie del territorio, nella tua inbox.
            </p>
            <p className="mt-2 max-w-md text-[15px] text-ink-600">
              Un riepilogo di radio, podcast ed eventi una volta al mese. Niente spam.
            </p>
          </div>
          <a
            href="#newsletter"
            className="btn-blue inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold transition-transform active:scale-[0.98]"
          >
            Iscriviti
          </a>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 md:grid-cols-3 md:px-10 lg:grid-cols-6">
        <div className="md:col-span-3 lg:col-span-2">
          <img
            loading="lazy"
            decoding="async"
            src={logoBlack}
            alt="IMLAND EXPERIENCE"
            className="h-14 w-auto max-w-[210px] object-contain"
            width={2048}
            height={960}
          />
          <p className="mt-5 max-w-xs text-[15px] text-ink-700">Dai voce al tuo territorio.</p>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink-600">
            Radio, podcast, eventi e community delle province di Vercelli, Novara, Biella e
            Verbania.
          </p>
          <Link
            to="/member"
            className="theme-member mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-citrus px-6 text-[15px] font-semibold text-ink-950"
          >
            Diventa Partner
          </Link>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink-950">
              {col.title}
            </h2>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className={`${themeForLink(l.to)} text-ink-600 transition-colors hover:text-signal`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink-950">
            Seguici
          </h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li>
              <a
                href="https://www.facebook.com/imlandradio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink-600 transition-colors hover:text-im-blue"
              >
                <Facebook size={18} /> Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/imland-experience/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink-600 transition-colors hover:text-im-blue"
              >
                <Linkedin size={18} /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/imland_radio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink-600 transition-colors hover:text-im-blue"
              >
                <Instagram size={18} /> Instagram
              </a>
            </li>
            <li>
              <a
                href="mailto:info@imlandradio.com"
                className="inline-flex items-center gap-2 text-ink-600 transition-colors hover:text-im-blue"
              >
                <Mail size={18} /> info@imlandradio.com
              </a>
            </li>
            <li>
              <a
                href="tel:+393514323003"
                className="inline-flex items-center gap-2 text-ink-600 transition-colors hover:text-im-blue"
              >
                <Phone size={18} /> +39 351 432 3003
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Provinces */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-2 gap-y-1 px-4 py-4 text-[13px] text-ink-600 md:px-10">
          <span className="mr-1">Siamo nel territorio di</span>
          {provinces.map((p, i) => (
            <span key={p} className="flex items-center gap-2">
              <span className="text-ink-700">{p}</span>
              {i < provinces.length - 1 && <span>·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Legal bottom */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-5 text-[13px] text-ink-600 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="space-y-1">
            <p className="text-ink-700">IMLAND EXPERIENCE SRL · P.IVA 02802650024</p>
            <p>Licenza SIAE 202500000226 · Licenza SCF 116/5/24</p>
            <p>
              Sito Web realizzato da ·{" "}
              <a
                href="https://www.bixont.it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-700 underline underline-offset-2 transition-colors hover:text-im-blue"
              >
                www.bixont.it
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-im-blue">
              Privacy
            </Link>
            <Link to="/cookie" className="transition-colors hover:text-im-blue">
              Cookie
            </Link>
            <Link to="/termini" className="transition-colors hover:text-im-blue">
              Termini
            </Link>
            <Link to="/cookie" className="transition-colors hover:text-im-blue">
              Preferenze cookie
            </Link>
          </div>
        </div>
      </div>

      {/* Final message */}
      <div className="mx-auto max-w-[1280px] px-4 pb-6 md:px-10">
        <div className="flex flex-col items-center gap-3 border-t border-border pt-6 text-center">
          <div className="im-gradient-rule w-16" />
          <p className="font-display text-lg font-semibold text-ink-950">
            Dai voce al tuo territorio.
          </p>
          <p className="text-[13px] text-ink-600">
            © {new Date().getFullYear()} IMLAND EXPERIENCE. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}

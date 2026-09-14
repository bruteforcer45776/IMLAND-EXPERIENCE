import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Search, ChevronDown, Radio, ArrowRight, LogOut, LayoutGrid } from "lucide-react";
import { usePlayer } from "@/components/player-context";


import { getSectionConfig } from "@/config/sections";
import { ServiceLauncher } from "@/components/system/service-launcher";
import { WHATSAPP_MEMBER_URL } from "@/lib/whatsapp";
import { useAuth } from "@/hooks/use-auth";

function useCurrentSection() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return getSectionConfig(pathname);
}

type NavItem = {
  to: string;
  label: string;
  children?: { to: string; label: string; desc: string }[];
};

const nav: NavItem[] = [
  { to: "/radio", label: "Radio" },
  { to: "/podcast", label: "Podcast" },
  { to: "/eventi", label: "Eventi" },
  { to: "/member", label: "Membri" },
  {
    to: "/chi-siamo",
    label: "Il progetto",
    children: [
      { to: "/chi-siamo", label: "Chi siamo", desc: "Manifesto, storia e team" },
      { to: "/news", label: "News", desc: "Le ultime voci dal territorio" },
      { to: "/contatti", label: "Contatti", desc: "Scrivici o collabora con noi" },
      { to: "/faq", label: "FAQ", desc: "Risposte alle domande frequenti" },
      { to: "/brand", label: "Brand & loghi", desc: "Loghi e linee guida ufficiali" },
      { to: "/scarica-app", label: "Scarica l'app", desc: "IMLAND sempre con te" },
    ],
  },
];

const mobileLinks = [
  { to: "/", label: "Home" },
  { to: "/radio", label: "Radio" },
  { to: "/podcast", label: "Podcast" },
  { to: "/eventi", label: "Eventi" },
  { to: "/news", label: "News" },
  { to: "/member", label: "Membri" },
  { to: "/chi-siamo", label: "Il progetto" },
  { to: "/contatti", label: "Contatti" },
  { to: "/faq", label: "FAQ" },
];


export function SiteHeader() {
  const section = useCurrentSection();
  const logo = section.logo;
  const navigate = useNavigate();
  const { playing } = usePlayer();
  const [open, setOpen] = useState(false);
  const [launcher, setLauncher] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { user, profile, signOut } = useAuth();

  const accountName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    user?.email?.split("@")[0] ||
    "Il mio account";
  const accountInitials = accountName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate({ to: "/accedi", replace: true });
  };


  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    setOpen(false);
    setQuery("");
    navigate({ to: "/cerca", search: { q } });
  };


  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-medium ${
          scrolled
            ? "bg-white/92 shadow-[0_1px_3px_rgba(16,17,20,0.06)] backdrop-blur-xl"
            : "bg-white/80 backdrop-blur-md"
        }`}
        style={{
          // banda contestuale: assume il colore della verticale corrente
          borderBottom: `2px solid ${section.key === "default" ? "var(--border)" : section.theme.signal}`,
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4 md:h-[72px] md:px-10">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
            <img loading="lazy" decoding="async"
              src={logo.url}
              alt={logo.alt}
              className="h-10 w-auto md:h-11"
              width={1000}
              height={500}
            />

          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex xl:items-center xl:gap-0.5" aria-label="Navigazione principale">
            {nav.map((item) => (
              <div key={item.to} className="relative" onMouseLeave={() => setDropdown(null)}>
                {item.children ? (
                  <button
                    onClick={() => setDropdown(dropdown === item.to ? null : item.to)}
                    onMouseEnter={() => setDropdown(item.to)}
                    aria-expanded={dropdown === item.to}
                    aria-haspopup="true"
                    className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-semibold text-ink-600 transition-colors hover:bg-muted hover:text-ink-800"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-fast ${dropdown === item.to ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className="relative inline-flex items-center rounded-full px-4 py-2 text-[15px] font-semibold text-ink-600 transition-colors hover:bg-muted hover:text-ink-800"
                    activeProps={{ className: "text-ink-950" }}
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && (
                  <div
                    className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-fast ${
                      dropdown === item.to
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0"
                    }`}
                  >
                    <div className="w-[320px] rounded-[20px] border border-border bg-white p-2 shadow-[var(--elevation-2)]">
                      {item.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          onClick={() => setDropdown(null)}
                          className="flex flex-col rounded-2xl px-4 py-3 transition-colors hover:bg-muted"
                        >
                          <span className="text-[15px] font-semibold text-ink-950">{c.label}</span>
                          <span className="mt-0.5 text-[13px] text-ink-600">{c.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <form onSubmit={submitSearch} role="search" className="hidden items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 lg:flex">
              <Search size={18} className="shrink-0 text-ink-400" aria-hidden />
              <label htmlFor="header-search" className="sr-only">Cerca su IMLAND</label>
              <input
                id="header-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca podcast, eventi, news…"
                className="h-8 w-[210px] bg-transparent text-[14px] outline-none placeholder:text-ink-400"
                autoComplete="off"
              />
            </form>

            <Link
              to="/cerca"
              aria-label="Cerca"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-muted md:h-11 md:w-11 lg:hidden"
            >
              <Search size={22} />
            </Link>

            <Link
              to="/radio"
              data-surface="dark"
              className="hidden items-center gap-2 rounded-full btn-blue px-5 py-2.5 text-[14px] md:inline-flex"
            >
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--error)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--error)]" />
              </span>

              {playing ? "ON AIR" : "Ascolta live"}
            </Link>

            {/* Launcher dei servizi (stile Google Apps) */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setLauncher((v) => !v)}
                aria-label="Tutti i servizi IMLAND"
                aria-expanded={launcher}
                aria-haspopup="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-muted"
              >
                <LayoutGrid size={22} />
              </button>
              {launcher && (
                <>
                  <div className="fixed inset-0 z-0" onClick={() => setLauncher(false)} aria-hidden />
                  <div className="absolute right-0 top-full z-10 mt-3 w-[min(92vw,560px)] animate-enter rounded-[24px] border border-border bg-white p-4 shadow-[var(--elevation-2)]">
                    <p className="mb-3 text-caption-im font-semibold uppercase tracking-wide text-muted-foreground">
                      I servizi IMLAND
                    </p>
                    <ServiceLauncher onNavigate={() => setLauncher(false)} />
                  </div>
                </>
              )}
            </div>





            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-950 transition-colors hover:bg-muted md:h-11 md:w-11"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-height panel: montato solo quando aperto, così
          nessun link resta focalizzabile a menu chiuso. */}
      {open && (
      <div className="fixed inset-0 z-50 pointer-events-auto opacity-100 animate-enter">
        <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
        <aside
          className={`absolute inset-x-0 top-0 bottom-0 flex h-full flex-col bg-white transition-transform duration-300 ease-out lg:left-auto lg:w-[420px] lg:max-w-[92vw] lg:border-l lg:border-border ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
          data-full-panel
          role="dialog"
          aria-label="Menu di navigazione"
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <div className="flex items-center">
              <img loading="lazy" decoding="async" src={logo.url} alt={logo.alt} className="h-10 w-auto" width={1000} height={500} />
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Chiudi menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-950 transition-colors hover:bg-muted md:h-11 md:w-11"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <form onSubmit={submitSearch} role="search" className="flex items-center gap-3 px-4 py-3">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-border bg-muted px-4 py-2.5">
              <Search size={20} className="shrink-0 text-ink-400" aria-hidden />
              <label htmlFor="menu-search" className="sr-only">Cerca su IMLAND</label>
              <input
                id="menu-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca radio, podcast, eventi…"
                className="h-7 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-400"
                autoComplete="off"
              />
            </div>
          </form>


          <nav className="scrollbar-imland flex-1 overflow-y-auto px-4 py-2" aria-label="Navigazione mobile">
            {mobileLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-3 py-3 text-[16px] font-semibold text-ink-950 transition-colors hover:bg-muted md:px-4 md:py-3.5 md:text-[17px]"
              >
                {item.label}
                <ArrowRight className="h-5 w-5 text-ink-400" />
              </Link>
            ))}
          </nav>

          <div className="space-y-3 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Link
              to="/radio"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full btn-blue px-5 py-3 text-[14px] md:py-3.5 md:text-[15px]"
            >
              <Radio size={18} />
              Ascolta live
            </Link>
            {user ? (
              <div className="rounded-3xl border border-border bg-white p-4">
                <Link
                  to="/ascoltatore/profilo"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--im-blue)]"
                >
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-inset ring-border">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={accountName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[15px] font-semibold text-ink-600">
                        {accountInitials}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-ink-950">{accountName}</p>
                    <p className="truncate text-[13px] text-ink-600">{user.email}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-[14px] font-semibold text-ink-950 transition-colors hover:bg-muted md:py-3.5 md:text-[15px]"
                >
                  <LogOut className="h-4 w-4" />
                  Esci
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/accedi"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-full btn-liquid px-5 py-3 text-[14px] md:py-3.5 md:text-[15px]"
              >
                Accedi
              </Link>
              <a
                href={WHATSAPP_MEMBER_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-[14px] font-semibold text-ink-950 md:py-3.5 md:text-[15px]"
              >
                Diventa membro
              </a>
            </div>
            )}
            <div className="flex justify-center gap-4 pt-1 text-[13px] text-ink-600">
              <Link to="/privacy" onClick={() => setOpen(false)}>Privacy</Link>
              <Link to="/termini" onClick={() => setOpen(false)}>Termini</Link>
              <Link to="/contatti" onClick={() => setOpen(false)}>Contatti</Link>
            </div>
          </div>
        </aside>
      </div>
      )}
    </>
  );
}

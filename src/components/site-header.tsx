import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Search, ChevronDown, Download, LogOut } from "lucide-react";

import { getSectionConfig } from "@/config/sections";
import { WHATSAPP_MEMBER_URL } from "@/lib/whatsapp";
import { useAuth } from "@/hooks/use-auth";
import { usePlayer } from "./player-context";

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
  { to: "/", label: "Home" },
  { to: "/chi-siamo", label: "Il Progetto" },
  { to: "/radio", label: "Radio" },
  {
    to: "/podcast",
    label: "Podcast",
    children: [
      { to: "/podcast", label: "Podcast", desc: "I format editoriali e tutte le puntate IMLAND." },
      {
        to: "/my-podcast",
        label: "My Podcast",
        desc: "Podcast su misura per aziende e organizzazioni.",
      },
    ],
  },
  { to: "/eventi", label: "Eventi" },
  { to: "/news", label: "News" },
  { to: "/member", label: "Members" },
  { to: "/contatti", label: "Contatti" },
  { to: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const section = useCurrentSection();
  const logo = section.logo;
  const navigate = useNavigate();
  const { menuOpen: open, setMenuOpen: setOpen } = usePlayer();
  const [scrolled, setScrolled] = useState(false);
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
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <>
      <header
        data-scrolled={scrolled ? "true" : "false"}
        className={`site-glass-header fixed inset-x-0 top-0 z-40 transition-all duration-medium ${
          scrolled
            ? "shadow-[0_12px_36px_rgba(0,0,0,0.22)]"
            : "shadow-[0_6px_24px_rgba(0,0,0,0.12)]"
        }`}
        style={{
          // banda contestuale: assume il colore della verticale corrente
          borderBottom: `2px solid ${section.key === "default" ? "var(--border)" : section.theme.signal}`,
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-4 md:h-[72px] md:px-10">
          {/* Logo */}
          <Link
            to="/"
            aria-label="IMLAND EXPERIENCE — Home"
            className="flex shrink-0 items-center"
            onClick={() => setOpen(false)}
          >
            <img
              loading="lazy"
              decoding="async"
              src={logo.url}
              alt={logo.alt}
              className="header-logo-total-black h-10 w-auto max-w-[108px] object-contain min-[380px]:max-w-[135px] md:h-12 md:max-w-[190px]"
              width={2048}
              height={960}
            />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <Link
              to="/scarica-app"
              className="btn-blue inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[12px] min-[380px]:px-4 min-[380px]:text-[13px] md:h-11 md:gap-2 md:px-5 md:text-[14px]"
            >
              <Download size={17} aria-hidden />
              <span>Scarica l'app</span>
            </Link>

            <Link
              to="/cerca"
              aria-label="Cerca"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white md:h-11 md:w-11"
            >
              <Search size={22} />
            </Link>

            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:h-11 md:w-11"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Pannello compatto ancorato all'header su ogni breakpoint. */}
      {open && (
        <div className="fixed inset-0 z-[80] pointer-events-auto opacity-100 animate-enter">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-black/25"
            aria-label="Chiudi menu"
            onClick={() => setOpen(false)}
          />
          <aside
            className="site-menu-glass absolute right-3 top-[calc(4.5rem+env(safe-area-inset-top))] z-10 flex max-h-[calc(100dvh-5.5rem-env(safe-area-inset-top))] w-[min(26.25rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[24px] border border-white/70 bg-white/95 shadow-[0_22px_56px_rgba(1,29,104,0.18)] backdrop-blur-xl md:right-5 md:top-[calc(5rem+env(safe-area-inset-top))]"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <div className="flex items-center">
                <img
                  loading="lazy"
                  decoding="async"
                  src={logo.url}
                  alt={logo.alt}
                  className="header-logo-total-black h-10 w-auto max-w-[170px] object-contain"
                  width={2048}
                  height={960}
                />
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Chiudi menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-950 transition-colors hover:bg-muted md:h-11 md:w-11"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={submitSearch}
              role="search"
              className="flex items-center gap-3 px-4 py-3"
            >
              <div className="flex flex-1 items-center gap-3 rounded-full border border-border bg-muted px-4 py-2.5">
                <Search size={20} className="shrink-0 text-ink-400" aria-hidden />
                <label htmlFor="menu-search" className="sr-only">
                  Cerca su IMLAND
                </label>
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

            <nav
              className="scrollbar-imland flex-1 overflow-y-auto px-4 py-2"
              aria-label="Navigazione mobile"
            >
              {nav.map((item) =>
                item.children ? (
                  <details key={item.to} className="group rounded-2xl">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl px-3 py-3 text-[16px] font-semibold text-ink-950 marker:hidden hover:bg-muted md:px-4 md:py-3.5 md:text-[17px]">
                      {item.label}
                      <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mx-3 mb-2 grid gap-1 border-l border-border pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpen(false)}
                          className="rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink-800 hover:bg-muted"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center rounded-2xl px-3 py-3 text-[16px] font-semibold text-ink-950 transition-colors hover:bg-muted md:px-4 md:py-3.5 md:text-[17px]"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="space-y-3 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <a
                href={WHATSAPP_MEMBER_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="theme-member flex w-full items-center justify-center rounded-full bg-signal px-5 py-3 text-[15px] font-bold text-ink-950 md:py-3.5"
              >
                Sei un’azienda? Diventa Member
              </a>
              <Link
                to="/scarica-app"
                onClick={() => setOpen(false)}
                className="btn-blue flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-bold md:py-3.5"
              >
                <Download size={18} aria-hidden /> Scarica l'app
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
                      <p className="truncate text-[15px] font-semibold text-ink-950">
                        {accountName}
                      </p>
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
                <div className="flex justify-center">
                  <Link
                    to="/accedi"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-[14px] font-semibold text-ink-700 underline underline-offset-4"
                  >
                    Accedi
                  </Link>
                </div>
              )}
              <div className="flex justify-center gap-4 text-[13px] text-ink-600">
                <Link to="/brand" onClick={() => setOpen(false)}>
                  Brand &amp; loghi
                </Link>
                <Link to="/scarica-app" onClick={() => setOpen(false)}>
                  Scarica l'app
                </Link>
              </div>
              <div className="flex justify-center gap-4 pt-1 text-[13px] text-ink-600">
                <Link to="/privacy" onClick={() => setOpen(false)}>
                  Privacy
                </Link>
                <Link to="/termini" onClick={() => setOpen(false)}>
                  Termini
                </Link>
                <Link to="/contatti" onClick={() => setOpen(false)}>
                  Contatti
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

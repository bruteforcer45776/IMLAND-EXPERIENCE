import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { RadioPlayer } from "../components/radio-player";
import { OnboardingRedirect } from "../components/onboarding-redirect";
import { PlayerProvider } from "../components/player-context";
import { StickyActions } from "../components/sticky-actions";
import { MobileBottomNav } from "../components/system/mobile-bottom-nav";


import { CookieBanner } from "../components/cookie-banner";
import { DownloadAppPopup } from "../components/download-app-popup";
import { FeedbackPopup } from "../components/feedback-popup";
import { Toaster } from "sonner";
import { AuthProvider } from "../hooks/use-auth";
import { getSectionConfig, sectionCssVars } from "../config/sections";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display-l text-foreground">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Questa pagina si è persa nel cielo.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-h1-im text-foreground">
          Qualcosa è andato storto
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Riprova o torna alla home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Riprova
          </button>
          <a href="/" className="rounded-full border border-border bg-background px-5 py-2 text-sm font-medium hover:bg-muted">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IMLAND EXPERIENCE — Dai voce al tuo territorio" },
      { name: "description", content: "Hub territoriale che raccoglie radio, podcast, eventi e community locale. Dai voce al tuo territorio." },
      { property: "og:title", content: "IMLAND EXPERIENCE — Dai voce al tuo territorio" },
      { property: "og:description", content: "Hub territoriale che raccoglie radio, podcast, eventi e community locale. Dai voce al tuo territorio." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "IMLAND EXPERIENCE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "IMLAND EXPERIENCE — Dai voce al tuo territorio" },
      { name: "twitter:description", content: "Hub territoriale che raccoglie radio, podcast, eventi e community locale. Dai voce al tuo territorio." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/P0C1ClGWD4YD0lkRvi88JtyEBWr2/social-images/social-1783652683370-Gemini_Generated_Image_7lk1k17lk1k17lk1-removebg-preview.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/P0C1ClGWD4YD0lkRvi88JtyEBWr2/social-images/social-1783652683370-Gemini_Generated_Image_7lk1k17lk1k17lk1-removebg-preview.webp" },
      { name: "theme-color", content: "#ffffff" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "IMLAND" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/icons/favicon-16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/icons/favicon-48.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/icons/favicon-96.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },

      { rel: "preconnect", href: "https://imlandradio.it", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://imlandradio.it" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@1,500;1,600&family=Instrument+Serif:ital@1&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@1,500;1,600&family=Instrument+Serif:ital@1&display=swap",
      },

    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function useSectionTheme() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return getSectionConfig(pathname);
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const section = useSectionTheme();
  const editorialFrame =
    section.key === "eventi"
      ? { tone: "green", src: "/backgrounds/imland-frame-green.png" }
      : section.key === "member"
        ? { tone: "yellow", src: "/backgrounds/imland-frame-yellow.png" }
        : section.key === "news"
          ? { tone: "red", src: "/backgrounds/imland-frame-red.png" }
          : { tone: "blue", src: "/backgrounds/imland-frame-blue.png" };
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlayerProvider>
          <div
            data-section={section.key}
            data-editorial-frame={editorialFrame.tone}
            style={sectionCssVars(section)}
            className="imland-night site-bg editorial-frame-page min-h-screen bg-transparent text-foreground"
          >
            <div className="editorial-frame-backdrop" aria-hidden="true">
              <img src={editorialFrame.src} alt="" />
            </div>

            <div className="editorial-frame-canvas">
              <a href="#main-content" className="skip-link">Salta al contenuto</a>
              <SiteHeader />
              <main id="main-content" className="relative flex-1 pt-[66px] pb-app-nav md:pt-[74px] md:pb-0">
                <Outlet />
              </main>

              <SiteFooter />
              <RadioPlayer />
              <MobileBottomNav />
              <StickyActions />
              <CookieBanner />
              <DownloadAppPopup />
              <FeedbackPopup />
              <OnboardingRedirect />
              <Toaster position="top-center" richColors closeButton />
            </div>
          </div>
        </PlayerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

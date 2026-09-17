import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const LEGACY_REDIRECTS: Record<string, string> = {
  "/home-imland-radio": "/",
  "/programmi-della-settimana": "/radio",
  "/custom-player": "/radio",
  "/imland-radio-team": "/chi-siamo",
  "/team-members": "/chi-siamo",
  "/la-storia-imland-radio": "/chi-siamo",
  "/la-storia": "/chi-siamo",
  "/podcast-imland-radio": "/podcast",
  "/podcast-imland-radio/grigliata-mista-podcast": "/podcast/grigliata-mista",
  "/podcast-imland-radio/stuzzicaziende-podcast": "/podcast/stuzzicaziende",
  "/podcast-imland-radio/istruzioni-per-l-uso-podcast": "/podcast/istruzioni-per-l-uso",
  "/podcast-imland-radio/schema-libero-podcast": "/podcast",
  "/podcast-imland-radio/terra-di-diamanti-podcast": "/podcast/terra-di-diamanti",
  "/podcast-imland-radio/imweekend-podcast": "/podcast",
  "/podcast-imland-radio/assaggi-podcast-imland": "/podcast/assaggi",
  "/podcast-imland-radio/carta-canta-podcast": "/podcast/carta-canta",
  "/podcast-imland-radio/tedx-biella-2025": "/my-podcast",
  "/podcast-imland-radio/mirabilis-podcast": "/my-podcast",
  "/members-wall": "/member",
  "/diventa-member": "/member",
  "/events-archive": "/eventi",
  "/events-page-elementor": "/eventi",
  "/blog-grid": "/news",
  "/blog-no-sidebar": "/news",
  "/blog-grid-sidebar": "/news",
  "/blog-horizontal": "/news",
  "/blog-masonry": "/news",
  "/blog-sidebar": "/news",
  "/social-media": "/contatti",
  "/merchandising": "/member",
  "/privacy-policy": "/privacy",
  "/cookie-policy": "/cookie",
};

function legacyRedirect(request: Request): Response | undefined {
  if (request.method !== "GET" && request.method !== "HEAD") return;
  const url = new URL(request.url);
  const normalizedPath = url.pathname !== "/" ? url.pathname.replace(/\/+$/, "") : "/";
  const destination = LEGACY_REDIRECTS[normalizedPath];
  if (!destination) return;

  const target = new URL(destination, "https://www.imlandradio.it");
  target.search = url.search;
  return Response.redirect(target.toString(), 301);
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

const IMMUTABLE_ASSET_RE =
  /^\/(?:assets|icons|logos|brand|__l5e\/assets-v1)\/.+\.(?:avif|webp|png|jpe?g|gif|svg|ico|css|js|mjs|woff2?)$/i;
const PUBLIC_STATIC_RE =
  /^\/(?:favicon\.ico|favicon\.png|apple-touch-icon\.png|icon-\d+\.png|icon-maskable-\d+\.png|manifest\.webmanifest|robots\.txt|sitemap\.xml|llms\.txt)$/i;
const PUBLIC_MEDIA_RE =
  /^\/(?:backgrounds|hero-carousel|podcast-covers)\/.+\.(?:avif|webp|png|jpe?g|gif|svg)$/i;

function withPerformanceHeaders(request: Request, response: Response): Response {
  const url = new URL(request.url);
  const headers = new Headers(response.headers);

  headers.set("x-content-type-options", "nosniff");

  if (response.status >= 200 && response.status < 400) {
    if (IMMUTABLE_ASSET_RE.test(url.pathname)) {
      headers.set("cache-control", "public, max-age=31536000, immutable");
    } else if (PUBLIC_STATIC_RE.test(url.pathname) || PUBLIC_MEDIA_RE.test(url.pathname)) {
      headers.set("cache-control", "public, max-age=86400, stale-while-revalidate=604800");
    } else if (url.pathname.startsWith("/_server/") || url.pathname.startsWith("/_build/")) {
      headers.set("cache-control", "public, max-age=31536000, immutable");
    } else if (request.method === "GET" && response.headers.get("content-type")?.includes("text/html")) {
      headers.set("cache-control", "public, max-age=60, stale-while-revalidate=300");
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const redirectResponse = legacyRedirect(request);
      if (redirectResponse) return redirectResponse;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return withPerformanceHeaders(request, normalized);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

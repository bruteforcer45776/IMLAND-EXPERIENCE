import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { requireAdmin } from "@/lib/admin-guard";
import { describeError } from "@/lib/errors";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: () => requireAdmin(),
  head: () => ({
    meta: [
      { title: "Pannello admin — IMLAND EXPERIENCE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  errorComponent: AdminError,
  component: () => <Outlet />,
});

function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 section-pad text-center">
      <h1 className="text-h1-im">Area admin non disponibile.</h1>
      <p className="mt-3 text-muted-foreground">{describeError(error)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Riprova
        </button>
        <Link to="/" className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-medium">
          Torna alla home
        </Link>
      </div>
    </div>
  );
}

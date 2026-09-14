import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { resolveShare } from "@/lib/shares.functions";

export const Route = createFileRoute("/s/$token")({
  loader: async ({ params }) => {
    const result = await resolveShare({ data: { token: params.token } });
    if (result.found) throw redirect({ href: result.linkUrl });
    return { found: false as const };
  },
  head: () => ({
    meta: [
      { title: "Link non valido — IMLAND EXPERIENCE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  errorComponent: InvalidShare,
  notFoundComponent: InvalidShare,
  component: InvalidShare,
});

function InvalidShare() {
  return (
    <div className="container-im py-20 text-center">
      <h1 className="text-display-s">Questo link non è più valido.</h1>
      <p className="mt-3 text-muted-foreground">
        La puntata potrebbe essere stata spostata.
        <br />
        Trovi tutti i programmi nell'archivio podcast.
      </p>
      <Link
        to="/podcast"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white"
      >
        Vai ai podcast
      </Link>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { canonical } from "../lib/seo";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News in arrivo — IMLAND EXPERIENCE" },
      { name: "description", content: "Stiamo lavorando per selezionare le migliori testate e notizie da ricondividere." },
    ],
    links: [canonical("/news")],
  }),
  component: NewsPage,
});

function NewsPage() {
  return (
    <main className="container-im flex min-h-[calc(100svh-12rem)] items-center justify-center section-pad">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-display-m text-ink-950">NEWS IN ARRIVO</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-950 sm:text-lg">
          Stiamo lavorando per selezionare le migliori testate e le notizie più interessanti da
          ricondividere con il territorio.
        </p>
      </div>
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";

import { BusinessShell } from "@/components/member/business-shell";
import { BentoGrid, BentoCard } from "@/components/bento";

export const Route = createFileRoute("/_authenticated/area-aziende/materiali")({
  head: () => ({
    meta: [
      { title: "Materiali e loghi — Area Aziende IMLAND" },
      {
        name: "description",
        content: "Loghi e materiali ufficiali IMLAND per le aziende partner.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MaterialiPage,
});

const kits = [
  { slug: "experience", label: "IMLAND EXPERIENCE" },
  { slug: "radio", label: "IMLAND RADIO" },
  { slug: "podcast", label: "IMLAND PODCAST" },
  { slug: "eventi", label: "IMLAND EVENTI" },
  { slug: "news", label: "IMLAND NEWS" },
  { slug: "member", label: "IMLAND MEMBER" },
] as const;

function MaterialiPage() {
  return (
    <BusinessShell
      title="Materiali e loghi."
      lead="Formati ufficiali pronti per stampa, web e social. Usa i loghi senza modificarne colori e proporzioni."
    >
      <BentoGrid>
        {kits.map((k) => (
          <BentoCard key={k.slug} tone="aziende" span={2}>
            <div className="flex h-20 items-center justify-center rounded-2xl bg-surface-1 p-3">
              <img
                src={`/brand/imland-${k.slug}.webp`}
                alt={k.label}
                loading="lazy"
                decoding="async"
                className="max-h-14 w-auto object-contain"
              />
            </div>
            <h2 className="mt-4 text-h3-im">{k.label}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`/brand/imland-${k.slug}.webp`}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-1"
              >
                <Download size={14} /> WebP
              </a>
              <a
                href={`/brand/imland-${k.slug}.png`}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-1"
              >
                <Download size={14} /> PNG
              </a>
              <a
                href={`/brand/mark-${k.slug}.png`}
                download
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-1"
              >
                <Download size={14} /> Simbolo
              </a>
            </div>
          </BentoCard>
        ))}

        <BentoCard tone="aziende" span={6}>
          <h2 className="text-h3-im">Linee guida complete</h2>
          <p className="mt-2 text-muted-foreground">
            Spaziature, usi corretti e palette sono descritti nella pagina Brand pubblica.
          </p>
          <Link
            to="/brand"
            className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-signal"
          >
            Apri le linee guida <ArrowRight size={18} />
          </Link>
        </BentoCard>
      </BentoGrid>
    </BusinessShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { BentoCard, BentoGrid } from "@/components/bento";
import { shareUrl, useShares } from "@/hooks/use-listener";

export const Route = createFileRoute("/_authenticated/ascoltatore/condivisioni")({
  head: () => ({
    meta: [
      { title: "Condivisioni — Area Persona IMLAND" },
      { name: "description", content: "Le puntate che hai condiviso con amici, clienti e la tua rete." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CondivisioniPage,
});

function CondivisioniPage() {
  const { shares, totalClicks } = useShares();

  const copy = async (token: string) => {
    await navigator.clipboard.writeText(shareUrl(token));
    toast.success("Link copiato negli appunti.");
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-signal">Condivisioni</p>
      <h1 className="mt-2 text-display-s">Le puntate che hai condiviso.</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {shares.length} puntate condivise · {totalClicks} persone raggiunte.
      </p>

      {shares.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-muted-foreground">
          Non hai ancora condiviso puntate. Usa il pulsante “Condividi” su una puntata.
        </div>
      ) : (
        <BentoGrid className="mt-8">
          {shares.map((share) => (
            <BentoCard key={share.id} tone="podcast" span={3}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {share.click_count} persone raggiunte
              </p>
              <h2 className="mt-2 text-title-m">{share.title}</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Creato il {new Date(share.created_at).toLocaleDateString("it-IT")}
                {share.last_click_at && ` · ultima apertura ${new Date(share.last_click_at).toLocaleDateString("it-IT")}`}
              </p>
              <p className="mt-3 truncate rounded-full border border-border bg-muted px-4 py-2 text-xs">
                {shareUrl(share.token)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copy(share.token)}
                  className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-white"
                >
                  <Copy className="h-3.5 w-3.5" /> Copia
                </button>
                <a
                  href={share.link_url}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Apri puntata
                </a>
              </div>
            </BentoCard>
          ))}
        </BentoGrid>
      )}
    </div>
  );
}

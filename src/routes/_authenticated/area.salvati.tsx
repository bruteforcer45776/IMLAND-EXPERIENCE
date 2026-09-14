import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { AreaShell, EmptyState } from "@/components/member/area-shell";
import { useFavorites } from "@/hooks/use-favorites";
import { formatDate } from "@/lib/member-area";

export const Route = createFileRoute("/_authenticated/area/salvati")({
  head: () => ({
    meta: [
      { title: "Salvati — IMLAND EXPERIENCE" },
      { name: "description", content: "Eventi, vantaggi e contenuti che hai salvato nell'Area Membri IMLAND." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SalvatiPage,
});

function SalvatiPage() {
  const { favorites, isLoading, toggle } = useFavorites();

  return (
    <AreaShell title="Salvati." lead="Tutto quello che hai messo da parte, in un unico posto.">
      {isLoading ? (
        <EmptyState text="Caricamento…" />
      ) : favorites.length === 0 ? (
        <EmptyState text="Non hai ancora salvato nulla. Usa il cuore sulle schede." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {favorites.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {f.item_type}
                </span>
                <p className="mt-2 truncate font-medium">{f.label ?? "Elemento salvato"}</p>
                <p className="text-xs text-muted-foreground">Salvato il {formatDate(f.created_at)}</p>
                {f.link_url && (
                  <a href={f.link_url} target="_blank" rel="noreferrer" className="text-sm text-primary">
                    Apri
                  </a>
                )}
              </div>
              <button
                onClick={() => toggle.mutate({ item_id: f.item_id, item_type: f.item_type })}
                aria-label="Rimuovi"
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </AreaShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download, Heart, Lock } from "lucide-react";

import { AreaShell, EmptyState } from "@/components/member/area-shell";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/use-favorites";
import { EXCLUSIVE_TYPES, formatDateTime } from "@/lib/member-area";
import { BentoGrid, BentoCard } from "../../components/bento";

export const Route = createFileRoute("/_authenticated/area/esclusivi")({
  head: () => ({
    meta: [
      { title: "Contenuti esclusivi — IMLAND EXPERIENCE" },
      {
        name: "description",
        content: "Podcast, backstage e materiali riservati alla community Member IMLAND.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EsclusiviPage,
});

function EsclusiviPage() {
  const [type, setType] = useState("Tutti");
  const { isFavorite, toggle } = useFavorites();

  const { data = [], isLoading } = useQuery({
    queryKey: ["exclusive-contents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exclusive_contents")
        .select("*")
        .order("publish_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const visible = data.filter((c) => new Date(c.publish_at).getTime() <= Date.now());
  const filtered = type === "Tutti" ? visible : visible.filter((c) => c.content_type === type);

  return (
    <AreaShell
      title="Contenuti esclusivi."
      lead="Materiali riservati: solo per chi è dentro la community."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {["Tutti", ...EXCLUSIVE_TYPES].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              type === t
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <EmptyState text="Caricamento…" />
      ) : filtered.length === 0 ? (
        <EmptyState text="Nessun contenuto esclusivo disponibile." />
      ) : (
        <BentoGrid>
          {filtered.map((c) => (
            <BentoCard key={c.id} tone="member" span={3} className="!p-0 overflow-hidden block">
              {c.cover_url && (
                <img
                  src={c.cover_url}
                  alt={c.title}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Lock size={12} /> {c.content_type}
                  </span>
                  <button
                    onClick={() =>
                      toggle.mutate({ item_id: c.id, item_type: "contenuto", label: c.title })
                    }
                    aria-label="Salva"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Heart
                      size={18}
                      fill={isFavorite(c.id, "contenuto") ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <h2 className="mt-3 text-h3-im">{c.title}</h2>
                {c.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
                )}
                {c.body && <p className="mt-3 whitespace-pre-line text-sm">{c.body}</p>}
                <div className="mt-4 flex flex-wrap gap-3">
                  {c.media_url && (
                    <a
                      href={c.media_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Ascolta / guarda
                    </a>
                  )}
                  {c.download_url && (
                    <a
                      href={c.download_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium"
                    >
                      <Download size={14} /> Scarica
                    </a>
                  )}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Pubblicato {formatDateTime(c.publish_at)}
                </p>
              </div>
            </BentoCard>
          ))}
        </BentoGrid>
      )}
    </AreaShell>
  );
}

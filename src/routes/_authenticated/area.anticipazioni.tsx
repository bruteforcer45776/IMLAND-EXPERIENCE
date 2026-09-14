import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Clock, Heart } from "lucide-react";

import { AreaShell, EmptyState } from "@/components/member/area-shell";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/use-favorites";
import { PREVIEW_TYPES, formatDate, formatDateTime } from "@/lib/member-area";
import { BentoGrid, BentoCard } from "../../components/bento";

export const Route = createFileRoute("/_authenticated/area/anticipazioni")({
  head: () => ({
    meta: [
      { title: "Anticipazioni Member — IMLAND EXPERIENCE" },
      { name: "description", content: "Contenuti e progetti IMLAND in anteprima per i Member." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnticipazioniPage,
});

function AnticipazioniPage() {
  const [type, setType] = useState<string>("Tutte");
  const { isFavorite, toggle } = useFavorites();

  const { data = [], isLoading } = useQuery({
    queryKey: ["previews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("previews")
        .select("*")
        .order("member_publish_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const now = Date.now();
  const visible = data.filter((p) => new Date(p.member_publish_at).getTime() <= now);
  const filtered = type === "Tutte" ? visible : visible.filter((p) => p.content_type === type);

  return (
    <AreaShell
      title="Anticipazioni."
      lead="Progetti, puntate ed eventi che vedi prima del pubblico."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {["Tutte", ...PREVIEW_TYPES].map((t) => (
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
        <EmptyState text="Nessuna anticipazione in questa categoria." />
      ) : (
        <BentoGrid>
          {filtered.map((p) => (
            <BentoCard key={p.id} tone="member" span={3} className="!p-0 overflow-hidden block">
              {p.cover_url && (
                <img
                  src={p.cover_url}
                  alt={p.title}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {p.content_type}
                  </span>
                  <button
                    onClick={() =>
                      toggle.mutate({ item_id: p.id, item_type: "podcast", label: p.title })
                    }
                    aria-label="Salva"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Heart size={18} fill={isFavorite(p.id, "podcast") ? "currentColor" : "none"} />
                  </button>
                </div>
                <h2 className="mt-3 text-h3-im">{p.title}</h2>
                {p.excerpt && <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>}
                {p.body && <p className="mt-3 whitespace-pre-line text-sm">{p.body}</p>}
                {p.media_url && (
                  <a
                    href={p.media_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-primary"
                  >
                    Apri contenuto
                  </a>
                )}
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={13} />
                  Member dal {formatDateTime(p.member_publish_at)}
                  {p.public_publish_at
                    ? ` · pubblico dal ${formatDate(p.public_publish_at)}`
                    : " · esclusiva Member"}
                </p>
              </div>
            </BentoCard>
          ))}
        </BentoGrid>
      )}
    </AreaShell>
  );
}

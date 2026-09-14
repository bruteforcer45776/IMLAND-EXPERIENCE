import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ExternalLink, Heart, MapPin } from "lucide-react";

import { AreaShell, EmptyState } from "@/components/member/area-shell";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/use-favorites";
import { DISCOVERY_CATEGORIES, PROVINCES } from "@/lib/member-area";
import { BentoGrid, BentoCard } from "../../components/bento";

export const Route = createFileRoute("/_authenticated/area/scopri")({
  head: () => ({
    meta: [
      { title: "Scopri il territorio — IMLAND EXPERIENCE" },
      { name: "description", content: "Eventi, locali ed esperienze selezionate tra Vercelli, Novara, Biella e Verbania." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ScopriPage,
});

function ScopriPage() {
  const [province, setProvince] = useState("Tutte");
  const [category, setCategory] = useState("Tutte");
  const { isFavorite, toggle } = useFavorites();

  const { data = [], isLoading } = useQuery({
    queryKey: ["discoveries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discoveries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = data.filter(
    (d) =>
      (province === "Tutte" || d.province === province) &&
      (category === "Tutte" || d.category === category),
  );

  return (
    <AreaShell title="Scopri." lead="Il territorio filtrato per provincia e categoria.">
      <div className="mb-4 flex flex-wrap gap-2">
        {["Tutte", ...PROVINCES].map((p) => (
          <button
            key={p}
            onClick={() => setProvince(p)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              province === p ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {["Tutte", ...DISCOVERY_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3.5 py-1 text-xs transition-colors ${
              category === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading ? (
        <EmptyState text="Caricamento…" />
      ) : filtered.length === 0 ? (
        <EmptyState text="Nessun contenuto con questi filtri." />
      ) : (
        <BentoGrid>
          {filtered.map((d) => (
            <BentoCard key={d.id} tone="member" span={2} className="!p-0 overflow-hidden block">
              {d.image_url && (
                <img src={d.image_url} alt={d.title} className="h-40 w-full object-cover" loading="lazy" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {d.category}
                  </span>
                  <button
                    onClick={() => toggle.mutate({ item_id: d.id, item_type: "esperienza", label: d.title, link_url: d.link_url })}
                    aria-label="Salva"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Heart size={18} fill={isFavorite(d.id, "esperienza") ? "currentColor" : "none"} />
                  </button>
                </div>
                <h2 className="mt-3 text-h3-im">{d.title}</h2>
                {d.description && <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>}
                <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  {[d.city, d.province].filter(Boolean).join(", ") || "Territorio IMLAND"}
                </p>
                {d.link_url && (
                  <a
                    href={d.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                  >
                    Scopri <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </BentoCard>
          ))}
        </BentoGrid>
      )}
    </AreaShell>
  );
}

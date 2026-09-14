import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { BentoGrid, BentoCard } from "@/components/bento";

export const Route = createFileRoute("/_authenticated/admin/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback del sito — IMLAND EXPERIENCE" },
      { name: "description", content: "Raccolta dei feedback e delle valutazioni lasciate dai visitatori." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FeedbackAdminPage,
});

type Feedback = {
  id: string;
  rating: number;
  note: string | null;
  page_path: string | null;
  user_id: string | null;
  created_at: string;
};

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} su 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= value ? "fill-[#facc15] text-[#facc15]" : "fill-white text-border"}`}
        />
      ))}
    </span>
  );
}

function FeedbackAdminPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["site-feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_feedback")
        .select("id, rating, note, page_path, user_id, created_at")
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return (data ?? []) as Feedback[];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("site_feedback").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Feedback eliminato.");
      void qc.invalidateQueries({ queryKey: ["site-feedback"] });
    },
    onError: () => toast.error("Eliminazione non riuscita."),
  });

  const items = data ?? [];
  const total = items.length;
  const average = total > 0 ? items.reduce((sum, f) => sum + f.rating, 0) / total : 0;
  const withNote = items.filter((f) => f.note && f.note.trim().length > 0).length;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: items.filter((f) => f.rating === star).length,
  }));

  return (
    <div className="container-im py-10">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Pannello admin
      </Link>

      <h1 className="mt-4 text-display-s">Feedback del sito</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Qui arrivano le valutazioni lasciate dai visitatori nel sondaggio.
        <br />
        Ogni voce mostra stelle, nota e pagina di provenienza.
      </p>

      <BentoGrid className="mt-6">
        <BentoCard title="Feedback ricevuti" tone="news">
          <p className="text-display-s">{total}</p>
        </BentoCard>
        <BentoCard title="Media voti" tone="member">
          <p className="text-display-s">{average ? average.toFixed(1) : "—"}</p>
          {average > 0 && <Stars value={Math.round(average)} />}
        </BentoCard>
        <BentoCard title="Con nota scritta" tone="podcast">
          <p className="text-display-s">{withNote}</p>
        </BentoCard>
        <BentoCard title="Distribuzione" tone="eventi">
          <ul className="space-y-1 text-sm">
            {distribution.map((d) => (
              <li key={d.star} className="flex items-center justify-between gap-3">
                <Stars value={d.star} />
                <span className="font-semibold">{d.count}</span>
              </li>
            ))}
          </ul>
        </BentoCard>
      </BentoGrid>

      <section className="mt-10">
        <h2 className="text-title-l">Tutti i feedback</h2>
        {isLoading && <p className="mt-3 text-muted-foreground">Caricamento…</p>}
        {!isLoading && total === 0 && (
          <p className="mt-3 text-muted-foreground">Nessun feedback ricevuto per ora.</p>
        )}
        <ul className="mt-4 space-y-3">
          {items.map((f) => (
            <li
              key={f.id}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars value={f.rating} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(f.created_at).toLocaleString("it-IT")}
                  </span>
                  {f.page_path && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{f.page_path}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {f.user_id ? "Utente registrato" : "Visitatore"}
                  </span>
                </div>
                {f.note && <p className="mt-2 whitespace-pre-line text-[15px]">{f.note}</p>}
              </div>
              <button
                type="button"
                onClick={() => remove.mutate(f.id)}
                aria-label="Elimina feedback"
                className="self-start rounded-full border border-border p-2 text-muted-foreground hover:bg-muted"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

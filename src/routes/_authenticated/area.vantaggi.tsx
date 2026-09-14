import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";

import { AreaShell, EmptyState } from "@/components/member/area-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { BENEFIT_TYPES, PROVINCES, formatDate, isExpired } from "@/lib/member-area";
import { BentoGrid, BentoCard } from "../../components/bento";

export const Route = createFileRoute("/_authenticated/area/vantaggi")({
  head: () => ({
    meta: [
      { title: "Vantaggi Member — IMLAND EXPERIENCE" },
      { name: "description", content: "Convenzioni e sconti riservati ai Member nelle attività del territorio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VantaggiPage,
});

function VantaggiPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { isFavorite, toggle } = useFavorites();
  const [province, setProvince] = useState("Tutte");
  const [type, setType] = useState("Tutti");

  const { data, isLoading } = useQuery({
    queryKey: ["benefits"],
    queryFn: async () => {
      const [benefits, redemptions] = await Promise.all([
        supabase.from("benefits").select("*").order("created_at", { ascending: false }),
        supabase.from("benefit_redemptions").select("*"),
      ]);
      if (benefits.error) throw benefits.error;
      return { benefits: benefits.data, redemptions: redemptions.data ?? [] };
    },
  });

  const redeem = useMutation({
    mutationFn: async (benefitId: string) => {
      if (!user) throw new Error("Devi accedere");
      const { data, error } = await supabase
        .from("benefit_redemptions")
        .insert({ benefit_id: benefitId, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["benefits"] });
      toast.success("Codice generato. Mostralo in attività.");
    },
    onError: () => toast.error("Non è stato possibile generare il codice."),
  });

  const benefits = (data?.benefits ?? []).filter(
    (b) =>
      (province === "Tutte" || b.province === province) &&
      (type === "Tutti" || b.benefit_type === type),
  );

  return (
    <AreaShell title="Vantaggi." lead="Convenzioni e sconti attivi nelle attività convenzionate IMLAND.">
      <div className="mb-6 flex flex-wrap gap-2">
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
        {["Tutti", ...BENEFIT_TYPES].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-full border px-3.5 py-1 text-xs transition-colors ${
              type === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <EmptyState text="Caricamento…" />
      ) : benefits.length === 0 ? (
        <EmptyState text="Nessun vantaggio disponibile con questi filtri." />
      ) : (
        <BentoGrid>
          {benefits.map((b) => {
            const redemption = (data?.redemptions ?? []).find((r) => r.benefit_id === b.id);
            const expired = isExpired(b.expires_at);
            return (
              <BentoCard key={b.id} tone="member" span={3} className="block">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {b.logo_url && (
                      <img src={b.logo_url} alt="" className="h-11 w-11 rounded-xl object-cover" loading="lazy" />
                    )}
                    <div>
                      <h2 className="text-h3-im">{b.business_name}</h2>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        {[b.city, b.province].filter(Boolean).join(", ") || "Territorio IMLAND"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle.mutate({ item_id: b.id, item_type: "vantaggio", label: b.business_name })}
                    aria-label="Salva"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Heart size={18} fill={isFavorite(b.id, "vantaggio") ? "currentColor" : "none"} />
                  </button>
                </div>

                <p className="mt-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {b.benefit_type}
                  {b.discount_percent ? ` · -${b.discount_percent}%` : ""}
                </p>
                {b.description && <p className="mt-3 text-sm text-muted-foreground">{b.description}</p>}
                {b.address && <p className="mt-2 text-xs text-muted-foreground">{b.address}</p>}
                {b.conditions && <p className="mt-2 text-xs text-muted-foreground">Condizioni: {b.conditions}</p>}
                <p className="mt-2 text-xs text-muted-foreground">
                  {b.expires_at ? `Valido fino al ${formatDate(b.expires_at)}` : "Senza scadenza"}
                </p>

                {redemption ? (
                  <div className="mt-4 flex items-center gap-4 rounded-2xl bg-muted/60 p-4">
                    <QRCodeSVG value={redemption.code} size={72} />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Codice</p>
                      <p className="font-display text-xl font-semibold tracking-widest">{redemption.code}</p>
                      <p className="text-xs text-muted-foreground">Stato: {redemption.status}</p>
                    </div>
                  </div>
                ) : (
                  <Button
                    className="mt-4 rounded-full"
                    disabled={expired || redeem.isPending}
                    onClick={() => redeem.mutate(b.id)}
                  >
                    {expired ? "Vantaggio scaduto" : "Genera codice vantaggio"}
                  </Button>
                )}
              </BentoCard>
            );
          })}
        </BentoGrid>
      )}
    </AreaShell>
  );
}

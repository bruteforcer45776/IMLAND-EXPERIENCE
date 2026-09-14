import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { AreaShell, EmptyState } from "@/components/member/area-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/member-area";

export const Route = createFileRoute("/_authenticated/area/invita")({
  head: () => ({
    meta: [
      { title: "Invita un amico — IMLAND EXPERIENCE" },
      { name: "description", content: "Invita amici nella community IMLAND e monitora le registrazioni." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InvitaPage,
});

const emailSchema = z.string().trim().email("Email non valida").max(255);

function InvitaPage() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");

  const link =
    typeof window !== "undefined" && profile
      ? `${window.location.origin}/accedi?ref=${profile.referral_code}`
      : "";

  const { data = [], isLoading } = useQuery({
    queryKey: ["referrals", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const invite = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Devi accedere");
      const parsed = emailSchema.safeParse(email);
      if (!parsed.success) throw new Error(parsed.error.issues[0]!.message);
      const { error } = await supabase
        .from("referrals")
        .insert({ referrer_id: user.id, invited_email: parsed.data });
      if (error) throw error;
    },
    onSuccess: () => {
      setEmail("");
      void qc.invalidateQueries({ queryKey: ["referrals"] });
      toast.success("Invito registrato. Condividi il tuo link.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Invito non riuscito"),
  });

  const registered = data.filter((r) => r.registered_user_id).length;

  return (
    <AreaShell title="Invita un amico." lead="Fai crescere la community del territorio.">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-h3-im">Il tuo link personale.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Codice invito: <span className="font-medium text-foreground">{profile?.referral_code ?? "—"}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Input readOnly value={link} className="flex-1" />
            <Button
              className="rounded-full"
              onClick={() => {
                void navigator.clipboard.writeText(link);
                toast.success("Link copiato.");
              }}
            >
              <Copy size={15} /> Copia
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                if (navigator.share) void navigator.share({ url: link, title: "Entra in IMLAND" });
                else {
                  void navigator.clipboard.writeText(link);
                  toast.success("Link copiato.");
                }
              }}
            >
              <Share2 size={15} /> Condividi
            </Button>
          </div>

          <div className="mt-6 flex gap-6">
            <div>
              <p className="font-display text-3xl font-semibold">{data.length}</p>
              <p className="text-sm text-muted-foreground">Inviti registrati</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-primary">{registered}</p>
              <p className="text-sm text-muted-foreground">Iscritti confermati</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-h3-im">Invita via email.</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Input
              type="email"
              maxLength={255}
              placeholder="nome@email.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button className="rounded-full" disabled={invite.isPending} onClick={() => invite.mutate()}>
              Registra invito
            </Button>
          </div>

          <h3 className="mt-6 text-h3-im uppercase tracking-wide text-muted-foreground">
            I tuoi inviti
          </h3>
          {isLoading ? (
            <p className="mt-3 text-sm text-muted-foreground">Caricamento…</p>
          ) : data.length === 0 ? (
            <div className="mt-3">
              <EmptyState text="Nessun invito ancora." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {data.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 rounded-2xl bg-muted/50 p-3 text-sm">
                  <span className="truncate">{r.invited_email ?? "Invito da link"}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {r.registered_at ? `Iscritto il ${formatDate(r.registered_at)}` : r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AreaShell>
  );
}

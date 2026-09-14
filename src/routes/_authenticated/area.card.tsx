import { createFileRoute } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

import { AreaShell } from "@/components/member/area-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, fullName } from "@/lib/member-area";
import logoMember from "@/assets/imland-logo-member-opt.webp.asset.json";

export const Route = createFileRoute("/_authenticated/area/card")({
  head: () => ({
    meta: [
      { title: "Member Card — IMLAND EXPERIENCE" },
      { name: "description", content: "La tua Member Card digitale IMLAND con QR Code di verifica." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardPage,
});

function CardPage() {
  const { profile } = useAuth();
  const verifyUrl =
    typeof window !== "undefined" && profile
      ? `${window.location.origin}/verifica/${profile.qr_token}`
      : "";

  return (
    <AreaShell title="Member Card." lead="Mostrala nelle attività convenzionate e agli ingressi eventi.">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="rounded-[28px] bg-primary p-1 shadow-lg">
          <div className="flex h-full flex-col justify-between rounded-[24px] bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <img loading="lazy" decoding="async" src={logoMember.url} alt="IMLAND MEMBER" className="h-10 w-auto" />
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {profile?.membership_status ?? "attivo"}
              </span>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Member</p>
              <p className="font-display text-2xl font-semibold">{fullName(profile)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {[profile?.city, profile?.province].filter(Boolean).join(", ") || "Territorio IMLAND"}
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">ID Member</p>
                <p className="font-display text-lg font-semibold tracking-wider">{profile?.member_id ?? "—"}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Member dal {formatDate(profile?.member_since)}
                </p>
              </div>
              {verifyUrl && (
                <div className="rounded-xl bg-background p-2">
                  <QRCodeSVG value={verifyUrl} size={92} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-h3-im">Come si usa.</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>1. Mostra il QR Code all'attività convenzionata o allo staff dell'evento.</li>
            <li>2. Lo staff inquadra il codice e vede nome, ID e stato dell'iscrizione.</li>
            <li>3. Per i vantaggi, genera il codice dedicato nella sezione Vantaggi.</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="rounded-full"
              onClick={() => {
                void navigator.clipboard.writeText(verifyUrl);
                toast.success("Link di verifica copiato.");
              }}
            >
              Copia link di verifica
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => window.print()}>
              Stampa / salva
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Il link di verifica mostra solo nome, ID Member, stato e data di iscrizione.
          </p>
        </div>
      </div>
    </AreaShell>
  );
}

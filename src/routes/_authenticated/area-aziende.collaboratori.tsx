import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { BusinessShell } from "@/components/member/business-shell";
import { BentoCard, BentoGrid } from "@/components/bento";
import { useMyOrganizations, useOrgTeam } from "@/hooks/use-organizations";
import { ORG_ROLE_LABEL, can, type OrgMemberRole } from "@/lib/org";

export const Route = createFileRoute("/_authenticated/area-aziende/collaboratori")({
  head: () => ({
    meta: [
      { title: "Collaboratori — Area Aziende IMLAND" },
      {
        name: "description",
        content: "Chi lavora sulla tua realtà: inviti, ruoli e permessi.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TeamPage,
});

const ROLES: OrgMemberRole[] = ["org_admin", "editor", "recruiter", "events", "analyst", "viewer"];

function TeamPage() {
  const orgs = useMyOrganizations();
  const org = orgs.data?.[0] ?? null;
  const team = useOrgTeam(org?.id);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrgMemberRole>("editor");

  const allowed = can(org?.role, "manage_team");

  return (
    <BusinessShell
      title="Collaboratori"
      lead="Ogni persona lavora con il suo accesso e con i permessi che le assegni."
    >
      {!org ? (
        <BentoGrid>
          <BentoCard tone="aziende" span={6}>
            <p className="text-muted-foreground">
              Registra prima la tua realtà nella sezione “La tua realtà”.
            </p>
          </BentoCard>
        </BentoGrid>
      ) : !allowed ? (
        <BentoGrid>
          <BentoCard tone="aziende" span={6}>
            <p className="text-muted-foreground">
              Il tuo ruolo ({ORG_ROLE_LABEL[org.role]}) non gestisce i collaboratori.
            </p>
          </BentoCard>
        </BentoGrid>
      ) : (
        <BentoGrid>
          <BentoCard tone="aziende" span={2}>
            <h2 className="text-h3-im">Invita una persona</h2>
            <form
              className="mt-4 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                team.invite.mutate(
                  { email, role },
                  {
                    onSuccess: () => {
                      setEmail("");
                      toast.success("Invito registrato.");
                    },
                  },
                );
              }}
            >
              <input
                required
                type="email"
                placeholder="email@azienda.it"
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                value={role}
                onChange={(e) => setRole(e.target.value as OrgMemberRole)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ORG_ROLE_LABEL[r]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={team.invite.isPending}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {team.invite.isPending ? "Invio…" : "Invita"}
              </button>
            </form>
          </BentoCard>

          <BentoCard tone="aziende" span={4}>
            <h2 className="text-h3-im">Chi ha accesso</h2>
            {team.list.isLoading ? (
              <p className="mt-3 text-muted-foreground">Caricamento…</p>
            ) : (team.list.data ?? []).length === 0 ? (
              <p className="mt-3 text-muted-foreground">
                Per ora lavori da solo.
                <br />
                Invita chi ti aiuta con schede, opportunità o eventi.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {(team.list.data ?? []).map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-border p-3 text-sm"
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {m.invited_email ?? m.user_id}
                    </span>
                    <span className="text-muted-foreground">
                      {m.accepted_at ? "Attivo" : "Invito inviato"}
                    </span>
                    <select
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-sm"
                      value={m.role}
                      onChange={(e) =>
                        team.changeRole.mutate({ id: m.id, role: e.target.value as OrgMemberRole })
                      }
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ORG_ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => team.remove.mutate(m.id)}
                      aria-label="Rimuovi collaboratore"
                      className="rounded-full border border-border p-2 text-muted-foreground hover:bg-muted"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </BentoCard>
        </BentoGrid>
      )}
    </BusinessShell>
  );
}

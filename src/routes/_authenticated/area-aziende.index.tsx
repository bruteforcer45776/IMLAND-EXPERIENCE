import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { BusinessShell } from "@/components/member/business-shell";
import { BadgeIcon } from "@/components/badge-icon";
import { BentoGrid, BentoCard, BentoLinkCard, BentoAnchorCard } from "@/components/bento";
import { useAuth } from "@/hooks/use-auth";
import { fullName } from "@/lib/member-area";
import { WHATSAPP_PARTNER_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/_authenticated/area-aziende/")({
  head: () => ({
    meta: [
      { title: "Dashboard Aziende — IMLAND EXPERIENCE" },
      { name: "description", content: "La dashboard riservata alle aziende partner IMLAND." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BusinessDashboard,
});

function BusinessDashboard() {
  const { profile } = useAuth();

  return (
    <BusinessShell
      title={`Benvenuta, ${fullName(profile).split(" ")[0]}.`}
      lead="Materiali, loghi e contatti della tua collaborazione con IMLAND."
    >
      <BentoGrid>
        <BentoLinkCard tone="aziende" span={2} to="/area-aziende/realta">
          <BadgeIcon name="aziende" className="h-12 w-12" />
          <h2 className="mt-4 text-h3-im">La tua realtà</h2>
          <p className="mt-2 text-muted-foreground">
            Dati, contatti e verifica: l'identità unica da cui nasce tutto il resto.
          </p>
        </BentoLinkCard>

        <BentoLinkCard tone="aziende" span={3} to="/area-aziende/recensioni">
          <BadgeIcon name="community" className="h-12 w-12" />
          <h2 className="mt-4 text-h3-im">Recensioni e risposte</h2>
          <p className="mt-2 text-muted-foreground">
            Leggi le esperienze delle persone e rispondi a nome della tua realtà.
          </p>
        </BentoLinkCard>

        <BentoLinkCard tone="aziende" span={3} to="/area-aziende/collaboratori">
          <BadgeIcon name="referente" className="h-12 w-12" />
          <h2 className="mt-4 text-h3-im">Collaboratori</h2>
          <p className="mt-2 text-muted-foreground">Inviti e permessi per chi lavora con te.</p>
        </BentoLinkCard>

        <BentoLinkCard tone="aziende" span={3} to="/area-aziende/materiali">
          <BadgeIcon name="materiali" className="h-12 w-12" />
          <h2 className="mt-4 text-h3-im">Materiali e loghi</h2>
          <p className="mt-2 text-muted-foreground">
            Scarica i loghi IMLAND nei formati ufficiali per le tue comunicazioni.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-signal">
            Apri <ArrowRight size={18} />
          </span>
        </BentoLinkCard>

        <BentoLinkCard tone="aziende" span={3} to="/area-aziende/referente">
          <BadgeIcon name="referente" className="h-12 w-12" />
          <h2 className="mt-4 text-h3-im">Il tuo referente</h2>
          <p className="mt-2 text-muted-foreground">
            Contatti diretti della persona che segue la tua azienda.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-signal">
            Apri <ArrowRight size={18} />
          </span>
        </BentoLinkCard>

        <BentoCard tone="aziende" span={4}>
          <h2 className="text-h3-im">Le tue attività</h2>
          <p className="mt-2 text-muted-foreground">
            Il piano attivo e i report vengono condivisi dal tuo referente.
            <br />
            Qui troverai lo storico appena la prima campagna è online.
          </p>
        </BentoCard>

        <BentoAnchorCard
          tone="aziende"
          span={2}
          href={WHATSAPP_PARTNER_URL}
          target="_blank"
          rel="noreferrer"
        >
          <BadgeIcon name="aziende" className="h-12 w-12" />
          <h2 className="mt-4 text-h3-im">Richiedi una modifica</h2>
          <p className="mt-2 text-muted-foreground">
            Scrivici su WhatsApp: rispondiamo in giornata.
          </p>
        </BentoAnchorCard>
      </BentoGrid>
    </BusinessShell>
  );
}

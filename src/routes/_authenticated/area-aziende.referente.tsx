import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { BusinessShell } from "@/components/member/business-shell";
import { BadgeIcon } from "@/components/badge-icon";
import { BentoGrid, BentoCard } from "@/components/bento";
import { WHATSAPP_PARTNER_URL } from "@/lib/whatsapp";

export const Route = createFileRoute("/_authenticated/area-aziende/referente")({
  head: () => ({
    meta: [
      { title: "Il tuo referente — Area Aziende IMLAND" },
      { name: "description", content: "Contatti del referente commerciale IMLAND per le aziende partner." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReferentePage,
});

function ReferentePage() {
  return (
    <BusinessShell
      title="Il tuo referente."
      lead="Una sola persona per piano, materiali e pianificazione. Rispondiamo dal lunedì al venerdì, 9:00–18:00."
    >
      <BentoGrid>
        <BentoCard tone="aziende" span={4}>
          <BadgeIcon name="referente" className="h-12 w-12" />
          <h2 className="mt-4 text-h3-im">Ufficio partner IMLAND</h2>
          <p className="mt-2 text-muted-foreground">
            Scrivi o chiama per modifiche al piano, nuovi contenuti e materiali.
          </p>
          <ul className="mt-5 space-y-3 text-[15px]">
            <li>
              <a href="mailto:info@imlandradio.com" className="inline-flex items-center gap-2 hover:underline">
                <Mail size={18} className="text-signal" /> info@imlandradio.com
              </a>
            </li>
            <li>
              <a href="tel:+393514323003" className="inline-flex items-center gap-2 hover:underline">
                <Phone size={18} className="text-signal" /> +39 351 432 3003
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_PARTNER_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                <MessageCircle size={18} className="text-signal" /> Scrivi su WhatsApp
              </a>
            </li>
          </ul>
        </BentoCard>

        <BentoCard tone="aziende" span={2}>
          <h2 className="text-h3-im">Tempi di risposta</h2>
          <p className="mt-2 text-muted-foreground">
            WhatsApp entro la giornata lavorativa.
            <br />
            Email entro 24 ore.
          </p>
        </BentoCard>
      </BentoGrid>
    </BusinessShell>
  );
}

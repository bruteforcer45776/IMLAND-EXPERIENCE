import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Headphones,
  ListMusic,
  LogOut,
  Megaphone,
  Radio,
  Share2,
  Star,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEpisodeNotifications } from "@/hooks/use-listener";

const NAV = [
  { to: "/ascoltatore", label: "Panoramica", icon: Headphones },
  { to: "/ascoltatore/puntate", label: "Puntate", icon: Radio },
  { to: "/ascoltatore/raccolte", label: "Raccolte", icon: ListMusic },
  { to: "/ascoltatore/canali", label: "Canali e notifiche", icon: Bell },
  { to: "/ascoltatore/segnalazioni", label: "Segnalazioni", icon: Megaphone },
  { to: "/ascoltatore/salvati", label: "Salvati", icon: Bookmark },
  { to: "/ascoltatore/recensioni", label: "Recensioni", icon: Star },
  { to: "/ascoltatore/candidature", label: "Candidature", icon: BriefcaseBusiness },
  { to: "/ascoltatore/condivisioni", label: "Condivisioni", icon: Share2 },
  { to: "/ascoltatore/profilo", label: "Profilo", icon: UserRound },
] as const;

export function ListenerShell({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { unread } = useEpisodeNotifications();

  return (
    <div className="container-im py-8 md:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Area Persona" className="flex flex-wrap gap-2">
          {NAV.map((item) => {
            const active =
              pathname === item.to || (item.to !== "/ascoltatore" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-transparent bg-signal text-white"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {item.to === "/ascoltatore/canali" && unread > 0 && (
                  <span className="ml-1 rounded-full bg-[var(--error)] px-2 py-0.5 text-xs font-bold text-white">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          onClick={async () => {
            await signOut();
            void navigate({ to: "/accedi", replace: true });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Esci
        </Button>
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}

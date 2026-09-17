/**
 * Shell dell'Area Aziende — stessa struttura dell'Area Membri, tono ambra.
 */

import { Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Download,
  LayoutDashboard,
  LogOut,
  Star,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { useAuth } from "@/hooks/use-auth";
import { fullName } from "@/lib/member-area";

const links = [
  { to: "/area-aziende", label: "Dashboard", icon: LayoutDashboard },
  { to: "/area-aziende/realta", label: "La tua realtà", icon: Building2 },
  { to: "/area-aziende/recensioni", label: "Recensioni", icon: Star },
  { to: "/area-aziende/collaboratori", label: "Collaboratori", icon: Users },
  { to: "/area-aziende/materiali", label: "Materiali e loghi", icon: Download },
  { to: "/area-aziende/referente", label: "Il tuo referente", icon: UserRound },
] as const;

export function BusinessShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container-im flex flex-col gap-8 py-10 md:flex-row md:py-14">
      <aside className="md:w-64 md:shrink-0">
        <div className="rounded-3xl border border-border bg-card p-4">
          <div className="px-2 pb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Area Aziende
            </p>
            <p className="mt-1 truncate text-sm font-semibold">{fullName(profile)}</p>
          </div>

          <nav className="flex flex-col gap-0.5" aria-label="Navigazione area aziende">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/area-aziende" }}
                className="inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                activeProps={{ className: "!bg-primary/10 !text-primary" }}
              >
                <l.icon size={18} />
                <span className="flex-1">{l.label}</span>
              </Link>
            ))}
            <Link
              to="/area"
              className="mt-1 inline-flex items-center gap-3 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Area Membri
            </Link>
          </nav>

          <button
            onClick={async () => {
              await signOut();
              void navigate({ to: "/accedi", replace: true });
            }}
            className="mt-3 inline-flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <LogOut size={18} />
            Esci
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="mb-6">
          <h1 className="text-h1-im">{title}</h1>
          {lead && <p className="mt-2 text-muted-foreground">{lead}</p>}
        </header>
        {children}
      </div>
    </div>
  );
}

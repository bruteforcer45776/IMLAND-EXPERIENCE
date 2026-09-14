import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  BadgeCheck,
  CalendarDays,
  Compass,
  Gift,
  Heart,
  LayoutDashboard,
  Lock,
  LogOut,
  Settings,
  Share2,
  Shield,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { useAuth } from "@/hooks/use-auth";
import Dock from "@/components/dock";

import { supabase } from "@/integrations/supabase/client";
import { fullName } from "@/lib/member-area";

const links = [
  { to: "/area", label: "Dashboard", icon: LayoutDashboard },
  { to: "/area/anticipazioni", label: "Anticipazioni", icon: Sparkles },
  { to: "/area/vantaggi", label: "Vantaggi", icon: Gift },
  { to: "/area/eventi", label: "Eventi", icon: CalendarDays },
  { to: "/area/esclusivi", label: "Contenuti esclusivi", icon: Lock },
  { to: "/area/scopri", label: "Scopri", icon: Compass },
  { to: "/area/salvati", label: "Salvati", icon: Heart },
  { to: "/area/notifiche", label: "Notifiche", icon: Bell },
  { to: "/area/card", label: "Member Card", icon: BadgeCheck },
  { to: "/area/invita", label: "Invita un amico", icon: Share2 },
  { to: "/area/profilo", label: "Profilo", icon: Settings },
] as const;

export function AreaShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  const { profile, isAdmin, signOut, user } = useAuth();
  const navigate = useNavigate();


  const { data: unread = 0 } = useQuery({
    queryKey: ["notif-unread", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const [{ data: notifs }, { data: reads }] = await Promise.all([
        supabase.from("notifications").select("id"),
        supabase.from("notification_reads").select("notification_id"),
      ]);
      const readIds = new Set((reads ?? []).map((r) => r.notification_id));
      return (notifs ?? []).filter((n) => !readIds.has(n.id)).length;
    },
  });

  const dockItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", onClick: () => void navigate({ to: "/area" }) },
    { icon: <CalendarDays size={20} />, label: "Eventi", onClick: () => void navigate({ to: "/area/eventi" }) },
    { icon: <Heart size={20} />, label: "Salvati", onClick: () => void navigate({ to: "/area/salvati" }) },
    { icon: <Bell size={20} />, label: "Notifiche", onClick: () => void navigate({ to: "/area/notifiche" }) },
    { icon: <BadgeCheck size={20} />, label: "Member Card", onClick: () => void navigate({ to: "/area/card" }) },
    { icon: <Settings size={20} />, label: "Profilo", onClick: () => void navigate({ to: "/area/profilo" }) },
  ];

  return (
    <>
    <div className="container-im flex flex-col gap-8 py-10 pb-32 md:flex-row md:py-14 md:pb-32">

      <aside className="md:w-64 md:shrink-0">
        <div className="rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center gap-3 px-2 pb-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {profile?.avatar_url ? (
                <img loading="lazy" decoding="async" src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                fullName(profile).slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{fullName(profile)}</p>
              <p className="truncate text-xs text-muted-foreground">{profile?.member_id ?? "—"}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-0.5 overflow-x-auto md:overflow-visible">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/area" }}
                className="inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                activeProps={{ className: "!bg-primary/10 !text-primary" }}
              >
                <l.icon size={18} />
                <span className="flex-1">{l.label}</span>
                {l.to === "/area/notifiche" && unread > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                    {unread}
                  </span>
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="mt-1 inline-flex items-center gap-3 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                activeProps={{ className: "!bg-primary/10 !text-primary" }}
              >
                <Shield size={18} />
                Pannello admin
              </Link>
            )}
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
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden justify-center sm:flex">
      <Dock items={dockItems} />
    </div>
    </>
  );
}


export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

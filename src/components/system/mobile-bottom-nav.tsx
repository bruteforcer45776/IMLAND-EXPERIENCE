/**
 * Bottom navigation mobile persistente: Home, Esplora, Salvati e Profilo.
 * Rispetta la safe area iOS e assume il colore della
 * verticale attiva. Nasconde se stessa su desktop.
 */
import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Compass, Home, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/cerca", label: "Esplora", icon: Compass },
    { to: user ? "/ascoltatore/salvati" : "/accedi", label: "Salvati", icon: Bookmark },
    { to: user ? "/ascoltatore/profilo" : "/accedi", label: "Profilo", icon: UserRound },
  ] as const;

  return (
    <nav
      aria-label="Navigazione rapida"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-end justify-between px-2 py-1.5">
        {items.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.label} className="flex-1">
              <Link
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 flex-col items-center gap-1 rounded-[var(--radius-md)] px-2 py-1.5 no-underline",
                  active ? "text-service-ink" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

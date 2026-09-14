/**
 * Stati di interfaccia condivisi: empty state coerente con la verticale
 * (icona, testo, azione utile), skeleton delle card e stato di errore
 * con retry. Nessun messaggio tecnico grezzo verso l'utente.
 */
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "service-panel flex flex-col items-center gap-3 px-6 py-10 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-service-soft text-service-ink">
          {icon}
        </span>
      ) : null}
      <h3 className="text-title-im">{title}</h3>
      {description ? (
        <p className="measure-prose text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actionLabel && actionTo ? (
        <Button asChild className="mt-2 rounded-full">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link to={actionTo as any}>{actionLabel}</Link>
        </Button>
      ) : actionLabel && onAction ? (
        <Button className="mt-2 rounded-full" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function SkeletonCard({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("service-panel overflow-hidden p-4", className)} aria-hidden="true">
      <div className="mb-4 h-40 w-full animate-pulse rounded-[var(--radius-md)] bg-muted" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 animate-pulse rounded-full bg-muted"
            style={{ width: `${100 - i * 18}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function ErrorState({
  title = "Contenuto non disponibile",
  description = "Non riusciamo a caricare questi contenuti in questo momento. Riprova tra poco.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="service-panel flex flex-col items-center gap-3 px-6 py-10 text-center" role="alert">
      <h3 className="text-title-im">{title}</h3>
      <p className="measure-prose text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button className="mt-2 rounded-full" onClick={onRetry}>
          Riprova
        </Button>
      ) : null}
    </div>
  );
}

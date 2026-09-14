/**
 * Chip/etichetta globale IMLAND — pill completamente arrotondata, area touch
 * 44px su mobile, varianti default/selected/soft/disabled, con supporto a
 * mini-logo, icona, contatore e rimozione.
 * I colori arrivano dai token `--service-*` della verticale attiva.
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceChipVariant = "default" | "selected" | "soft" | "status";

type Props = {
  children: ReactNode;
  variant?: ServiceChipVariant;
  /** icona a sinistra (lucide o img) */
  icon?: ReactNode;
  /** mini-logo originale della verticale */
  logoSrc?: string;
  logoAlt?: string;
  /** contatore a destra */
  count?: number;
  /** mostra la X di rimozione */
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

const VARIANT: Record<ServiceChipVariant, string> = {
  default: "hover:bg-muted",
  selected: "pill-selected",
  soft: "pill-soft",
  status: "pill-soft",
};

export function ServiceChip({
  children,
  variant = "default",
  icon,
  logoSrc,
  logoAlt = "",
  count,
  onRemove,
  removeLabel = "Rimuovi filtro",
  className,
  type = "button",
  disabled,
  ...props
}: Props) {
  return (
    <span
      className={cn(
        "pill-base",
        VARIANT[variant],
        disabled && "opacity-50",
        className,
      )}
    >
      <button
        type={type}
        disabled={disabled}
        className="inline-flex items-center gap-2 bg-transparent text-inherit"
        aria-pressed={variant === "selected" ? true : undefined}
        {...props}
      >
        {logoSrc ? (
          <img src={logoSrc} alt={logoAlt} width={24} height={24} className="h-6 w-6 shrink-0 object-contain" loading="lazy" />
        ) : null}
        {icon ? <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span> : null}
        <span className="truncate">{children}</span>
        {typeof count === "number" ? (
          <span className="ml-1 rounded-full bg-black/10 px-2 py-0.5 text-xs font-bold">{count}</span>
        ) : null}
      </button>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel}
          className="-mr-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-black/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  );
}

/** Riga di chip scorrevole: su mobile scorre in orizzontale, su desktop va a capo. */
export function ChipRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("chip-row chip-row-hide md:flex-wrap md:overflow-visible", className)} role="group">
      {children}
    </div>
  );
}

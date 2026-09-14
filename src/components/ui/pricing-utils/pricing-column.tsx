import * as React from "react";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PricingColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  icon?: React.ReactNode;
  description?: string;
  price?: number | string;
  priceNote?: string;
  badge?: string;
  cta?: {
    label: string;
    href: string;
    variant?: "default" | "outline";
  };
  features: string[];
  variant?: "default" | "glow" | "glow-brand";
}

export function PricingColumn({
  name,
  icon,
  description,
  price,
  priceNote,
  badge,
  cta,
  features,
  variant = "default",
  className,
  ...props
}: PricingColumnProps) {
  const brand = variant === "glow-brand";

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-3xl border p-6 transition-colors",
        variant === "default" && "border-border bg-card",
        variant === "glow" && "border-border bg-card",
        brand && "border-signal/40 bg-card md:-translate-y-6 md:py-10 md:z-10",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
          {icon ? <span className="text-signal">{icon}</span> : null}
          {name}
        </h3>
        {badge ? (
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
              brand ? "bg-signal/10 text-signal" : "bg-foreground/5 text-foreground/70",
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>

      {description ? <p className="mt-3 text-sm text-muted-foreground">{description}</p> : null}

      {price !== undefined ? (
        <div className="mt-6 flex items-end gap-1">
          <span className="font-display text-4xl font-bold tracking-tight">
            {typeof price === "number" ? `€${price}` : price}
          </span>
        </div>
      ) : null}
      {priceNote ? <p className="mt-2 text-xs text-muted-foreground">{priceNote}</p> : null}

      <ul className="mt-6 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-signal" />
            <span className="text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>

      {cta ? (
        <div className="mt-auto pt-8">
          <Button
            asChild
            variant={cta.variant ?? "default"}
            className="side-blue h-11 w-full rounded-full text-sm font-semibold"
          >
            <Link to={cta.href}>{cta.label}</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

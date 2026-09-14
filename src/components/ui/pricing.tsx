import * as React from "react";

import { cn } from "@/lib/utils";
import {
  PricingColumn,
  type PricingColumnProps,
} from "@/components/ui/pricing-utils/pricing-column";
import { Section } from "@/components/ui/pricing-utils/section";

export interface PricingProps {
  eyebrow?: string | false;
  title?: React.ReactNode | false;
  description?: React.ReactNode | false;
  note?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

export default function Pricing({
  eyebrow,
  title,
  description,
  note,
  plans,
  className = "",
}: PricingProps) {
  return (
    <Section className={cn(className)}>
      <div className="container-im section-pad">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-4 whitespace-pre-line text-muted-foreground">
              {description}
            </p>
          ) : null}
          {note ? (
            <p className="mt-3 block w-full max-w-xl rounded-2xl border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wide text-card-foreground">
              {note}
            </p>
          ) : null}
        </div>

        {plans !== false && plans && plans.length > 0 ? (
          <div className="mt-10 grid items-center gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <PricingColumn key={plan.name} {...plan} />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}

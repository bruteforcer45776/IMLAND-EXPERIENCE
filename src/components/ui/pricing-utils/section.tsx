import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("border-y border-border bg-sunken", className)} {...props}>
      {children}
    </section>
  );
}

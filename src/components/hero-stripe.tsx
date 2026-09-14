import { cn } from "@/lib/utils";

export function HeroStripe({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full bg-white py-4 md:py-5", className)}>
      {children ? (
        <div className="container-im flex items-center justify-center gap-3 text-sm font-medium text-ink-950">
          {children}
        </div>
      ) : null}
    </div>
  );
}

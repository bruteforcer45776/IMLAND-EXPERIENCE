import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  speed?: number;
}

export function Marquee({
  children,
  pauseOnHover = false,
  direction = "left",
  speed = 30,
  className,
  ...props
}: MarqueeProps) {
  const group = (
    <div className="flex min-w-full shrink-0 items-center justify-around">{children}</div>
  );
  return (
    <div className={cn("group flex overflow-hidden", className)} {...props}>
      <div
        className={cn(
          "flex w-max animate-marquee items-center",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          direction === "right" && "[animation-direction:reverse]",
        )}
        style={{ ["--duration" as string]: `${speed}s` }}
      >
        {group}
        {group}
      </div>
    </div>
  );
}

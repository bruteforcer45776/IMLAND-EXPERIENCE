import type { ReactNode, HTMLAttributes } from "react";

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  spotlightColor?: string;
  lightSpots?: boolean | "low" | "normal" | "high";
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor: _spotlightColor,
  lightSpots: _lightSpots = false,
  style,
  ...props
}: SpotlightCardProps) {
  return (
    <div className={`surface-card ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}

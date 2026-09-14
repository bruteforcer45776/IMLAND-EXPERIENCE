import "./liquid-glass.css";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

const LiquidGlassImpl = lazy(() => import("liquid-glass-react"));

export type LiquidGlassProps = {
  children: ReactNode;
  className?: string;
  padding?: string;
  cornerRadius?: number;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  overLight?: boolean;
  mode?: "standard" | "polar" | "prominent" | "shader";
  onClick?: () => void;
};

/**
 * Wrapper SSR-safe per liquid-glass-react: monta l'effetto solo dopo
 * l'idratazione, con fallback al glass-panel del design system.
 */
export function LiquidGlass({
  children,
  className = "",
  padding = "20px 28px",
  cornerRadius = 28,
  displacementScale = 64,
  blurAmount = 0.1,
  saturation = 130,
  aberrationIntensity = 2,
  elasticity = 0.35,
  overLight = false,
  mode = "standard",
  onClick,
}: LiquidGlassProps) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className={`glass-panel ${className}`} style={{ padding, borderRadius: cornerRadius }}>
        {children}
      </div>
    );
  }

  return (
    <span className="lg-anchor">
      <Suspense
        fallback={
          <div
            className={`glass-panel ${className}`}
            style={{ padding, borderRadius: cornerRadius }}
          >
            {children}
          </div>
        }
      >
        <LiquidGlassImpl
          className={className}
          padding={padding}
          cornerRadius={cornerRadius}
          displacementScale={displacementScale}
          blurAmount={blurAmount}
          saturation={saturation}
          aberrationIntensity={aberrationIntensity}
          elasticity={elasticity}
          overLight={overLight}
          mode={mode}
          onClick={onClick}
        >
          {children}
        </LiquidGlassImpl>
      </Suspense>
    </span>
  );
}

export default LiquidGlass;

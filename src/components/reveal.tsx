import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
};

/** Fade + blur-in on scroll. Purely presentational. */
export function Reveal({ children, delay = 0, className = "", y = 28 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(14px)",
        transform: visible ? "none" : `translateY(${y}px)`,
        transition: `opacity 900ms ${ease} ${delay}ms, transform 900ms ${ease} ${delay}ms, filter 700ms ease ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}

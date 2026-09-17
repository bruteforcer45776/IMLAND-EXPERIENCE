import { useEffect, useRef, useState } from "react";

export function useScrollReveal() {
  const [visible, setVisible] = useState(true);
  const previousY = useRef(0);

  useEffect(() => {
    previousY.current = window.scrollY;
    let frame = 0;

    const update = () => {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - previousY.current;

      if (currentY < 80 || delta < -6) setVisible(true);
      else if (delta > 8 && currentY > 140) setVisible(false);

      previousY.current = currentY;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return visible;
}

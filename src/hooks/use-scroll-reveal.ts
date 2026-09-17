import { useEffect, useRef, useState } from "react";

export function useScrollReveal() {
  const [visible, setVisible] = useState(true);
  const previousY = useRef(0);
  const directionDistance = useRef(0);

  useEffect(() => {
    previousY.current = window.scrollY;
    let frame = 0;

    const update = () => {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - previousY.current;

      if (
        (delta > 0 && directionDistance.current < 0) ||
        (delta < 0 && directionDistance.current > 0)
      ) {
        directionDistance.current = delta;
      } else {
        directionDistance.current += delta;
      }

      if (currentY < 80) {
        setVisible(true);
        directionDistance.current = 0;
      } else if (directionDistance.current > 24 && currentY > 140) {
        setVisible(false);
        directionDistance.current = 0;
      } else if (directionDistance.current < -18) {
        setVisible(true);
        directionDistance.current = 0;
      }

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

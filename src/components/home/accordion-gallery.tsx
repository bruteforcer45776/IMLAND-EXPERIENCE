import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import "./accordion-gallery.css";

export type AccordionGalleryItem = {
  image: string;
  label: string;
  link: string;
  alt?: string;
  accentColor?: string;
};

type Props = {
  items: AccordionGalleryItem[];
  defaultIndex?: number;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
};

export function AccordionGallery({
  items,
  defaultIndex = 0,
  height = 280,
  gap = 10,
  radius = 16,
  expandRatio = 0.44,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), items.length - 1));

  const applyLayout = useCallback((animate: boolean) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const grow = items.length > 1
      ? (expandRatio * (items.length - 1)) / (1 - expandRatio)
      : 1;
    timelineRef.current?.kill();
    const timeline = gsap.timeline();
    panelRefs.current.forEach((panel, index) => {
      if (!panel) return;
      const isActive = index === active;
      const media = mediaRefs.current[index];
      const duration = animate && !prefersReduced ? 0.55 : 0;
      timeline.to(panel, {
        flexGrow: isActive ? grow : 1,
        rotateY: isActive ? 0 : index < active ? 4 : -4,
        duration,
        ease: "power3.out",
      }, 0);
      if (media) {
        const drift = Math.max(-1.5, Math.min(1.5, active - index));
        timeline.to(media, {
          xPercent: -50,
          yPercent: -50,
          x: isActive ? 0 : drift * 10,
          "--ag-dim": isActive ? 0.06 : 0.32,
          duration,
          ease: "power3.out",
        }, 0);
      }
    });
    timelineRef.current = timeline;
  }, [active, expandRatio, items.length]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      applyLayout(!firstRunRef.current);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [applyLayout, expandRatio, gap, items.length]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
    return () => timelineRef.current?.kill();
  }, [applyLayout]);

  const move = (index: number, direction: number) => {
    const next = (index + direction + items.length) % items.length;
    setActive(next);
    panelRefs.current[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className="ecosystem-gallery"
      style={{
        "--ag-gap": `${gap}px`,
        "--ag-radius": `${radius}px`,
        height: `${height}px`,
      } as React.CSSProperties}
      role="navigation"
      aria-label="Esplora Radio, Podcast, Eventi e News IMLAND"
    >
      {items.map((item, index) => {
        const isActive = index === active;
        return (
          <a
            key={item.label}
            ref={(element) => { panelRefs.current[index] = element; }}
            href={item.link}
            className="ecosystem-gallery__panel"
            style={{
              "--ag-accent": item.accentColor ?? "#ffffff",
              flexGrow: isActive ? (expandRatio * (items.length - 1)) / (1 - expandRatio) : 1,
            } as React.CSSProperties}
            aria-current={isActive ? "true" : undefined}
            aria-label={`Apri ${item.label}`}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={(event) => {
              if (!isActive) {
                event.preventDefault();
                setActive(index);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                move(index, 1);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                move(index, -1);
              }
            }}
          >
            <span className="ecosystem-gallery__frame">
              <span
                ref={(element) => { mediaRefs.current[index] = element; }}
                className="ecosystem-gallery__media"
              >
                <img src={item.image} alt={item.alt ?? ""} draggable="false" />
              </span>
              <span className="ecosystem-gallery__overlay" aria-hidden="true" />
            </span>
            <span className="ecosystem-gallery__label" aria-hidden="true">
              <span className="ecosystem-gallery__bar" />
              <strong className="ecosystem-gallery__text">{item.label}</strong>
            </span>
          </a>
        );
      })}
    </div>
  );
}

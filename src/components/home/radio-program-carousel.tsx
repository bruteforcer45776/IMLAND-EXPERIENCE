import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

type RadioProgram = {
  image: string;
  label: string;
  link: string;
  alt: string;
};

type Props = {
  items: RadioProgram[];
};

export function RadioProgramCarousel({ items }: Props) {
  const [active, setActive] = useState(0);
  const current = items[active];

  useEffect(() => {
    if (items.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(() => setActive((index) => (index + 1) % items.length), 5200);
    return () => window.clearInterval(interval);
  }, [items.length]);

  if (!current) return null;

  const move = (direction: number) => {
    setActive((index) => (index + direction + items.length) % items.length);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[28px] border border-[#0aa2cf]/35 bg-white shadow-[0_16px_40px_rgb(1_29_104/12%)]"
      aria-label="Programmi radio IMLAND"
    >
      <Link
        to={current.link}
        className="group relative block overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0aa2cf]"
        aria-label={`Apri ${current.label}`}
      >
        <img
          key={current.image}
          src={current.image}
          alt={current.alt}
          className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </Link>

      <div className="flex items-center justify-between gap-3 border-t border-[#0aa2cf]/20 px-4 py-3">
        <div className="flex gap-1.5" aria-label={`Programma ${active + 1} di ${items.length}`}>
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-label={`Mostra ${item.label}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setActive(index)}
              className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0aa2cf] ${
                index === active ? "w-7 bg-[#0aa2cf]" : "w-2.5 bg-[#0aa2cf]/25 hover:bg-[#0aa2cf]/50"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Programma precedente"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0aa2cf]/30 text-[#076d8c] transition-colors hover:bg-[#0aa2cf]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0aa2cf]"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Programma successivo"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0aa2cf]/30 text-[#076d8c] transition-colors hover:bg-[#0aa2cf]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0aa2cf]"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

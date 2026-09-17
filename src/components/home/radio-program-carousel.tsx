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
      className="relative overflow-hidden rounded-[28px] border border-[#0aa2cf]/35 bg-[#07161d] p-3 shadow-[0_16px_40px_rgb(1_29_104/12%)]"
      aria-label="Programmi radio IMLAND"
    >
      <Link
        to={current.link}
        className="group relative block aspect-[4/3] overflow-hidden rounded-[20px] bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0aa2cf]"
        aria-label={`Apri ${current.label}`}
      >
        <img
          key={current.image}
          src={current.image}
          alt={current.alt}
          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pb-5 pt-14">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7ddcff]">In onda su IMLAND</p>
          <p className="mt-1 font-display text-xl font-bold text-white">{current.label}</p>
        </div>
      </Link>

      <div className="mt-3 flex items-center justify-between gap-3 px-1">
        <div className="flex gap-1.5" aria-label={`Programma ${active + 1} di ${items.length}`}>
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-label={`Mostra ${item.label}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setActive(index)}
              className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0aa2cf] ${
                index === active ? "w-7 bg-[#0aa2cf]" : "w-2.5 bg-white/35 hover:bg-white/65"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Programma precedente"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0aa2cf]"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Programma successivo"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0aa2cf]"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

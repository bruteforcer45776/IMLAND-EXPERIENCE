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
  const current = items[0];

  if (!current) return null;

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

      <div className="border-t border-[#0aa2cf]/20 px-4 py-3 text-center">
        <p className="text-sm font-semibold text-[#076d8c]">{current.label}</p>
      </div>
    </section>
  );
}

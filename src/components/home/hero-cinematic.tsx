import heroTerritory from "@/assets/home-lake-orta-opt.webp";

export function HeroCinematic() {
  return (
    <section className="home-unified-hero relative flex min-h-[560px] items-center justify-center overflow-hidden bg-black px-5 py-16 text-center md:min-h-[640px] md:px-10">
      <div className="absolute inset-0">
        <img
          src={heroTerritory}
          alt=""
          aria-hidden
          width={900}
          height={700}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
      </div>
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-white">
        <h1 className="font-display text-[clamp(2.35rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.035em] text-balance !text-white">
          DAI VOCE AL TUO TERRITORIO
        </h1>
        <p className="mt-7 font-display text-[clamp(1.2rem,2.6vw,2rem)] font-bold uppercase tracking-[0.08em] !text-white">
          RADIO · PODCAST · EVENTI
        </p>
        <p className="mt-5 font-keyword text-[clamp(1.35rem,2.6vw,2.2rem)] italic !text-white/90">
          Storie e racconti di persone e aziende
        </p>
        <p className="mt-8 max-w-4xl text-[clamp(.78rem,1.6vw,1.05rem)] font-bold uppercase leading-relaxed tracking-[0.12em] !text-white/90">
          VERCELLI · NOVARA · BIELLA · VERBANO CUSIO OSSOLA
        </p>
      </div>
    </section>
  );
}

import { useState } from "react";
import LogoLoop, { type LogoItem } from "./LogoLoop";
import { partnerLogos, type PartnerLogo } from "@/data/partner-logos";

function PartnerMark({ partner }: { partner: PartnerLogo }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="flex h-16 items-center whitespace-nowrap px-7 font-display text-lg font-semibold tracking-tight text-black/70 transition-colors hover:text-black md:text-xl">
        {partner.name}
      </span>
    );
  }

  return (
    <span className="flex h-18 items-center justify-center px-7 py-2">
      <img
        src={partner.src}
        alt={partner.name}
        loading="eager"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-14 w-auto max-w-[220px] object-contain transition duration-300 hover:scale-[1.04]"
      />
    </span>
  );

}


export function PartnerLoop({
  partners = partnerLogos,
  fadeOutColor = "#f8fafd",
  className,
}: {
  partners?: PartnerLogo[];
  fadeOutColor?: string;
  className?: string;
}) {
  const logos: LogoItem[] = partners.map((p) => ({
    node: <PartnerMark partner={p} />,
    title: p.name,
    ariaLabel: p.name,
    ...(p.href ? { href: p.href } : {}),
  }));

  return (
    <LogoLoop
      className={className}
      logos={logos}
      speed={60}
      direction="left"
      logoHeight={58}
      gap={34}
      hoverSpeed={16}
      scaleOnHover
      fadeOut
      fadeOutColor={fadeOutColor}
      ariaLabel="Partner IMLAND Experience"
    />
  );
}

export default PartnerLoop;

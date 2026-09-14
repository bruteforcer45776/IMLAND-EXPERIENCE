import { useState } from "react";
import LogoLoop, { type LogoItem } from "./LogoLoop";
import { partnerLogos, type PartnerLogo } from "@/data/partner-logos";

function PartnerMark({ partner }: { partner: PartnerLogo }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="flex h-12 items-center whitespace-nowrap px-6 font-display text-base font-semibold tracking-tight text-black/70 transition-colors hover:text-black md:text-lg">
        {partner.name}
      </span>
    );
  }

  return (
    <span className="flex h-14 items-center justify-center px-6 py-2">
      <img
        src={partner.src}
        alt={partner.name}
        loading="eager"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-11 w-auto max-w-[170px] object-contain transition duration-300 hover:scale-[1.04]"
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
      logoHeight={48}
      gap={44}
      hoverSpeed={16}
      scaleOnHover
      fadeOut
      fadeOutColor={fadeOutColor}
      ariaLabel="Partner IMLAND Experience"
    />
  );
}

export default PartnerLoop;

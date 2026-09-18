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
    <span className="partner-loop__mark flex items-center justify-center">
      <img
        src={partner.src}
        alt={partner.name}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onError={() => setFailed(true)}
        className="partner-loop__image object-contain"
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
      className={["partner-loop", className].filter(Boolean).join(" ")}
      logos={logos}
      speed={60}
      direction="left"
      logoHeight={58}
      gap={34}
      hoverSpeed={16}
      scaleOnHover={false}
      fadeOut={false}
      ariaLabel="Partner IMLAND Experience"
    />
  );
}

export default PartnerLoop;

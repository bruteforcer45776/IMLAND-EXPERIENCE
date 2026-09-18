import { useState } from "react";
import { partnerLogos, type PartnerLogo } from "@/data/partner-logos";
import "./LogoLoop.css";

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
        decoding="sync"
        onError={() => setFailed(true)}
        className="partner-loop__image object-contain"
      />
    </span>
  );
}

export function PartnerLoop({
  partners = partnerLogos,
  className,
}: {
  partners?: PartnerLogo[];
  fadeOutColor?: string;
  className?: string;
}) {
  return (
    <div
      className={["partner-loop partner-loop--forced", className].filter(Boolean).join(" ")}
      role="region"
      aria-label="Partner IMLAND Experience"
    >
      <ul className="partner-loop__forced-grid" role="list">
        {partners.map((partner) => (
          <li className="partner-loop__forced-item" key={partner.src}>
            {partner.href ? (
              <a
                className="partner-loop__forced-link"
                href={partner.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={partner.name}
              >
                <PartnerMark partner={partner} />
              </a>
            ) : (
              <PartnerMark partner={partner} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PartnerLoop;

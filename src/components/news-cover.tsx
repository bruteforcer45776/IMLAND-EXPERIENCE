import newsLogo from "@/assets/imland-news-logo.png.asset.json";
import { cn } from "@/lib/utils";

type Props = {
  src?: string | null;
  alt?: string | null;
  className?: string;
  logoClassName?: string;
  priority?: boolean;
};

/** Copertina news con label logo IMLAND News centrata in alto. */
export function NewsCover({ src, alt, className, logoClassName, priority = false }: Props) {
  if (!src) {
    return (
      <div className={cn("image-coming-soon flex items-center justify-center rounded-2xl bg-neutral-100", className)}>
        <span>IMMAGINE IN ARRIVO</span>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-ink-950/5", className)}>
      <img
        src={src}
        alt={alt ?? ""}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-3">
        <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 shadow-md backdrop-blur">
          <img
            src={newsLogo.url}
            alt="IMLAND News"
            loading="lazy"
            decoding="async"
            className={cn("h-5 w-auto md:h-6", logoClassName)}
          />
        </span>
      </div>
    </div>
  );
}

export default NewsCover;

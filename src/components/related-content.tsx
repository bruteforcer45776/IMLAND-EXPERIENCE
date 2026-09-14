import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { BentoGrid, BentoCard, type BentoTone } from "@/components/bento";
import { useRelatedContent } from "@/hooks/use-relations";
import { CONTENT_KIND_LABEL, relationTone, type ContentKind } from "@/lib/relations";

type Props = {
  kind: ContentKind;
  id: string | null | undefined;
  title?: string;
  description?: string;
};

/**
 * Blocco "collegato nell'ecosistema": mostra i contenuti nati dalla stessa
 * informazione (un luogo, un'opportunità, una notizia, un evento) con il tono
 * di colore del servizio di destinazione.
 */
export function RelatedContent({
  kind,
  id,
  title = "Collegato nell'ecosistema",
  description = "La stessa informazione, dove ti serve: luoghi, opportunità, eventi e notizie del territorio.",
}: Props) {
  const { data, isLoading } = useRelatedContent(kind, id);

  if (isLoading || !data || data.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-h2-im">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>

      <BentoGrid className="mt-6">
        {data.map((item) => {
          const tone = relationTone(item.kind) as BentoTone;
          const body = (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--bento-tone)]">
                {CONTENT_KIND_LABEL[item.kind]}
              </p>
              <h3 className="mt-2 text-base font-semibold leading-snug">{item.title}</h3>
              {item.href && (
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                  Apri <ArrowUpRight size={15} />
                </span>
              )}
            </>
          );

          return item.href ? (
            <BentoCard key={`${item.kind}:${item.id}`} tone={tone} span={2} className="p-0">
              <Link to={item.href} className="block h-full p-6">
                {body}
              </Link>
            </BentoCard>
          ) : (
            <BentoCard key={`${item.kind}:${item.id}`} tone={tone} span={2}>
              {body}
            </BentoCard>
          );
        })}
      </BentoGrid>
    </section>
  );
}

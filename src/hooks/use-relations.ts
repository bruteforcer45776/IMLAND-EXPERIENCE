import { useQuery } from "@tanstack/react-query";

import { fetchRelations, resolveRelated, type ContentKind } from "@/lib/relations";

/**
 * Contenuti collegati a un contenuto dell'Hub, in entrambe le direzioni.
 * Un'informazione entra una sola volta e riappare dove è utile.
 */
export function useRelatedContent(kind: ContentKind, id: string | null | undefined) {
  return useQuery({
    queryKey: ["relations", kind, id ?? ""],
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const raw = await fetchRelations(kind, id as string);
      return resolveRelated(raw);
    },
  });
}

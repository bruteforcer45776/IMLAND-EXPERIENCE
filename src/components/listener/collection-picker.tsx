import { useState } from "react";
import { ListPlus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCollections } from "@/hooks/use-listener";

type Props = {
  programSlug: string;
  episodeSlug: string;
  label: string;
};

/** Aggiunge la puntata a una raccolta esistente o ne crea una nuova. */
export function CollectionPicker({ programSlug, episodeSlug, label }: Props) {
  const { collections, createCollection, addItem } = useCollections();
  const [busy, setBusy] = useState(false);

  const createAndAdd = async () => {
    const name = window.prompt("Nome della nuova raccolta");
    if (!name?.trim()) return;
    setBusy(true);
    try {
      const created = await createCollection.mutateAsync({ name });
      if (created?.id) {
        await addItem.mutateAsync({ collectionId: created.id, programSlug, episodeSlug, label });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50"
        >
          <ListPlus className="h-3.5 w-3.5" /> Raccolta
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Aggiungi a…</DropdownMenuLabel>
        {collections.length === 0 && (
          <DropdownMenuItem disabled>Nessuna raccolta</DropdownMenuItem>
        )}
        {collections.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onSelect={() =>
              addItem.mutate({ collectionId: c.id, programSlug, episodeSlug, label })
            }
          >
            {c.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void createAndAdd()}>
          Nuova raccolta…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

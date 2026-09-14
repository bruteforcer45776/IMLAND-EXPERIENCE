import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

/**
 * Barra di ricerca di sezione: coerente con la search globale,
 * invia la query alla pagina /cerca su tutti i contenuti del sito.
 */
export function SectionSearch({
  placeholder = "Cerca su IMLAND…",
  label = "Cerca",
}: {
  placeholder?: string;
  label?: string;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        if (q.length < 2) return;
        navigate({ to: "/cerca", search: { q } });
      }}
      className="flex w-full max-w-xl items-center gap-2 rounded-full border border-outline bg-card px-4 py-2"
    >
      <Search size={18} className="shrink-0 text-muted-foreground" aria-hidden />
      <label htmlFor={`search-${label}`} className="sr-only">
        {label}
      </label>
      <input
        id={`search-${label}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="h-9 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
      />
      <button type="submit" className="shrink-0 rounded-full btn-blue px-4 py-2 text-sm">
        Cerca
      </button>
    </form>
  );
}

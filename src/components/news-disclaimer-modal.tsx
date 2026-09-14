import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "imland-news-disclaimer";

export function NewsDisclaimerModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setOpen(true);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-xl rounded-3xl border border-border bg-background p-6 shadow-2xl md:p-8">
        <button
          onClick={() => {
            setOpen(false);
            if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, "1");
          }}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
          aria-label="Chiudi"
        >
          <X className="h-5 w-5" />
        </button>
        <p className="text-xs font-semibold uppercase tracking-wider text-signal">Informazione</p>
        <h2 className="mt-3 text-h3-im">IMLAND News è un hub territoriale.</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Ricorda: IMLAND News non è una testata giornalistica, ma un hub territoriale indipendente che riunisce le notizie delle maggiori testate giornalistiche del territorio in un'unica piattaforma.
        </p>
        <button
          onClick={() => {
            setOpen(false);
            if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, "1");
          }}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Ho capito
        </button>
      </div>
    </div>
  );
}

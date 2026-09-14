import { useEffect, useState } from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useShares, shareUrl } from "@/hooks/use-listener";
import { formatEpisodeDate } from "@/lib/listener-catalog";

type Props = {
  programSlug: string;
  programName: string;
  episodeSlug: string;
  title: string;
  cover?: string;
  date?: string | null;
  compact?: boolean;
};

/** Genera un link di condivisione per la puntata e mostra l'anteprima. */
export function ShareEpisodeDialog({
  programSlug,
  programName,
  episodeSlug,
  title,
  cover,
  date,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { shares, createShare } = useShares();
  const share = shares.find((s) => s.episode_slug === episodeSlug && s.channel === "link");
  const url = share ? shareUrl(share.token) : "";

  useEffect(() => {
    if (!open || share || createShare.isPending) return;
    createShare.mutate({ programSlug, episodeSlug, title });
  }, [open, share, createShare, programSlug, episodeSlug, title]);

  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copiato negli appunti.");
    window.setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `${programName} — ${title}`, url });
        return;
      } catch {
        /* condivisione annullata */
      }
    }
    await copy();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
        >
          <Share2 className="h-3.5 w-3.5" /> {compact ? "" : "Condividi"}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Condividi la puntata</DialogTitle>
          <DialogDescription>
            Invita amici, clienti e la tua rete ad ascoltare. Il link porta diretto alla puntata.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex gap-4 p-4">
            {cover && (
              <img
                src={cover}
                alt=""
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {programName}
              </p>
              <p className="mt-1 truncate text-sm font-semibold">{title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatEpisodeDate(date)}</p>
              <p className="mt-2 text-xs text-muted-foreground">IMLAND EXPERIENCE · Podcast</p>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2">
          <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-xs">{url || "Generazione del link…"}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copy()}
            disabled={!url}
            className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copiato" : "Copia link"}
          </button>
          <button
            type="button"
            onClick={() => void nativeShare()}
            disabled={!url}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-50"
          >
            <Share2 className="h-3.5 w-3.5" /> Condividi
          </button>
          {url && (
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${programName} — ${title} ${url}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
            >
              WhatsApp
            </a>
          )}
          {share && (
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-2 text-xs text-muted-foreground">
              {share.click_count} persone raggiunte
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

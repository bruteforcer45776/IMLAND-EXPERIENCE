import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getNowPlaying, type NowPlayingData } from "@/lib/tunein.functions";

export function useNowPlaying() {
  const fetchNP = useServerFn(getNowPlaying);
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      try {
        const next = await fetchNP();
        if (cancelled) return;
        setData(next);
        setError(null);
        const ms = Math.max(10, Math.min(60, next.ttl || 20)) * 1000;
        timer = setTimeout(tick, ms);
      } catch (e) {
        if (cancelled) return;
        setError(e as Error);
        timer = setTimeout(tick, 30_000);
      }
    }

    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [fetchNP]);

  return { data, error };
}

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  Mic,
  Music2,
  Radio as RadioIcon,
  AlertTriangle,
  Loader2,
  RotateCw,
  X,
} from "lucide-react";
import { useNowPlaying } from "@/hooks/use-now-playing";
import { usePlayer } from "./player-context";
import { podcastAudio, registerRadioStop } from "./podcast-audio";

const RADIO_STREAM_URL = "https://stream.aiir.com/ylpompusqpatv";

type StreamStatus = "idle" | "loading" | "playing" | "error";

export function RadioPlayer() {
  const { open, setOpen, playing, setPlaying } = usePlayer();
  const [volume, setVolume] = useState(60);
  const [muted, setMuted] = useState(false);
  const { data: np, error: npError } = useNowPlaying();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const notifiedRef = useRef(false);
  // Il pannello si apre e si chiude solo al click: niente apertura all'hover,
  // così la X chiude davvero e il pulsante riapre sempre.
  const expanded = open;

  const effectiveVolume = muted ? 0 : volume;
  const trackTitle = np?.trackTitle ?? "Voci di quartiere";
  const trackArtist = np?.trackArtist ?? "Giulia Rinaldi";
  const artwork = np?.trackImage ?? np?.stationImage ?? null;
  const stationName = np?.stationName ?? "IMLAND Radio";

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = effectiveVolume / 100;
  }, [effectiveVolume]);

  // Audio element event listeners for accurate status
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onWaiting = () => setStatus((s) => (s === "error" ? s : "loading"));
    const onPlaying = () => {
      setStatus("playing");
      setErrorMsg(null);
      notifiedRef.current = false;
    };
    const onPause = () => {
      setStatus((s) => (s === "error" ? s : "idle"));
      // iOS: dopo una chiamata il sistema mette in pausa lo stream.
      // Sincronizziamo lo stato così l'effetto stacca la sorgente
      // ed evita che iOS riprenda l'audio in background.
      setPlaying(false);
    };
    const onError = () => {
      const msg = !navigator.onLine
        ? "Sei offline. Controlla la connessione e riprova."
        : "Trasmissione non disponibile al momento. Riprova più tardi.";
      setStatus("error");
      setErrorMsg(msg);
      setPlaying(false);
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        toast.error("Radio non disponibile", { description: msg });
      }
    };
    const onStalled = () => setStatus((s) => (s === "playing" ? "loading" : s));
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("pause", onPause);
    a.addEventListener("error", onError);
    a.addEventListener("stalled", onStalled);
    return () => {
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("error", onError);
      a.removeEventListener("stalled", onStalled);
    };
  }, [setPlaying]);

  // Start / stop stream when `playing` toggles
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      setStatus("loading");
      setErrorMsg(null);
      notifiedRef.current = false;
      // Reload stream when starting to avoid stale buffer for live audio
      a.src = RADIO_STREAM_URL;
      const p = a.play();
      if (p && typeof p.catch === "function") {
        p.catch((err: unknown) => {
          const name = (err as { name?: string })?.name;
          setPlaying(false);
          if (name === "NotAllowedError") {
            setStatus("idle");
            toast.error("Riproduzione bloccata dal browser", {
              description: "Tocca di nuovo il pulsante Play per avviare la radio.",
            });
          } else {
            setStatus("error");
            const msg = "Impossibile avviare lo stream. Riprova.";
            setErrorMsg(msg);
            if (!notifiedRef.current) {
              notifiedRef.current = true;
              toast.error("Radio non disponibile", { description: msg });
            }
          }
        });
      }
    } else {
      a.pause();
      // Detach source so we don't keep buffering while paused
      a.removeAttribute("src");
      a.load();
    }
  }, [playing, setPlaying]);

  // Sync with the podcast player: only one audio source at a time
  useEffect(() => registerRadioStop(() => setPlaying(false)), [setPlaying]);
  useEffect(() => {
    if (playing) podcastAudio.pause();
  }, [playing]);

  // Watch offline transitions
  useEffect(() => {
    const onOffline = () => {
      if (playing) {
        toast.error("Connessione persa", {
          description: "Riproviamo appena torni online.",
        });
      }
    };
    // iOS: quando l'utente riceve/termina una chiamata l'app va in background.
    // Fermiamo lo stream così non riparte da solo dietro le quinte.
    const onPageHide = () => {
      const a = audioRef.current;
      if (a && !a.paused) {
        a.pause();
      }
      setPlaying(false);
    };
    window.addEventListener("offline", onOffline);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [playing, setPlaying]);

  const retry = useCallback(() => {
    setErrorMsg(null);
    setStatus("loading");
    setPlaying(true);
  }, [setPlaying]);

  // Surface a soft warning if the "now playing" feed is broken (metadata only,
  // the stream itself may still work).
  useEffect(() => {
    if (npError) {
      console.warn("Now-playing feed error:", npError);
    }
  }, [npError]);

  return (
    <>
      <audio ref={audioRef} preload="none" crossOrigin="anonymous" />

      <div
        role="complementary"
        aria-label="Player IMLAND Radio"
        data-surface="dark"
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 z-50 md:bottom-6 md:left-6"
      >
        {expanded && (
          <div className="absolute bottom-[4.5rem] left-0 w-[min(92vw,380px)] origin-bottom-left animate-enter rounded-[28px] border border-white/10 bg-ink/95 p-5 text-white shadow-2xl backdrop-blur-xl md:bottom-0 md:left-[4.5rem] md:origin-bottom-left">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-2 w-2 rounded-full ${status === "error" ? "bg-[#c5221f]" : "bg-citrus"}`}
                />
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${status === "error" ? "text-alert" : "text-citrus"}`}
                >
                  {status === "error" ? "Offline" : "On air"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Chiudi player"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-4">
              {artwork ? (
                <img
                  src={artwork}
                  alt={trackTitle}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-white/15 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60">
                  <RadioIcon size={26} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold leading-tight">{trackTitle}</h3>
                <p className="mt-1 truncate text-sm text-white/60">
                  {trackArtist ? `${trackArtist} · ${stationName}` : stationName}
                </p>
                {status === "loading" && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-white/50">
                    <Loader2 size={11} className="animate-spin" /> Connessione…
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-alert">
                    <AlertTriangle size={11} /> {errorMsg ?? "Radio non disponibile"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={() => (status === "error" ? retry() : setPlaying(!playing))}
                aria-label={
                  status === "error"
                    ? "Riprova"
                    : status === "loading"
                      ? "Caricamento"
                      : playing
                        ? "Pausa"
                        : "Play"
                }
                className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white transition hover:opacity-90 ${
                  status === "error" ? "bg-[#c5221f]" : "bg-[var(--error)]"
                }`}
              >
                {playing && status === "playing" && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
                )}
                {status === "loading" ? (
                  <Loader2 size={22} className="relative animate-spin" />
                ) : status === "error" ? (
                  <RotateCw size={22} className="relative" />
                ) : playing ? (
                  <Pause size={22} className="relative fill-current" />
                ) : (
                  <Play size={22} className="relative fill-current" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/50">
                  <span>Volume</span>
                  <span>{effectiveVolume}%</span>
                </div>
                <div className="mt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMuted(!muted)}
                    aria-label={muted ? "Riattiva audio" : "Silenzia"}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
                  >
                    {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={effectiveVolume}
                    onChange={(e) => {
                      setMuted(false);
                      setVolume(Number(e.target.value));
                    }}
                    aria-label="Volume"
                    className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-signal"
                    style={{
                      background: `linear-gradient(to right, var(--signal) 0%, var(--signal) ${effectiveVolume}%, rgba(255,255,255,0.15) ${effectiveVolume}%, rgba(255,255,255,0.15) 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Live waveform */}
            <div className="mt-4 flex h-5 items-center gap-[3px]" aria-hidden>
              {[4, 7, 5, 9, 6, 8, 5, 7, 6, 9, 5, 7].map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-white/60"
                  style={{
                    height: `${h * 2}px`,
                    animation: playing
                      ? `imland-bar 900ms ease-in-out ${i * 90}ms infinite alternate`
                      : "none",
                  }}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
              <a
                href="tel:+390000000000"
                className="btn-blue inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold"
              >
                <Mic size={14} />
                Parlaci in diretta
              </a>
              <Link
                to="/contatti"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold transition hover:bg-white/10"
              >
                <Music2 size={14} />
                Proponi un brano
              </Link>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={expanded}
          aria-label={expanded ? "Chiudi il pannello del player" : "Apri il player radio"}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition hover:scale-105 md:h-16 md:w-16 ${
            status === "error" ? "bg-[#c5221f]" : "bg-[var(--error)]"
          }`}
        >
          {playing && status === "playing" && (
            <span className="absolute inset-0 animate-ping rounded-full bg-white/25" />
          )}
          {status === "loading" ? (
            <Loader2 size={24} className="relative animate-spin" />
          ) : status === "error" ? (
            <RotateCw size={24} className="relative" />
          ) : playing ? (
            <Pause size={24} className="relative fill-current" />
          ) : (
            <Play size={24} className="relative ml-0.5 fill-current" />
          )}
        </button>
      </div>

      <style>{`
        @keyframes imland-bar {
          from { transform: scaleY(0.5); }
          to { transform: scaleY(1.4); }
        }
      `}</style>
    </>
  );
}

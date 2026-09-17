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
  ChevronDown,
  ChevronUp,
  X,
  AudioLines,
  Copy,
  Check,
  Smartphone,
} from "lucide-react";
import { useNowPlaying } from "@/hooks/use-now-playing";
import { usePlayer } from "./player-context";
import { podcastAudio, registerRadioStop } from "./podcast-audio";

const RADIO_STREAM_URL = "https://stream.aiir.com/ylpompusqpatv";

type StreamStatus = "idle" | "loading" | "playing" | "error";
type PartyChannel = "left" | "stereo" | "right";

const PARTY_QUERY_KEY = "party";
const PARTY_LEAD_MS = 8_000;

export function RadioPlayer() {
  const { open, setOpen, playing, setPlaying } = usePlayer();
  const [volume, setVolume] = useState(60);
  const [muted, setMuted] = useState(false);
  const { data: np, error: npError } = useNowPlaying();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [partyPanelOpen, setPartyPanelOpen] = useState(false);
  const [partyActive, setPartyActive] = useState(false);
  const [partyStartAt, setPartyStartAt] = useState<number | null>(null);
  const [partyChannel, setPartyChannel] = useState<PartyChannel>("stereo");
  const [partyCopied, setPartyCopied] = useState(false);
  const [partyCountdown, setPartyCountdown] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const stereoPannerRef = useRef<StereoPannerNode | null>(null);
  const notifiedRef = useRef(false);
  // Il pannello si apre e si chiude solo al click: niente apertura all'hover,
  // così la X chiude davvero e il pulsante riapre sempre.
  const expanded = open;

  const effectiveVolume = muted ? 0 : volume;
  const trackTitle = np?.trackTitle ?? "IMLAND Radio in diretta";
  const trackArtist = np?.trackArtist ?? "";
  const artwork = np?.trackImage ?? np?.stationImage ?? null;
  const stationName = np?.stationName ?? "IMLAND Radio";

  const enableStereoChannel = useCallback(async (channel: PartyChannel) => {
    const audio = audioRef.current;
    if (!audio) return false;
    try {
      if (!audioContextRef.current) {
        const context = new AudioContext();
        const source = context.createMediaElementSource(audio);
        const panner = context.createStereoPanner();
        source.connect(panner).connect(context.destination);
        audioContextRef.current = context;
        audioSourceRef.current = source;
        stereoPannerRef.current = panner;
      }
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      stereoPannerRef.current!.pan.value = channel === "left" ? -1 : channel === "right" ? 1 : 0;
      return true;
    } catch {
      toast.error("Canale stereo non disponibile", {
        description: "La radio resta attiva in modalità stereo standard su questo browser.",
      });
      return false;
    }
  }, []);

  const joinParty = useCallback(
    async (startAt: number, channel: PartyChannel = "stereo") => {
      setPartyActive(true);
      setPartyPanelOpen(true);
      setPartyStartAt(startAt);
      setPartyChannel(channel);
      await enableStereoChannel(channel);
      const delay = Math.max(0, startAt - Date.now());
      setPlaying(false);
      window.setTimeout(() => setPlaying(true), delay);
    },
    [enableStereoChannel, setPlaying],
  );

  const createParty = useCallback(async () => {
    const startAt = Date.now() + PARTY_LEAD_MS;
    const url = new URL(window.location.href);
    url.searchParams.set(PARTY_QUERY_KEY, String(startAt));
    url.searchParams.set("channel", partyChannel);
    window.history.replaceState({}, "", url);
    await joinParty(startAt, partyChannel);
    try {
      await navigator.clipboard.writeText(url.toString());
      setPartyCopied(true);
      window.setTimeout(() => setPartyCopied(false), 2200);
      toast.success("Link Party copiato", {
        description: "Aprilo sugli altri dispositivi prima del conto alla rovescia.",
      });
    } catch {
      toast.success("Modalità Party pronta", {
        description: "Condividi l’indirizzo di questa pagina con gli altri dispositivi.",
      });
    }
  }, [joinParty, partyChannel]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawStart = Number(params.get(PARTY_QUERY_KEY));
    const rawChannel = params.get("channel");
    if (!Number.isFinite(rawStart) || rawStart <= 0) return;
    const channel: PartyChannel = rawChannel === "left" || rawChannel === "right" ? rawChannel : "stereo";
    void joinParty(rawStart, channel);
  }, [joinParty]);

  useEffect(() => {
    if (!partyActive || !partyStartAt) return;
    const update = () => setPartyCountdown(Math.max(0, partyStartAt - Date.now()));
    update();
    const interval = window.setInterval(update, 100);
    return () => window.clearInterval(interval);
  }, [partyActive, partyStartAt]);

  useEffect(() => {
    if (!partyActive) return;
    void enableStereoChannel(partyChannel);
    const url = new URL(window.location.href);
    url.searchParams.set("channel", partyChannel);
    window.history.replaceState({}, "", url);
  }, [enableStereoChannel, partyActive, partyChannel]);

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
        data-floating-radio-player
        className="floating-radio-player fixed inset-x-3 z-50 md:inset-x-6"
      >
        {expanded && (
          <div className="radio-player-glass absolute bottom-[4.75rem] left-0 max-h-[min(70vh,620px)] w-[min(92vw,420px)] origin-bottom-left overflow-y-auto rounded-[28px] p-5 text-white animate-enter">
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
                  status === "error" ? "bg-[#c5221f]" : "bg-[var(--color-icon-radio)]"
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
                    className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
                    style={{
                      accentColor: "#168cf2",
                      background: `linear-gradient(to right, #168cf2 0%, #168cf2 ${effectiveVolume}%, rgba(255,255,255,0.15) ${effectiveVolume}%, rgba(255,255,255,0.15) 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4" aria-label="Avanzamento della diretta">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/55">
                <span>Diretta</span>
                <span>Live</span>
              </div>
              <div
                role="progressbar"
                aria-valuetext="Trasmissione in diretta"
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15"
              >
                <span className="block h-full w-2/3 rounded-full bg-signal" />
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

            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setPartyPanelOpen((value) => !value)}
                aria-expanded={partyPanelOpen}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-[#f28c18] px-4 py-3 text-left text-white transition hover:bg-[#dc7910] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <AudioLines size={20} aria-hidden />
                  <span>
                    <span className="block text-sm font-extrabold tracking-wide">MODALITÀ PARTY</span>
                    <span className="block text-xs text-white/80">Sincronizza più dispositivi vicini</span>
                  </span>
                </span>
                {partyActive ? (
                  <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase">Attiva</span>
                ) : (
                  <ChevronDown className={`shrink-0 transition-transform ${partyPanelOpen ? "rotate-180" : ""}`} size={18} />
                )}
              </button>

              {partyPanelOpen && (
                <div className="mt-3 rounded-2xl border border-white/15 bg-black/20 p-4">
                  <p className="text-sm font-semibold">Un’unica diretta, più casse.</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/65">
                    Apri lo stesso link sui dispositivi vicini: partiranno insieme. La precisione può variare leggermente in base alla rete.
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Canale audio del dispositivo">
                    {(["left", "stereo", "right"] as const).map((channel) => (
                      <button
                        key={channel}
                        type="button"
                        onClick={() => setPartyChannel(channel)}
                        aria-pressed={partyChannel === channel}
                        className={`rounded-xl px-2 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                          partyChannel === channel ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/15"
                        }`}
                      >
                        {channel === "left" ? "Sinistra" : channel === "right" ? "Destra" : "Stereo"}
                      </button>
                    ))}
                  </div>

                  {partyActive && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-semibold">
                      <Smartphone size={15} aria-hidden />
                      {partyCountdown > 0
                        ? `Avvio sincronizzato tra ${(partyCountdown / 1000).toFixed(1)} s`
                        : status === "playing"
                          ? "Dispositivo sincronizzato e in ascolto"
                          : "Sessione pronta: avvia la radio per rientrare nella diretta"}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => void createParty()}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f28c18]"
                  >
                    {partyCopied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                    {partyActive ? "Copia di nuovo il link" : "Crea e copia il link Party"}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
              <a
                href="tel:+393514323003"
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

        <div
          className={`radio-player-glass flex h-16 items-center gap-3 rounded-[20px] px-3 text-white md:h-[68px] md:px-4 ${
            status === "error" ? "ring-2 ring-[#c5221f]" : ""
          }`}
        >
          {artwork ? (
            <img src={artwork} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover md:h-12 md:w-12" />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/75 md:h-12 md:w-12">
              <RadioIcon size={20} aria-hidden />
            </span>
          )}

          <button
            type="button"
            onClick={() => (status === "error" ? retry() : setPlaying(!playing))}
            aria-label={status === "error" ? "Riprova" : playing ? "Pausa" : "Riproduci la radio"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink-950 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {status === "loading" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : status === "error" ? (
              <RotateCw size={18} />
            ) : playing ? (
              <Pause size={18} className="fill-current" />
            ) : (
              <Play size={18} className="ml-0.5 fill-current" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold md:text-[15px]">{trackTitle}</p>
            <p className="truncate text-xs text-white/65">{trackArtist ? `${trackArtist} · ${stationName}` : stationName}</p>
          </div>

          <div className="hidden w-[min(24vw,260px)] items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              aria-label={muted ? "Riattiva audio" : "Silenzia"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15"
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={effectiveVolume}
              onChange={(event) => {
                setMuted(false);
                setVolume(Number(event.target.value));
              }}
              aria-label="Volume"
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full"
              style={{
                accentColor: "#168cf2",
                background: `linear-gradient(to right, #168cf2 0%, #168cf2 ${effectiveVolume}%, rgba(255,255,255,0.15) ${effectiveVolume}%, rgba(255,255,255,0.15) 100%)`,
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={expanded}
            aria-label={expanded ? "Chiudi il pannello del player" : "Apri il player radio"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {expanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
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

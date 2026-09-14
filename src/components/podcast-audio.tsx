import { useState, useSyncExternalStore } from "react";

export type PlayingTrack = {
  audio: string;
  title: string;
  program: string;
  programSlug: string;
  episodeSlug: string;
  cover: string;
};

type State = {
  track: PlayingTrack | null;
  playing: boolean;
  time: number;
  duration: number;
};

/** Identità stabile di una puntata: alcune puntate condividono lo stesso file audio. */
export function trackKey(t: { programSlug: string; episodeSlug: string }) {
  return `${t.programSlug}/${t.episodeSlug}`;
}

let state: State = { track: null, playing: false, time: 0, duration: 0 };
const listeners = new Set<() => void>();
let el: HTMLAudioElement | null = null;
let pendingResume: (() => void) | null = null;

const STORE_KEY = "im-podcast-progress";

type Persisted = { positions: Record<string, number>; last: PlayingTrack | null };
let persisted: Persisted = { positions: {}, last: null };
let restored = false;

function loadPersisted() {
  if (restored || typeof window === "undefined") return;
  restored = true;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Persisted;
      persisted = { positions: parsed?.positions ?? {}, last: parsed?.last ?? null };
    }
  } catch {
    /* ignore corrupted storage */
  }
}

function savePersisted() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(persisted));
  } catch {
    /* storage full or unavailable */
  }
}

/** Last known playback position for an episode audio URL (seconds). */
export function getSavedPosition(audioUrl: string) {
  loadPersisted();
  return persisted.positions[audioUrl] ?? 0;
}

/** All saved playback positions, keyed by audio URL. */
export function getSavedPositions(): Record<string, number> {
  loadPersisted();
  return { ...persisted.positions };
}

/** Last episode the user was listening to, if any. */
export function getLastTrack(): PlayingTrack | null {
  loadPersisted();
  return persisted.last;
}

/**
 * Unisce le posizioni salvate sul server con quelle locali, tenendo la più
 * avanzata: permette di riprendere una puntata anche da un altro dispositivo.
 */
export function primeSavedPositions(remote: Record<string, number>) {
  loadPersisted();
  let changed = false;
  for (const [audio, position] of Object.entries(remote)) {
    if (!isFinite(position) || position <= 0) continue;
    if ((persisted.positions[audio] ?? 0) < position) {
      persisted.positions[audio] = position;
      changed = true;
    }
  }
  if (changed) savePersisted();
}

function rememberPosition(t: number) {
  const src = state.track?.audio;
  if (!src || !isFinite(t)) return;
  persisted.positions[src] = t;
  persisted.last = state.track;
  savePersisted();
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function audio() {
  if (typeof window === "undefined") return null;
  loadPersisted();
  if (!el) {
    el = new Audio();
    el.preload = "metadata";
    let lastSaved = 0;
    el.addEventListener("timeupdate", () => {
      const t = el!.currentTime;
      set({ time: t });
      if (Math.abs(t - lastSaved) >= 3) {
        lastSaved = t;
        rememberPosition(t);
      }
    });
    el.addEventListener("loadedmetadata", () => set({ duration: el!.duration }));
    el.addEventListener("play", () => set({ playing: true }));
    el.addEventListener("pause", () => {
      set({ playing: false });
      rememberPosition(el!.currentTime);
    });
    el.addEventListener("ended", () => {
      const src = state.track?.audio;
      if (src) delete persisted.positions[src];
      savePersisted();
      set({ playing: false, time: 0 });
    });
    window.addEventListener("pagehide", () => rememberPosition(el!.currentTime));
  }
  return el;
}

/** Registry used by the radio player so radio and podcast never play together. */
let stopRadio: (() => void) | null = null;
export function registerRadioStop(fn: () => void) {
  stopRadio = fn;
  return () => {
    if (stopRadio === fn) stopRadio = null;
  };
}

export const podcastAudio = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get() {
    return state;
  },
  toggle(track: PlayingTrack) {
    const a = audio();
    if (!a) return;
    if (state.track && trackKey(state.track) === trackKey(track)) {
      if (a.paused) {
        stopRadio?.();
        void a.play();
      } else a.pause();
      return;
    }
    stopRadio?.();
    // salva il punto della puntata che stiamo lasciando
    if (state.track && isFinite(a.currentTime) && a.currentTime > 0)
      rememberPosition(a.currentTime);
    // annulla un eventuale resume ancora pendente della puntata precedente
    if (pendingResume) {
      a.removeEventListener("loadedmetadata", pendingResume);
      pendingResume = null;
    }
    a.pause();
    a.src = track.audio;
    a.load();
    const resumeAt = getSavedPosition(track.audio);
    set({ track, time: resumeAt, duration: 0, playing: false });
    const applyResume = () => {
      pendingResume = null;
      set({ duration: a.duration });
      if (resumeAt > 0 && isFinite(a.duration) && resumeAt < a.duration - 1) {
        a.currentTime = resumeAt;
        set({ time: resumeAt });
      } else {
        set({ time: a.currentTime });
      }
    };
    pendingResume = applyResume;
    a.addEventListener("loadedmetadata", applyResume, { once: true });
    void a.play();
  },
  seek(t: number) {
    const a = audio();
    if (a && state.track) {
      a.currentTime = t;
      set({ time: t });
      rememberPosition(t);
    }
  },

  pause() {
    const a = audio();
    if (a && !a.paused) a.pause();
  },
  stop() {
    const a = audio();
    if (a) {
      if (isFinite(a.currentTime) && a.currentTime > 0) rememberPosition(a.currentTime);
      if (pendingResume) {
        a.removeEventListener("loadedmetadata", pendingResume);
        pendingResume = null;
      }
      a.pause();
      a.removeAttribute("src");
      a.load();
    }
    set({ track: null, playing: false, time: 0, duration: 0 });
  },
};

const serverSnapshot: State = { track: null, playing: false, time: 0, duration: 0 };

export function usePodcastAudio() {
  return useSyncExternalStore(podcastAudio.subscribe, podcastAudio.get, () => serverSnapshot);
}

export function fmtTime(t: number) {
  if (!isFinite(t) || t <= 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayIcon({
  playing,
  className = "h-4 w-4",
}: {
  playing: boolean;
  className?: string;
}) {
  return playing ? (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/** Floating mini-player shown while a podcast episode is playing. */
export function PodcastMiniPlayer() {
  const { track, playing, time, duration } = usePodcastAudio();
  const [open, setOpen] = useState(false);
  if (!track) return null;
  const expanded = open;

  return (
    <aside
      aria-label="Player podcast"
      data-surface="dark"
      className="fixed bottom-[calc(9.75rem+env(safe-area-inset-bottom))] left-4 z-40 md:bottom-[7rem] md:left-6"
    >
      {expanded && (
        <div className="absolute bottom-[4.25rem] left-0 w-[min(92vw,360px)] origin-bottom-left animate-enter rounded-[24px] border border-white/10 bg-ink/95 p-4 text-white shadow-2xl backdrop-blur-xl md:bottom-0 md:left-[4.25rem]">
          <div className="flex items-center gap-3">
            <img
              loading="lazy"
              decoding="async"
              src={track.cover}
              alt=""
              className="h-14 w-14 shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight">{track.title}</p>
              <p className="mt-0.5 truncate text-xs text-white/60">{track.program}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                podcastAudio.stop();
              }}
              aria-label="Chiudi il player"
              className="shrink-0 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.41 6.29 6.3-6.3 6.29 1.41 1.41 6.3-6.29 6.29 6.29 1.41-1.41-6.29-6.29 6.29-6.3z" />
              </svg>
            </button>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => podcastAudio.toggle(track)}
              aria-label={playing ? "Metti in pausa" : "Riprendi"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal text-white transition hover:opacity-90"
            >
              <PlayIcon playing={playing} className="h-5 w-5" />
            </button>
            <div className="flex flex-1 items-center gap-2.5">
              <span className="w-9 text-right text-xs tabular-nums text-white/60">
                {fmtTime(time)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={Math.min(time, duration || 0)}
                disabled={!duration}
                onChange={(e) => podcastAudio.seek(Number(e.target.value))}
                aria-label="Avanzamento episodio"
                className="h-1.5 flex-1 cursor-pointer accent-[var(--signal)]"
              />
              <span className="w-9 text-xs tabular-nums text-white/60">{fmtTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={expanded}
        aria-label={expanded ? "Chiudi i controlli podcast" : `Apri i controlli di ${track.title}`}
        className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 shadow-xl transition hover:scale-105 md:h-16 md:w-16"
      >
        <img
          loading="lazy"
          decoding="async"
          src={track.cover}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-black/40" />
        <PlayIcon playing={playing} className="relative h-6 w-6 text-white" />
      </button>
    </aside>
  );
}

/** Round play/pause trigger for an episode. */
export function EpisodePlayButton({
  track,
  className = "",
  label,
}: {
  track: PlayingTrack;
  className?: string;
  label?: string;
}) {
  const { track: current, playing } = usePodcastAudio();
  const isCurrent = Boolean(current && trackKey(current) === trackKey(track));
  const isPlaying = isCurrent && playing;
  return (
    <button
      type="button"
      onClick={() => podcastAudio.toggle(track)}
      aria-label={`${isPlaying ? "Metti in pausa" : "Ascolta"} ${track.title}`}
      className={`inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 ${className}`}
    >
      <PlayIcon playing={isPlaying} className="h-3.5 w-3.5" />
      {label ?? (isPlaying ? "In pausa" : "Ascolta")}
    </button>
  );
}

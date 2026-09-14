import { createContext, useContext, useState, type ReactNode } from "react";

type PlayerState = {
  open: boolean;
  setOpen: (value: boolean) => void;
  playing: boolean;
  setPlaying: (value: boolean) => void;
  toggleOpen: () => void;
  togglePlaying: () => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <PlayerContext.Provider
      value={{
        open,
        setOpen,
        playing,
        setPlaying,
        toggleOpen: () => setOpen((o) => !o),
        togglePlaying: () => setPlaying((p) => !p),
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
}

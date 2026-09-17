import { createContext, useContext, useState, type ReactNode } from "react";

type PlayerState = {
  open: boolean;
  setOpen: (value: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (value: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  playing: boolean;
  setPlaying: (value: boolean) => void;
  toggleOpen: () => void;
  togglePlaying: () => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [activePanel, setActivePanel] = useState<"player" | "chatbot" | "menu" | null>(null);
  const [playing, setPlaying] = useState(false);

  const setPanelOpen = (panel: "player" | "chatbot" | "menu", value: boolean) => {
    setActivePanel((current) => (value ? panel : current === panel ? null : current));
  };

  const open = activePanel === "player";
  const chatOpen = activePanel === "chatbot";
  const menuOpen = activePanel === "menu";

  return (
    <PlayerContext.Provider
      value={{
        open,
        setOpen: (value) => setPanelOpen("player", value),
        chatOpen,
        setChatOpen: (value) => setPanelOpen("chatbot", value),
        menuOpen,
        setMenuOpen: (value) => setPanelOpen("menu", value),
        playing,
        setPlaying,
        toggleOpen: () => setPanelOpen("player", !open),
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

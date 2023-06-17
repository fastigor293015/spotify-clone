import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PlayerStore {
  isPlaying: boolean;
  ids: string[];
  activeId?: string;
  volume: number;
  play?: () => void;
  pause?: () => void;
  setIsPlaying: (value: boolean) => void;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setVolume: (value: number) => void;
  reset: () => void;
};

const usePlayer = create<PlayerStore>()(
  persist(
    (set) => ({
      isPlaying: false,
      ids: [],
      activeId: undefined,
      volume: 1,
      play: undefined,
      pause: undefined,
      setIsPlaying: (value: boolean) => set({ isPlaying: value }),
      setId: (id: string) => set({ activeId: id }),
      setIds: (ids: string[]) => set({ ids }),
      setVolume: (value: number) => set({ volume: value }),
      reset: () => set({ ids: [], activeId: undefined })
    }),
    {
      name: "player-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default usePlayer;

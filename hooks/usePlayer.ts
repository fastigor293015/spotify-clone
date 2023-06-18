import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PlayerStore {
  isPlaying: boolean;
  ids: string[];
  activeId?: string;
  volume: number;
  isMobilePlayerOpen: boolean;
  play?: () => void;
  pause?: () => void;
  setIsPlaying: (value: boolean) => void;
  onPlayNext: () => void;
  onPlayPrev: () => void;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setVolume: (value: number) => void;
  reset: () => void;
  setIsMobilePlayerOpen: (value: boolean) => void;
};

const usePlayer = create<PlayerStore>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      ids: [],
      activeId: undefined,
      volume: 1,
      isMobilePlayerOpen: false,
      play: undefined,
      pause: undefined,
      setIsPlaying: (value: boolean) => set({ isPlaying: value }),
      onPlayNext: () => {
        if (get().ids.length === 0) {
          return;
        }

        const curIndex = get().ids.findIndex((id) => id === get().activeId);
        const nextSong = get().ids[curIndex + 1];

        if (!nextSong) {
          return get().setId(get().ids[0]);
        }

        get().setId(nextSong);
      },
      onPlayPrev: () => {
        if (get().ids.length === 0) {
          return;
        }

        const curIndex = get().ids.findIndex((id) => id === get().activeId);
        const prevSong = get().ids[curIndex - 1];

        if (!prevSong) {
          return get().setId(get().ids[get().ids.length - 1]);
        }

        get().setId(prevSong);
      },
      setId: (id: string) => set({ activeId: id }),
      setIds: (ids: string[]) => set({ ids }),
      setVolume: (value: number) => set({ volume: value }),
      reset: () => set({ ids: [], activeId: undefined }),
      setIsMobilePlayerOpen: (value: boolean) => set({ isMobilePlayerOpen: value })
    }),
    {
      name: "player-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default usePlayer;

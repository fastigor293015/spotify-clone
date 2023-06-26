import { toast } from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PlayerStore {
  isPlaying: boolean;
  ids: string[];
  activeId?: string;
  activeIndex: number;
  playlistId?: string;
  playlistName?: string;
  volume: number;
  isMobilePlayerOpen: boolean;
  play?: () => void;
  pause?: () => void;
  setIsPlaying: (value: boolean) => void;
  onPlayNext: () => void;
  onPlayPrev: () => void;
  setId: (id: string, index: number) => void;
  setIds: (ids: string[], playlistId?: string, playlistName?: string) => void;
  addToQueue: (ids: string[]) => void;
  removeFromQueue: (id: string, index: number) => void;
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
      activeIndex: 0,
      volume: 1,
      isMobilePlayerOpen: false,
      play: undefined,
      pause: undefined,
      setIsPlaying: (value: boolean) => set({ isPlaying: value }),
      onPlayNext: () => {
        if (get().ids.length === 0) {
          return;
        }

        const nextSong = get().ids[get().activeIndex + 1];

        if (!nextSong) {
          return get().setId(get().ids[0], 0);
        }

        get().setId(nextSong, get().activeIndex + 1);
      },
      onPlayPrev: () => {
        if (get().ids.length === 0) {
          return;
        }

        const prevSong = get().ids[get().activeIndex - 1];

        if (!prevSong) {
          return get().setId(get().ids[get().ids.length - 1], get().ids.length - 1);
        }

        get().setId(prevSong, get().activeIndex - 1);
      },
      setId: (id: string, index: number) => set({ activeId: id, activeIndex: index}),
      setIds: (ids: string[], playlistId?: string, playlistName?: string) => set({ ids, playlistId, playlistName }),
      addToQueue: (ids: string[]) => {
        set({ ids: [...get().ids, ...ids] });
        toast.success("Added to queue");
      },
      removeFromQueue: (id: string, index: number) => {
        if (get().ids[index] !== id) return toast.error("No such track in queue");

        set({ ids: get().ids.filter((songId, i) => i !== index) });
        toast.success("Removed from queue");
      },
      setVolume: (value: number) => set({ volume: value }),
      reset: () => set({
        isPlaying: false,
        ids: [],
        activeId: undefined,
        activeIndex: 0,
        isMobilePlayerOpen: false,
        play: undefined,
        pause: undefined,
      }),
      setIsMobilePlayerOpen: (value: boolean) => set({ isMobilePlayerOpen: value })
    }),
    {
      name: "player-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default usePlayer;

import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  volume: number;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setVolume: (value: number) => void;
  reset: () => void;
};

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  volume: 1,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids }),
  setVolume: (value: number) => set({ volume: value }),
  reset: () => set({ ids: [], activeId: undefined })
}));

export default usePlayer;

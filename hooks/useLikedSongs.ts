import { Song } from "@/types";
import { create } from "zustand";

interface LikedSongsStore {
  songs: string[];
  set: (songs: string[]) => void;
  toggle: (id: string) => void;
}

const useLikedSongs = create<LikedSongsStore>((set, get) => ({
  songs: [],
  set: (songs: string[]) => set({ songs }),
  toggle: (id: string) => {
    if (get().songs.findIndex((songId) => songId === id) >= 0) {
      return set({
        songs: get().songs.filter((songId, i) => songId !== id)
      })
    }

    return set({
      songs: [...get().songs, id],
    })
  }
}));

export default useLikedSongs;

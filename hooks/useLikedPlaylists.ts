import { create } from "zustand";

interface LikedPlaylistsStore {
  playlists: string[];
  set: (playlists: string[]) => void;
  toggle: (id: string) => void;
}

const useLikedPlaylists = create<LikedPlaylistsStore>((set, get) => ({
  playlists: [],
  set: (playlists: string[]) => set({ playlists }),
  toggle: (id: string) => {
    if (get().playlists.findIndex((songId) => songId === id) >= 0) {
      return set({
        playlists: get().playlists.filter((songId) => songId !== id)
      })
    }

    return set({
      playlists: [...get().playlists, id],
    })
  }
}));

export default useLikedPlaylists;

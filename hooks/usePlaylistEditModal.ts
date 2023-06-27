import { Playlist } from "@/types";
import { create } from "zustand";

interface PlaylistEditModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  playlistData: Playlist | null;
  setData: (data: Playlist) => void;
};

const usePlaylistEditModal = create<PlaylistEditModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  playlistData: null,
  setData: (data: Playlist) => set({ playlistData: { ...data } })
}));

export default usePlaylistEditModal;

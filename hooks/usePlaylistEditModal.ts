import { Playlist } from "@/types";
import { create } from "zustand";

type PlaylistWithPublicUrl = Playlist & {
  publicImageUrl: string | null;
}

interface PlaylistEditModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  playlistData: PlaylistWithPublicUrl | null;
  setData: (data: PlaylistWithPublicUrl) => void;
};

const usePlaylistEditModal = create<PlaylistEditModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  playlistData: null,
  setData: (data: PlaylistWithPublicUrl) => set({ playlistData: { ...data } })
}));

export default usePlaylistEditModal;

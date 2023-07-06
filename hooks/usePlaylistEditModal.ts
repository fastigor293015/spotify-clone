import { Playlist } from "@/types";
import { create } from "zustand";

export enum EPlaylistEditInputsIds {
  image = "playlist-edit-image",
  title = "playlist-edit-title",
  description = "playlist-edit-description",
}

interface PlaylistEditModalStore {
  isOpen: boolean;
  inputId?: EPlaylistEditInputsIds;
  onOpen: (inputId?: EPlaylistEditInputsIds) => void;
  onClose: () => void;
  playlistData: Playlist | null;
  setData: (data: Playlist) => void;
};

const usePlaylistEditModal = create<PlaylistEditModalStore>((set) => ({
  isOpen: false,
  inputId: undefined,
  onOpen: (inputId?: EPlaylistEditInputsIds) => set({ isOpen: true, inputId }),
  onClose: () => set({ isOpen: false, inputId: undefined }),
  playlistData: null,
  setData: (data: Playlist) => set({ playlistData: { ...data } })
}));

export default usePlaylistEditModal;

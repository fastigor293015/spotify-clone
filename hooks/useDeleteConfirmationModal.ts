import { Playlist } from "@/types";
import { create } from "zustand";

interface DeleteConfirmationModalStore {
  isOpen: boolean;
  playlist?: Playlist;
  onOpen: (playlist: Playlist) => void;
  onClose: () => void;
};

const useDeleteConfirmationModal = create<DeleteConfirmationModalStore>((set) => ({
  isOpen: false,
  playlist: undefined,
  onOpen: (playlist: Playlist) => set({ isOpen: true, playlist }),
  onClose: () => set({ isOpen: false, playlist: undefined }),
}));

export default useDeleteConfirmationModal;

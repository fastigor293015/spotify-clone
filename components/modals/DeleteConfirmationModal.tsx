"use client";

import useDeleteConfirmationModal from "@/hooks/useDeleteConfirmationModal";
import Modal from "./Modal";
import Button from "../buttons/Button";
import usePlaylistActions from "@/hooks/usePlaylistActions";

const DeleteConfirmationModal = () => {
  const { isOpen, onClose, playlist } = useDeleteConfirmationModal();
  const { isLoading, deletePlaylist } = usePlaylistActions(playlist);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onChange={onChange}
      title="Delete from library?"
      className="flex md:block flex-col justify-center items-center text-black bg-white"
      closeBtn={false}
    >
      <p className="text-sm">This will delete <span className="font-bold">{playlist?.title}</span> from <span className="font-bold">Your Library</span></p>
      <div className="flex justify-end items-center gap-4 mt-6">
        <Button onClick={onClose} className="px-8 border-none bg-transparent" disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={deletePlaylist} className="px-8 border-none" disabled={isLoading}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;

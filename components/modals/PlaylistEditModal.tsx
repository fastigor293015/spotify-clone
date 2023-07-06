"use client";

import usePlaylistEditModal from "@/hooks/usePlaylistEditModal";
import Modal from "./Modal";
import PlaylistEditForm from "../PlaylistEditForm";

const PlaylistEditModal = () => {
  const { isOpen, onClose } = usePlaylistEditModal();

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onChange={onChange}
      title="Edit details"
      className="md:max-w-[524px]"
    >
      <PlaylistEditForm />
    </Modal>
  );
}

export default PlaylistEditModal;

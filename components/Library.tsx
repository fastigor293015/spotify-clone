"use client";

import { TbPlaylist, TbUpload } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { CgPlayListAdd } from "react-icons/cg";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Playlist } from "@/types";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import DropdownMenu, { DropdownItem } from "./DropdownMenu";
import PlaylistItem from "./PlaylistItem";
import useLikedSongs from "@/hooks/useLikedSongs";
import usePlaylistActions from "@/hooks/usePlaylistActions";

interface LibraryProps {
  playlists: Playlist[];
}

const Library: React.FC<LibraryProps> = ({
  playlists
}) => {
  const { createPlaylist } = usePlaylistActions();
  const subscribeModal = useSubscribeModal();
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const { songs: likedSongs } = useLikedSongs();
  const { user, subscription } = useUser();

  const handleSongUpload = () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    return uploadModal.onOpen();
  };



  const likedPlaylist: Playlist = {
    id: "liked",
    user_id: user?.id!,
    email: user?.email!,
    title: "Liked Songs",
    songs: [...likedSongs],
  }

  const dropdownItems: DropdownItem[] = [
    {
      label: "Upload a song",
      icon: TbUpload,
      onClick: handleSongUpload,
    },
    {
      label: "Create a new playlist",
      icon: CgPlayListAdd,
      onClick: createPlaylist,
    },
  ];

  return (
    <div className="flex flex-col">
      <div
        className="
          flex
          items-center
          justify-between
          px-5
          pt-4
        "
      >
        <div
          className="
            inline-flex
            items-center
            gap-x-2
          "
        >
          <TbPlaylist className="text-neutral-400" size={26} />
          <p
            className="
              text-neutral-400
              font-medium
              text-md
            "
          >
            Your Library
          </p>
        </div>

        <DropdownMenu items={dropdownItems} align="start">
          <AiOutlinePlus
            size={20}
            className="
              text-neutral-400
              cursor-pointer
              hover:text-white
              transition
            "
          />
        </DropdownMenu>
      </div>
      <div
        className="
          flex
          flex-col
          mt-4
          px-2
        "
      >
        {[likedPlaylist, ...playlists].map((item) => (
          <PlaylistItem
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </div>
  );
}

export default Library;

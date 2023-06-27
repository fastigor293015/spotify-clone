"use client";

import useLoadImage from "@/hooks/useLoadImage";
import Image from "next/image";
import PlayButton from "./buttons/PlayButton";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import { useRouter } from "next/navigation";
import { RiMusic2Line } from "react-icons/ri";
import { Playlist } from "@/types";

interface PlaylistMediaItemProps {
  playlist: Playlist;
}

const PlaylistMediaItem: React.FC<PlaylistMediaItemProps> = ({
  playlist
}) => {
  const router = useRouter();
  const { songs: songsData } = useGetSongsByIds(playlist.songs);
  const imagePath = useLoadImage(playlist.image_path || songsData[0]);

  return (
    <div
      onClick={() => router.push(`/playlist/${playlist.id}`)}
      className="
        relative
        group
        flex
        flex-col
        items-center
        justify-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-300/5
        cursor-pointer
        hover:bg-neutral-400/10
        transition
        p-3
      "
    >
      <div
        className="
          relative
          flex
          items-center
          justify-center
          aspect-square
          w-full
          h-full
          rounded-md
          text-neutral-400
          bg-neutral-700
          overflow-hidden
        "
      >
        {imagePath ? (
          <Image
            fill
            alt="Image"
            className="object-cover"
            src={imagePath}
          />
        ) : (
          <RiMusic2Line className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />
        )}
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full">
          {playlist.title}
        </p>
        <p
          className="
            text-neutral-400
            text-sm
            pb-4
            w-full
            truncate
          "
        >
          {playlist.email}
        </p>
      </div>
      <div className="
        absolute
        bottom-24
        right-5
      ">
        <PlayButton
          playlistId={playlist.id}
          playlistName={playlist.title}
          songs={songsData}
          className="
            translate-y-1/4
            opacity-0
            group-hover:opacity-100
            group-hover:translate-y-0
          "
        />
      </div>
    </div>
  );
}

export default PlaylistMediaItem;

"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { LuVolume2 } from "react-icons/lu";
import { RiMusic2Line } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import { Playlist } from "@/types";
import { useEffect, useMemo } from "react";
import ContextMenu, { ContextItem } from "./ContextMenu";
import usePlaylistActions from "@/hooks/usePlaylistActions";

interface PlaylistItemProps {
  data: Playlist;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  data
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { playlistId, isPlaying } = usePlayer();
  const { songs } = useGetSongsByIds(data.songs);
  const playlistImage = useLoadImage(data.image_path || songs?.[0]);
  const { addToQueue, editDetails, deletePlaylist } = usePlaylistActions(data, playlistImage);
  const isLikedPlaylist = useMemo(() => data.title === "Liked Songs", [data]);
  const playlistUrl = useMemo(() => isLikedPlaylist ? "/liked" : `/playlist/${data.id}`, [data, isLikedPlaylist]);

  useEffect(() => {
    console.log(playlistImage)
  }, [playlistImage]);

  const contextMenuItems: ContextItem[] = !isLikedPlaylist ? [
    {
      label: "Add to queue",
      onClick: addToQueue,
    },
    {
      label: "Edit details",
      onClick: editDetails,
    },
    {
      label: "Delete",
      onClick: deletePlaylist,
    },
  ] : [];

  return (
    <ContextMenu items={contextMenuItems}>
      <div onClick={() => router.push(playlistUrl)} className={twMerge(`grid grid-cols-[auto_1fr] items-center gap-x-3 p-2 rounded-md hover:bg-neutral-800/50 cursor-pointer`, playlistUrl === pathname && "bg-white/[0.06]")}>
        <div className="relative flex items-center justify-center h-12 w-12 rounded-md text-neutral-400 bg-neutral-800 shadow-4xl overflow-hidden">
          {isLikedPlaylist ? (
            <Image
              fill
              src={"/images/liked.png"}
              alt="Playlist image"
              className="object-cover"
            />
          ) : playlistImage ? (
            <Image
              fill
              src={playlistImage}
              alt="Playlist image"
              className="object-cover"
            />
          ) : (
            <RiMusic2Line size={25} />
          )}
        </div>
        <div className="grid grid-flow-col grid-cols-1 auto-cols-auto items-center gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <h1 className={twMerge("font-medium truncate", playlistId === data.id && "text-green-500")}>{data.title}</h1>
            <p className="text-sm text-neutral-400 truncate">
              Playlist
              {isLikedPlaylist ? (
                <span> • {data.songs.length} {data.songs.length === 1 ? "song" : "songs"}</span>
              ) : (
                <span> • {data.email}</span>
              )}
            </p>
          </div>
          {playlistId === data.id && isPlaying && (
            <div className="text-green-500">
              <LuVolume2 size={24} />
            </div>
          )}
        </div>
      </div>
    </ContextMenu>
  );
}

export default PlaylistItem;

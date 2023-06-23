"use client";

import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import useLoadImage from "@/hooks/useLoadImage";
import { Playlist } from "@/types";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { RiMusic2Line } from "react-icons/ri";
import { twMerge } from "tailwind-merge";

interface PlaylistItemProps {
  data: Playlist;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  data
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { songs } = useGetSongsByIds(data.songs);
  const playlistImage = useLoadImage(data.image_path ? data.image_path : songs?.[0]);
  const playlistUrl = `/playlist/${data.id}`;

  return (
    <div onClick={() => router.push(playlistUrl)} className={twMerge(`grid grid-cols-[auto_1fr] items-center gap-x-3 p-2 rounded-md hover:bg-neutral-800/50 cursor-pointer`, playlistUrl === pathname && "bg-white/[0.06]")}>
      <div className="relative flex items-center justify-center h-12 w-12 rounded-md text-neutral-400 bg-neutral-800 shadow-4xl overflow-hidden">
        {playlistImage ? (
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
      <div>
        <div className="flex flex-col gap-1">
          <h1 className="font-medium">{data.title}</h1>
          <p className="text-sm text-neutral-400">
            Playlist
            {data.songs && data.songs.length > 0 && (
              <span> • {data.songs.length} {data.songs.length === 1 ? "song" : "songs"}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlaylistItem;

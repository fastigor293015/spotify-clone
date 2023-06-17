"use client";

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useMemo } from "react";

const QueueContent = () => {
  const player = usePlayer();
  const { songs } = useGetSongsByIds(player.ids);

  useEffect(() => {
    console.log(songs);
  }, [songs]);

  const firstInQueue = useMemo(() => songs.findIndex((song) => song.id === player.activeId), [player, songs]);

  if (songs.length === 0) return null;

  return (
    <div className="mb-7 px-6">
      <div className="mb-4">
        <h2 className="mb-1 text-neutral-400 font-bold text-md">
          Now playing
        </h2>
        <div className="flex gap-x-4">
          <MediaItem
            number={1}
            data={songs[firstInQueue]}
            onClick={() => {}}
          />
          <LikeButton songId={songs[firstInQueue].id} />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="mb-1 text-neutral-400 font-bold text-md">
          Next up
        </h2>
        {songs.slice(firstInQueue + 1).map((song, i) => (
          <div key={song.id} className="flex gap-x-4">
            <MediaItem
              number={i + 2}
              data={song}
              onClick={() => {}}
            />
            <LikeButton songId={songs[0].id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default QueueContent;

"use client";

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const QueueContent = () => {
  const player = usePlayer();
  const router = useRouter();
  const { songs } = useGetSongsByIds(player.ids);

  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    console.log(songs);
  }, [songs]);

  const firstInQueue = useMemo(() => songs.findIndex((song) => song.id === player.activeId), [player, songs]);
  const nextSongs = useMemo(() => songs.slice(firstInQueue + 1), [songs, firstInQueue]);

  if (songs.length === 0) {
    return (
      <div className="
        flex
        flex-col
        gap-y-2
        w-full
        px-6
        text-neutral-400
      ">
        You have no tracks in queue.
      </div>
    )
  };

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
            likeBtn
          />
        </div>
      </div>

      {nextSongs.length > 0 && (<div className="mb-4">
        <h2 className="mb-1 text-neutral-400 font-bold text-md">
          Next up
        </h2>
        {nextSongs.map((song, i) => (
          <div key={song.id} className="flex gap-x-4">
            <MediaItem
              number={i + 2}
              data={song}
              onClick={() => {}}
              likeBtn
            />
          </div>
        ))}
      </div>)}
    </div>
  );
}

export default QueueContent;

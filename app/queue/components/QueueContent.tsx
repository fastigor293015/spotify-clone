"use client";

import MediaItem from "@/components/MediaItem";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import usePlayActions from "@/hooks/usePlayActions";
import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const QueueContent = () => {
  const player = usePlayer();
  const router = useRouter();
  const { songHandlePlay } = usePlayActions(player.ids);
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
        <MediaItem
          number={1}
          data={songs[firstInQueue]}
          onClick={(id: string) => songHandlePlay(id)}
          likeBtn
        />
      </div>

      {nextSongs.length > 0 && (<div className="mb-4">
        <h2 className="mb-1 text-neutral-400 font-bold text-md">
          {player.playlistId && player.playlistName && player.playlistName !== "Liked Songs" ? "Next from: " : "Next up"}
          {player.playlistId && player.playlistName && player.playlistName !== "Liked Songs" && (
            <Link className="hover:underline hover:text-white" href={`/playlist/${player.playlistId}`}>{player.playlistName}</Link>
          )}
        </h2>
        {nextSongs.map((song, i) => (
          <MediaItem
            key={song.id}
            number={i + 2}
            data={song}
            onClick={(id: string) => songHandlePlay(id)}
            likeBtn
          />
        ))}
      </div>)}
    </div>
  );
}

export default QueueContent;

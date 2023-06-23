"use client";

import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import { useCallback, useMemo } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface PlayButtonProps {
  songs: Song[];
  playlistId?: string;
  className?: string;
  iconSize?: number | string;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  songs,
  playlistId,
  className,
  iconSize = 16
}) => {
  const player = usePlayer();

  const isActive = useMemo(() => player.playlistId === playlistId, [player, playlistId]);

  const handleClick = useCallback(() => {
    if (songs.length === 0) return;
    if (!isActive) {
      player.setIds(songs.map((song) => song.id), playlistId);
      player.setId(songs[0].id);
    };
    if (!player.play || !player.pause || !isActive) return;

    if (!player.isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, isActive, songs, playlistId]);

  return (
    <button
      onClick={handleClick}
      className={twMerge(`
        flex
        items-center
        p-4
        rounded-full
        text-black
        bg-green-500
        transition
        drop-shadow-md
        hover:scale-110
        active:scale-100
        active:opacity-70
      `, className)}
    >
      {isActive && player.isPlaying ? (
        <FaPause size={iconSize} />
      ) : (
        <FaPlay size={iconSize} />
      )}
    </button>
  );
}

export default PlayButton;

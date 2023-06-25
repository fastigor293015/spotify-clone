"use client";

import usePlayActions from "@/hooks/usePlayActions";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import { useCallback, useMemo } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface PlayButtonProps {
  songs: Song[];
  playlistId?: string;
  playlistName?: string;
  className?: string;
  iconSize?: number | string;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  songs,
  playlistId,
  playlistName,
  className,
  iconSize = 16
}) => {
  const player = usePlayer();
  const { playlistHandlePlay, isActive } = usePlayActions(songs.map((song) => song.id), playlistId, playlistName);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playlistHandlePlay();
  }

  return (
    <button
      onClick={handlePlay}
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

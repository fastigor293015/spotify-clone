"use client";

import usePlayActions from "@/hooks/usePlayActions";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import { useCallback } from "react";
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
  const { playlistHandlePlay, isActivePlaylist } = usePlayActions(songs.map((song) => song.id), playlistId, playlistName);

  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playlistHandlePlay();
  }, [playlistHandlePlay]);

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
      {isActivePlaylist && player.isPlaying ? (
        <FaPause size={iconSize} />
      ) : (
        <FaPlay size={iconSize} />
      )}
    </button>
  );
}

export default PlayButton;

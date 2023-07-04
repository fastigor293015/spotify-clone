"use client";

import usePlayActions from "@/hooks/usePlayActions";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import Button from "./Button";

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
  const [hasMounted, setHasMounted] = useState(false);

  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playlistHandlePlay();
  }, [playlistHandlePlay]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <Button
      onClick={handlePlay}
      className={twMerge(`
        flex
        items-center
        p-4
        border-none
        drop-shadow-md
        transition
        duration-200
      `,
        className,
        isActivePlaylist && player.isPlaying && "opacity-100 translate-y-0"
      )}
    >
      {isActivePlaylist && player.isPlaying ? (
        <FaPause size={iconSize} />
      ) : (
        <FaPlay size={iconSize} />
      )}
    </Button>
  );
}

export default PlayButton;

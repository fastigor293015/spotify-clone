"use client";

import usePlayer from "@/hooks/usePlayer";
import { useCallback } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

interface PlayButtonProps {
  isActive: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({
  isActive
}) => {
  const player = usePlayer();

  const handlePlay = useCallback(() => {
    if (!player.play || !player.pause || !isActive) return;

    if (!player.isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, isActive]);

  return (
    <button
      onClick={handlePlay}
      className="
        transition
        opacity-0
        rounded-full
        flex
        items-center
        bg-green-500
        p-4
        drop-shadow-md
        translate-y-1/4
        group-hover:opacity-100
        group-hover:translate-y-0
        hover:scale-110
      "
    >
      {isActive && player.isPlaying ? (
        <FaPause className="text-black" />
      ) : (
        <FaPlay className="text-black" />
      )}
    </button>
  );
}

export default PlayButton;

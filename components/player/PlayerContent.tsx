"use client";

import { useEffect } from "react";
import { Song } from "@/types";

import usePlayer from "@/hooks/usePlayer";
import useSound from "use-sound";
import MobilePlayer from "./MobilePlayer";
import DesktopPlayer from "./DesktopPlayer";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song,
  songUrl
}) => {
  const player = usePlayer();

  const [play, { pause, sound, duration }] = useSound(
    songUrl,
    {
      volume: player.volume,
      onplay: () => player.setIsPlaying(true),
      onend: () => {
        player.setIsPlaying(false);
        player.onPlayNext();
      },
      onpause: () => player.setIsPlaying(false),
      format: ["mp3"]
    }
  );

  useEffect(() => {
    sound?.play();
    player.play = play;
    player.pause = pause;

    return () => {
      sound?.unload();
    }
  }, [sound]);

  return (
    <>
      <MobilePlayer song={song} sound={sound} duration={duration} />
      <DesktopPlayer song={song} sound={sound} duration={duration} />
    </>
  );
}

export default PlayerContent;

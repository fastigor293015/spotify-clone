"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Song } from "@/types";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiOutlineQueueList, HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import usePlayer from "@/hooks/usePlayer";
import useSound from "use-sound";
import useInterval from "@/hooks/useInterval";

import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import { usePathname, useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const formatTime = (time: number | null) => {
  if (!time || isNaN(time)) {
    return "-:--";
  }
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time - Math.floor(time / 60) * 60);

  return mins + ":" + (secs < 10 ? `0${secs}` : secs);
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song,
  songUrl
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const player = usePlayer();
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState("-:--");
  const [showRemainingTime, setShowRemainingTime] = useState(false);

  const Icon = player.isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = player.volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const curIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[curIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrev = () => {
    if (player.ids.length === 0) {
      return;
    }

    const curIndex = player.ids.findIndex((id) => id === player.activeId);
    const prevSong = player.ids[curIndex - 1];

    if (!prevSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(prevSong);
  };

  const [play, { pause, sound, duration }] = useSound(
    songUrl,
    {
      volume: player.volume,
      onplay: () => player.setIsPlaying(true),
      onend: () => {
        player.setIsPlaying(false);
        onPlayNext();
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

  useInterval(() => {
    if (sound) {
      setSeconds(sound.seek([]));
      setTime(formatTime(sound.seek([])));
    }
  }, 1000);

  const trackDuration = useMemo(() => {
    if (showRemainingTime) {
      return "-" + formatTime((duration as number) / 1000 - seconds + 0.99);
    }
    return formatTime((duration as number) / 1000);
  }, [duration, showRemainingTime, seconds]);

  const handlePlay = useCallback(() => {
    if (!player.isPlaying) {
      play();
    } else {
      pause();
    }
  }, [player.isPlaying, play, pause]);

  const toggleMute = () => {
    if (player.volume === 0) {
      player.setVolume(1);
    } else {
      player.setVolume(0);
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="
        flex
        w-full
        justify-start
      ">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div
        className="
          flex
          md:hidden
          col-auto
          w-full
          justify-end
          items-center
        "
      >
        <div
          onClick={handlePlay}
          className="
            h-10
            w-10
            flex
            items-center
            justify-center
            rounded-full
            bg-white
            p-1
            cursor-pointer
          "
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>

      <div
        className="
          justify-self-center
          hidden
          h-full
          md:flex
          flex-col
          gap-2
          w-full
          max-w-[722px]
        "
      >
        <div
          className="
            flex
            justify-center
            items-center
            gap-x-6
          "
        >
          <AiFillStepBackward
            onClick={onPlayPrev}
            size={25}
            className="
              text-neutral-400
              cursor-pointer
              hover:text-white
              transition
            "
          />
          <div
            onClick={handlePlay}
            className="
              flex
              items-center
              justify-center
              h-8
              w-8
              rounded-full
              bg-white
              p-1
              cursor-pointer
            "
          >
            <Icon size={25} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={25}
            className="
              text-neutral-400
              cursor-pointer
              hover:text-white
              transition
            "
          />
        </div>
        <div className="relative flex items-center gap-1">
          <div className="absolute right-[calc(100%+7px)] whitespace-nowrap text-xs text-neutral-400 select-none">
            {time}
          </div>
          <Slider
            ariaLabel="Track"
            value={seconds}
            onChange={(value) => {
              sound?.seek([value]);
              setSeconds(sound?.seek([]));
              setTime(formatTime(sound.seek([])));
            }}
            defaultValue={0}
            max={(duration as number) / 1000}
            step={1}
          />
          <div onClick={() => setShowRemainingTime(prev => !prev)} className="absolute left-[calc(100%+7px)] whitespace-nowrap text-xs text-neutral-400 select-none">
            {trackDuration}
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-x-3 w-full justify-end pr-2">
        <div className={twMerge(`relative text-white cursor-pointer`, pathname === "/queue" && "text-green-500")}>
          <HiOutlineQueueList onClick={() => pathname !== "/queue" ? router.push("/queue") : router.back()} size={20} />
          <div className={twMerge(`
            absolute
            top-[calc(100%+2px)]
            left-[calc(50%-2px)]
            w-1
            h-1
            rounded-full
            bg-current
            opacity-0
          `, pathname === "/queue" && "opacity-100")} />
        </div>
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={24}
          />
          <Slider
            ariaLabel="Volume"
            value={player.volume}
            onChange={(value) => player.setVolume(value)}
            defaultValue={1}
            max={1}
            step={0.005}
          />
        </div>
      </div>
    </div>
  );
}

export default PlayerContent;

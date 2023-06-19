"use client";

import { useCallback, useMemo, useState } from "react";
import usePlayer from "@/hooks/usePlayer";
import useInterval from "@/hooks/useInterval";
import { Song } from "@/types";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import MediaItem from "../MediaItem";
import LikeButton from "../buttons/LikeButton";
import Slider from "../Slider";
import QueueButton from "../buttons/QueueButton";
import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";

const formatTime = (time: number | null) => {
  if (!time || isNaN(time)) {
    return "-:--";
  }
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time - Math.floor(time / 60) * 60);

  return mins + ":" + (secs < 10 ? `0${secs}` : secs);
}

interface DesktopPlayerProps {
  song: Song;
  sound: any;
  duration: number | null;
}

const DesktopPlayer: React.FC<DesktopPlayerProps> = ({
  song,
  sound,
  duration
}) => {
  const player = usePlayer();
  const imageUrl = useLoadImage(song);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState("-:--");
  const [showRemainingTime, setShowRemainingTime] = useState(false);

  const Icon = player.isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = player.volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const trackDuration = useMemo(() => {
    if (showRemainingTime) {
      return "-" + formatTime((duration as number) / 1000 - seconds + 0.99);
    }
    return formatTime((duration as number) / 1000);
  }, [duration, showRemainingTime, seconds]);

  const handlePlay = useCallback(() => {
    if (!player.play || !player.pause) return;

    if (!player.isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [player]);

  const toggleMute = () => {
    if (player.volume === 0) {
      player.setVolume(1);
    } else {
      player.setVolume(0);
    }
  }

  const onRewind = (value: number) => {
    sound?.seek([value]);
    setSeconds(sound?.seek([]));
    setTime(formatTime(sound.seek([])));
  }

  useInterval(() => {
    if (sound) {
      setSeconds(sound.seek([]));
      setTime(formatTime(sound.seek([])));
    }
  }, 1000);

  return (
    <div
      className="
        hidden
        md:grid
        grid-cols-3
        gap-10
        w-full
        h-[80px]
        py-2
        px-4
        bg-black
      "
    >
      <div className="
        flex
        w-full
        justify-start
      ">
        <div className="flex items-center gap-x-4 w-full">
        {/* <MediaItem data={song} likeBtn /> */}
          <div
            className="
              relative
              min-h-[55px]
              min-w-[55px]
              rounded-md
              overflow-hidden
            "
          >
            <Image
              fill
              src={imageUrl || "/images/liked.png"}
              alt="Media Item"
              className="object-cover"
            />
          </div>
          <div className="truncate">
            <p className="text-text-sm truncate">{song.title}</p>
            <p className="text-[11px] text-neutral-400 truncate">{song.author}</p>
          </div>
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div
        className="
          justify-self-center
          flex
          flex-col
          gap-2
          h-full
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
            onClick={player.onPlayPrev}
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
            onClick={player.onPlayNext}
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
            onChange={onRewind}
            defaultValue={0}
            max={(duration as number) / 1000}
            step={1}
          />
          <div onClick={() => setShowRemainingTime(prev => !prev)} className="absolute left-[calc(100%+7px)] whitespace-nowrap text-xs text-neutral-400 select-none">
            {trackDuration}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-3 w-full justify-end pr-2">
        <QueueButton />
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

export default DesktopPlayer;

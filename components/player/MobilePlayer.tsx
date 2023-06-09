"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import useInterval from "@/hooks/useInterval";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import useSongActions from "@/hooks/useSongActions";
import useImageDominantColor from "@/hooks/useImageDominantColor";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { RxDotsHorizontal } from "react-icons/rx";
import { HiOutlineArrowPathRoundedSquare, HiOutlineQueueList } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import LikeButton from "../buttons/LikeButton";
import Slider from "../Slider";
import { formatTime } from "@/utils";
import { Song } from "@/types";
import PlayerButton from "../buttons/PlayerButton";

interface MobilePlayerProps {
  song: Song;
  sound: any;
  duration: number | null;
}

const MobilePlayer: React.FC<MobilePlayerProps> = ({
  song,
  sound,
  duration
}) => {
  const player = usePlayer();
  const imageUrl = useLoadImage(song);
  const { isLiked, handleLike } = useSongActions(song.id);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState("-:--");
  const imageColor = useImageDominantColor(imageUrl);

  const Icon = player.isPlaying ? BsPauseFill : BsPlayFill;

  const trackDuration = useMemo(() => {
    return formatTime(parseInt(song.duration));
  }, [song]);

  useEffect(() => {
    if (!imageColor) return;
    player.setBgcolor(imageColor);
  }, [imageColor]);

  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    if (!player.play || !player.pause) return;

    if (!player.isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [player]);

  const onRewind = (value: number) => {
    sound?.seek([value]);
    setSeconds(sound?.seek([]));
    setTime(sound?.seek([]) === 0 ? "0:00" : formatTime(sound.seek([])));
  }

  useInterval(() => {
    if (sound) {
      setSeconds(sound.seek([]));
      setTime(sound?.seek([]) === 0 ? "0:00" : formatTime(sound.seek([])));
    }
  }, 1000);

  return (
    <>
      <div className="fixed z-[20] right-2 bottom-2 left-2 block md:hidden rounded-md transition duration-300" style={{ backgroundColor: imageColor }}>
        <div className="relative grid grid-cols-[auto,1fr,auto] items-center gap-2 h-14 w-full p-2 bg-black/[.48]" onClick={(e) => player.setIsMobilePlayerOpen(true)}>
          <Image
            width={40}
            height={40}
            src={imageUrl || "/images/liked.png"}
            alt="Media Item"
            className="mr-1 rounded-[4px] object-cover"
          />
          <div className="flex-1 flex justify-center flex-col text-[13px] truncate">
            <p className="font-bold">{song.title}</p>
            <p>{song.author}</p>
          </div>
          <div className="flex items-center gap-2">
            <LikeButton isLiked={isLiked} handleLike={handleLike} className="p-1" iconSize={30} />
            <button className="p-1" onClick={handlePlay}>
              <Icon size={30} />
            </button>
          </div>

          <div className="absolute right-2 bottom-0 left-2 rounded-sm bg-white/30">
            <div className="h-[2px] bg-white" style={{ width: duration ? `${seconds / duration * 1000 * 100}%` : 0 }}></div>
          </div>
        </div>

        <AnimatePresence>
        {player.isMobilePlayerOpen && <motion.div
          className="fixed inset-0 flex flex-col p-3 bg-[linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.6)_80%)]"
          key={`${player.isMobilePlayerOpen}`}
          initial={{ y: "100%" }}
          animate={{ y: 0, backgroundColor: imageColor }}
          exit={{  y: "100%" }}
          transition={{ type: "keyframes", duration: .2 }}
        >
          <div className="flex items-center mb-10">
            <button className="p-2" onClick={() => player.setIsMobilePlayerOpen(false)}>
              <IoIosArrowDown size={30} />
            </button>
            <p className="flex-1 font-bold text-[13px] text-center">Album Name</p>
            <button className="p-3">
              <RxDotsHorizontal size={24} />
            </button>
          </div>
          <div className="relative flex-1 mb-6">
            <Image
              fill
              src={imageUrl || "/images/liked.png"}
              alt="Media Item"
              className="mr-1 rounded-[4px] object-contain"
            />
            {/* <div className="h-full w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${imageUrl})` }} /> */}
          </div>
          <div className="flex items-center gap-3 mx-3 mb-4">
            <div className="flex-1 truncate">
              <p className="text-2xl font-bold">{song.title}</p>
              <p className="opacity-70">{song.author}</p>
            </div>
            <LikeButton isLiked={isLiked} handleLike={handleLike} />
          </div>
          <div className="mx-3 mb-6">
            <Slider
              ariaLabel="Track"
              value={seconds}
              onChange={onRewind}
              defaultValue={0}
              max={(duration as number) / 1000}
              step={1}
            />
            <div className="flex justify-between opacity-70 text-[11px]">
              <div>
                {time}
              </div>
              <div>
                {trackDuration}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-16 px-3">
          <PlayerButton href="/queue" icon={HiOutlineQueueList} iconSize={35} />
            <button onClick={player.onPlayPrev}>
              <AiFillStepBackward size={35} />
            </button>
            <button className="p-2 rounded-full text-black bg-white" onClick={handlePlay}>
              <Icon size={35} />
            </button>
            <button onClick={player.onPlayNext}>
              <AiFillStepForward size={35} />
            </button>
            <button>
              <HiOutlineArrowPathRoundedSquare size={35} />
            </button>
          </div>
        </motion.div>}
      </AnimatePresence>
      </div>
    </>
  );
}
// HiOutlineArrowPathRoundedSquare
export default MobilePlayer;

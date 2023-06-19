"use client";

import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import Image from "next/image";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import LikeButton from "./LikeButton";

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
  number?: number;
  likeBtn?: boolean;
}

const MediaItem: React.FC<MediaItemProps> = ({
  data,
  onClick,
  number,
  likeBtn
}) => {
  const player = usePlayer();
  const imageUrl = useLoadImage(data);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }

    return player.setId(data.id);
  }

  const Icon = player.isPlaying && player.activeId === data.id ? BsPauseFill : BsPlayFill;

  return (
    <div
      onClick={handleClick}
      className="
        group
        flex-1
        flex
        items-center
        gap-x-3
        cursor-pointer
        hover:bg-neutral-800/50
        w-full
        p-2
        rounded-md
      "
    >
      {number && (
        <div className="flex items-center justify-center w-4 h-4 ml-2 mr-1">
          <div className={twMerge(`text-neutral-400 group-hover:hidden group-focus:hidden`, player.activeId === data.id && "text-green-500")}>
            {player.isPlaying && player.activeId === data.id
            ? <Image width={14} height={14} src="/images/equaliser-animated.gif" alt="Equalizer" />
            : number}
          </div>
          <div className="hidden group-hover:block group-focus:hidden" onClick={() => {
            if (player.activeId !== data.id) {
              return player.setId(data.id);
            }
            if (!player.pause || !player.play) return;
            if (player.isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}>
            <Icon size={22} />
          </div>
        </div>
      )}
      <div
        className="
          relative
          rounded-md
          min-h-[48px]
          min-w-[48px]
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
      <div className="
        flex-1
        flex
        flex-col
        gap-y-1
        overflow-hidden
      ">
        <p className={twMerge(`text-white truncate`, player.activeId === data.id && "text-green-500")}>
          {data.title}
        </p>
        <p className="text-neutral-400 text-sm truncate">
          {data.author}
        </p>
      </div>
      {likeBtn && (
        <LikeButton className="mr-2" songId={data.id} />
      )}
    </div>
  );
}

export default MediaItem;

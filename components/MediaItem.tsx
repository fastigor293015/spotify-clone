"use client";

import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Playlist, Song } from "@/types";
import Image from "next/image";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import LikeButton from "./buttons/LikeButton";
import Button from "./buttons/Button";
import { useMemo } from "react";
import DropdownMenu from "./DropdownMenu";
import { RxDotsHorizontal } from "react-icons/rx";
import { formatTime } from "@/utils";
import useSongActions from "@/hooks/useSongActions";

interface MediaItemProps {
  data: Song;
  index: number;
  isActivePlaylist: boolean;
  onClick: (id: string, index: number) => void;
  number?: number;
  likeBtn?: boolean;
  addBtn?: boolean;
  curPlaylist?: Playlist;
}

const MediaItem: React.FC<MediaItemProps> = ({
  data,
  index,
  isActivePlaylist,
  onClick,
  number,
  likeBtn,
  addBtn,
  curPlaylist
}) => {
  const { isInCurPlaylist, isLiked, handleLike, isLoading, addToCurPlaylist, dropdownItems } = useSongActions(data.id, index, curPlaylist);
  const player = usePlayer();
  const imageUrl = useLoadImage(data);

  const isEqualToPlayingSong = useMemo(() => player.activeId === data.id && player.activeIndex === index && isActivePlaylist, [player, data, index, isActivePlaylist]);

  const Icon = useMemo(() => player.isPlaying && isEqualToPlayingSong ? BsPauseFill : BsPlayFill, [player, isEqualToPlayingSong]);
  const songDuration = useMemo(() => formatTime(parseInt(data.duration)), [data]);

  const playBtnHandler = () => {
    onClick(data.id, index);
  }

  return (
    <div
      className="
        group
        grid
        grid-cols-1 auto-cols-[auto] grid-flow-col
        items-center
        gap-x-3
        cursor-pointer
        hover:bg-neutral-800/50
        w-full
        max-w-full
        p-2
        rounded-md
      "
    >
      <div className="flex items-center gap-x-3">
        {number && (
          <div className="flex items-center justify-center w-4 h-4 ml-2 mr-1">
            <div className={twMerge(`text-neutral-400 group-hover:hidden group-focus:hidden`, isEqualToPlayingSong && "text-green-500")}>
              {player.isPlaying && isEqualToPlayingSong
                ? <Image width={14} height={14} src="/images/equaliser-animated.gif" alt="Equalizer" />
                : number}
            </div>
            <div className="hidden group-hover:block group-focus:hidden" onClick={playBtnHandler}>
              <Icon size={22} />
            </div>
          </div>
        )}
        <div
          className="
            relative
            rounded-md
            h-[48px]
            w-[48px]
            overflow-hidden
          "
        >
          <Image
            fill
            src={imageUrl || "/images/liked.png"}
            alt="Media Item"
            className="object-cover"
          />
          {!number && (
            <button
              className={twMerge(`
                absolute
                inset-0
                z-1
                flex
                items-center
                justify-center
                bg-black/50
                opacity-0
                group-hover:opacity-100
              `, player.isPlaying && isEqualToPlayingSong && "opacity-100")}
              onClick={playBtnHandler}
            >
              <Icon size={24} />
            </button>
          )}
        </div>
        <div className="
          flex-1
          flex
          flex-col
          gap-y-1
          truncate
        ">
          <p className={twMerge(`text-white truncate`, isEqualToPlayingSong && "text-green-500")}>
            {data.title}
          </p>
          <p className="text-neutral-400 text-sm truncate">
            {data.author}
          </p>
        </div>
      </div>
      {likeBtn && (
        <LikeButton
          isLiked={isLiked}
          handleLike={handleLike}
          className="mr-2 hidden group-hover:block transition-colors"
        />
      )}
      {addBtn && !isInCurPlaylist ? (
        <Button onClick={addToCurPlaylist} className="mr-1 py-1 px-4 border-white/80 text-sm text-white bg-transparent hover:border-white" disabled={isLoading}>
          Add
        </Button>
      ) : (
        <>
          <div className="text-sm text-neutral-400">{songDuration}</div>
          <DropdownMenu items={dropdownItems} className="mx-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto" align="end">
            <RxDotsHorizontal size={20} />
          </DropdownMenu>
        </>
      )}
    </div>
  );
}

export default MediaItem;

"use client";

import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import PlayButton from "./buttons/PlayButton";
import usePlayer from "@/hooks/usePlayer";

interface SongItemProps {
  data: Song;
}

const SongItem: React.FC<SongItemProps> = ({
  data,
}) => {
  const player = usePlayer();
  const imagePath = useLoadImage(data);
  return (
    <div
      className="
        relative
        group
        flex
        flex-col
        items-center
        justify-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-300/5
        cursor-pointer
        hover:bg-neutral-400/10
        transition
        p-3
      "
    >
      <div
        className="
          relative
          aspect-square
          w-full
          h-full
          rounded-md
          overflow-hidden
        "
      >
        <Image
          className="object-cover"
          src={imagePath || "/images/liked.png"}
          fill
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-start w-full pt-4 gap-y-1">
        <p className="font-semibold truncate w-full">
          {data.title}
        </p>
        <p
          className="
            text-neutral-400
            text-sm
            pb-4
            w-full
            truncate
          "
        >
          By {data.author}
        </p>
      </div>
      <div className="
        absolute
        bottom-24
        right-5
      ">
        <PlayButton
          songs={[data]}
          className="
            translate-y-1/4
            opacity-0
            group-hover:opacity-100
            group-hover:translate-y-0
          "
        />
      </div>
    </div>
  );
}

export default SongItem;

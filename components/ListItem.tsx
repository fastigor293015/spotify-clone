"use client";

import { Song } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PlayButton from "./buttons/PlayButton";

interface ListItemProps {
  image: string;
  name: string;
  href: string;
  songs: Song[];
}

const ListItem: React.FC<ListItemProps> = ({
  image,
  name,
  href,
  songs
}) => {
  const router = useRouter();

  const onClick  = () => {
    // Add authentication before push
    router.push(href);
  }

  return (
    <button
      onClick={onClick}
      className="
        relative
        group
        flex
        items-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-100/10
        hover:bg-neutral-100/20
        transition
        pr-4
      "
    >
      <div className="
        relative
        min-h-[64px]
        min-w-[64px]
      ">
        <Image
          className="object-cover"
          fill
          src={image}
          alt="Image"
        />
      </div>
      <p className="font-medium truncate py-5">
        {name}
      </p>
      <PlayButton
        songs={songs}
        playlistId="liked"
        playlistName="Liked Songs"
        className="
          absolute
          right-5
          opacity-0
          group-hover:opacity-100
          hover:scale-110
        "
      />
    </button>
  );
}

export default ListItem;

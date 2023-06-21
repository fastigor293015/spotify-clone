"use client";

import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({
  songs
}) => {
  const onPlay = useOnPlay(songs);

  if (songs.length === 0) {
    return (
      <div
        className="
          flex
          flex-col
          gap-y-2
          w-full
          px-6
          text-neutral-400
        "
      >
        No songs found.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-2 w-full mb-7 px-6">
      {songs.map((song) => (
        <MediaItem
          key={song.id}
          onClick={(id: string) => onPlay(id)}
          data={song}
          likeBtn
        />
      ))}
    </div>
  );
}

export default SearchContent;

"use client";

import MediaItem from "@/components/MediaItem";
import usePlayActions from "@/hooks/usePlayActions";
import useOnPlay from "@/hooks/usePlayActions";
import { Song } from "@/types";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({
  songs
}) => {
  const { songHandlePlay, isActivePlaylist } = usePlayActions(songs.map((song) => song.id));

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
    <div className="flex flex-col w-full mb-7 px-6">
      {songs.map((song, i) => (
        <MediaItem
          key={song.id}
          data={song}
          index={i}
          isActivePlaylist={isActivePlaylist}
          onClick={(id, index) => songHandlePlay(id, index)}
          likeBtn
        />
      ))}
    </div>
  );
}

export default SearchContent;

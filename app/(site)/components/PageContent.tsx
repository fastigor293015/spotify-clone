"use client";

import MediaItem from "@/components/MediaItem";
import PlaylistMediaItem from "@/components/PlaylistMediaItem";
import usePlayActions from "@/hooks/usePlayActions";
import useOnPlay from "@/hooks/usePlayActions";
import { Playlist, Song } from "@/types";

interface PageContentProps {
  songs: Song[];
  playlists: Playlist[];
}

const PageContent: React.FC<PageContentProps> = ({
  songs,
  playlists
}) => {
  const { songHandlePlay, isActivePlaylist } = usePlayActions(songs.map((song) => song.id));

  if (songs.length === 0) {
    return (
      <div className="mt-4 text-neutral-400">
        No songs available.
      </div>
    )
  }

  return (
    <div className="relative z-[1] mb-7 px-6">
      <h1 className="my-6 text-white text-2xl font-semibold">
        Newest playlists
      </h1>
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-8
          gap-4
          mt-4
        "
      >
        {playlists.map((item) => (
          <PlaylistMediaItem
            key={item.id}
            playlist={item}
          />
        ))}
      </div>

      <h1 className="my-6 text-white text-2xl font-semibold">
        Newest songs
      </h1>
      <div>
        {songs.map((item, i) => (
          <MediaItem
            key={item.id}
            isActivePlaylist={isActivePlaylist}
            index={i}
            data={item}
            onClick={(id, index) => songHandlePlay(id, index)}
            likeBtn
          />
        ))}
      </div>
    </div>
  );
}

export default PageContent;

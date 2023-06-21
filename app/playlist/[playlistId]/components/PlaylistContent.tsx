"use client";

import Header from "@/components/Header";
import MediaItem from "@/components/MediaItem";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import useOnPlay from "@/hooks/useOnPlay";
import usePlaylistEditModal from "@/hooks/usePlaylistEditModal";
import { Playlist } from "@/types";
import Image from "next/image";
import { useEffect } from "react";
import { RiMusic2Line } from "react-icons/ri";

interface PlaylistContentProps {
  playlist: Playlist;
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({
  playlist
}) => {
  const { songs } = useGetSongsByIds(playlist.songs);
  const onPlay = useOnPlay(songs);
  const playlistEditModal = usePlaylistEditModal();

  useEffect(() => {
    playlistEditModal.setData(playlist);
  }, [playlist]);

  return (
    <>
      <Header bgcolor="rgb(6,95,70)">
        <div className="mt-14">
          <div
            className="
              flex
              flex-col
              md:flex-row
              items-center
              gap-x-5
            "
          >
            <label
              onClick={playlistEditModal.onOpen}
              htmlFor="upload"
              className="
                relative
                flex
                items-center
                justify-center
                h-32
                w-32
                lg:h-48
                lg:w-48
                shadow-4xl
                text-neutral-400
                bg-neutral-800
              "
            >
              {playlist.image_path ? (
                <Image
                  fill
                  alt="Playlist"
                  className="object-cover"
                  src={playlist.image_path}
                />
              ) : (
                <RiMusic2Line size={50} />
              )}

            </label>
            <input className="hidden" id="upload" type="file" accept="image/.jpg, image/.jpeg, image/.png" onChange={(e) => console.log(e.target.value)} />
            <div className="
              flex
              flex-col
              gap-y-2
              mt-4
              md:mt-0
            ">
              <p className="hidden md:block font-semibold text-sm">
                Playlist
              </p>
              <h1
                className="
                  text-white
                  text-4xl
                  sm:text-5xl
                  lg:text-7xl
                  font-bold
                "
              >
                {playlist.title}
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <div className="relative z-[1]">
        {songs.length === 0 ? (
          <div className="
            flex
            flex-col
            gap-y-2
            w-full
            px-6
            text-neutral-400
          ">
            No songs in playlist.
          </div>
        ) : (
          <div className="flex flex-col p-6">
            {songs.map((song, i) => (
              <MediaItem
                key={song.id}
                onClick={(id: string) => onPlay(id)}
                data={song}
                number={i + 1}
                likeBtn
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default PlaylistContent;

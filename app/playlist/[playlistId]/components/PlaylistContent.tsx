"use client";

import { useEffect } from "react";
import { RiMusic2Line } from "react-icons/ri";
import Image from "next/image";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import useOnPlay from "@/hooks/useOnPlay";
import usePlaylistEditModal from "@/hooks/usePlaylistEditModal";
import { Playlist, Song } from "@/types";
import Header from "@/components/Header";
import MediaItem from "@/components/MediaItem";
import useLoadImage from "@/hooks/useLoadImage";
import { useUser } from "@/hooks/useUser";
import { twMerge } from "tailwind-merge";

interface PlaylistContentProps {
  playlist: Playlist;
  recommendedSongs: Song[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({
  playlist,
  recommendedSongs
}) => {
  const { songs } = useGetSongsByIds(playlist.songs);
  const onPlay = useOnPlay(songs);
  const onPlayRecommended = useOnPlay(recommendedSongs);
  const playlistImage = useLoadImage(playlist.image_path ? playlist.image_path : songs?.[0]);
  const playlistEditModal = usePlaylistEditModal();
  const { user } = useUser();

  useEffect(() => {
    playlistEditModal.setData(playlist);
    console.log(playlistEditModal.playlistData);
  }, [playlist]);

  return (
    <>
      <Header bgcolor="rgb(83, 83, 83)">
        <div className="mt-10">
          <div
            className="
              flex
              flex-col
              md:flex-row
              items-center
              md:items-end
              gap-x-5
            "
          >
            <label
              onClick={playlistEditModal.onOpen}
              htmlFor="upload"
              className={twMerge(`
                relative
                flex
                items-center
                justify-center
                h-32
                w-32
                lg:h-[232px]
                lg:w-[232px]
                shadow-4xl
                text-neutral-400
                bg-neutral-800
              `, user?.id !== playlist.user_id && "pointer-events-none")}
            >
              {playlistImage ? (
                <Image
                  fill
                  alt="Playlist"
                  className="object-cover"
                  src={playlistImage}
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
              <p className="hidden md:block font-bold text-sm">
                Playlist
              </p>
              <h1
                className="
                  text-white
                  text-4xl
                  sm:text-5xl
                  lg:text-7xl
                  leading-[1.2]
                  sm:leading-[1.2]
                  lg:leading-[1.2]
                  font-bold
                  truncate
                "
              >
                {playlist.title}
              </h1>
              {playlist.description && (
                <p>{playlist.description}</p>
              )}
              <p className="mt-2 text-sm font-bold">
                {playlist.email}
                {playlist.songs.length > 0 && <span className="font-normal"> • {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}</span>}
              </p>
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
      {user?.id === playlist.user_id && (
        <div className="mt-10 px-6">
          <h2 className="mb-3 text-2xl font-bold">Recommended</h2>
          <p className="mb-6 text-neutral-400 text-sm">Based on the title of this playlist</p>
          {recommendedSongs.map((song) =>
            !playlist.songs.includes(song.id) && (
              <MediaItem
                key={song.id}
                onClick={(id: string) => onPlayRecommended(id)}
                data={song}
                addBtn
              />
            )
          )}
        </div>
      )}
    </>
  );
}

export default PlaylistContent;

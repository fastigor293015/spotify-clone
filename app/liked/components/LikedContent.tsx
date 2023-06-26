"use client";

import Header from "@/components/Header";
import MediaItem from "@/components/MediaItem";
import PlayButton from "@/components/buttons/PlayButton";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import useImageDominantColor from "@/hooks/useImageDominantColor";
import useLikedSongs from "@/hooks/useLikedSongs";
import usePlayActions from "@/hooks/usePlayActions";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LikedContent = () => {
  const router = useRouter();
  const  { isLoading, user } = useUser();
  const likedSongs = useLikedSongs();
  const { songHandlePlay, isActivePlaylist } = usePlayActions(likedSongs.songs, "liked", "Liked Songs");
  const { songs } = useGetSongsByIds(likedSongs.songs);
  const likedColor = useImageDominantColor("/images/liked.png");

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const stickyContent = (
    <div className="flex items-center gap-2">
      <PlayButton
        playlistId="liked"
        playlistName="Liked Songs"
        songs={songs}
        className="opacity-100"
      />
      <p className="text-2xl text-white font-bold">Liked Songs</p>
    </div>
  )

  return (
    <>
      <Header bgcolor={likedColor} stickyContent={stickyContent} scrollValue={360}>
        <div className="mt-10">
          <div
            className="
              flex
              flex-col
              md:flex-row
              items-center
              md:items-end
              text-center
              md:text-start
              gap-x-5
            "
          >
            <div className="
              relative
              flex
              items-center
              justify-center
              h-32
              w-32
              md:h-40
              md:w-40
              lg:h-[232px]
              lg:w-[232px]
              shadow-4xl
            ">
              <Image
                fill
                alt="Playlist"
                className="object-cover"
                src="/images/liked.png"
              />
            </div>
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
                  lg:text-8xl
                  leading-[1.2]
                  sm:leading-[1.2]
                  lg:leading-[1.2]
                  font-bold
                  truncate
                "
              >
                Liked Songs
              </h1>
              <p className="mt-2 text-sm font-bold">
                {user?.email}
                {songs.length > 0 && <span className="font-normal"> • {songs.length} {songs.length === 1 ? "song" : "songs"}</span>}
              </p>
            </div>
          </div>
        </div>
      </Header>
      {songs.length > 0 && (
        <div className="p-6">
          <PlayButton
            songs={songs}
            playlistId="liked"
            playlistName="Liked Songs"
            className="p-[18px]"
            iconSize={20}
          />
        </div>
      )}
      <div className="relative z-[1]">
        {songs.length === 0 ? (
          <div className="
            flex
            flex-col
            gap-y-2
            w-full
            p-6
            text-neutral-400
          ">
            No liked songs.
          </div>
        ) : (
          <div className="flex flex-col p-6">
            {songs.map((song, i) => (
              <MediaItem
                key={song.id}
                data={song}
                index={i}
                isActivePlaylist={isActivePlaylist}
                onClick={(id, index) => songHandlePlay(id, index)}
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

export default LikedContent;

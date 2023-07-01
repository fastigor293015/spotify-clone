"use client";

import { useEffect } from "react";
import { RiMusic2Line } from "react-icons/ri";
import Image from "next/image";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import usePlaylistEditModal from "@/hooks/usePlaylistEditModal";
import { Playlist, Song } from "@/types";
import Header from "@/components/Header";
import MediaItem from "@/components/MediaItem";
import useLoadImage from "@/hooks/useLoadImage";
import { useUser } from "@/hooks/useUser";
import { twMerge } from "tailwind-merge";
import useImageDominantColor from "@/hooks/useImageDominantColor";
import PlayButton from "@/components/buttons/PlayButton";
import DropdownMenu from "@/components/DropdownMenu";
import { RxDotsHorizontal } from "react-icons/rx";
import LikeButton from "@/components/buttons/LikeButton";
import usePlayActions from "@/hooks/usePlayActions";
import usePlaylistActions from "@/hooks/usePlaylistActions";
import ContextMenu from "@/components/ContextMenu";
import { HiOutlinePencil } from "react-icons/hi";

interface PlaylistContentProps {
  playlist: Playlist;
  recommendedSongs: Song[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({
  playlist,
  recommendedSongs
}) => {
  const playlistEditModal = usePlaylistEditModal();
  const playActions = usePlayActions(playlist.songs, playlist.id, playlist.title);
  const recommendedPlayActions = usePlayActions(recommendedSongs.map((song) => song.id));
  const { songs } = useGetSongsByIds(playlist.songs);
  const firstSongImage = useLoadImage(songs?.[0]);
  const playlistImage = playlist.image_path || firstSongImage;
  const { isLiked, handleLike, editDetails, dropdownItems } = usePlaylistActions(playlist, playlistImage);
  const headerColor = useImageDominantColor(playlistImage);
  const { user } = useUser();

  useEffect(() => {
    if (!playlist) return;
    playlistEditModal.setData({ ...playlist, image_path: playlistImage });
    console.log(playlistEditModal.playlistData);
  }, [playlist, playlistImage]);

  const stickyContent = (
    <div className="flex items-center gap-2">
      <PlayButton
        playlistId={playlist.id}
        playlistName={playlist.title}
        songs={songs}
        className="opacity-100"
      />
      <p className="text-2xl text-white font-bold">{playlist.title}</p>
    </div>
  )

  return (
    <>
      <Header bgcolor={playlistImage ? headerColor : "rgb(83, 83, 83)"} stickyContent={stickyContent} scrollValue={360}>
        <ContextMenu items={dropdownItems}>
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
                gap-5
              "
            >
              <label
                onClick={playlistEditModal.onOpen}
                htmlFor="upload-image"
                className={twMerge(`
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
                  <RiMusic2Line className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />
                )}
                <div className={twMerge(`absolute inset-0 flex flex-col items-center justify-center pt-5 text-white text-sm md:text-base bg-neutral-800 opacity-0 hover:opacity-100`, playlistImage && "bg-black/70")}>
                  <HiOutlinePencil className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" />
                  <p>Choose a photo</p>
                </div>
              </label>
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
                  onClick={editDetails}
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
                    -translate-y-1
                    cursor-pointer
                  "
                >
                  {playlist.title}
                </h1>
                {playlist.description && (
                  <p onClick={editDetails} className="text-sm text-white/70">{playlist.description}</p>
                )}
                <p className="text-sm font-bold">
                  {playlist.email}
                  {playlist.songs.length > 0 && <span className="font-normal"> • {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}</span>}
                </p>
              </div>
            </div>
          </div>
        </ContextMenu>
      </Header>
      <div className="flex items-center gap-8 p-6">
        {playlist.songs.length > 0 && (
          <PlayButton
            songs={songs}
            playlistId={playlist.id}
            playlistName={playlist.title}
            className="p-[18px]"
            iconSize={20}
          />
        )}
        {user?.id !== playlist.user_id && (
          <LikeButton
            isLiked={isLiked}
            handleLike={handleLike}
            iconSize={35}
          />
        )}
        <DropdownMenu items={dropdownItems} className="text-neutral-400 hover:text-white" align="start">
          <RxDotsHorizontal size={30} />
        </DropdownMenu>
      </div>
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
            No songs in playlist.
          </div>
        ) : (
          <div className="flex flex-col p-6">
            {songs.map((song, i) => (
              <MediaItem
                key={song.id}
                data={song}
                index={i}
                isActivePlaylist={playActions.isActivePlaylist}
                onClick={(id, index) => playActions.songHandlePlay(id, index)}
                number={i + 1}
                likeBtn
                curPlaylist={playlist}
              />
            ))}
          </div>
        )}
      </div>
      {user?.id === playlist.user_id && (
        <div className="mt-10 px-6">
          <h2 className="mb-3 text-2xl font-bold">Recommended</h2>
          <p className="mb-6 text-neutral-400 text-sm">{!playlist.songs || playlist.songs.length === 0 ? "Based on the title of this playlist" : "Based on what's in this playlist"}</p>
          {recommendedSongs.map((song, i) =>
            !playlist.songs.includes(song.id) && (
              <MediaItem
                key={song.id}
                data={song}
                index={i}
                isActivePlaylist={recommendedPlayActions.isActivePlaylist}
                onClick={(id, index) => recommendedPlayActions.songHandlePlay(id, index)}
                addBtn
                curPlaylist={playlist}
              />
            )
          )}
        </div>
      )}
    </>
  );
}

export default PlaylistContent;

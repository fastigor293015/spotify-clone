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
import DropdownMenu, { DropdownItem } from "@/components/DropdownMenu";
import { RxDotsHorizontal } from "react-icons/rx";
import usePlayer from "@/hooks/usePlayer";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface PlaylistContentProps {
  playlist: Playlist;
  recommendedSongs: Song[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({
  playlist,
  recommendedSongs
}) => {
  const router = useRouter();
  const player = usePlayer();
  const playlistEditModal = usePlaylistEditModal();
  const { songs } = useGetSongsByIds(playlist.songs);
  const playlistImage = useLoadImage(playlist.image_path ? playlist.image_path : songs?.[0]);
  const headerColor = useImageDominantColor(playlistImage);
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (!playlist) return;
    playlistEditModal.setData({ ...playlist, image_path: playlist?.image_path || songs?.[0]?.image_path });
    console.log(playlistEditModal.playlistData);
  }, [playlist]);

  const deletePlaylistHandler = async (e?: React.MouseEvent) => {
    if (!user) return;
    e?.stopPropagation();

    try {
      const { error } = await supabaseClient
        .from("playlists")
        .delete()
        .eq("id", playlist.id);

      if (error) {
        toast.error(error.message);
      }

      toast.success("Playlist deleted!");
      router.push("/");

    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  const stickyContent = (
    <div className="flex items-center gap-2">
      <PlayButton playlistId={playlist.id} songs={songs} className="opacity-100" />
      <p className="text-2xl text-white font-bold">{playlist.title}</p>
    </div>
  )

  const dropdownItems: DropdownItem[] = [
    {
      label: "Add to queue",
      onClick: () => player.addToQueue(playlist.songs),
    },
    {
      label: "Delete",
      onClick: () => deletePlaylistHandler(),
    },
  ];

  return (
    <>
      <Header bgcolor={playlistImage ? headerColor : "rgb(83, 83, 83)"} stickyContent={stickyContent} scrollValue={360}>
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
                  lg:text-8xl
                  leading-[1.2]
                  sm:leading-[1.2]
                  lg:leading-[1.2]
                  font-bold
                  truncate
                  -translate-y-1
                "
              >
                {playlist.title}
              </h1>
              {playlist.description && (
                <p className="text-sm text-white/70">{playlist.description}</p>
              )}
              <p className="text-sm font-bold">
                {playlist.email}
                {playlist.songs.length > 0 && <span className="font-normal"> • {playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"}</span>}
              </p>
            </div>
          </div>
        </div>
      </Header>
      <div className="flex items-center gap-8 p-6">
        {playlist.songs.length > 0 && (
          <PlayButton
            songs={songs}
            playlistId={playlist.id}
            className="p-[18px]"
            iconSize={20}
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
          <p className="mb-6 text-neutral-400 text-sm">{!playlist.songs || playlist.songs.length === 0 ? "Based on the title of this playlist" : "Based on what's in this playlist"}</p>
          {recommendedSongs.map((song) =>
            !playlist.songs.includes(song.id) && (
              <MediaItem
                key={song.id}
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

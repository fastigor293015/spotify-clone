"use client";

import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import Image from "next/image";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import LikeButton from "./buttons/LikeButton";
import Button from "./buttons/Button";
import usePlaylistEditModal from "@/hooks/usePlaylistEditModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import DropdownMenu, { DropdownItem } from "./DropdownMenu";
import { RxDotsHorizontal } from "react-icons/rx";
import { useUser } from "@/hooks/useUser";

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
  number?: number;
  likeBtn?: boolean;
  addBtn?: boolean;
}

const MediaItem: React.FC<MediaItemProps> = ({
  data,
  onClick,
  number,
  likeBtn,
  addBtn,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { playlistData } = usePlaylistEditModal();
  const player = usePlayer();
  const imageUrl = useLoadImage(data);
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const isPlaylistPath = useMemo(() => pathname.includes("/playlist/"), [pathname]);
  const isInCurPlaylist = useMemo(() =>  playlistData?.songs.includes(data.id), [playlistData, data]);
  const Icon = useMemo(() => player.isPlaying && player.activeId === data.id ? BsPauseFill : BsPlayFill, [player, data]);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }

    return player.setId(data.id);
  }

  const addToCurPlaylist = async (e?: React.MouseEvent) => {
    if (!user) return;
    e?.stopPropagation();

    if (!playlistData?.songs) return null;

    try {
      setIsLoading(true);
      const { error } = await supabaseClient
        .from("playlists")
        .update({
          songs: [...playlistData.songs, data.id]
        })
        .eq("id", playlistData.id);

      if (error) {
        toast.error(error.message);
      }

      setIsLoading(false);
      toast.success("Successfully added!");
      router.refresh();

    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  const removeFromCurPlaylist = async (e?: React.MouseEvent) => {
    if (!user) return;
    e?.stopPropagation();

    if (!playlistData?.songs) return null;

    try {
      setIsLoading(true);
      const { error } = await supabaseClient
        .from("playlists")
        .update({
          songs: playlistData.songs.filter((song) => song !== data.id)
        })
        .eq("id", playlistData.id);

      if (error) {
        toast.error(error.message);
      }

      setIsLoading(false);
      toast.success("Successfully removed!");
      router.refresh();

    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }

  const playBtnHandler = () => {
    if (player.activeId !== data.id) {
      return player.setId(data.id);
    }
    if (!player.pause || !player.play) return;
    if (player.isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }

  const defaultDropdownItems: DropdownItem[] = isInCurPlaylist && isPlaylistPath && user?.id === playlistData?.user_id ? [
    {
      label: "Add to queue",
      onClick: () => player.addToQueue(data.id),
    },
    {
      label: "Remove from this playlist",
      onClick: () => removeFromCurPlaylist(),
    },
  ] : [
    {
      label: "Add to queue",
      onClick: () => player.addToQueue(data.id),
    },
  ];

  return (
    <div
      onClick={handleClick}
      className="
        group
        grid
        grid-cols-1 auto-cols-[auto] grid-flow-col
        items-center
        gap-x-3
        cursor-pointer
        hover:bg-neutral-800/50
        w-full
        max-w-full
        p-2
        rounded-md
      "
    >
      <div className="flex items-center gap-x-3">
        {number && (
          <div className="flex items-center justify-center w-4 h-4 ml-2 mr-1">
            <div className={twMerge(`text-neutral-400 group-hover:hidden group-focus:hidden`, player.activeId === data.id && "text-green-500")}>
              {player.isPlaying && player.activeId === data.id
                ? <Image width={14} height={14} src="/images/equaliser-animated.gif" alt="Equalizer" />
                : number}
            </div>
            <div className="hidden group-hover:block group-focus:hidden" onClick={playBtnHandler}>
              <Icon size={22} />
            </div>
          </div>
        )}
        <div
          className="
            relative
            rounded-md
            h-[48px]
            w-[48px]
            overflow-hidden
          "
        >
          <Image
            fill
            src={imageUrl || "/images/liked.png"}
            alt="Media Item"
            className="object-cover"
          />
        </div>
        <div className="
          flex-1
          flex
          flex-col
          gap-y-1
          truncate
        ">
          <p className={twMerge(`text-white truncate`, player.activeId === data.id && "text-green-500")}>
            {data.title}
          </p>
          <p className="text-neutral-400 text-sm truncate">
            {data.author}
          </p>
        </div>
      </div>
      {likeBtn && (
        <LikeButton className="mr-2 hidden group-hover:block transition-colors" songId={data.id} />
      )}
      {addBtn && isPlaylistPath && !isInCurPlaylist ? (
        <Button onClick={addToCurPlaylist} className="w-auto py-1 px-4 border-white/80 text-sm text-white bg-transparent hover:scale-110 hover:border-white hover:opacity-100" disabled={isLoading}>
          Add
        </Button>
      ) : (
        <DropdownMenu items={defaultDropdownItems} className="mx-2 opacity-0 group-hover:opacity-100" align="end">
          <RxDotsHorizontal size={20} />
        </DropdownMenu>
      )}
    </div>
  );
}

export default MediaItem;

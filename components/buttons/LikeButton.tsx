"use client";

import { useEffect, useMemo, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useLikedSongs from "@/hooks/useLikedSongs";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  id: string;
  contentType?: "song" | "playlist";
  className?: string;
  iconSize?: number;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  id,
  contentType = "song",
  className,
  iconSize = 25,
}) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();

  const likedSongs = useLikedSongs();
  const authModal = useAuthModal();
  const { user } = useUser();

  const [isPlaylistLiked, setIsPlaylistLiked] = useState(false);
  const isLiked = useMemo(() => {
    return contentType === "song"
      ? Boolean(likedSongs.songs.find((song) => id === song))
      : isPlaylistLiked
  }, [contentType, id, likedSongs, isPlaylistLiked]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from(`liked_${contentType}s`)
        .select("*")
        .eq("user_id", user.id)
        .eq(`${contentType}_id`, id)
        .single();

      if (!error && data && !isLiked) {
        if (contentType === "song") {
          likedSongs.toggle(id);
        } else {
          setIsPlaylistLiked(true);
          router.refresh();
        }
      }
    };

    fetchData();
  }, [id, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from(`liked_${contentType}s`)
        .delete()
        .eq("user_id", user.id)
        .eq(`${contentType}_id`, id);

      if (error) {
        return toast.error(error.message);
      }

      if (contentType === "song") {
        likedSongs.toggle(id);
      } else {
        setIsPlaylistLiked(false);
        router.refresh();
      }

    } else {
      const { error } = await supabaseClient
        .from(`liked_${contentType}s`)
        .insert(contentType === "song"
          ? {
            song_id: id,
            user_id: user.id,
          } : {
            playlist_id: id,
            user_id: user.id,
          });

      if (error) {
        return toast.error(error.message);
      }

      if (contentType === "song") {
        likedSongs.toggle(id);
      } else {
        setIsPlaylistLiked(true);
        router.refresh();
      }
      toast.success("Liked");
    }
  }

  return (
    <button
      onClick={handleLike}
      className={twMerge(`
        hover:opacity-75
        transition
      `, className, isLiked && "block")}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={iconSize} />
    </button>
  );
}

export default LikeButton;

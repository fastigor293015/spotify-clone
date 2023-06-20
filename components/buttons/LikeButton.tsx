"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useLikedSongs from "@/hooks/useLikedSongs";
import { twMerge } from "tailwind-merge";

interface LikeButtonProps {
  songId: string;
  className?: string;
  iconSize?: number;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  songId,
  className,
  iconSize = 25,
}) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();

  const likedSongs = useLikedSongs();
  const authModal = useAuthModal();
  const { user } = useUser();

  // const [isLiked, setIsLiked] = useState(likedSongs);
  const isLiked = useMemo(() => {
    return Boolean(likedSongs.songs.find((song) => songId === song));
  }, [likedSongs, songId]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (!error && data && !isLiked) {
        likedSongs.toggle(songId);
      }
    };

    fetchData();
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      if (error) {
        toast.error(error.message);
      } else {
        likedSongs.toggle(songId);
      }
    } else {
      const { error } = await supabaseClient
        .from("liked_songs")
        .insert({
          song_id: songId,
          user_id: user.id,
        });

      if (error) {
        toast.error(error.message);
      } else {
        likedSongs.toggle(songId);
        toast.success("Liked");
      }
    }
  }

  return (
    <button
      onClick={handleLike}
      className={twMerge(`
        hover:opacity-75
        transition
      `, className)}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={iconSize} />
    </button>
  );
}

export default LikeButton;
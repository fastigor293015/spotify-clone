import { useCallback, useMemo, useState } from "react";
import { useUser } from "./useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { DropdownItem } from "@/components/DropdownMenu";
import usePlayer from "./usePlayer";
import useLikedSongs from "./useLikedSongs";
import useAuthModal from "./useAuthModal";
import { Playlist } from "@/types";

const useSongActions = (songId: string, index?: number, curPlaylist?: Playlist) => {
  const router = useRouter();
  const pathname = usePathname();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const authModal = useAuthModal();
  const likedSongs = useLikedSongs();
  const player = usePlayer();

  const [isLoading, setIsLoading] = useState(false);
  const isLiked = useMemo(() => !!likedSongs.songs.find((song) => songId === song), [songId, likedSongs]);

  const isQueuePath = useMemo(() => pathname === "/queue", [pathname]);
  const isInCurPlaylist = useMemo(() => curPlaylist && curPlaylist.songs.includes(songId), [songId, curPlaylist]);

  // useEffect(() => {
  //   if (!user?.id) {
  //     return;
  //   }

  //   const fetchData = async () => {
  //     const { data, error } = await supabaseClient
  //       .from(`liked_songs`)
  //       .select("*")
  //       .eq("user_id", user.id)
  //       .eq(`song_id`, songId)
  //       .single();

  //     if (!error && data && !isLiked) {
  //       likedSongs.toggle(songId);
  //     }
  //   };

  //   fetchData();
  // }, [songId, supabaseClient, user?.id]);

  const handleLike = useCallback(async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from(`liked_songs`)
        .delete()
        .eq("user_id", user.id)
        .eq(`song_id`, songId);

      if (error) {
        return toast.error(error.message);
      }

      likedSongs.toggle(songId);
    } else {
      const { error } = await supabaseClient
        .from(`liked_songs`)
        .insert({
          song_id: songId,
          user_id: user.id,
        });

      if (error) {
        return toast.error(error.message);
      }

      likedSongs.toggle(songId);
      toast.success("Liked");
    }
  }, [user, authModal, supabaseClient, isLiked, songId, likedSongs]);

  const addToCurPlaylist = useCallback(async () => {
    if (!user) return;

    if (!curPlaylist?.songs) return null;

    try {
      setIsLoading(true);
      const { error } = await supabaseClient
        .from("playlists")
        .update({
          songs: [...curPlaylist.songs, songId]
        })
        .eq("id", curPlaylist.id);

      if (error) {
        toast.error(error.message);
      }

      setIsLoading(false);
      toast.success("Added to playlist");
      router.refresh();

    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, [songId, curPlaylist, router, supabaseClient, user]);

  const removeFromCurPlaylist = useCallback(async () => {
    if (!user) return;

    if (!curPlaylist?.songs) return null;

    try {
      setIsLoading(true);
      const { error } = await supabaseClient
        .from("playlists")
        .update({
          songs: curPlaylist.songs.filter((song) => song !== songId)
        })
        .eq("id", curPlaylist.id);

      if (error) {
        toast.error(error.message);
      }

      setIsLoading(false);
      toast.success("Removed from playlist");
      router.refresh();

    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  }, [songId, curPlaylist, router, supabaseClient, user]);

  const likeDropdownItem: DropdownItem = useMemo(() => ({
    label: isLiked ? "Remove from your Liked Songs" : "Save to your Liked Songs",
    onClick: handleLike,
  }), [isLiked, handleLike]);

  const dropdownItems = useMemo((): DropdownItem[] => isInCurPlaylist && user?.id === curPlaylist?.user_id ? [
    {
      label: "Add to queue",
      onClick: () => player.addToQueue([songId]),
    },
    likeDropdownItem,
    {
      label: "Remove from this playlist",
      onClick: () => removeFromCurPlaylist(),
    },
  ] : isQueuePath && index && index !== player.activeIndex ? [
    {
      label: "Add to queue",
      onClick: () => player.addToQueue([songId]),
    },
    {
      label: "Remove from queue",
      onClick: () => player.removeFromQueue(songId, index),
    },
    likeDropdownItem
  ] : [
    {
      label: "Add to queue",
      onClick: () => player.addToQueue([songId]),
    },
    likeDropdownItem
  ], [isInCurPlaylist, isQueuePath, user?.id, curPlaylist?.user_id, player, songId, index, removeFromCurPlaylist, likeDropdownItem]);

  return {
    isInCurPlaylist,
    isLiked,
    handleLike,
    isLoading,
    addToCurPlaylist,
    removeFromCurPlaylist,
    dropdownItems
  };
};

export default useSongActions;

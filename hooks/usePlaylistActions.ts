import { Playlist } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import usePlayer from "./usePlayer";
import { useUser } from "./useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import usePlaylistEditModal from "./usePlaylistEditModal";
import useAuthModal from "./useAuthModal";
import useSubscribeModal from "./useSubscribeModal";
import { DropdownItem } from "@/components/DropdownMenu";
import useLikedPlaylists from "./useLikedPlaylists";

const usePlaylistActions = (playlist?: Playlist, publicImageUrl?: string | null) => {
  const router = useRouter();
  const pathname = usePathname();
  const player = usePlayer();
  const authModal = useAuthModal();
  const subscribeModal = useSubscribeModal();
  const playlistEditModal = usePlaylistEditModal();
  const { user, subscription } = useUser();
  const supabaseClient = useSupabaseClient();
  const likedPlaylists = useLikedPlaylists();

  const isLiked = useMemo(() => !!likedPlaylists.playlists.find((playlistId) => playlistId === playlist?.id), [likedPlaylists, playlist]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from(`liked_playlists`)
        .select("*")
        .eq("user_id", user.id)
        .eq(`playlist_id`, playlist?.id)
        .single();

      if (!error && data && !isLiked) {
        likedPlaylists.toggle(playlist?.id!);
      }
    };

    fetchData();
  }, [playlist, supabaseClient, user?.id]);

  const handleLike = useCallback(async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from(`liked_playlists`)
        .delete()
        .eq("user_id", user.id)
        .eq(`playlist_id`, playlist?.id);

      if (error) {
        return toast.error(error.message);
      }

      likedPlaylists.toggle(playlist?.id!);

    } else {
      const { error } = await supabaseClient
        .from(`liked_playlists`)
        .insert({
            playlist_id: playlist?.id,
            user_id: user.id,
          });

      if (error) {
        return toast.error(error.message);
      }

      likedPlaylists.toggle(playlist?.id!);
      toast.success("Liked");
    }
  }, [user, router, authModal, supabaseClient, isLiked, playlist]);

  const createPlaylist = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (!subscription) {
      return subscribeModal.onOpen();
    }

    try {
      const { data, error } = await supabaseClient
        .from("playlists")
        .insert({
          title: "My Playlist",
          user_id: user.id,
          email: user.email,
          songs: [],
        })
        .select();

      if (error) {
        return toast.error(error.message);
      }

      console.log(data);

      toast.success("Playlist created");
      router.refresh();
      router.push(`/playlist/${data[0].id}`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const addToQueue = useCallback(() => {
    if (!playlist) return;
    player.addToQueue(playlist.songs);
  }, [player, playlist]);

  const editDetails = useCallback(() => {
    if (!user || !playlist || !publicImageUrl || user.id !== playlist.user_id) return;
    playlistEditModal.setData({ ...playlist, image_path: publicImageUrl });
    playlistEditModal.onOpen();
  }, [user, playlistEditModal, playlist, publicImageUrl]);

  const deletePlaylist = useCallback(async () => {
    if (!user || !playlist || user.id !== playlist.user_id) return;

    try {
      const { error } = await supabaseClient
        .from("playlists")
        .delete()
        .eq("id", playlist.id);

      if (error) {
        toast.error(error.message);
      }

      toast.success("Playlist deleted");
      router.refresh();
      if (pathname === `/playlist/${playlist.id}`) router.push("/");

    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [user, router, pathname, supabaseClient, playlist]);

  const dropdownItems = useMemo((): DropdownItem[] => playlist?.id === "liked" ? []
    : playlist?.user_id === user?.id ? [
      {
        label: "Add to queue",
        onClick: addToQueue,
      },
      {
        label: "Edit details",
        onClick: editDetails,
      },
      {
        label: "Delete",
        onClick: deletePlaylist,
      },
    ] : [
      {
        label: "Add to queue",
        onClick: addToQueue,
      },
      {
        label: isLiked ? "Remove from your library" : "Add to your library",
        onClick: handleLike,
      }
    ], [user, isLiked, handleLike, playlist, addToQueue, editDetails, deletePlaylist]);

  return {
    isLiked,
    handleLike,
    createPlaylist,
    addToQueue,
    editDetails,
    deletePlaylist,
    dropdownItems
  };
};

export default usePlaylistActions;

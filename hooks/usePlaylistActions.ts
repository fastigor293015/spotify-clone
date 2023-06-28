import { Playlist } from "@/types";
import { useCallback, useMemo } from "react";
import usePlayer from "./usePlayer";
import { useUser } from "./useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import usePlaylistEditModal from "./usePlaylistEditModal";
import useAuthModal from "./useAuthModal";
import useSubscribeModal from "./useSubscribeModal";

const usePlaylistActions = (playlist?: Playlist, publicImageUrl?: string | null) => {
  const router = useRouter();
  const pathname = usePathname();
  const player = usePlayer();
  const authModal = useAuthModal();
  const subscribeModal = useSubscribeModal();
  const playlistEditModal = usePlaylistEditModal();
  const { user, subscription } = useUser();
  const supabaseClient = useSupabaseClient();

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

  const dropdownItems = useMemo(() => playlist?.id === "liked" ? []
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
    ], [user, playlist, addToQueue, editDetails, deletePlaylist]);

  return {
    createPlaylist,
    addToQueue,
    editDetails,
    deletePlaylist,
    dropdownItems
  };
};

export default usePlaylistActions;

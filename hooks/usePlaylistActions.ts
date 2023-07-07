import { Playlist } from "@/types";
import { useCallback, useMemo, useState } from "react";
import usePlayer from "./usePlayer";
import { useUser } from "./useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import usePlaylistEditModal, { EPlaylistEditInputsIds } from "./usePlaylistEditModal";
import useAuthModal from "./useAuthModal";
import useSubscribeModal from "./useSubscribeModal";
import { DropdownItem } from "@/components/DropdownMenu";
import useLikedPlaylists from "./useLikedPlaylists";
import useDeleteConfirmationModal from "./useDeleteConfirmationModal";

const usePlaylistActions = (playlist?: Playlist, publicImageUrl?: string | null) => {
  const router = useRouter();
  const pathname = usePathname();
  const player = usePlayer();
  const authModal = useAuthModal();
  const subscribeModal = useSubscribeModal();
  const playlistEditModal = usePlaylistEditModal();
  const deleteConfirmationModal = useDeleteConfirmationModal();
  const { user, subscription } = useUser();
  const supabaseClient = useSupabaseClient();
  const likedPlaylists = useLikedPlaylists();
  const [isLoading, setIsLoading] = useState(false);

  const isLiked = useMemo(() => !!likedPlaylists.playlists.find((playlistId) => playlistId === playlist?.id), [likedPlaylists, playlist]);

  // useEffect(() => {
  //   if (!user?.id) {
  //     return;
  //   }

  //   const fetchData = async () => {
  //     const { data, error } = await supabaseClient
  //       .from(`liked_playlists`)
  //       .select("*")
  //       .eq("user_id", user.id)
  //       .eq(`playlist_id`, playlist?.id)
  //       .single();

  //     if (!error && data && !isLiked) {
  //       likedPlaylists.toggle(playlist?.id!);
  //     }
  //   };

  //   console.log("Загружаю")
  //   fetchData();
  // }, [playlist, supabaseClient, user?.id]);

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
  }, [user, authModal, supabaseClient, isLiked, playlist, likedPlaylists]);

  const createPlaylist = useCallback(async () => {
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
  }, [router, supabaseClient, subscribeModal, authModal, subscription, user]);

  const addToQueue = useCallback(() => {
    if (!playlist) return;
    player.addToQueue(playlist.songs);
  }, [player, playlist]);

  const editDetails = useCallback((inputId?: EPlaylistEditInputsIds) => {
    if (!user || !playlist || user.id !== playlist.user_id) return;
    playlistEditModal.setData({ ...playlist, image_path: publicImageUrl });
    playlistEditModal.onOpen(inputId);
  }, [user, playlistEditModal, playlist, publicImageUrl]);

  const deletePlaylist = useCallback(async () => {
    if (!user || !playlist || user.id !== playlist.user_id) return;

    try {
      setIsLoading(true);
      const { error } = await supabaseClient
        .from("playlists")
        .delete()
        .eq("id", playlist.id);

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
      }

      toast.success("Playlist deleted");
      deleteConfirmationModal.onClose();
      setIsLoading(false);
      router.refresh();
      if (pathname === `/playlist/${playlist.id}`) router.push("/");

    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, router, pathname, supabaseClient, playlist, deleteConfirmationModal]);

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
        onClick: () => deleteConfirmationModal.onOpen(playlist!),
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
    ], [user, isLiked, handleLike, playlist, addToQueue, editDetails, deleteConfirmationModal]);

  return {
    isLoading,
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

import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import useSubscribeModal from "./useSubscribeModal";
import { useCallback, useMemo } from "react";

const usePlayActions = (songs: string[], playlistId?: string, playlistName?: string) => {
  const player = usePlayer();
  const subscriptionModal = useSubscribeModal();
  const authModal = useAuthModal();
  const { user, subscription} = useUser();

  const isActivePlaylist = useMemo(() => player.playlistId === playlistId, [player, playlistId]);

  const songHandlePlay = useCallback((id: string, index: number) => {
    if (!user) {
      return authModal.onOpen();
    }

    if (player.activeIndex !== index || !isActivePlaylist) {
      player.setIds(songs, playlistId, playlistName);
      return player.setId(id, index);
    }
    if (!player.pause || !player.play) return;
    if (player.isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [user, player, authModal, songs, playlistId, playlistName, isActivePlaylist]);

  const playlistHandlePlay = useCallback(() => {
    if (!user) {
      return authModal.onOpen();
    }

    if (songs.length === 0) return;
    if (!isActivePlaylist) {
      player.setIds(songs, playlistId, playlistName);
      player.setId(songs[0], 0);
    };
    if (!player.play || !player.pause) return;

    if (player.isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [user, player, authModal, isActivePlaylist, songs, playlistId, playlistName]);

  return useMemo(() => ({
    songHandlePlay,
    playlistHandlePlay,
    isActivePlaylist
  }), [songHandlePlay, playlistHandlePlay, isActivePlaylist]);
};

export default usePlayActions;

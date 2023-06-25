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

  const isActive = useMemo(() => player.playlistId === playlistId, [player, playlistId]);

  const songHandlePlay = useCallback((id: string) => {
    if (!user) {
      return authModal.onOpen();
    }

    if (player.activeId !== id) {
      player.setIds(songs, playlistId, playlistName);
      return player.setId(id);
    }
    if (!player.pause || !player.play) return;
    if (player.isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [user, player, authModal, songs, playlistId, playlistName]);

  const playlistHandlePlay = useCallback(() => {
    if (!user) {
      return authModal.onOpen();
    }

    if (songs.length === 0) return;
    if (!isActive) {
      player.setIds(songs, playlistId, playlistName);
      player.setId(songs[0]);
    };
    if (!player.play || !player.pause) return;

    if (!player.isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [user, player, authModal, isActive, songs]);

  return useMemo(() => ({
    songHandlePlay,
    playlistHandlePlay,
    isActive
  }), [songHandlePlay, playlistHandlePlay, isActive]);
};

export default usePlayActions;

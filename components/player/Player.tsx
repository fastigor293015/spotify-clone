"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";
import { useUser } from "@/hooks/useUser";

const Player = () => {
  const player = usePlayer();
  const { user, subscription } = useUser();
  const { song } = useGetSongById(player.activeId);

  const songUrl = useLoadSongUrl(song!);

  if (!song || !songUrl || !player.activeId || !user || !subscription) {
    return null;
  }

  return (
    <PlayerContent
      // после переключения песни изменённый ключ пересоздаст данный компонент, и хук useSound сработает как надо
      key={`${player.playlistId}-${songUrl}`}
      song={song}
      songUrl={songUrl}
    />
  );
}

export default Player;

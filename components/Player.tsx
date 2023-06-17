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
    <div
      className="
        bg-black
        w-full
        py-2
        h-[80px]
        px-4
      "
    >
      <PlayerContent
        // после переключения песни изменённый ключ пересоздаст данный компонент, и хук useSound сработает как надо
        key={songUrl}
        song={song}
        songUrl={songUrl}
      />
    </div>
  );
}

export default Player;

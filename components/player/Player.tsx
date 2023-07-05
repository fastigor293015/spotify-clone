"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

const Player = () => {
  const player = usePlayer();
  const { user } = useUser();
  const { song, isLoading } = useGetSongById(player.activeId);

  const songUrl = useLoadSongUrl(song!);

  useEffect(() => {
    const getLyrics = async () => {
      if (!song) return;

      const trackResponse = await fetch(`https://api.musixmatch.com/ws/1.1/track.search?q_artist=${song.author}&q_track=${song.title}&s_track_rating=desc&apikey=4d014072b0915be84ad8479706abefc4`);
      const data = await trackResponse.json();

      const lyricsResponse = await fetch(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${data.message.body.track_list[0].track.track_id}&apikey=4d014072b0915be84ad8479706abefc4`);
      const lyricsData = await lyricsResponse.json();
      player.setLyrics(lyricsData.message.body.lyrics.lyrics_body);
      console.log(data);
      console.log(lyricsData);
    }
    getLyrics();
  }, [song]);

  if (!song || !songUrl || !player.activeId || !user || isLoading) {
    return null;
  }

  return (
    <PlayerContent
      // после переключения песни изменённый ключ пересоздаст данный компонент, и хук useSound сработает как надо
      key={`${player.activeIndex}-${player.playlistId}-${songUrl}`}
      song={song}
      songUrl={songUrl}
    />
  );
}

export default Player;

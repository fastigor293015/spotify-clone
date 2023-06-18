"use client";

import useLikedSongs from "@/hooks/useLikedSongs";
import { Song } from "@/types";
import { useEffect } from "react";

interface LikedSongsProviderProps {
  songs: Song[];
}

const LikedSongsProvider: React.FC<LikedSongsProviderProps> = ({
  songs
}) => {
  const { set } = useLikedSongs();

  useEffect(() => {
    set(songs.map((song) => song.id));
  }, [songs]);

  return null;
}

export default LikedSongsProvider;

"use client";

import useLikedPlaylists from "@/hooks/useLikedPlaylists";
import { Playlist } from "@/types";
import { useEffect } from "react";

interface LikedPlaylistsProviderProps {
  playlists: Playlist[];
}

const LikedPlaylistsProvider: React.FC<LikedPlaylistsProviderProps> = ({
  playlists
}) => {
  const { set } = useLikedPlaylists();

  useEffect(() => {
    set(playlists.map((playlist) => playlist.id));
  }, [playlists]);

  return null;
}

export default LikedPlaylistsProvider;

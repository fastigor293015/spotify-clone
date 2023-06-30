import { Playlist } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast";

const useGetPlaylistsByIds = (ids?: string[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!ids) {
      return;
    }

    setIsLoading(true);

    const fetchPlaylists = async () => {
      const { data, error } = await supabaseClient
        .from("playlists")
        .select("*")
        .in("id", ids)
        .order("created_at", { ascending: false });

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      const newPlaylistsData = ids.map((playlistId) => data.find((item) => item.id === playlistId));
      setPlaylists(newPlaylistsData as Playlist[]);
      setIsLoading(false);
    }

    fetchPlaylists();
  }, [ids, supabaseClient]);

  return useMemo(() => ({
    isLoading,
    playlists
  }), [isLoading, playlists]);
};

export default useGetPlaylistsByIds;

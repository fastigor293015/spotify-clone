import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast";

const useGetSongsByIds = (ids?: string[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!ids) {
      return;
    }

    setIsLoading(true);

    const fetchSong = async () => {
      const { data, error } = await supabaseClient
        .from("songs")
        .select("*")
        .in("id", ids)
        .order("created_at", { ascending: false });

      if (error) {
        setIsLoading(false);
        return toast.error(error.message);
      }

      const newSongsData = ids.map((songId) => data.find((item) => item.id === songId));
      setSongs(newSongsData as Song[]);
      setIsLoading(false);
    }

    fetchSong();
  }, [ids, supabaseClient]);

  return useMemo(() => ({
    isLoading,
    songs
  }), [isLoading, songs]);
};

export default useGetSongsByIds;

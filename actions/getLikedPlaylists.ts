import { Playlist } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedPlaylists = async (): Promise<Playlist[]> => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("liked_playlists")
    .select("*, playlists(*)")
    .eq("user_id", session?.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item.playlists
  }));
};

export default getLikedPlaylists;

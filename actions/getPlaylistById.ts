import { Playlist } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getPlaylistById = async (id?: string): Promise<Playlist | null> => {
  if (!id) return null;

  const supabase = createServerComponentClient({
    cookies,
  });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
  }

  if (!data?.image_path) {
    return data as Playlist;
  }

  const { data: imageData } = supabase
    .storage
    .from("images")
    .getPublicUrl(data?.image_path);

  console.log(imageData.publicUrl);

  return { ...data, image_path: imageData.publicUrl } as Playlist;
}

export default getPlaylistById;

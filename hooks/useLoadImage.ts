import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Song } from "@/types";

const useLoadImage = (data: Song | string) => {
  const supabaseClient = useSupabaseClient();

  if (!data) {
    return null;
  }

  const { data: imageData } = supabaseClient
    .storage
    .from("images")
    .getPublicUrl(typeof data === "string" ? data : data.image_path);

  return imageData.publicUrl;
};

export default useLoadImage;

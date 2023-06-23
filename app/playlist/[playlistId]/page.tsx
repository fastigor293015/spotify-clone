import getPlaylistById from "@/actions/getPlaylistById";
import Box from "@/components/Box";
import PlaylistContent from "./components/PlaylistContent";
import getSongs from "@/actions/getSongs";

interface IParams {
  playlistId?: string;
}

const Playlist = async ({ params }: { params: IParams }) => {
  const playlist = await getPlaylistById(params.playlistId);
  const recommendedSongs = await getSongs();

  if (!playlist) return null;
  console.log(playlist);

  return (
    <Box
      className="
        h-full
        pb-20
        overflow-hidden
        overflow-y-auto
      "
    >
      <PlaylistContent playlist={playlist} recommendedSongs={recommendedSongs} />
    </Box>
  );
}

export default Playlist;

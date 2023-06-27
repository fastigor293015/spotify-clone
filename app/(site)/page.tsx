import getSongs from "@/actions/getSongs";
import Box from "@/components/Box";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "./components/PageContent";
import getLikedSongs from "@/actions/getLikedSongs";
import getPlaylists from "@/actions/getPlaylists";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const likedSongs = await getLikedSongs();
  const playlists = await getPlaylists();

  return (
    <Box
      className="
        h-full
        pb-20
        overflow-hidden
        overflow-y-auto
      "
    >
      <Header bgcolor="rgb(6,95,70)">
        <div className="mb-2">
          <h1
            className="
              text-white
              text-3xl
              font-semibold
            "
          >
            Welcome back
          </h1>
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
              gap-3
              mt-4
            "
          >
            <ListItem
              image="/images/liked.png"
              name="Liked songs"
              href="liked"
              songs={likedSongs}
            />
          </div>
        </div>
      </Header>
      <PageContent songs={songs} playlists={playlists} />
    </Box>
  )
}

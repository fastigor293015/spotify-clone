import getSongs from "@/actions/getSongs";
import Box from "@/components/Box";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "./components/PageContent";
import getLikedSongs from "@/actions/getLikedSongs";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const likedSongs = await getLikedSongs();

  return (
    <Box
      className="
        h-full
        overflow-hidden
        overflow-y-auto
      "
    >
      <Header>
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
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Newest songs
          </h1>
        </div>
        <PageContent songs={songs} />
      </div>
    </Box>
  )
}

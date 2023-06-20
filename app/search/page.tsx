import getSongsByTitle from "@/actions/getSongsByTitle";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";
import Box from "@/components/Box";

interface SearchProps {
  searchParams: {
    title: string;
  }
};

export const revalidate = 0;

const Search = async ({ searchParams }: SearchProps) => {
  const songs = await getSongsByTitle(searchParams.title);

  return (
    <Box
      className="
        h-full
        pb-20
        overflow-hidden
        overflow-y-auto
      "
    >
      <Header>
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Search
          </h1>
          <SearchInput />
        </div>
      </Header>
      <div className="relative z-[1]">
        <SearchContent songs={songs} />
      </div>
    </Box>
  )
}

export default Search;

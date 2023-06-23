import LikedContent from "./components/LikedContent";
import Box from "@/components/Box";

export const revalidate = 0;

const Liked = () => {

  return (
    <Box
      className="
        h-full
        pb-20
        overflow-hidden
        overflow-y-auto
      "
    >
      <LikedContent />
    </Box>
  );
}

export default Liked;

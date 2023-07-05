import Box from "@/components/Box";
import Header from "@/components/Header";
import LyricsContent from "./components/LyricsContent";

const LyricsPage = () => {
  return (
    <Box
      className="
        h-full
        overflow-hidden
        overflow-y-auto
      "
    >
      <Header />
      <div className="relative z-[1]">
        <LyricsContent />
      </div>
    </Box>
  );
}

export default LyricsPage;

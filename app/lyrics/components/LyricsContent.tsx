"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useImageDominantColor from "@/hooks/useImageDominantColor";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

const LyricsContent = () => {
  const router = useRouter();
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const imageUrl = useLoadImage(song?.image_path!);
  const bgcolor = useImageDominantColor(imageUrl);
  const lyricsRows = player.lyrics?.split("\n");

  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  return (
    <div className="py-16 px-36 font-bold text-white text-5xl leading-normal" style={{ backgroundColor: bgcolor }}>
      {lyricsRows?.map((item, i) => (
        <div key={`${i}-${item}`} className={twMerge(i === lyricsRows.length - 1 && "py-14 text-base")}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default LyricsContent;

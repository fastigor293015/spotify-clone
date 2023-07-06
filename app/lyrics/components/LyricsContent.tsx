"use client";

import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

const LyricsContent = () => {
  const router = useRouter();
  const player = usePlayer();
  const lyricsRows = player.lyrics?.split("\n")?.slice(0, -1);

  const { isLoading, user } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  return (
    <div className="py-8 pb-16 lg:pt-16 px-6 sm:px-16 lg:px-36 font-bold text-white text-2xl xl:text-[32px] 2xl:text-5xl xl:leading-normal 2xl:leading-normal transition duration-200" style={{ backgroundColor: player.bgcolor }}>
      {lyricsRows?.map((item, i) => (
        <div key={`${i}-${item}`} className={twMerge(i === lyricsRows.length - 1 && "py-14 text-[0.45em]")}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default LyricsContent;

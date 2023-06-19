"use client";

import Header from "@/components/Header";
import Image from "next/image";
import LikedContent from "./components/LikedContent";
import Box from "@/components/Box";
import { useEffect, useRef, useState } from "react";
import { getImageData } from "@/libs/utils";

// export const revalidate = 0;

const Liked = () => {
  const [imageData, setImageData] = useState<Uint8ClampedArray | number[]>([0,0,0]);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;
    imageRef.current.addEventListener("load", () => {
      const newImageData = getImageData(imageRef.current!);
      console.log(newImageData);
      setImageData(newImageData);
    })
  }, [imageRef.current]);

  return (
    <Box
      className="
        h-full
        overflow-hidden
        overflow-y-auto
      "
    >
      <Image
        ref={imageRef}
        className="absolute -left-20 bottom-[150px]"
        height={1}
        width={1}
        src={"/images/liked.png"}
        alt="For picking color"
      />
      <Header bgcolor={`rgb(${imageData[0],imageData[1],imageData[2]})`}>
        <div className="mt-20">
          <div
            className="
              flex
              flex-col
              md:flex-row
              items-center
              gap-x-5
            "
          >
            <div className="
              relative
              h-32
              w-32
              lg:h-44
              lg:w-44
            ">
              <Image
                fill
                alt="Playlist"
                className="object-cover"
                src="/images/liked.png"
              />
            </div>
            <div className="
              flex
              flex-col
              gap-y-2
              mt-4
              md:mt-0
            ">
              <p className="hidden md:block font-semibold text-sm">
                Playlist
              </p>
              <h1
                className="
                  text-white
                  text-4xl
                  sm:text-5xl
                  lg:text-7xl
                  font-bold
                "
              >
                Liked Songs
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <div className="relative z-[1]">
        <LikedContent />
      </div>
    </Box>
  );
}

export default Liked;

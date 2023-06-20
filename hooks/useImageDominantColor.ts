import { getImageDominantColor } from "@/utils";
import { useEffect, useState } from "react";

const useImageDominantColor = (src: string | null) => {
  const [color, setColor] = useState<any>("#000");

  useEffect(() => {
    if (!src) return;

    const getColor = async () => {
      const newColor = await getImageDominantColor(src);
      setColor(newColor);
    }

    getColor();
  }, [src]);

  return color;
}

export default useImageDominantColor;

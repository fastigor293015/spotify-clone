import ColorThief from "color-thief-ts";

export const getImageDominantColor = async (src: string) => {
  const colorThief = new ColorThief();
  const color = await colorThief.getColorAsync(src);
  console.log(color);

  return color as any;
}

export const formatTime = (time: number | null) => {
  if (!time || isNaN(time)) {
    return "-:--";
  }
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time - Math.floor(time / 60) * 60);

  return mins + ":" + (secs < 10 ? `0${secs}` : secs);
}

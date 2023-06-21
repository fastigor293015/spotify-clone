import ColorThief from "color-thief-ts";

export const getImageDominantColor = async (src: string) => {
  const colorThief = new ColorThief();
  const color = await colorThief.getColorAsync(src);
  console.log(color);

  return color as any;
}

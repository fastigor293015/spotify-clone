export const getImageData = (img: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext && canvas.getContext("2d");
  let data: Uint8ClampedArray | number[] = [0,0,0];

  if (!context) {
    return data;
  }

  canvas.height = canvas.width = 1;
  context.drawImage(img!, 0, 0, 1, 1);

  try {
    data = context.getImageData(0, 0, 1, 1).data;

    console.log(data);

  } catch (error: any) {
    console.log(error);
  }

  return data;
}

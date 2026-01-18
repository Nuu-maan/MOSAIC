export const ASCII_SETS = {
  dense: "@%#*+=-:. ",
  medium: "@#*+-. ",
  light: "@*. "
} as const;

export type CharSetKey = keyof typeof ASCII_SETS;

export function getPixelBrightness(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function mapBrightnessToChar(brightness: number, charSet: string): string {
  const index = Math.floor((1 - brightness) * (charSet.length - 1));
  return charSet[Math.min(index, charSet.length - 1)];
}

export function resizeFrame(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number
): { width: number; height: number } {
  const aspectRatio = originalHeight / originalWidth;
  const charAspectRatio = 0.5;
  const height = Math.floor(targetWidth * aspectRatio * charAspectRatio);
  return { width: targetWidth, height };
}

export function convertFrameToAscii(
  imageData: ImageData,
  width: number,
  charSet: string
): string {
  const { data } = imageData;
  const imgWidth = imageData.width;
  const imgHeight = imageData.height;
  
  const charAspectRatio = 0.5;
  const height = Math.floor(width * (imgHeight / imgWidth) * charAspectRatio);
  
  const cellWidth = imgWidth / width;
  const cellHeight = imgHeight / height;
  
  let ascii = "";
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sampleX = Math.floor(x * cellWidth + cellWidth / 2);
      const sampleY = Math.floor(y * cellHeight + cellHeight / 2);
      
      const pixelIndex = (sampleY * imgWidth + sampleX) * 4;
      
      const r = data[pixelIndex] || 0;
      const g = data[pixelIndex + 1] || 0;
      const b = data[pixelIndex + 2] || 0;
      
      const brightness = getPixelBrightness(r, g, b);
      const char = mapBrightnessToChar(brightness, charSet);
      ascii += char;
    }
    ascii += "\n";
  }
  
  return ascii;
}

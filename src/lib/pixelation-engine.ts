export const QUALITY_RANGE = {
  min: 1,
  max: 50,
  default: 10,
} as const;

export type ColorMode = "normal" | "grayscale" | "sepia" | "inverted" | "custom";

export interface VideoOptions {
  pixelSize: number;
  colorMode: ColorMode;
  customColor: string;
  brightness: number;
  contrast: number;
  saturation: number;
}

export const DEFAULT_OPTIONS: VideoOptions = {
  pixelSize: QUALITY_RANGE.default,
  colorMode: "normal",
  customColor: "#8b5cf6",
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export function calculatePixelSize(qualityLevel: number): number {
  return Math.max(QUALITY_RANGE.min, Math.min(QUALITY_RANGE.max, qualityLevel));
}

export function qualityToPercentage(pixelSize: number): number {
  return Math.round(((QUALITY_RANGE.max - pixelSize) / (QUALITY_RANGE.max - QUALITY_RANGE.min)) * 100);
}

export function percentageToPixelSize(percentage: number): number {
  return Math.round(QUALITY_RANGE.max - (percentage / 100) * (QUALITY_RANGE.max - QUALITY_RANGE.min));
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 139, g: 92, b: 246 };
}

export function applyColorFilter(
  imageData: ImageData,
  colorMode: ColorMode,
  customColor: string,
  brightness: number,
  contrast: number,
  saturation: number
): void {
  const data = imageData.data;
  const customRgb = hexToRgb(customColor);
  const brightnessFactor = brightness / 100;
  const contrastFactor = (contrast / 100) * 2;
  const saturationFactor = saturation / 100;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply brightness
    r = r * brightnessFactor;
    g = g * brightnessFactor;
    b = b * brightnessFactor;

    // Apply contrast
    r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
    g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
    b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;

    // Apply saturation
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = gray + saturationFactor * (r - gray);
    g = gray + saturationFactor * (g - gray);
    b = gray + saturationFactor * (b - gray);

    // Apply color mode
    switch (colorMode) {
      case "grayscale": {
        const avg = 0.299 * r + 0.587 * g + 0.114 * b;
        r = g = b = avg;
        break;
      }
      case "sepia": {
        const tr = 0.393 * r + 0.769 * g + 0.189 * b;
        const tg = 0.349 * r + 0.686 * g + 0.168 * b;
        const tb = 0.272 * r + 0.534 * g + 0.131 * b;
        r = tr;
        g = tg;
        b = tb;
        break;
      }
      case "inverted": {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
        break;
      }
      case "custom": {
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const factor = luminance / 255;
        r = customRgb.r * factor;
        g = customRgb.g * factor;
        b = customRgb.b * factor;
        break;
      }
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
}

export function applyPixelation(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: VideoOptions
): void {
  const w = canvas.width;
  const h = canvas.height;
  const { pixelSize, colorMode, customColor, brightness, contrast, saturation } = options;

  if (pixelSize <= 1) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(video, 0, 0, w, h);
    
    if (colorMode !== "normal" || brightness !== 100 || contrast !== 100 || saturation !== 100) {
      const imageData = ctx.getImageData(0, 0, w, h);
      applyColorFilter(imageData, colorMode, customColor, brightness, contrast, saturation);
      ctx.putImageData(imageData, 0, 0);
    }
    return;
  }

  const scaledW = Math.max(1, Math.floor(w / pixelSize));
  const scaledH = Math.max(1, Math.floor(h / pixelSize));

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(video, 0, 0, scaledW, scaledH);

  // Apply color filter to the small version for better performance
  if (colorMode !== "normal" || brightness !== 100 || contrast !== 100 || saturation !== 100) {
    const imageData = ctx.getImageData(0, 0, scaledW, scaledH);
    applyColorFilter(imageData, colorMode, customColor, brightness, contrast, saturation);
    ctx.putImageData(imageData, 0, 0);
  }

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, scaledW, scaledH, 0, 0, w, h);
}

export function getQualityLabel(percentage: number): string {
  if (percentage >= 95) return "Original";
  if (percentage >= 75) return "High";
  if (percentage >= 50) return "Medium";
  if (percentage >= 25) return "Low";
  return "Pixelated";
}

export const COLOR_PRESETS = [
  { name: "Purple", color: "#8b5cf6" },
  { name: "Cyan", color: "#06b6d4" },
  { name: "Green", color: "#22c55e" },
  { name: "Orange", color: "#f97316" },
  { name: "Pink", color: "#ec4899" },
  { name: "Red", color: "#ef4444" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Yellow", color: "#eab308" },
] as const;

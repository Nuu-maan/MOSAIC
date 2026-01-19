export const QUALITY_RANGE = {
  min: 1,
  max: 50,
  default: 10,
} as const;

export type ColorMode = "normal" | "grayscale" | "sepia" | "inverted" | "custom" | "duotone" | "posterize" | "vhs" | "crt";
export type RenderMode = "pixel" | "ascii" | "edge";
export type AsciiDensity = "dense" | "medium" | "light";

export interface VideoOptions {
  pixelSize: number;
  colorMode: ColorMode;
  customColor: string;
  brightness: number;
  contrast: number;
  saturation: number;
  renderMode: RenderMode;
  asciiDensity: AsciiDensity;
  asciiFontSize: number;
  asciiColor: string;
  asciiBackground: string;
  blur: number;
  sharpen: number;
  duotoneColor1: string;
  duotoneColor2: string;
  posterizeLevels: number;
  glitchIntensity: number;
  scanlineIntensity: number;
}

export const DEFAULT_OPTIONS: VideoOptions = {
  pixelSize: QUALITY_RANGE.default,
  colorMode: "normal",
  customColor: "#8b5cf6",
  brightness: 100,
  contrast: 100,
  saturation: 100,
  renderMode: "pixel",
  asciiDensity: "medium",
  asciiFontSize: 10,
  asciiColor: "#00ff00",
  asciiBackground: "#000000",
  blur: 0,
  sharpen: 0,
  duotoneColor1: "#000000",
  duotoneColor2: "#8b5cf6",
  posterizeLevels: 4,
  glitchIntensity: 0,
  scanlineIntensity: 0,
};

export const ASCII_SETS: Record<AsciiDensity, string> = {
  dense: "@%#*+=-:. ",
  medium: "@#*+-. ",
  light: "@*. ",
};

export interface Preset {
  name: string;
  icon: string;
  options: Partial<VideoOptions>;
}

export const PRESETS: Preset[] = [
  {
    name: "Default",
    icon: "sparkles",
    options: { ...DEFAULT_OPTIONS },
  },
  {
    name: "Retro 8-bit",
    icon: "gamepad",
    options: {
      pixelSize: 20,
      colorMode: "normal",
      brightness: 110,
      contrast: 120,
      saturation: 120,
    },
  },
  {
    name: "Game Boy",
    icon: "gamepad2",
    options: {
      pixelSize: 15,
      colorMode: "custom",
      customColor: "#9bbc0f",
      brightness: 100,
      contrast: 110,
      saturation: 100,
    },
  },
  {
    name: "Noir",
    icon: "film",
    options: {
      pixelSize: 4,
      colorMode: "grayscale",
      brightness: 90,
      contrast: 130,
      saturation: 0,
    },
  },
  {
    name: "Vintage",
    icon: "camera",
    options: {
      pixelSize: 3,
      colorMode: "sepia",
      brightness: 95,
      contrast: 90,
      saturation: 80,
    },
  },
  {
    name: "Cyberpunk",
    icon: "zap",
    options: {
      pixelSize: 8,
      colorMode: "custom",
      customColor: "#ff00ff",
      brightness: 105,
      contrast: 140,
      saturation: 150,
    },
  },
  {
    name: "Matrix",
    icon: "binary",
    options: {
      pixelSize: 6,
      colorMode: "custom",
      customColor: "#00ff00",
      brightness: 85,
      contrast: 150,
      saturation: 100,
    },
  },
  {
    name: "Vaporwave",
    icon: "sunset",
    options: {
      pixelSize: 12,
      colorMode: "custom",
      customColor: "#ff71ce",
      brightness: 110,
      contrast: 100,
      saturation: 130,
    },
  },
  {
    name: "ASCII Art",
    icon: "terminal",
    options: {
      renderMode: "ascii",
      asciiDensity: "medium",
      asciiFontSize: 10,
      asciiColor: "#00ff00",
      asciiBackground: "#000000",
    },
  },
];

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
  options: VideoOptions
): void {
  const { colorMode, customColor, brightness, contrast, saturation, duotoneColor1, duotoneColor2, posterizeLevels, scanlineIntensity } = options;
  const data = imageData.data;
  const customRgb = hexToRgb(customColor);
  const duotone1 = hexToRgb(duotoneColor1);
  const duotone2 = hexToRgb(duotoneColor2);
  const brightnessFactor = brightness / 100;
  const contrastFactor = (contrast / 100) * 2;
  const saturationFactor = saturation / 100;
  const width = imageData.width;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    r = r * brightnessFactor;
    g = g * brightnessFactor;
    b = b * brightnessFactor;

    r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
    g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
    b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;

    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = gray + saturationFactor * (r - gray);
    g = gray + saturationFactor * (g - gray);
    b = gray + saturationFactor * (b - gray);

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
      case "duotone": {
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        r = duotone1.r * (1 - lum) + duotone2.r * lum;
        g = duotone1.g * (1 - lum) + duotone2.g * lum;
        b = duotone1.b * (1 - lum) + duotone2.b * lum;
        break;
      }
      case "posterize": {
        const levels = posterizeLevels;
        r = Math.round(r / 255 * (levels - 1)) / (levels - 1) * 255;
        g = Math.round(g / 255 * (levels - 1)) / (levels - 1) * 255;
        b = Math.round(b / 255 * (levels - 1)) / (levels - 1) * 255;
        break;
      }
      case "vhs": {
        const noise = (Math.random() - 0.5) * 30;
        r = r + noise + 10;
        g = g + noise;
        b = b + noise - 5;
        const pixelY = Math.floor((i / 4) / width);
        if (pixelY % 3 === 0) {
          r *= 0.95;
          g *= 0.95;
          b *= 0.95;
        }
        break;
      }
      case "crt": {
        const pixelIndex = i / 4;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        if (y % 2 === 0) {
          r *= (1 - scanlineIntensity / 100 * 0.3);
          g *= (1 - scanlineIntensity / 100 * 0.3);
          b *= (1 - scanlineIntensity / 100 * 0.3);
        }
        const subpixel = x % 3;
        if (subpixel === 0) { g *= 0.9; b *= 0.8; }
        else if (subpixel === 1) { r *= 0.9; b *= 0.8; }
        else { r *= 0.8; g *= 0.9; }
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
  const { pixelSize, colorMode, brightness, contrast, saturation, renderMode, blur } = options;

  if (renderMode === "ascii") {
    applyAsciiArt(ctx, video, canvas, options);
    return;
  }

  if (renderMode === "edge") {
    applyEdgeDetection(ctx, video, canvas, options);
    return;
  }

  if (pixelSize <= 1) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(video, 0, 0, w, h);
    
    if (blur > 0) {
      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
    }
    
    if (colorMode !== "normal" || brightness !== 100 || contrast !== 100 || saturation !== 100) {
      const imageData = ctx.getImageData(0, 0, w, h);
      applyColorFilter(imageData, options);
      ctx.putImageData(imageData, 0, 0);
    }
    return;
  }

  const scaledW = Math.max(1, Math.floor(w / pixelSize));
  const scaledH = Math.max(1, Math.floor(h / pixelSize));

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(video, 0, 0, scaledW, scaledH);

  if (colorMode !== "normal" || brightness !== 100 || contrast !== 100 || saturation !== 100) {
    const imageData = ctx.getImageData(0, 0, scaledW, scaledH);
    applyColorFilter(imageData, options);
    ctx.putImageData(imageData, 0, 0);
  }

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, scaledW, scaledH, 0, 0, w, h);
}

function applyEdgeDetection(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: VideoOptions
): void {
  const w = canvas.width;
  const h = canvas.height;
  
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(video, 0, 0, w, h);
  
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      
      const getGray = (ox: number, oy: number) => {
        const i = ((y + oy) * w + (x + ox)) * 4;
        return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      };
      
      const gx = 
        -1 * getGray(-1, -1) + 1 * getGray(1, -1) +
        -2 * getGray(-1, 0) + 2 * getGray(1, 0) +
        -1 * getGray(-1, 1) + 1 * getGray(1, 1);
        
      const gy = 
        -1 * getGray(-1, -1) - 2 * getGray(0, -1) - 1 * getGray(1, -1) +
        1 * getGray(-1, 1) + 2 * getGray(0, 1) + 1 * getGray(1, 1);
      
      const magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy));
      
      output[idx] = magnitude;
      output[idx + 1] = magnitude;
      output[idx + 2] = magnitude;
      output[idx + 3] = 255;
    }
  }
  
  const outputData = new ImageData(output, w, h);
  ctx.putImageData(outputData, 0, 0);
}

function getPixelBrightness(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function mapBrightnessToChar(brightness: number, charSet: string): string {
  const index = Math.floor((1 - brightness) * (charSet.length - 1));
  return charSet[Math.min(index, charSet.length - 1)];
}

export function applyAsciiArt(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: VideoOptions
): void {
  const { asciiDensity, asciiFontSize, asciiColor, asciiBackground, brightness, contrast } = options;
  const charSet = ASCII_SETS[asciiDensity];
  
  const w = canvas.width;
  const h = canvas.height;
  
  const fontSize = Math.max(4, asciiFontSize);
  const charWidth = fontSize * 0.6;
  const charHeight = fontSize;
  
  const cols = Math.floor(w / charWidth);
  const rows = Math.floor(h / charHeight);
  
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(video, 0, 0, cols, rows);
  const imageData = ctx.getImageData(0, 0, cols, rows);
  const data = imageData.data;
  
  ctx.fillStyle = asciiBackground;
  ctx.fillRect(0, 0, w, h);
  
  ctx.font = `${fontSize}px monospace`;
  ctx.fillStyle = asciiColor;
  ctx.textBaseline = "top";
  
  const brightnessFactor = brightness / 100;
  const contrastFactor = (contrast / 100) * 2;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      r = r * brightnessFactor;
      g = g * brightnessFactor;
      b = b * brightnessFactor;
      
      r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
      g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
      b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;
      
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));
      
      const pixelBrightness = getPixelBrightness(r, g, b);
      const char = mapBrightnessToChar(pixelBrightness, charSet);
      
      ctx.fillText(char, x * charWidth, y * charHeight);
    }
  }
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

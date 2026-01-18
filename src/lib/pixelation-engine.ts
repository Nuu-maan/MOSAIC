export const QUALITY_RANGE = {
  min: 1,
  max: 50,
  default: 10,
} as const;

export function calculatePixelSize(qualityLevel: number): number {
  return Math.max(QUALITY_RANGE.min, Math.min(QUALITY_RANGE.max, qualityLevel));
}

export function qualityToPercentage(pixelSize: number): number {
  return Math.round(((QUALITY_RANGE.max - pixelSize) / (QUALITY_RANGE.max - QUALITY_RANGE.min)) * 100);
}

export function percentageToPixelSize(percentage: number): number {
  return Math.round(QUALITY_RANGE.max - (percentage / 100) * (QUALITY_RANGE.max - QUALITY_RANGE.min));
}

export function applyPixelation(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  pixelSize: number
): void {
  const w = canvas.width;
  const h = canvas.height;

  if (pixelSize <= 1) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(video, 0, 0, w, h);
    return;
  }

  const scaledW = Math.max(1, Math.floor(w / pixelSize));
  const scaledH = Math.max(1, Math.floor(h / pixelSize));

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(video, 0, 0, scaledW, scaledH);

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

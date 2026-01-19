import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { VideoOptions, applyPixelation } from './pixelation-engine';

export type ExportFormat = 'webm' | 'gif' | 'png' | 'jpg' | 'png-sequence';

export interface ExportOptions {
  format: ExportFormat;
  quality: number;
  fps: number;
  startTime: number;
  endTime: number;
  width?: number;
  height?: number;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'webm',
  quality: 80,
  fps: 30,
  startTime: 0,
  endTime: 0,
  width: undefined,
  height: undefined,
};

export async function captureScreenshot(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg' = 'png',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to capture screenshot'));
        }
      },
      mimeType,
      quality
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportToGif(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: VideoOptions,
  exportOptions: ExportOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { fps, startTime, endTime } = exportOptions;
  const duration = endTime - startTime;
  const totalFrames = Math.ceil(duration * fps);
  
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Cannot get canvas context');

  const gif = GIFEncoder();
  
  for (let i = 0; i < totalFrames; i++) {
    const time = startTime + (i / fps);
    
    await new Promise<void>((resolve) => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        applyPixelation(ctx, video, canvas, options);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = imageData;
        
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        
        gif.writeFrame(index, width, height, {
          palette,
          delay: Math.round(1000 / fps),
        });
        
        onProgress?.(Math.round(((i + 1) / totalFrames) * 100));
        resolve();
      };
      
      video.addEventListener('seeked', onSeeked);
      video.currentTime = time;
    });
  }
  
  gif.finish();
  const output = gif.bytes();
  return new Blob([output], { type: 'image/gif' });
}

export async function exportToWebM(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: VideoOptions,
  exportOptions: ExportOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { fps, startTime, endTime, quality } = exportOptions;
  const duration = endTime - startTime;
  const totalFrames = Math.ceil(duration * fps);
  
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Cannot get canvas context');

  const stream = canvas.captureStream(fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: Math.round(quality * 100000),
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const exportPromise = new Promise<Blob>((resolve, reject) => {
    mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
    mediaRecorder.onerror = reject;
  });

  mediaRecorder.start();

  for (let i = 0; i < totalFrames; i++) {
    const time = startTime + (i / fps);
    
    await new Promise<void>((resolve) => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        applyPixelation(ctx, video, canvas, options);
        onProgress?.(Math.round(((i + 1) / totalFrames) * 100));
        resolve();
      };
      
      video.addEventListener('seeked', onSeeked);
      video.currentTime = time;
    });

    await new Promise((r) => setTimeout(r, 1000 / fps));
  }

  mediaRecorder.stop();
  return exportPromise;
}

export async function exportToPngSequence(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: VideoOptions,
  exportOptions: ExportOptions,
  onProgress?: (progress: number) => void
): Promise<Blob[]> {
  const { fps, startTime, endTime } = exportOptions;
  const duration = endTime - startTime;
  const totalFrames = Math.ceil(duration * fps);
  
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Cannot get canvas context');

  const frames: Blob[] = [];

  for (let i = 0; i < totalFrames; i++) {
    const time = startTime + (i / fps);
    
    await new Promise<void>((resolve, reject) => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        applyPixelation(ctx, video, canvas, options);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              frames.push(blob);
              onProgress?.(Math.round(((i + 1) / totalFrames) * 100));
              resolve();
            } else {
              reject(new Error('Failed to capture frame'));
            }
          },
          'image/png'
        );
      };
      
      video.addEventListener('seeked', onSeeked);
      video.currentTime = time;
    });
  }

  return frames;
}

"use client";

import { RefObject } from "react";

interface AsciiPlayerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  videoUrl: string | null;
  asciiFrame: string;
  onVideoLoad: () => void;
  onVideoEnd: () => void;
}

export function AsciiPlayer({
  videoRef,
  canvasRef,
  videoUrl,
  asciiFrame,
  onVideoLoad,
  onVideoEnd,
}: AsciiPlayerProps) {
  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        src={videoUrl || undefined}
        onLoadedMetadata={onVideoLoad}
        onEnded={onVideoEnd}
        className="hidden"
        playsInline
        preload="metadata"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
        <div className="overflow-auto max-h-[70vh]">
          <pre className="font-mono text-[8px] leading-[8px] sm:text-[10px] sm:leading-[10px] text-emerald-400 p-4 whitespace-pre select-all">
            {asciiFrame || generatePlaceholder()}
          </pre>
        </div>
      </div>
    </div>
  );
}

function generatePlaceholder(): string {
  const width = 80;
  const height = 20;
  const text = "UPLOAD VIDEO TO START";
  
  let placeholder = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === Math.floor(height / 2)) {
        const startX = Math.floor((width - text.length) / 2);
        if (x >= startX && x < startX + text.length) {
          placeholder += text[x - startX];
          continue;
        }
      }
      placeholder += ".";
    }
    placeholder += "\n";
  }
  return placeholder;
}

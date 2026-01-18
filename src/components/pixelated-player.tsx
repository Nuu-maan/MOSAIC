"use client";

import { RefObject, useEffect, useRef } from "react";

interface PixelatedPlayerProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  videoUrl: string | null;
  onVideoLoad: () => void;
  onVideoEnd: () => void;
  onWheel: (e: WheelEvent) => void;
}

export function PixelatedPlayer({
  videoRef,
  canvasRef,
  videoUrl,
  onVideoLoad,
  onVideoEnd,
  onWheel,
}: PixelatedPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      onWheel(e);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [onWheel]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden"
      style={{ aspectRatio: "16/9" }}
    >
      <video
        ref={videoRef}
        src={videoUrl || undefined}
        onLoadedMetadata={onVideoLoad}
        onEnded={onVideoEnd}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        playsInline
        preload="metadata"
        loop
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}

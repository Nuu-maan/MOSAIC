"use client";

import { getQualityLabel } from "@/lib/pixelation-engine";

interface QualityIndicatorProps {
  quality: number;
  pixelSize: number;
}

export function QualityIndicator({ quality, pixelSize }: QualityIndicatorProps) {
  const label = getQualityLabel(quality);

  return (
    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-white/5">
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs text-zinc-300 uppercase tracking-wide">Quality</div>
          <div className="text-lg font-bold">{quality}%</div>
        </div>
        <div className="h-12 w-px bg-zinc-700" />
        <div>
          <div className="text-xs text-zinc-300 uppercase tracking-wide">Level</div>
          <div className="text-sm font-medium text-emerald-400">{label}</div>
        </div>
      </div>
      <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 transition-all duration-150 ease-out"
          style={{ width: `${quality}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] text-zinc-400 text-center">
        {pixelSize}px blocks
      </div>
    </div>
  );
}

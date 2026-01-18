"use client";

import { Play, Pause, RotateCcw, Gauge, Grid3X3, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CharSetKey } from "@/lib/ascii-converter";

interface ControlsProps {
  isPlaying: boolean;
  isLoaded: boolean;
  duration: number;
  currentTime: number;
  asciiWidth: number;
  charSet: CharSetKey;
  playbackSpeed: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onWidthChange: (width: number) => void;
  onCharSetChange: (charSet: CharSetKey) => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export function Controls({
  isPlaying,
  isLoaded,
  duration,
  currentTime,
  asciiWidth,
  charSet,
  playbackSpeed,
  onTogglePlay,
  onSeek,
  onWidthChange,
  onCharSetChange,
  onSpeedChange,
  onReset,
}: ControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800 p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          onClick={onTogglePlay}
          disabled={!isLoaded}
          className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 disabled:opacity-50"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <div className="flex-1 space-y-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={([value]) => onSeek(value)}
            disabled={!isLoaded}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={onReset}
          className="text-zinc-400 hover:text-zinc-100"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Maximize2 className="h-3 w-3" />
            <span>Width: {asciiWidth} chars</span>
          </div>
          <Slider
            value={[asciiWidth]}
            min={40}
            max={200}
            step={10}
            onValueChange={([value]) => onWidthChange(value)}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Grid3X3 className="h-3 w-3" />
            <span>Character Set</span>
          </div>
          <Select value={charSet} onValueChange={(v) => onCharSetChange(v as CharSetKey)}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dense">Dense</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Gauge className="h-3 w-3" />
            <span>Speed: {playbackSpeed}x</span>
          </div>
          <Slider
            value={[playbackSpeed]}
            min={0.5}
            max={2}
            step={0.25}
            onValueChange={([value]) => onSpeedChange(value)}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

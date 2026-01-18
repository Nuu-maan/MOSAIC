"use client";

import {
  Sun,
  Contrast,
  Palette,
  RotateCcw,
  Mouse,
  Grid3X3,
  Droplets,
  Volume2,
  VolumeX,
  Repeat,
  Gauge,
  Download,
  Maximize,
  Sparkles,
  Gamepad2,
  Film,
  Camera,
  Zap,
  Binary,
  Sunset,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  VideoOptions,
  ColorMode,
  QUALITY_RANGE,
  COLOR_PRESETS,
  PRESETS,
  DEFAULT_OPTIONS,
} from "@/lib/pixelation-engine";
import { PlaybackSpeed, PLAYBACK_SPEEDS } from "@/hooks/use-pixelated-video";

interface VideoControlsProps {
  options: VideoOptions;
  quality: number;
  scrollEnabled: boolean;
  playbackSpeed: PlaybackSpeed;
  isLooping: boolean;
  volume: number;
  isMuted: boolean;
  isExporting: boolean;
  exportProgress: number;
  onPixelSizeChange: (value: number) => void;
  onColorModeChange: (mode: ColorMode) => void;
  onCustomColorChange: (color: string) => void;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
  onScrollEnabledChange: (enabled: boolean) => void;
  onPlaybackSpeedChange: (speed: PlaybackSpeed) => void;
  onLoopChange: (loop: boolean) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onFullscreenToggle: () => void;
  onExport: () => void;
  onPresetSelect: (options: Partial<VideoOptions>) => void;
  onReset: () => void;
}

const COLOR_MODES: { value: ColorMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "grayscale", label: "Grayscale" },
  { value: "sepia", label: "Sepia" },
  { value: "inverted", label: "Inverted" },
  { value: "custom", label: "Custom" },
];

const PRESET_ICONS: Record<string, React.ReactNode> = {
  sparkles: <Sparkles className="w-3.5 h-3.5" />,
  gamepad: <Gamepad2 className="w-3.5 h-3.5" />,
  gamepad2: <Gamepad2 className="w-3.5 h-3.5" />,
  film: <Film className="w-3.5 h-3.5" />,
  camera: <Camera className="w-3.5 h-3.5" />,
  zap: <Zap className="w-3.5 h-3.5" />,
  binary: <Binary className="w-3.5 h-3.5" />,
  sunset: <Sunset className="w-3.5 h-3.5" />,
};

export function VideoControls({
  options,
  quality,
  scrollEnabled,
  playbackSpeed,
  isLooping,
  volume,
  isMuted,
  isExporting,
  exportProgress,
  onPixelSizeChange,
  onColorModeChange,
  onCustomColorChange,
  onBrightnessChange,
  onContrastChange,
  onSaturationChange,
  onScrollEnabledChange,
  onPlaybackSpeedChange,
  onLoopChange,
  onVolumeChange,
  onMuteToggle,
  onFullscreenToggle,
  onExport,
  onPresetSelect,
  onReset,
}: VideoControlsProps) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800 p-4 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
      {/* Presets */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <Label className="text-sm font-medium">Presets</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onPresetSelect(preset.options)}
              className="flex items-center gap-2 px-3 py-2 text-xs rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors text-left"
            >
              {PRESET_ICONS[preset.icon]}
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pixelation Control */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-purple-400" />
            <Label className="text-sm font-medium">Pixelation</Label>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {options.pixelSize}px ({quality}%)
          </span>
        </div>
        <Slider
          value={[options.pixelSize]}
          min={QUALITY_RANGE.min}
          max={QUALITY_RANGE.max}
          step={1}
          onValueChange={([value]) => onPixelSizeChange(value)}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>Original</span>
          <span>Pixelated</span>
        </div>
      </div>

      {/* Scroll Wheel Toggle */}
      <div className="flex items-center justify-between py-2 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <Mouse className="w-4 h-4 text-zinc-400" />
          <Label htmlFor="scroll-control" className="text-sm">
            Scroll wheel control
          </Label>
        </div>
        <Switch
          id="scroll-control"
          checked={scrollEnabled}
          onCheckedChange={onScrollEnabledChange}
        />
      </div>

      {/* Playback Speed */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-purple-400" />
          <Label className="text-sm font-medium">Playback Speed</Label>
        </div>
        <div className="flex flex-wrap gap-1">
          {PLAYBACK_SPEEDS.map((speed) => (
            <button
              key={speed}
              onClick={() => onPlaybackSpeedChange(speed)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                playbackSpeed === speed
                  ? "bg-purple-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Loop Toggle */}
      <div className="flex items-center justify-between py-2 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-zinc-400" />
          <Label htmlFor="loop-control" className="text-sm">
            Loop video
          </Label>
        </div>
        <Switch
          id="loop-control"
          checked={isLooping}
          onCheckedChange={onLoopChange}
        />
      </div>

      {/* Volume Control */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onMuteToggle} className="text-zinc-400 hover:text-zinc-200">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <Label className="text-sm">Volume</Label>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {isMuted ? "Muted" : `${Math.round(volume * 100)}%`}
          </span>
        </div>
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          min={0}
          max={100}
          step={5}
          onValueChange={([value]) => onVolumeChange(value / 100)}
          className="cursor-pointer"
          disabled={isMuted}
        />
      </div>

      {/* Color Mode */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <Label className="text-sm font-medium">Color Mode</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {COLOR_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => onColorModeChange(mode.value)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                options.colorMode === mode.value
                  ? "bg-purple-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Picker */}
      {options.colorMode === "custom" && (
        <div className="space-y-3">
          <Label className="text-sm text-zinc-400">Custom Color</Label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.color}
                onClick={() => onCustomColorChange(preset.color)}
                className={`w-8 h-8 rounded-md border-2 transition-all ${
                  options.customColor === preset.color
                    ? "border-white scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              />
            ))}
            <label className="w-8 h-8 rounded-md border-2 border-dashed border-zinc-600 cursor-pointer flex items-center justify-center hover:border-zinc-500 transition-colors overflow-hidden">
              <input
                type="color"
                value={options.customColor}
                onChange={(e) => onCustomColorChange(e.target.value)}
                className="w-10 h-10 cursor-pointer opacity-0 absolute"
              />
              <span className="text-zinc-500 text-lg">+</span>
            </label>
          </div>
        </div>
      )}

      {/* Brightness */}
      <div className="space-y-3 pt-2 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            <Label className="text-sm">Brightness</Label>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {options.brightness}%
          </span>
        </div>
        <Slider
          value={[options.brightness]}
          min={0}
          max={200}
          step={5}
          onValueChange={([value]) => onBrightnessChange(value)}
          className="cursor-pointer"
        />
      </div>

      {/* Contrast */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Contrast className="w-4 h-4 text-blue-400" />
            <Label className="text-sm">Contrast</Label>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {options.contrast}%
          </span>
        </div>
        <Slider
          value={[options.contrast]}
          min={0}
          max={200}
          step={5}
          onValueChange={([value]) => onContrastChange(value)}
          className="cursor-pointer"
        />
      </div>

      {/* Saturation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <Label className="text-sm">Saturation</Label>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {options.saturation}%
          </span>
        </div>
        <Slider
          value={[options.saturation]}
          min={0}
          max={200}
          step={5}
          onValueChange={([value]) => onSaturationChange(value)}
          className="cursor-pointer"
        />
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-zinc-800 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onFullscreenToggle}
            className="text-zinc-400 border-zinc-700 hover:bg-zinc-800"
          >
            <Maximize className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={isExporting}
            className="text-zinc-400 border-zinc-700 hover:bg-zinc-800"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {exportProgress}%
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full text-zinc-400 border-zinc-700 hover:bg-zinc-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All Settings
        </Button>
      </div>
    </div>
  );
}

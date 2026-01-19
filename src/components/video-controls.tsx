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
  Terminal,
  Type,
  Image,
  Scissors,
  PictureInPicture2,
  SplitSquareHorizontal,
  FileImage,
  FileVideo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  VideoOptions,
  ColorMode,
  RenderMode,
  AsciiDensity,
  QUALITY_RANGE,
  COLOR_PRESETS,
  PRESETS,
  DEFAULT_OPTIONS,
} from "@/lib/pixelation-engine";
import { ExportFormat } from "@/lib/export-utils";
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
  duration: number;
  trimStart: number;
  trimEnd: number;
  exportFormat: ExportFormat;
  showComparison: boolean;
  isPiPActive: boolean;
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
  onExport: (format?: ExportFormat) => void;
  onPresetSelect: (options: Partial<VideoOptions>) => void;
  onReset: () => void;
  onRenderModeChange: (mode: RenderMode) => void;
  onAsciiDensityChange: (density: AsciiDensity) => void;
  onAsciiFontSizeChange: (size: number) => void;
  onAsciiColorChange: (color: string) => void;
  onAsciiBackgroundChange: (color: string) => void;
  onScreenshot: (format: 'png' | 'jpg') => void;
  onTrimStartChange: (value: number) => void;
  onTrimEndChange: (value: number) => void;
  onExportFormatChange: (format: ExportFormat) => void;
  onPiPToggle: () => void;
  onComparisonToggle: () => void;
}

const COLOR_MODES: { value: ColorMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "grayscale", label: "Grayscale" },
  { value: "sepia", label: "Sepia" },
  { value: "inverted", label: "Inverted" },
  { value: "custom", label: "Custom" },
  { value: "duotone", label: "Duotone" },
  { value: "posterize", label: "Posterize" },
  { value: "vhs", label: "VHS" },
  { value: "crt", label: "CRT" },
];

const RENDER_MODES: { value: RenderMode; label: string }[] = [
  { value: "pixel", label: "Pixel" },
  { value: "ascii", label: "ASCII" },
  { value: "edge", label: "Edge" },
];

const ASCII_DENSITIES: { value: AsciiDensity; label: string }[] = [
  { value: "dense", label: "Dense" },
  { value: "medium", label: "Medium" },
  { value: "light", label: "Light" },
];

const EXPORT_FORMATS: { value: ExportFormat; label: string; icon: React.ReactNode }[] = [
  { value: "webm", label: "WebM", icon: <FileVideo className="w-3.5 h-3.5" /> },
  { value: "gif", label: "GIF", icon: <FileImage className="w-3.5 h-3.5" /> },
  { value: "png-sequence", label: "PNG Seq", icon: <Image className="w-3.5 h-3.5" /> },
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
  terminal: <Terminal className="w-3.5 h-3.5" />,
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
  duration,
  trimStart,
  trimEnd,
  exportFormat,
  showComparison,
  isPiPActive,
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
  onRenderModeChange,
  onAsciiDensityChange,
  onAsciiFontSizeChange,
  onAsciiColorChange,
  onAsciiBackgroundChange,
  onScreenshot,
  onTrimStartChange,
  onTrimEndChange,
  onExportFormatChange,
  onPiPToggle,
  onComparisonToggle,
}: VideoControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
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
                className="flex items-center gap-2 px-3 py-2 text-xs rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors text-left"
              >
                {PRESET_ICONS[preset.icon]}
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Render Mode Toggle */}
        <div className="space-y-3 pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-purple-400" />
            <Label className="text-sm font-medium">Render Mode</Label>
          </div>
          <div className="flex gap-2">
            {RENDER_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => onRenderModeChange(mode.value)}
                className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${
                  options.renderMode === mode.value
                    ? "bg-purple-500 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* ASCII Controls - Only shown in ASCII mode */}
        {options.renderMode === "ascii" && (
          <div className="space-y-4 pt-2 border-t border-zinc-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <Label className="text-sm font-medium">ASCII Settings</Label>
              </div>
              
              {/* ASCII Density */}
              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Character Density</Label>
                <div className="flex gap-1">
                  {ASCII_DENSITIES.map((density) => (
                    <button
                      key={density.value}
                      onClick={() => onAsciiDensityChange(density.value)}
                      className={`flex-1 px-2 py-1.5 text-xs rounded transition-colors ${
                        options.asciiDensity === density.value
                          ? "bg-green-500 text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {density.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ASCII Font Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-zinc-300">Font Size</Label>
                  <span className="text-xs text-zinc-300 font-mono">{options.asciiFontSize}px</span>
                </div>
                <Slider
                  value={[options.asciiFontSize]}
                  min={4}
                  max={24}
                  step={1}
                  onValueChange={([value]) => onAsciiFontSizeChange(value)}
                  className="cursor-pointer"
                />
              </div>

              {/* ASCII Colors */}
              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Text Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { name: "Green", color: "#00ff00" },
                    { name: "Amber", color: "#ffbf00" },
                    { name: "Cyan", color: "#00ffff" },
                    { name: "White", color: "#ffffff" },
                    { name: "Pink", color: "#ff69b4" },
                  ].map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => onAsciiColorChange(preset.color)}
                      className={`w-7 h-7 rounded border-2 transition-all ${
                        options.asciiColor === preset.color
                          ? "border-white scale-110"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                  <label className="w-7 h-7 rounded border-2 border-dashed border-zinc-600 cursor-pointer flex items-center justify-center hover:border-zinc-500 transition-colors overflow-hidden">
                    <input
                      type="color"
                      value={options.asciiColor}
                      onChange={(e) => onAsciiColorChange(e.target.value)}
                      className="w-8 h-8 cursor-pointer opacity-0 absolute"
                    />
                    <span className="text-zinc-500 text-sm">+</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Background Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { name: "Black", color: "#000000" },
                    { name: "Dark Gray", color: "#1a1a1a" },
                    { name: "Navy", color: "#0a0a2e" },
                    { name: "Dark Green", color: "#0a1a0a" },
                  ].map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => onAsciiBackgroundChange(preset.color)}
                      className={`w-7 h-7 rounded border-2 transition-all ${
                        options.asciiBackground === preset.color
                          ? "border-white scale-110"
                          : "border-zinc-600 hover:scale-105"
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                  <label className="w-7 h-7 rounded border-2 border-dashed border-zinc-600 cursor-pointer flex items-center justify-center hover:border-zinc-500 transition-colors overflow-hidden">
                    <input
                      type="color"
                      value={options.asciiBackground}
                      onChange={(e) => onAsciiBackgroundChange(e.target.value)}
                      className="w-8 h-8 cursor-pointer opacity-0 absolute"
                    />
                    <span className="text-zinc-500 text-sm">+</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pixelation Control - Only shown in pixel mode */}
        {options.renderMode === "pixel" && (
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-purple-400" />
                <Label className="text-sm font-medium">Pixelation</Label>
              </div>
              <span className="text-xs text-zinc-300 font-mono">
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
        )}

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
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
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
            <button onClick={onMuteToggle} className="text-zinc-400 hover:text-zinc-100">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <Label className="text-sm">Volume</Label>
          </div>
          <span className="text-xs text-zinc-300 font-mono">
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
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
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
          <Label className="text-sm text-zinc-300">Custom Color</Label>
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
          <span className="text-xs text-zinc-300 font-mono">
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
          <span className="text-xs text-zinc-300 font-mono">
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
          <span className="text-xs text-zinc-300 font-mono">
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
        <div className="pt-3 border-t border-zinc-800 space-y-3">
          {/* Timeline Trimming */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-purple-400" />
              <Label className="text-sm font-medium">Trim Selection</Label>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span>Start: {formatTime(trimStart)}</span>
                <span>End: {formatTime(trimEnd)}</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Slider
                    value={[trimStart]}
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={([value]) => onTrimStartChange(Math.min(value, trimEnd - 0.1))}
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <Slider
                    value={[trimEnd]}
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={([value]) => onTrimEndChange(Math.max(value, trimStart + 0.1))}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-2">
            <Label className="text-xs text-zinc-300">Export Format</Label>
            <div className="flex gap-1">
              {EXPORT_FORMATS.map((format) => (
                <button
                  key={format.value}
                  onClick={() => onExportFormatChange(format.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs rounded transition-colors ${
                    exportFormat === format.value
                      ? "bg-purple-500 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {format.icon}
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onScreenshot('png')}
              className="text-zinc-100 border-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Screenshot
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPiPToggle}
              className={`border-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:text-white ${isPiPActive ? 'text-purple-400 hover:text-purple-300' : 'text-zinc-100'}`}
            >
              <PictureInPicture2 className="w-4 h-4 mr-2" />
              PiP
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onFullscreenToggle}
              className="text-zinc-100 border-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:text-white"
            >
              <Maximize className="w-4 h-4 mr-2" />
              Fullscreen
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onComparisonToggle}
              className={`border-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:text-white ${showComparison ? 'text-purple-400 hover:text-purple-300' : 'text-zinc-100'}`}
            >
              <SplitSquareHorizontal className="w-4 h-4 mr-2" />
              Compare
            </Button>
          </div>

          {/* Export Button */}
          <Button
            variant="default"
            size="sm"
            onClick={() => onExport(exportFormat)}
            disabled={isExporting}
            className="w-full bg-purple-500 hover:bg-purple-400 text-white font-medium"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting {exportProgress}%
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {exportFormat.toUpperCase()}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="w-full text-zinc-100 border-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Settings
          </Button>
        </div>
      </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import {
  Grid3X3,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Mouse,
  Settings2,
  Keyboard,
  X,
  Volume2,
  VolumeX,
  Repeat,
  Maximize,
  Minimize,
} from "lucide-react";
import { VideoUploader } from "@/components/video-uploader";
import { PixelatedPlayer } from "@/components/pixelated-player";
import { QualityIndicator } from "@/components/quality-indicator";
import { VideoControls } from "@/components/video-controls";
import { usePixelatedVideo } from "@/hooks/use-pixelated-video";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VideoOptions, DEFAULT_OPTIONS, qualityToPercentage } from "@/lib/pixelation-engine";

export default function Home() {
  const {
    videoRef,
    canvasRef,
    containerRef,
    videoFile,
    videoUrl,
    isPlaying,
    isLoaded,
    options,
    quality,
    duration,
    currentTime,
    scrollEnabled,
    playbackSpeed,
    isLooping,
    volume,
    isMuted,
    isFullscreen,
    isExporting,
    exportProgress,
    loadVideo,
    handleVideoLoad,
    togglePlay,
    seek,
    seekRelative,
    handleWheel,
    reset,
    resetOptions,
    pause,
    setColorMode,
    setCustomColor,
    setBrightness,
    setContrast,
    setSaturation,
    setPixelSize,
    setScrollEnabled,
    setPlaybackSpeed,
    toggleLoop,
    setLooping,
    setVolume,
    toggleMute,
    toggleFullscreen,
    exportVideo,
    updatePixelSize,
    setOptions,
  } = usePixelatedVideo();

  const [showControls, setShowControls] = useState(true);

  const { showShortcuts, setShowShortcuts, displayShortcuts } = useKeyboardShortcuts({
    enabled: isLoaded,
    togglePlay,
    seekRelative,
    toggleMute,
    setVolume,
    volume,
    toggleFullscreen,
    updatePixelSize,
    toggleLoop,
    resetOptions,
  });

  const handleVideoEnd = useCallback(() => {
    if (!isLooping) {
      pause();
    }
  }, [pause, isLooping]);

  const handlePresetSelect = useCallback(
    (presetOptions: Partial<VideoOptions>) => {
      setOptions((prev) => {
        const newOptions = { ...DEFAULT_OPTIONS, ...presetOptions };
        return newOptions;
      });
    },
    [setOptions]
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowShortcuts(false)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-2">
              {displayShortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                >
                  <span className="text-zinc-400">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-purple-400">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <header className="border-b border-zinc-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Grid3X3 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight font-mono">
                    PIXEL<span className="text-purple-400">_</span>VIDEO
                  </h1>
                  <p className="text-xs text-zinc-500">Scroll-controlled pixelation</p>
                </div>
              </div>
              {isLoaded && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShortcuts(true)}
                  className="text-zinc-400 hover:text-zinc-100"
                >
                  <Keyboard className="w-4 h-4 mr-2" />
                  Shortcuts
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {!videoFile ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
              <div className="text-center space-y-4 max-w-lg">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-purple-400 font-medium">Scroll to control</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tight">
                  Dynamic video
                  <span className="text-purple-400"> pixelation</span>
                </h2>
                <p className="text-zinc-400">
                  Upload any MP4 video and control the pixelation with your scroll wheel.
                  Scroll up for better quality, scroll down for more pixelation.
                </p>
              </div>

              <div className="w-full max-w-md">
                <VideoUploader onFileSelect={loadVideo} />
              </div>

              <div className="grid grid-cols-3 gap-8 text-center text-sm pt-8">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-400">60fps</div>
                  <div className="text-zinc-500">Smooth playback</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-400">100MB</div>
                  <div className="text-zinc-500">Max file size</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-400">1-50px</div>
                  <div className="text-zinc-500">Block range</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 text-sm mt-4">
                <Mouse className="w-4 h-4" />
                <span>Scroll wheel controls quality over the video</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-6">
              {/* Main Video Area */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-sm text-zinc-400 font-mono truncate max-w-xs">
                      {videoFile.name}
                    </span>
                    {playbackSpeed !== 1 && (
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                        {playbackSpeed}x
                      </span>
                    )}
                    {isLooping && (
                      <Repeat className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowControls(!showControls)}
                      className="text-zinc-400 hover:text-zinc-100 lg:hidden"
                    >
                      <Settings2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={reset}
                      className="text-zinc-400 hover:text-zinc-100"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Video
                    </Button>
                  </div>
                </div>

                <div
                  ref={containerRef}
                  className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-black flex items-center justify-center" : ""}`}
                >
                  <PixelatedPlayer
                    videoRef={videoRef}
                    canvasRef={canvasRef}
                    videoUrl={videoUrl}
                    onVideoLoad={handleVideoLoad}
                    onVideoEnd={handleVideoEnd}
                    onWheel={handleWheel}
                  />
                  {isLoaded && (
                    <QualityIndicator quality={quality} pixelSize={options.pixelSize} />
                  )}
                  {isLoaded && scrollEnabled && !isFullscreen && (
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-zinc-400 flex items-center gap-2">
                      <Mouse className="w-3 h-3" />
                      Scroll to adjust quality
                    </div>
                  )}
                  {/* Fullscreen controls overlay */}
                  {isFullscreen && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={togglePlay}
                          className="h-10 w-10 rounded-full bg-purple-500 hover:bg-purple-400 text-zinc-950"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </Button>
                        <div className="flex-1">
                          <Slider
                            value={[currentTime]}
                            min={0}
                            max={duration || 100}
                            step={0.1}
                            onValueChange={([value]) => seek(value)}
                            className="cursor-pointer"
                          />
                        </div>
                        <span className="text-xs text-zinc-400 font-mono">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={toggleMute}
                          className="text-zinc-400 hover:text-zinc-100"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={toggleFullscreen}
                          className="text-zinc-400 hover:text-zinc-100"
                        >
                          <Minimize className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {!isFullscreen && (
                  <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800 p-4">
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={togglePlay}
                        disabled={!isLoaded}
                        className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-400 text-zinc-950 disabled:opacity-50"
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
                          onValueChange={([value]) => seek(value)}
                          disabled={!isLoaded}
                          className="cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-zinc-500">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Mini volume control */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={toggleMute}
                          className="text-zinc-400 hover:text-zinc-100 h-8 w-8"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="w-20 hidden sm:block">
                          <Slider
                            value={[isMuted ? 0 : volume * 100]}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={([value]) => setVolume(value / 100)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleLoop}
                        className={`h-8 w-8 ${isLooping ? "text-purple-400" : "text-zinc-400"} hover:text-zinc-100`}
                      >
                        <Repeat className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleFullscreen}
                        className="text-zinc-400 hover:text-zinc-100 h-8 w-8"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Sidebar */}
              {!isFullscreen && (
                <div
                  className={`w-80 shrink-0 transition-all duration-300 ${
                    showControls ? "opacity-100" : "opacity-0 lg:opacity-100 hidden lg:block"
                  }`}
                >
                  <div className="sticky top-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Settings2 className="w-4 h-4 text-purple-400" />
                      <h2 className="text-sm font-medium">Video Controls</h2>
                    </div>
                    <VideoControls
                      options={options}
                      quality={quality}
                      scrollEnabled={scrollEnabled}
                      playbackSpeed={playbackSpeed}
                      isLooping={isLooping}
                      volume={volume}
                      isMuted={isMuted}
                      isExporting={isExporting}
                      exportProgress={exportProgress}
                      onPixelSizeChange={setPixelSize}
                      onColorModeChange={setColorMode}
                      onCustomColorChange={setCustomColor}
                      onBrightnessChange={setBrightness}
                      onContrastChange={setContrast}
                      onSaturationChange={setSaturation}
                      onScrollEnabledChange={setScrollEnabled}
                      onPlaybackSpeedChange={setPlaybackSpeed}
                      onLoopChange={setLooping}
                      onVolumeChange={setVolume}
                      onMuteToggle={toggleMute}
                      onFullscreenToggle={toggleFullscreen}
                      onExport={exportVideo}
                      onPresetSelect={handlePresetSelect}
                      onReset={resetOptions}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="border-t border-zinc-800/50 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-600 font-mono">
                Client-side processing only. Your videos never leave your browser.
              </p>
              {isLoaded && (
                <button
                  onClick={() => setShowShortcuts(true)}
                  className="text-xs text-zinc-600 hover:text-zinc-400 flex items-center gap-1"
                >
                  <Keyboard className="w-3 h-3" />
                  Press ? for shortcuts
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

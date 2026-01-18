"use client";

import { useCallback } from "react";
import { Grid3X3, Sparkles, Play, Pause, RotateCcw, Mouse } from "lucide-react";
import { VideoUploader } from "@/components/video-uploader";
import { PixelatedPlayer } from "@/components/pixelated-player";
import { QualityIndicator } from "@/components/quality-indicator";
import { usePixelatedVideo } from "@/hooks/use-pixelated-video";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const {
    videoRef,
    canvasRef,
    videoFile,
    videoUrl,
    isPlaying,
    isLoaded,
    pixelSize,
    quality,
    duration,
    currentTime,
    loadVideo,
    handleVideoLoad,
    togglePlay,
    seek,
    handleWheel,
    reset,
    pause,
  } = usePixelatedVideo();

  const handleVideoEnd = useCallback(() => {
    pause();
  }, [pause]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />

      <div className="relative z-10">
        <header className="border-b border-zinc-800/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
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
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-sm text-zinc-400 font-mono truncate max-w-xs">
                    {videoFile.name}
                  </span>
                </div>
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

              <div className="relative">
                <PixelatedPlayer
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  videoUrl={videoUrl}
                  onVideoLoad={handleVideoLoad}
                  onVideoEnd={handleVideoEnd}
                  onWheel={handleWheel}
                />
                {isLoaded && (
                  <QualityIndicator quality={quality} pixelSize={pixelSize} />
                )}
                {isLoaded && (
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-zinc-400 flex items-center gap-2">
                    <Mouse className="w-3 h-3" />
                    Scroll to adjust quality
                  </div>
                )}
              </div>

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
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-zinc-800/50 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <p className="text-center text-xs text-zinc-600 font-mono">
              Client-side processing only. Your videos never leave your browser.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

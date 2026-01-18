"use client";

import { useState, useCallback } from "react";
import { Terminal, Sparkles } from "lucide-react";
import { VideoUploader } from "@/components/video-uploader";
import { AsciiPlayer } from "@/components/ascii-player";
import { Controls } from "@/components/controls";
import { useAsciiVideo } from "@/hooks/use-ascii-video";
import { CharSetKey } from "@/lib/ascii-converter";

export default function Home() {
  const [asciiWidth, setAsciiWidth] = useState(100);
  const [charSet, setCharSet] = useState<CharSetKey>("dense");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const {
    videoRef,
    canvasRef,
    videoFile,
    videoUrl,
    isPlaying,
    asciiFrame,
    duration,
    currentTime,
    isLoaded,
    loadVideo,
    handleVideoLoad,
    togglePlay,
    seek,
    reset,
    pause,
  } = useAsciiVideo({ asciiWidth, charSet, playbackSpeed });

  const handleVideoEnd = useCallback(() => {
    pause();
  }, [pause]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />
      
      <div className="relative z-10">
        <header className="border-b border-zinc-800/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Terminal className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight font-mono">
                  ASCII<span className="text-emerald-400">_</span>VIDEO
                </h1>
                <p className="text-xs text-zinc-500">MP4 to ASCII converter</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {!videoFile ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
              <div className="text-center space-y-4 max-w-lg">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">Real-time conversion</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tight">
                  Transform videos into
                  <span className="text-emerald-400"> ASCII art</span>
                </h2>
                <p className="text-zinc-400">
                  Upload any MP4 video and watch it play back as live ASCII characters.
                  Adjust width, density, and speed in real-time.
                </p>
              </div>
              
              <div className="w-full max-w-md">
                <VideoUploader onFileSelect={loadVideo} />
              </div>

              <div className="grid grid-cols-3 gap-8 text-center text-sm pt-8">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-emerald-400">30fps</div>
                  <div className="text-zinc-500">Smooth playback</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-emerald-400">50MB</div>
                  <div className="text-zinc-500">Max file size</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-emerald-400">200</div>
                  <div className="text-zinc-500">Max char width</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-zinc-400 font-mono truncate max-w-xs">
                    {videoFile.name}
                  </span>
                </div>
              </div>

              <AsciiPlayer
                videoRef={videoRef}
                canvasRef={canvasRef}
                videoUrl={videoUrl}
                asciiFrame={asciiFrame}
                onVideoLoad={handleVideoLoad}
                onVideoEnd={handleVideoEnd}
              />

              <Controls
                isPlaying={isPlaying}
                isLoaded={isLoaded}
                duration={duration}
                currentTime={currentTime}
                asciiWidth={asciiWidth}
                charSet={charSet}
                playbackSpeed={playbackSpeed}
                onTogglePlay={togglePlay}
                onSeek={seek}
                onWidthChange={setAsciiWidth}
                onCharSetChange={setCharSet}
                onSpeedChange={setPlaybackSpeed}
                onReset={reset}
              />
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

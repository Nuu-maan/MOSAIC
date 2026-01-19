"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  applyPixelation,
  QUALITY_RANGE,
  qualityToPercentage,
  DEFAULT_OPTIONS,
  VideoOptions,
  ColorMode,
  RenderMode,
  AsciiDensity,
} from "@/lib/pixelation-engine";
import {
  ExportFormat,
  ExportOptions,
  DEFAULT_EXPORT_OPTIONS,
  captureScreenshot,
  downloadBlob,
  exportToGif,
  exportToWebM,
  exportToPngSequence,
} from "@/lib/export-utils";

export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export function usePixelatedVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const optionsRef = useRef<VideoOptions>({ ...DEFAULT_OPTIONS });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [options, setOptionsState] = useState<VideoOptions>({ ...DEFAULT_OPTIONS });
  const [quality, setQuality] = useState(qualityToPercentage(QUALITY_RANGE.default));
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  
  // New states
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeed>(1);
  const [isLooping, setIsLooping] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('webm');
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const [isPiPActive, setIsPiPActive] = useState(false);

  const setOptions = useCallback((value: VideoOptions | ((prev: VideoOptions) => VideoOptions)) => {
    setOptionsState((prev) => {
      const newValue = typeof value === "function" ? value(prev) : value;
      optionsRef.current = newValue;
      return newValue;
    });
  }, []);

  const updateOption = useCallback(<K extends keyof VideoOptions>(key: K, value: VideoOptions[K]) => {
    setOptions((prev) => {
      const newOptions = { ...prev, [key]: value };
      if (key === "pixelSize") {
        setQuality(qualityToPercentage(value as number));
      }
      return newOptions;
    });
  }, [setOptions]);

  const renderFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (video.paused || video.ended) {
      animationRef.current = null;
      return;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    applyPixelation(ctx, video, canvas, optionsRef.current);
    setCurrentTime(video.currentTime);

    animationRef.current = requestAnimationFrame(renderFrame);
  }, []);

  const loadVideo = useCallback((file: File) => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setIsPlaying(false);
    setIsLoaded(false);
  }, [videoUrl]);

  const handleVideoLoad = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    setDuration(video.duration);
    setTrimEnd(video.duration);
    setIsLoaded(true);
    video.loop = isLooping;
    video.playbackRate = playbackSpeed;
    video.volume = isMuted ? 0 : volume;

    video.play();
    setIsPlaying(true);
    animationRef.current = requestAnimationFrame(renderFrame);
  }, [renderFrame, isLooping, playbackSpeed, volume, isMuted]);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play();
    setIsPlaying(true);
    if (animationRef.current === null) {
      animationRef.current = requestAnimationFrame(renderFrame);
    }
  }, [renderFrame]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const seekRelative = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.max(0, Math.min(video.duration, video.currentTime + delta));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const updatePixelSize = useCallback((delta: number) => {
    setOptions((prev) => {
      const newSize = Math.max(QUALITY_RANGE.min, Math.min(QUALITY_RANGE.max, prev.pixelSize + delta));
      setQuality(qualityToPercentage(newSize));
      return { ...prev, pixelSize: newSize };
    });
  }, [setOptions]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!scrollEnabled) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 2 : -2;
    updatePixelSize(delta);
  }, [updatePixelSize, scrollEnabled]);

  const setColorMode = useCallback((mode: ColorMode) => {
    updateOption("colorMode", mode);
  }, [updateOption]);

  const setCustomColor = useCallback((color: string) => {
    updateOption("customColor", color);
  }, [updateOption]);

  const setBrightness = useCallback((value: number) => {
    updateOption("brightness", value);
  }, [updateOption]);

  const setContrast = useCallback((value: number) => {
    updateOption("contrast", value);
  }, [updateOption]);

  const setSaturation = useCallback((value: number) => {
    updateOption("saturation", value);
  }, [updateOption]);

  const setPixelSize = useCallback((value: number) => {
    updateOption("pixelSize", value);
  }, [updateOption]);

  const setRenderMode = useCallback((mode: RenderMode) => {
    updateOption("renderMode", mode);
  }, [updateOption]);

  const setAsciiDensity = useCallback((density: AsciiDensity) => {
    updateOption("asciiDensity", density);
  }, [updateOption]);

  const setAsciiFontSize = useCallback((size: number) => {
    updateOption("asciiFontSize", size);
  }, [updateOption]);

  const setAsciiColor = useCallback((color: string) => {
    updateOption("asciiColor", color);
  }, [updateOption]);

  const setAsciiBackground = useCallback((color: string) => {
    updateOption("asciiBackground", color);
  }, [updateOption]);

  // Playback speed
  const setPlaybackSpeed = useCallback((speed: PlaybackSpeed) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
    }
    setPlaybackSpeedState(speed);
  }, []);

  // Loop toggle
  const toggleLoop = useCallback(() => {
    const video = videoRef.current;
    const newLooping = !isLooping;
    if (video) {
      video.loop = newLooping;
    }
    setIsLooping(newLooping);
  }, [isLooping]);

  const setLooping = useCallback((loop: boolean) => {
    const video = videoRef.current;
    if (video) {
      video.loop = loop;
    }
    setIsLooping(loop);
  }, []);

  // Volume control
  const setVolume = useCallback((vol: number) => {
    const video = videoRef.current;
    const clampedVol = Math.max(0, Math.min(1, vol));
    if (video) {
      video.volume = clampedVol;
    }
    setVolumeState(clampedVol);
    if (clampedVol > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    const newMuted = !isMuted;
    if (video) {
      video.muted = newMuted;
    }
    setIsMuted(newMuted);
  }, [isMuted]);

  // Fullscreen
  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Export video
  const exportVideo = useCallback(async (format?: ExportFormat) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || isExporting) return;

    const targetFormat = format || exportFormat;
    setIsExporting(true);
    setExportProgress(0);

    const wasPlaying = isPlaying;
    if (wasPlaying) pause();

    const exportOpts: ExportOptions = {
      format: targetFormat,
      quality: 80,
      fps: 30,
      startTime: trimStart,
      endTime: trimEnd || video.duration,
    };

    try {
      let blob: Blob;
      const timestamp = Date.now();
      
      if (targetFormat === 'gif') {
        blob = await exportToGif(video, canvas, optionsRef.current, exportOpts, setExportProgress);
        downloadBlob(blob, `pixelated-video-${timestamp}.gif`);
      } else if (targetFormat === 'png-sequence') {
        const frames = await exportToPngSequence(video, canvas, optionsRef.current, exportOpts, setExportProgress);
        for (let i = 0; i < frames.length; i++) {
          downloadBlob(frames[i], `frame-${String(i).padStart(5, '0')}.png`);
          await new Promise(r => setTimeout(r, 100));
        }
      } else {
        blob = await exportToWebM(video, canvas, optionsRef.current, exportOpts, setExportProgress);
        downloadBlob(blob, `pixelated-video-${timestamp}.webm`);
      }

      video.currentTime = trimStart;
      setCurrentTime(trimStart);
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed. Your browser may not support video recording.");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
      if (wasPlaying) play();
    }
  }, [isPlaying, pause, play, isExporting, exportFormat, trimStart, trimEnd]);

  const takeScreenshot = useCallback(async (format: 'png' | 'jpg' = 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await captureScreenshot(canvas, format);
      downloadBlob(blob, `screenshot-${Date.now()}.${format}`);
    } catch (err) {
      console.error("Screenshot error:", err);
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else if (document.pictureInPictureEnabled) {
        const pipVideo = document.createElement('video');
        const stream = canvas.captureStream(30);
        pipVideo.srcObject = stream;
        pipVideo.muted = true;
        await pipVideo.play();
        await pipVideo.requestPictureInPicture();
        setIsPiPActive(true);
        
        pipVideo.addEventListener('leavepictureinpicture', () => {
          setIsPiPActive(false);
          pipVideo.srcObject = null;
        });
      }
    } catch (err) {
      console.error("PiP error:", err);
    }
  }, []);

  const toggleComparison = useCallback(() => {
    setShowComparison(prev => !prev);
  }, []);

  const resetOptions = useCallback(() => {
    setOptions({ ...DEFAULT_OPTIONS });
    setQuality(qualityToPercentage(DEFAULT_OPTIONS.pixelSize));
  }, [setOptions]);

  const reset = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
    setIsPlaying(false);
    setIsLoaded(false);
    setOptions({ ...DEFAULT_OPTIONS });
    setQuality(qualityToPercentage(DEFAULT_OPTIONS.pixelSize));
    setDuration(0);
    setCurrentTime(0);
    setPlaybackSpeedState(1);
    setIsLooping(false);
    setVolumeState(1);
    setIsMuted(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [videoUrl, setOptions]);

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [videoUrl]);

  return {
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
    trimStart,
    trimEnd,
    exportFormat,
    showComparison,
    comparisonPosition,
    isPiPActive,
    loadVideo,
    handleVideoLoad,
    play,
    pause,
    togglePlay,
    seek,
    seekRelative,
    updatePixelSize,
    handleWheel,
    reset,
    resetOptions,
    setOptions,
    updateOption,
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
    setRenderMode,
    setAsciiDensity,
    setAsciiFontSize,
    setAsciiColor,
    setAsciiBackground,
    takeScreenshot,
    setTrimStart,
    setTrimEnd,
    setExportFormat,
    togglePiP,
    toggleComparison,
    setComparisonPosition,
  };
}

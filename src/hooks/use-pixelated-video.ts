"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  applyPixelation,
  QUALITY_RANGE,
  qualityToPercentage,
  DEFAULT_OPTIONS,
  VideoOptions,
  ColorMode,
} from "@/lib/pixelation-engine";

export function usePixelatedVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    setIsLoaded(true);

    video.play();
    setIsPlaying(true);
    animationRef.current = requestAnimationFrame(renderFrame);
  }, [renderFrame]);

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
    videoFile,
    videoUrl,
    isPlaying,
    isLoaded,
    options,
    quality,
    duration,
    currentTime,
    scrollEnabled,
    loadVideo,
    handleVideoLoad,
    play,
    pause,
    togglePlay,
    seek,
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
  };
}

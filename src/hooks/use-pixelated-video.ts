"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { applyPixelation, QUALITY_RANGE, qualityToPercentage } from "@/lib/pixelation-engine";

export function usePixelatedVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const pixelSizeRef = useRef(QUALITY_RANGE.default);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pixelSize, setPixelSizeState] = useState(QUALITY_RANGE.default);
  const [quality, setQuality] = useState(qualityToPercentage(QUALITY_RANGE.default));
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const setPixelSize = useCallback((value: number | ((prev: number) => number)) => {
    setPixelSizeState((prev) => {
      const newValue = typeof value === "function" ? value(prev) : value;
      pixelSizeRef.current = newValue;
      return newValue;
    });
  }, []);

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

    applyPixelation(ctx, video, canvas, pixelSizeRef.current);
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
    setPixelSize((prev) => {
      const newSize = Math.max(QUALITY_RANGE.min, Math.min(QUALITY_RANGE.max, prev + delta));
      setQuality(qualityToPercentage(newSize));
      return newSize;
    });
  }, [setPixelSize]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 2 : -2;
    updatePixelSize(delta);
  }, [updatePixelSize]);

  const reset = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
    setIsPlaying(false);
    setIsLoaded(false);
    setPixelSize(QUALITY_RANGE.default);
    setQuality(qualityToPercentage(QUALITY_RANGE.default));
    setDuration(0);
    setCurrentTime(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [videoUrl, setPixelSize]);

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
    pixelSize,
    quality,
    duration,
    currentTime,
    loadVideo,
    handleVideoLoad,
    play,
    pause,
    togglePlay,
    seek,
    updatePixelSize,
    handleWheel,
    reset,
    setPixelSize,
    setQuality,
  };
}

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { convertFrameToAscii, ASCII_SETS, CharSetKey } from "@/lib/ascii-converter";

interface UseAsciiVideoOptions {
  asciiWidth?: number;
  charSet?: CharSetKey;
  playbackSpeed?: number;
}

export function useAsciiVideo(options: UseAsciiVideoOptions = {}) {
  const { 
    asciiWidth = 100, 
    charSet = "dense", 
    playbackSpeed = 1 
  } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [asciiFrame, setAsciiFrame] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadVideo = useCallback((file: File) => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setIsPlaying(false);
    setAsciiFrame("");
    setIsLoaded(false);
  }, [videoUrl]);

  const handleVideoLoad = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setDuration(video.duration);
    setIsLoaded(true);
  }, []);

  const convertCurrentFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.paused || video.ended) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const ascii = convertFrameToAscii(imageData, asciiWidth, ASCII_SETS[charSet]);
    setAsciiFrame(ascii);
    setCurrentTime(video.currentTime);

    animationRef.current = requestAnimationFrame(convertCurrentFrame);
  }, [asciiWidth, charSet]);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = playbackSpeed;
    video.play();
    setIsPlaying(true);
    animationRef.current = requestAnimationFrame(convertCurrentFrame);
  }, [convertCurrentFrame, playbackSpeed]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.pause();
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
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

  const reset = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
    setIsPlaying(false);
    setAsciiFrame("");
    setDuration(0);
    setCurrentTime(0);
    setIsLoaded(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

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
    asciiFrame,
    duration,
    currentTime,
    isLoaded,
    loadVideo,
    handleVideoLoad,
    play,
    pause,
    togglePlay,
    seek,
    reset,
  };
}

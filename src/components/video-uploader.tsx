"use client";

import { useCallback, useState } from "react";
import { Upload, Film, AlertCircle, Link, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  onUrlLoad?: (url: string) => void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export function VideoUploader({ onFileSelect, onUrlLoad }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("video/") && !file.name.toLowerCase().match(/\.(mp4|webm|mov|avi|mkv)$/)) {
      return "Please upload a video file (MP4, WebM, MOV, AVI, MKV)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 100MB";
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const text = e.dataTransfer.getData("text");
    if (text && (text.startsWith("http://") || text.startsWith("https://"))) {
      setUrlInput(text);
      setShowUrlInput(true);
      return;
    }
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      setIsLoadingUrl(true);
      setError(null);

      const response = await fetch(urlInput);
      if (!response.ok) {
        throw new Error("Failed to fetch video");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.startsWith("video/")) {
        if (onUrlLoad) {
          onUrlLoad(urlInput);
          return;
        }
        throw new Error("URL does not point to a valid video file");
      }

      const blob = await response.blob();
      const fileName = urlInput.split("/").pop() || "video.mp4";
      const file = new File([blob], fileName, { type: contentType });
      
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("Video file is too large (max 100MB)");
      }

      onFileSelect(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load video from URL");
    } finally {
      setIsLoadingUrl(false);
    }
  }, [urlInput, onFileSelect, onUrlLoad]);

  return (
    <div className="space-y-4">
      <Card
        className={`relative border-2 border-dashed transition-all duration-200 cursor-pointer group
          ${isDragging 
            ? "border-purple-400 bg-purple-400/5" 
            : "border-zinc-700 hover:border-purple-400/50 bg-zinc-900/50"
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
          <input
            type="file"
            accept="video/*,.mp4,.webm,.mov,.avi,.mkv"
            onChange={handleInputChange}
            className="hidden"
          />
          
          <div className={`p-4 rounded-full mb-6 transition-all duration-200
            ${isDragging 
              ? "bg-purple-400/20" 
              : "bg-zinc-800 group-hover:bg-purple-400/10"
            }`}>
            {isDragging ? (
              <Film className="w-12 h-12 text-purple-400" />
            ) : (
              <Upload className="w-12 h-12 text-zinc-400 group-hover:text-purple-400 transition-colors duration-200" />
            )}
          </div>

          <h3 className="text-xl font-semibold text-zinc-100 mb-2">
            {isDragging ? "Drop your video here" : "Upload Video"}
          </h3>
          
          <p className="text-zinc-500 text-sm text-center">
            Drag and drop or click to browse
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            MP4, WebM, MOV, AVI, MKV - max 100MB
          </p>
        </label>
      </Card>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-500">or</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {!showUrlInput ? (
        <Button
          variant="outline"
          className="w-full text-zinc-400 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
          onClick={() => setShowUrlInput(true)}
        >
          <Link className="w-4 h-4 mr-2" />
          Load from URL
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/video.mp4"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              disabled={isLoadingUrl}
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={isLoadingUrl}
              className="bg-purple-500 hover:bg-purple-400"
            >
              {isLoadingUrl ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Load"
              )}
            </Button>
          </div>
          <button
            onClick={() => {
              setShowUrlInput(false);
              setUrlInput("");
              setError(null);
            }}
            className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

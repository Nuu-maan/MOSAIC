"use client";

import { useCallback, useState } from "react";
import { Upload, Film, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export function VideoUploader({ onFileSelect }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("video/mp4") && !file.name.toLowerCase().endsWith(".mp4")) {
      return "Please upload an MP4 file";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 50MB";
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

  return (
    <Card
      className={`relative border-2 border-dashed transition-all duration-300 cursor-pointer group
        ${isDragging 
          ? "border-emerald-400 bg-emerald-400/5" 
          : "border-zinc-700 hover:border-emerald-400/50 bg-zinc-900/50"
        }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
        <input
          type="file"
          accept="video/mp4,.mp4"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className={`p-4 rounded-full mb-6 transition-all duration-300
          ${isDragging 
            ? "bg-emerald-400/20" 
            : "bg-zinc-800 group-hover:bg-emerald-400/10"
          }`}>
          {isDragging ? (
            <Film className="w-12 h-12 text-emerald-400" />
          ) : (
            <Upload className="w-12 h-12 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
          )}
        </div>

        <h3 className="text-xl font-semibold text-zinc-100 mb-2">
          {isDragging ? "Drop your video here" : "Upload MP4 Video"}
        </h3>
        
        <p className="text-zinc-500 text-sm text-center">
          Drag and drop or click to browse
        </p>
        <p className="text-zinc-600 text-xs mt-1">
          MP4 files only, max 50MB
        </p>

        {error && (
          <div className="flex items-center gap-2 mt-4 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </label>
    </Card>
  );
}

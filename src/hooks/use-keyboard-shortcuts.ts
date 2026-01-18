"use client";

import { useEffect, useCallback, useState } from "react";

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  ctrl?: boolean;
  shift?: boolean;
}

export interface UseKeyboardShortcutsProps {
  enabled: boolean;
  togglePlay: () => void;
  seekRelative: (delta: number) => void;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  volume: number;
  toggleFullscreen: () => void;
  updatePixelSize: (delta: number) => void;
  toggleLoop: () => void;
  resetOptions: () => void;
}

export function useKeyboardShortcuts({
  enabled,
  togglePlay,
  seekRelative,
  toggleMute,
  setVolume,
  volume,
  toggleFullscreen,
  updatePixelSize,
  toggleLoop,
  resetOptions,
}: UseKeyboardShortcutsProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const shortcuts: KeyboardShortcut[] = [
    { key: "Space", description: "Play / Pause", action: togglePlay },
    { key: "K", description: "Play / Pause", action: togglePlay },
    { key: "ArrowLeft", description: "Seek -5s", action: () => seekRelative(-5) },
    { key: "ArrowRight", description: "Seek +5s", action: () => seekRelative(5) },
    { key: "J", description: "Seek -10s", action: () => seekRelative(-10) },
    { key: "L", description: "Seek +10s", action: () => seekRelative(10) },
    { key: "M", description: "Toggle mute", action: toggleMute },
    { key: "ArrowUp", description: "Volume +10%", action: () => setVolume(Math.min(1, volume + 0.1)) },
    { key: "ArrowDown", description: "Volume -10%", action: () => setVolume(Math.max(0, volume - 0.1)) },
    { key: "F", description: "Toggle fullscreen", action: toggleFullscreen },
    { key: "+", description: "Less pixelation", action: () => updatePixelSize(-2) },
    { key: "-", description: "More pixelation", action: () => updatePixelSize(2) },
    { key: "=", description: "Less pixelation", action: () => updatePixelSize(-2) },
    { key: "R", description: "Toggle loop", action: toggleLoop },
    { key: "0", description: "Reset settings", action: resetOptions },
    { key: "?", description: "Show shortcuts", action: () => setShowShortcuts((s) => !s), shift: true },
  ];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      
      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const key = e.key;
      const isShift = e.shiftKey;
      const isCtrl = e.ctrlKey || e.metaKey;

      // Handle special cases
      if (key === " " || key === "Spacebar") {
        e.preventDefault();
        togglePlay();
        return;
      }

      // Find matching shortcut
      const shortcut = shortcuts.find((s) => {
        const keyMatch = s.key.toLowerCase() === key.toLowerCase() || 
                        (s.key === "+" && (key === "+" || key === "=")) ||
                        (s.key === "-" && key === "-");
        const shiftMatch = s.shift ? isShift : !isShift || key === "?";
        const ctrlMatch = s.ctrl ? isCtrl : true;
        return keyMatch && shiftMatch && ctrlMatch;
      });

      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    },
    [enabled, shortcuts, togglePlay]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const toggleShortcutsHelp = useCallback(() => {
    setShowShortcuts((s) => !s);
  }, []);

  // Filter out duplicate/alias shortcuts for display
  const displayShortcuts = [
    { key: "Space / K", description: "Play / Pause" },
    { key: "J / L", description: "Seek -10s / +10s" },
    { key: "< / >", description: "Seek -5s / +5s" },
    { key: "M", description: "Toggle mute" },
    { key: "Up/Down", description: "Volume +/- 10%" },
    { key: "F", description: "Toggle fullscreen" },
    { key: "+ / -", description: "Adjust pixelation" },
    { key: "R", description: "Toggle loop" },
    { key: "0", description: "Reset settings" },
    { key: "?", description: "Show/hide shortcuts" },
  ];

  return {
    showShortcuts,
    setShowShortcuts,
    toggleShortcutsHelp,
    displayShortcuts,
  };
}

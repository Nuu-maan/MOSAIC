# MOSAIC

A real-time video pixelation and effects tool that runs entirely in your browser.

**Live Demo:** [mosaic.nuu-maan.com](https://mosaic.nuu-maan.com)

## Features

- **Scroll-Controlled Pixelation** — Use your scroll wheel to dynamically adjust video quality
- **Multiple Render Modes** — Pixel blocks, ASCII art, and more
- **Real-Time Processing** — 60fps smooth playback with instant effect updates
- **Color Modes** — Original, grayscale, sepia, inverted, and custom color overlays
- **Export Options** — Save processed videos as WebM or GIF
- **Screenshot Capture** — Export single frames as PNG
- **Keyboard Shortcuts** — Full keyboard control for power users
- **Privacy First** — All processing happens client-side; your videos never leave your browser

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Canvas API

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Upload an MP4 video (max 100MB)
2. Scroll over the video to adjust pixelation level
3. Use the control panel to adjust colors, brightness, contrast, and more
4. Export your creation as WebM, GIF, or PNG screenshot

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` / `→` | Seek -5s / +5s |
| `↑` / `↓` | Increase / Decrease pixel size |
| `M` | Toggle mute |
| `L` | Toggle loop |
| `F` | Toggle fullscreen |
| `R` | Reset effects |
| `?` | Show shortcuts |

## License

MIT

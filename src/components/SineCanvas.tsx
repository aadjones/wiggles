import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type { WaveParams } from "../types/wave";
import { generateSinePoints } from "../utils/math";

interface SineCanvasProps {
  width: number;
  height: number;
  waveParams: WaveParams;
  mode?: "draw" | "analysis";
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export interface SineCanvasRef {
  getImageData: () => ImageData | null;
  getCanvas: () => HTMLCanvasElement | null;
}

export const SineCanvas = forwardRef<SineCanvasRef, SineCanvasProps>(
  ({ width, height, waveParams, mode = "draw", onCanvasReady }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getImageData: () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        return ctx.getImageData(0, 0, width, height);
      },
      getCanvas: () => canvasRef.current,
    }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get device pixel ratio for high-DPI displays
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Set actual canvas size in memory (scaled up for high-DPI)
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    
    // Scale the canvas down using CSS (maintains sharp rendering)
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    // Scale the drawing context so everything draws at the correct size
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Enable antialiasing for smoother lines
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw grid lines
    drawGrid(ctx, width, height);

    // Generate and draw sine wave
    const points = generateSinePoints(width, height, waveParams);
    drawSineWave(ctx, points);

    // Draw center line (more prominent)
    ctx.strokeStyle = "#374151"; // Darker gray for better visibility
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Add period markers
    drawPeriodMarkers(ctx, width, height);

    // Notify parent when canvas is ready
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [width, height, waveParams, onCanvasReady]);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
        }}
      />
    );
  }
);

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.strokeStyle = "#f3f4f6";
  ctx.lineWidth = 1;

  // Vertical grid lines (every 100px for quarter periods)
  for (let x = 0; x <= width; x += width / 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal grid lines (every 50px for amplitude reference)
  for (let y = 0; y <= height; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawSineWave(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
) {
  if (points.length === 0) return;

  // Set up styling exactly like the center line but thicker and blue
  ctx.strokeStyle = "#0000FF"; // Bright blue
  ctx.lineWidth = 6; // Thick like the center line but thicker

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.stroke();
}

function drawPeriodMarkers(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.fillStyle = "#6b7280";
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "center";

  // Mark quarter periods
  const markers = [
    { x: 0, label: "0" },
    { x: width / 4, label: "π/2" },
    { x: width / 2, label: "π" },
    { x: (3 * width) / 4, label: "3π/2" },
    { x: width, label: "2π" },
  ];

  markers.forEach((marker) => {
    // Draw tick mark
    ctx.strokeStyle = "#6b7280";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(marker.x, height / 2 - 8);
    ctx.lineTo(marker.x, height / 2 + 8);
    ctx.stroke();

    // Adjust text alignment for edge labels to prevent cutoff
    if (marker.x === 0) {
      ctx.textAlign = "start";
    } else if (marker.x === width) {
      ctx.textAlign = "end";
    } else {
      ctx.textAlign = "center";
    }

    // Draw label
    ctx.fillText(marker.label, marker.x, height - 10);
  });
}

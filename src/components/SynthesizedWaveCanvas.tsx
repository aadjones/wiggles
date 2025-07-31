import { useEffect, useRef } from "react";
import { synthesizeWaveform } from "../utils/synthesis";
import type { SpectralComponent } from "../types/wave";

interface SynthesizedWaveCanvasProps {
  width: number;
  height: number;
  components: SpectralComponent[];
  targetWaveform?: number[]; // Optional ghost outline
}

export function SynthesizedWaveCanvas({ 
  width, 
  height, 
  components,
  targetWaveform 
}: SynthesizedWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, width, height);

    // Draw target waveform (ghost outline) if provided
    if (targetWaveform && targetWaveform.length > 0) {
      drawTargetWaveform(ctx, targetWaveform, width, height);
    }

    // Synthesize and draw current waveform
    const synthesizedWave = synthesizeWaveform(components, width);
    drawSynthesizedWave(ctx, synthesizedWave, width, height);

    // Draw center line
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

  }, [width, height, components, targetWaveform]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: "2px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      }}
    />
  );
}


function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = "#f3f4f6";
  ctx.lineWidth = 1;

  // Vertical grid lines (quarter periods)
  for (let x = 0; x <= width; x += width / 8) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal grid lines
  for (let y = 0; y <= height; y += height / 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawTargetWaveform(
  ctx: CanvasRenderingContext2D, 
  targetWave: number[], 
  width: number, 
  height: number
) {
  if (targetWave.length === 0) return;

  ctx.strokeStyle = "#94a3b8"; // Light gray for ghost
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]); // Dashed line

  const scaleY = height / 4; // Scale factor for amplitude
  const centerY = height / 2;

  ctx.beginPath();
  
  for (let i = 0; i < targetWave.length; i++) {
    const x = (i / targetWave.length) * width;
    const y = centerY - targetWave[i] * scaleY;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
  ctx.setLineDash([]); // Reset dash
}

function drawSynthesizedWave(
  ctx: CanvasRenderingContext2D,
  wavePoints: number[],
  width: number,
  height: number
) {
  if (wavePoints.length === 0) return;

  ctx.strokeStyle = "#2563eb"; // Blue for synthesized wave
  ctx.lineWidth = 4;

  const scaleY = height / 4; // Scale factor for amplitude
  const centerY = height / 2;

  ctx.beginPath();
  
  for (let i = 0; i < wavePoints.length; i++) {
    const x = (i / wavePoints.length) * width;
    const y = centerY - wavePoints[i] * scaleY;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}
import { useRef } from "react";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import type { WaveParams } from "../types/wave";

interface PhasorCanvasProps {
  width: number;
  height: number;
  waveParams: WaveParams;
}

export function PhasorCanvas({ width, height, waveParams }: PhasorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationTimeRef = useRef(0);

  // Use animation frame for smooth rotation
  useAnimationFrame((deltaTime) => {
    animationTimeRef.current += deltaTime;
    draw();
  });

  const draw = () => {
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

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.35; // Leave margin

    // Draw coordinate axes (subtle)
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Horizontal axis
    ctx.moveTo(centerX - maxRadius * 1.2, centerY);
    ctx.lineTo(centerX + maxRadius * 1.2, centerY);
    // Vertical axis  
    ctx.moveTo(centerX, centerY - maxRadius * 1.2);
    ctx.lineTo(centerX, centerY + maxRadius * 1.2);
    ctx.stroke();

    // Draw reference circle (very subtle)
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Calculate phasor properties
    const { amplitude, phase, frequency } = waveParams;
    const phasorLength = amplitude * maxRadius / 2; // Scale amplitude to radius
    
    // Calculate current angle: base phase + continuous rotation based on frequency
    // Rotate at a speed proportional to frequency for visual effect
    const rotationSpeed = frequency * 0.5; // Adjust this multiplier for good visual speed
    const currentAngle = (phase * Math.PI / 180) + (animationTimeRef.current * rotationSpeed * 0.001);

    // Calculate phasor endpoint
    const phasorEndX = centerX + phasorLength * Math.cos(currentAngle);
    const phasorEndY = centerY - phasorLength * Math.sin(currentAngle); // Negative for upward positive

    // Draw phasor vector
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(phasorEndX, phasorEndY);
    ctx.stroke();

    // Draw phasor arrowhead
    const arrowLength = 12;
    const arrowAngle = Math.PI / 6; // 30 degrees
    
    ctx.beginPath();
    ctx.moveTo(phasorEndX, phasorEndY);
    ctx.lineTo(
      phasorEndX - arrowLength * Math.cos(currentAngle - arrowAngle),
      phasorEndY + arrowLength * Math.sin(currentAngle - arrowAngle)
    );
    ctx.moveTo(phasorEndX, phasorEndY);
    ctx.lineTo(
      phasorEndX - arrowLength * Math.cos(currentAngle + arrowAngle),
      phasorEndY + arrowLength * Math.sin(currentAngle + arrowAngle)
    );
    ctx.stroke();

    // Draw center dot
    ctx.fillStyle = "#374151";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Add labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "center";
    
    // Amplitude label
    ctx.fillText(
      `Amplitude: ${amplitude.toFixed(1)}`,
      centerX,
      height - 20
    );
    
    // Phase label
    ctx.fillText(
      `Phase: ${Math.round(phase % 360)}°`,
      centerX,
      height - 5
    );
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      }}
    />
  );
}
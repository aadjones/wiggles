import { useRef } from "react";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import { calculateSineValue } from "../utils/math";
import type { WaveParams } from "../types/wave";

interface LEDStripCanvasProps {
  width: number;
  height: number;
  waveParams: WaveParams;
}

export function LEDStripCanvas({ width, height, waveParams }: LEDStripCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationTimeRef = useRef(0);

  // Number of LEDs in the strip
  const NUM_LEDS = 64;

  // Use animation frame for smooth updates at 60fps
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

    // Enable antialiasing for smoother rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate LED strip dimensions
    const stripWidth = width * 0.9; // 90% of canvas width
    const stripHeight = 40; // Height of LED strip
    const stripX = (width - stripWidth) / 2; // Center horizontally
    const stripY = (height - stripHeight) / 2; // Center vertically

    const ledWidth = stripWidth / NUM_LEDS;
    const ledHeight = stripHeight;

    // Draw background strip
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(stripX, stripY, stripWidth, stripHeight);

    // Add some visual depth with borders
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.strokeRect(stripX, stripY, stripWidth, stripHeight);

    // Calculate wave values and draw LEDs
    for (let i = 0; i < NUM_LEDS; i++) {
      // Map LED position to mathematical x coordinate (0 to 2π)
      const mathX = (i / (NUM_LEDS - 1)) * 2 * Math.PI;
      
      // Calculate wave value at this position
      const waveValue = calculateSineValue(mathX, waveParams);
      
      // Map wave value (-amplitude to +amplitude) to brightness (0 to 1)
      // Using the black-gray-white scheme: -1=black, 0=gray, +1=white
      const normalizedValue = waveValue / 2; // Normalize to -1 to +1 range
      const brightness = (normalizedValue + 1) / 2; // Map to 0-1 range
      
      // Calculate RGB values: black (0,0,0) -> gray (128,128,128) -> white (255,255,255)
      const rgbValue = Math.round(brightness * 255);
      const ledColor = `rgb(${rgbValue}, ${rgbValue}, ${rgbValue})`;

      // Calculate LED position
      const ledX = stripX + i * ledWidth;
      
      // Draw LED with small gaps between them
      const gap = 1;
      ctx.fillStyle = ledColor;
      ctx.fillRect(
        ledX + gap/2, 
        stripY + gap/2, 
        ledWidth - gap, 
        ledHeight - gap
      );

      // Add LED "shine" effect for brighter LEDs
      if (brightness > 0.7) {
        const shine = (brightness - 0.7) * 3.33; // Scale 0.7-1.0 to 0-1
        ctx.fillStyle = `rgba(255, 255, 255, ${shine * 0.3})`;
        ctx.fillRect(
          ledX + gap/2 + 2, 
          stripY + gap/2 + 2, 
          ledWidth - gap - 4, 
          ledHeight - gap - 4
        );
      }
    }

    // Add labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "center";
    
    // Position markers
    const markers = [
      { pos: 0, label: "0" },
      { pos: 0.25, label: "π/2" },
      { pos: 0.5, label: "π" },
      { pos: 0.75, label: "3π/2" },
      { pos: 1, label: "2π" },
    ];

    markers.forEach(marker => {
      const x = stripX + marker.pos * stripWidth;
      
      // Draw tick mark below strip
      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, stripY + stripHeight + 5);
      ctx.lineTo(x, stripY + stripHeight + 10);
      ctx.stroke();
      
      // Draw label
      ctx.fillText(marker.label, x, stripY + stripHeight + 25);
    });

    // Add title
    ctx.textAlign = "center";
    ctx.fillText(
      `LED Strip - Amplitude: ${waveParams.amplitude.toFixed(1)}, Phase: ${Math.round(waveParams.phase)}°`,
      width / 2,
      stripY - 15
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
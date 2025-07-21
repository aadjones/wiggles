import type { WaveParams } from "../types/wave";

/**
 * Calculate sine wave value at given x position
 * For single period display: y = amplitude * sin(x + phase)
 * The frequency is handled by the x-axis mapping, not here
 */
export function calculateSineValue(x: number, params: WaveParams): number {
  const { amplitude, phase } = params;
  const phaseRadians = (phase * Math.PI) / 180; // Convert degrees to radians
  return amplitude * Math.sin(x + phaseRadians);
}

/**
 * Generate array of sine wave points for rendering
 */
export function generateSinePoints(
  width: number,
  height: number,
  params: WaveParams,
  resolution: number = 2,
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const centerY = height / 2;
  const scale = 120; // Much larger scaling for maximum visibility

  for (let pixelX = 0; pixelX <= width; pixelX += resolution) {
    // Map pixel coordinates to mathematical coordinates
    const mathX = (pixelX / width) * 2 * Math.PI; // Show exactly 1 full period
    const mathY = calculateSineValue(mathX, params);
    const pixelY = centerY - mathY * scale; // Flip Y and scale

    points.push({ x: pixelX, y: pixelY });
  }

  return points;
}

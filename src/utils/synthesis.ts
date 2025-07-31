import type { SpectralComponent } from "../types/wave";

/**
 * Synthesize a waveform from spectral components using additive synthesis
 * @param components Array of spectral components with k, amplitude, and phase
 * @param numPoints Number of points to generate (one full period)
 * @returns Array of amplitude values representing the synthesized waveform
 */
export function synthesizeWaveform(components: SpectralComponent[], numPoints: number): number[] {
  const points: number[] = [];
  
  for (let x = 0; x < numPoints; x++) {
    const t = (x / numPoints) * 2 * Math.PI; // One full period
    let amplitude = 0;

    // Sum all harmonic components
    for (const component of components) {
      if (component.amplitude > 0.001) { // Skip very small components
        const phaseRad = (component.phase * Math.PI) / 180; // Convert to radians
        
        if (component.k === 0) {
          // DC component
          amplitude += component.amplitude;
        } else {
          // Harmonic components
          amplitude += component.amplitude * Math.sin(component.k * t + phaseRad);
        }
      }
    }

    points.push(amplitude);
  }

  return points;
}
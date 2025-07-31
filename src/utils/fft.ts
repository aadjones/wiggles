import type { SpectralData, SpectralComponent } from "../types/wave";

/**
 * Simple DFT implementation for educational purposes
 * For production, this would be replaced with an optimized FFT library
 */
function computeDFT(samples: number[]): Complex[] {
  const N = samples.length;
  const result: Complex[] = [];

  for (let k = 0; k < N; k++) {
    let real = 0;
    let imag = 0;

    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N;
      real += samples[n] * Math.cos(angle);
      imag += samples[n] * Math.sin(angle);
    }

    result.push({ real: real / N, imag: imag / N });
  }

  return result;
}

interface Complex {
  real: number;
  imag: number;
}

function complexMagnitude(c: Complex): number {
  return Math.sqrt(c.real * c.real + c.imag * c.imag);
}

function complexPhase(c: Complex): number {
  const phaseRad = Math.atan2(c.imag, c.real);
  return (phaseRad * 180) / Math.PI;
}

/**
 * Analyze a waveform and return spectral components
 * Takes canvas samples and returns the first 6 frequency components
 */
export function analyzeWaveform(samples: number[]): SpectralData {
  if (samples.length === 0) {
    return { components: [], energy: 0 };
  }

  // Compute DFT
  const dftResult = computeDFT(samples);
  
  // Extract first 6 components (k = 0 to 5)
  const components: SpectralComponent[] = [];
  let energy = 0;

  for (let k = 0; k < Math.min(6, dftResult.length); k++) {
    const amplitude = complexMagnitude(dftResult[k]);
    const phase = complexPhase(dftResult[k]);
    
    components.push({
      k,
      amplitude,
      phase
    });

    energy += amplitude * amplitude;
  }

  return {
    components,
    energy
  };
}

/**
 * Sample a canvas ImageData to extract waveform values
 * Looks for the wave line by finding the darkest pixels in each column
 */
export function sampleCanvasWaveform(imageData: ImageData, width: number, height: number): number[] {
  const samples: number[] = [];
  
  for (let x = 0; x < width; x++) {
    let minBrightness = 255;
    let waveY = height / 2; // default to center

    // Find darkest pixel in this column (the wave line)
    for (let y = 0; y < height; y++) {
      const pixelIndex = (y * width + x) * 4;
      const brightness = (
        imageData.data[pixelIndex] +     // R
        imageData.data[pixelIndex + 1] + // G
        imageData.data[pixelIndex + 2]   // B
      ) / 3;

      if (brightness < minBrightness) {
        minBrightness = brightness;
        waveY = y;
      }
    }

    // Convert y coordinate to amplitude (-1 to 1)
    const amplitude = (height / 2 - waveY) / (height / 2);
    samples.push(amplitude);
  }

  return samples;
}
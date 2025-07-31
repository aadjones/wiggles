import { describe, it, expect } from "vitest";
import { analyzeWaveform, sampleCanvasWaveform } from "./fft";

describe("FFT Analysis", () => {
  describe("analyzeWaveform", () => {
    it("returns empty components for empty input", () => {
      const result = analyzeWaveform([]);
      expect(result.components).toHaveLength(0);
      expect(result.energy).toBe(0);
    });

    it("detects DC component for constant signal", () => {
      const constantSignal = Array(32).fill(1);
      const result = analyzeWaveform(constantSignal);
      
      // DC component (k=0) should have the highest amplitude
      const dcComponent = result.components.find(c => c.k === 0);
      const otherComponents = result.components.filter(c => c.k !== 0);
      
      expect(dcComponent?.amplitude).toBeGreaterThan(0.5);
      otherComponents.forEach(comp => {
        expect(comp.amplitude).toBeLessThan(dcComponent!.amplitude);
      });
    });

    it("detects fundamental frequency for pure sine wave", () => {
      // Generate a pure sine wave at frequency k=1
      const sineWave = Array.from({ length: 32 }, (_, i) => 
        Math.sin((2 * Math.PI * i) / 32)
      );
      
      const result = analyzeWaveform(sineWave);
      
      // Fundamental (k=1) should have highest amplitude among non-DC components
      const fundamental = result.components.find(c => c.k === 1);
      const harmonics = result.components.filter(c => c.k > 1);
      
      expect(fundamental?.amplitude).toBeGreaterThan(0.3);
      harmonics.forEach(harmonic => {
        expect(harmonic.amplitude).toBeLessThan(fundamental!.amplitude);
      });
    });

    it("preserves energy (Parseval's theorem approximately)", () => {
      const signal = [1, 0.5, -0.5, -1, 0, 1, 0.5, -0.5];
      const result = analyzeWaveform(signal);
      
      // Time domain energy
      const timeEnergy = signal.reduce((sum, x) => sum + x * x, 0) / signal.length;
      
      // Frequency domain energy should be similar (accounting for scaling differences)
      expect(result.energy).toBeGreaterThan(timeEnergy * 0.5);
      expect(result.energy).toBeLessThan(timeEnergy * 2);
    });

    it("limits output to first 6 components", () => {
      const longSignal = Array(64).fill(0).map((_, i) => Math.sin(i));
      const result = analyzeWaveform(longSignal);
      
      expect(result.components).toHaveLength(6);
      expect(result.components.every(c => c.k >= 0 && c.k <= 5)).toBe(true);
    });
  });

  describe("sampleCanvasWaveform", () => {
    it("handles empty image data gracefully", () => {
      // Mock ImageData structure
      const mockImageData = {
        data: new Uint8ClampedArray(4), // RGBA for 1 pixel
        width: 1,
        height: 1
      } as ImageData;
      
      const result = sampleCanvasWaveform(mockImageData, 1, 1);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeTypeOf("number");
    });

    it("produces samples within expected amplitude range", () => {
      // Create mock image data - black pixels should produce centered amplitude
      const width = 4;
      const height = 4;
      const mockImageData = {
        data: new Uint8ClampedArray(width * height * 4), // All zeros = black
        width,
        height
      } as ImageData;
      
      const result = sampleCanvasWaveform(mockImageData, width, height);
      
      expect(result).toHaveLength(width);
      result.forEach(sample => {
        expect(sample).toBeGreaterThanOrEqual(-1);
        expect(sample).toBeLessThanOrEqual(1);
      });
    });
  });
});
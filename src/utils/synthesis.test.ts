import { describe, it, expect } from "vitest";
import { synthesizeWaveform } from "./synthesis";
import type { SpectralComponent } from "../types/wave";

describe("Waveform Synthesis", () => {
  describe("synthesizeWaveform", () => {
    it("produces zero signal for empty components", () => {
      const result = synthesizeWaveform([], 10);
      
      expect(result).toHaveLength(10);
      result.forEach(point => {
        expect(point).toBe(0);
      });
    });

    it("produces constant signal for DC-only component", () => {
      const dcOnly: SpectralComponent[] = [
        { k: 0, amplitude: 1.5, phase: 0 }
      ];
      
      const result = synthesizeWaveform(dcOnly, 8);
      
      result.forEach(point => {
        expect(point).toBeCloseTo(1.5, 5);
      });
    });

    it("produces symmetric waveform for zero-phase fundamental", () => {
      const fundamental: SpectralComponent[] = [
        { k: 1, amplitude: 1, phase: 0 }
      ];
      
      const result = synthesizeWaveform(fundamental, 8);
      
      // Should be symmetric around center (sine wave property)
      const center = result.length / 2;
      expect(result[0]).toBeCloseTo(0, 2); // Starts at zero
      expect(result[center]).toBeCloseTo(0, 2); // Zero at π
      expect(result[1]).toBeCloseTo(-result[result.length - 1], 2); // Symmetry
    });

    it("shifts waveform correctly with phase offset", () => {
      const zeroPhase: SpectralComponent[] = [
        { k: 1, amplitude: 1, phase: 0 }
      ];
      const ninetyPhase: SpectralComponent[] = [
        { k: 1, amplitude: 1, phase: 90 }
      ];
      
      const wave1 = synthesizeWaveform(zeroPhase, 8);
      const wave2 = synthesizeWaveform(ninetyPhase, 8);
      
      // 90-degree phase shift should make sine behave like cosine
      // First point should be different
      expect(Math.abs(wave1[0] - wave2[0])).toBeGreaterThan(0.5);
    });

    it("combines multiple harmonics additively", () => {
      const fundamental: SpectralComponent[] = [
        { k: 1, amplitude: 1, phase: 0 }
      ];
      const harmonic: SpectralComponent[] = [
        { k: 2, amplitude: 0.5, phase: 0 }
      ];
      const combined: SpectralComponent[] = [
        { k: 1, amplitude: 1, phase: 0 },
        { k: 2, amplitude: 0.5, phase: 0 }
      ];
      
      const wave1 = synthesizeWaveform(fundamental, 16);
      const wave2 = synthesizeWaveform(harmonic, 16);
      const waveCombined = synthesizeWaveform(combined, 16);
      
      // Combined should approximately equal sum of individual waves
      for (let i = 0; i < 16; i++) {
        expect(waveCombined[i]).toBeCloseTo(wave1[i] + wave2[i], 3);
      }
    });

    it("ignores very small amplitude components", () => {
      const withTiny: SpectralComponent[] = [
        { k: 1, amplitude: 1, phase: 0 },
        { k: 2, amplitude: 0.0001, phase: 0 } // Below threshold
      ];
      const withoutTiny: SpectralComponent[] = [
        { k: 1, amplitude: 1, phase: 0 }
      ];
      
      const wave1 = synthesizeWaveform(withTiny, 16);
      const wave2 = synthesizeWaveform(withoutTiny, 16);
      
      // Should be nearly identical (tiny component ignored)
      for (let i = 0; i < 16; i++) {
        expect(wave1[i]).toBeCloseTo(wave2[i], 3);
      }
    });
  });
});
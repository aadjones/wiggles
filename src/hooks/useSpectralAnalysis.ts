import { useState, useCallback } from "react";
import type { SpectralData } from "../types/wave";
import { analyzeWaveform, sampleCanvasWaveform } from "../utils/fft";

export function useSpectralAnalysis() {
  const [spectralData, setSpectralData] = useState<SpectralData>({
    components: [],
    energy: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCanvas = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) return;

    setIsAnalyzing(true);

    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Get canvas image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Sample the waveform from the canvas
      const samples = sampleCanvasWaveform(imageData, canvas.width, canvas.height);
      
      // Analyze the samples
      const analysis = analyzeWaveform(samples);
      
      setSpectralData(analysis);
    } catch (error) {
      console.error("Error analyzing canvas:", error);
      setSpectralData({ components: [], energy: 0 });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSpectralData({ components: [], energy: 0 });
  }, []);

  return {
    spectralData,
    isAnalyzing,
    analyzeCanvas,
    reset
  };
}
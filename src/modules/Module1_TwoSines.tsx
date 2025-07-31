import { useState } from "react";
import { InteractiveSpectralBars } from "../components/InteractiveSpectralBars";
import { SynthesizedWaveCanvas } from "../components/SynthesizedWaveCanvas";
import { AudioControls } from "../components/AudioControls";
import { useMultiOscillatorAudio } from "../hooks/useMultiOscillatorAudio";
import type { ModuleProps } from "../types/module";
import type { SpectralComponent } from "../types/wave";

export function Module1_TwoSines({ onComplete, onNext }: ModuleProps) {
  const [components, setComponents] = useState<SpectralComponent[]>([
    { k: 0, amplitude: 0, phase: 0 },
    { k: 1, amplitude: 1, phase: 0 },
    { k: 2, amplitude: 0, phase: 0 },
    { k: 3, amplitude: 0, phase: 0 },
    { k: 4, amplitude: 0, phase: 0 },
    { k: 5, amplitude: 0, phase: 0 },
    { k: 6, amplitude: 0, phase: 0 },
    { k: 7, amplitude: 0, phase: 0 }
  ]);

  // Convert components to spectral data format for audio
  const spectralData = {
    components: components.filter(c => c.amplitude > 0.01),
    energy: components.reduce((sum, c) => sum + c.amplitude * c.amplitude, 0)
  };

  const { isPlaying, startAudio, stopAudio } = useMultiOscillatorAudio(spectralData);

  const handleComponentChange = (index: number, newComponent: SpectralComponent) => {
    setComponents(prev => 
      prev.map((comp, i) => i === index ? newComponent : comp)
    );
  };

  const handlePresetSquare = () => {
    // Square wave approximation: odd harmonics with 1/k amplitude
    const squareComponents = components.map(comp => ({
      ...comp,
      amplitude: comp.k === 0 ? 0 : (comp.k % 2 === 1 ? 1.2 / comp.k : 0)
    }));
    setComponents(squareComponents);
  };

  const handlePresetSawtooth = () => {
    // Sawtooth wave: all harmonics with 1/k amplitude
    const sawComponents = components.map(comp => ({
      ...comp,
      amplitude: comp.k === 0 ? 0 : (comp.k > 0 ? 0.8 / comp.k : 0)
    }));
    setComponents(sawComponents);
  };

  const handleReset = () => {
    setComponents(prev => prev.map(comp => ({ ...comp, amplitude: 0 })));
    stopAudio();
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1200px", 
      margin: "0 auto",
      fontFamily: "system-ui, sans-serif"
    }}>
      {/* Module Header */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 8px 0", color: "#374151" }}>
          Soundboard Synth - Additive Synthesis
        </h2>
        <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
          Build complex waveforms by stacking harmonic components
        </p>
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr",
        gap: "20px",
        marginBottom: "20px"
      }}>
        {/* Synthesized Waveform */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>Synthesized Waveform</h3>
          <SynthesizedWaveCanvas
            width={600}
            height={200}
            components={components}
          />
        </div>

        {/* Interactive Spectral Bars */}
        <div style={{ textAlign: "center" }}>
          <InteractiveSpectralBars
            components={components}
            onComponentChange={handleComponentChange}
            width={600}
            height={280}
            maxBars={8}
          />
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap",
        gap: "12px", 
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        <button
          onClick={handlePresetSquare}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Square Wave
        </button>
        
        <button
          onClick={handlePresetSawtooth}
          style={{
            padding: "8px 16px",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Sawtooth Wave
        </button>
        
        <button
          onClick={handleReset}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Reset
        </button>
      </div>

      {/* Audio Controls */}
      {spectralData.components.length > 0 && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <AudioControls
            isPlaying={isPlaying}
            onPlay={startAudio}
            onStop={stopAudio}
            label="Play Synthesized Sound"
          />
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        backgroundColor: "#f9fafb", 
        padding: "16px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>Instructions:</h3>
        <ol style={{ margin: "0", paddingLeft: "20px", fontSize: "14px" }}>
          <li>Drag the bars up and down to adjust harmonic amplitudes</li>
          <li>Try the Square Wave and Sawtooth presets to see classic waveforms</li>
          <li>Watch how the synthesized waveform changes in real-time</li>
          <li>Use the audio controls to hear your creation</li>
        </ol>
      </div>

      {/* Navigation */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <button
          onClick={() => onNext()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Continue Learning
        </button>

        <button
          onClick={() => onComplete()}
          style={{
            padding: "10px 20px",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Mark Complete
        </button>
      </div>
    </div>
  );
}
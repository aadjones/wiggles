import { useState, useRef } from "react";
import { SineCanvas, type SineCanvasRef } from "../components/SineCanvas";
import { SpectralBars } from "../components/SpectralBars";
import { AudioControls } from "../components/AudioControls";
import { AmplitudeSlider } from "../components/AmplitudeSlider";
import { PhaseKnob } from "../components/PhaseKnob";
import { useSpectralAnalysis } from "../hooks/useSpectralAnalysis";
import { useMultiOscillatorAudio } from "../hooks/useMultiOscillatorAudio";
import type { ModuleProps } from "../types/module";
import type { WaveParams } from "../types/wave";

export function Module2_MiniPrism({ onComplete, onNext }: ModuleProps) {
  const [waveParams, setWaveParams] = useState<WaveParams>({
    amplitude: 1,
    frequency: 2,
    phase: 0,
  });

  const canvasRef = useRef<SineCanvasRef>(null);
  const { spectralData, isAnalyzing, analyzeCanvas, reset } = useSpectralAnalysis();
  const { isPlaying, startAudio, stopAudio } = useMultiOscillatorAudio(spectralData);

  const handleSplit = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (canvas) {
      analyzeCanvas(canvas);
    }
  };

  const handleReset = () => {
    reset();
    stopAudio();
  };

  const handleAmplitudeChange = (amplitude: number) => {
    setWaveParams(prev => ({ ...prev, amplitude }));
  };

  const handlePhaseChange = (phase: number) => {
    setWaveParams(prev => ({ ...prev, phase }));
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "1000px", 
      margin: "0 auto",
      fontFamily: "system-ui, sans-serif"
    }}>
      {/* Module Header */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 8px 0", color: "#374151" }}>
          Mini Prism - Wave Splitting
        </h2>
        <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
          Draw a wave and split it into frequency components
        </p>
      </div>

      {/* Wave Controls */}
      <div style={{ 
        display: "flex", 
        gap: "20px", 
        marginBottom: "20px",
        justifyContent: "center"
      }}>
        <AmplitudeSlider 
          value={waveParams.amplitude}
          onChange={handleAmplitudeChange}
        />
        <PhaseKnob 
          phase={waveParams.phase}
          onChange={handlePhaseChange}
        />
      </div>

      {/* Main Content Area */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 300px",
        gap: "20px",
        marginBottom: "20px"
      }}>
        {/* Wave Canvas */}
        <div>
          <SineCanvas
            ref={canvasRef}
            width={500}
            height={300}
            waveParams={waveParams}
          />
          
          {/* Analysis Controls */}
          <div style={{ 
            marginTop: "12px", 
            display: "flex", 
            gap: "12px",
            justifyContent: "center"
          }}>
            <button
              onClick={handleSplit}
              disabled={isAnalyzing}
              style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isAnalyzing ? "not-allowed" : "pointer",
                opacity: isAnalyzing ? 0.6 : 1,
                fontWeight: "500"
              }}
            >
              {isAnalyzing ? "Analyzing..." : "Split Wave"}
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
        </div>

        {/* Spectral Bars */}
        <SpectralBars spectralData={spectralData} />
      </div>

      {/* Audio Controls */}
      {spectralData.components.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <AudioControls
            isPlaying={isPlaying}
            onPlay={startAudio}
            onStop={stopAudio}
            label="Play Spectral Components"
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
          <li>Adjust the amplitude and phase to create different wave shapes</li>
          <li>Click "Split Wave" to analyze the frequency components</li>
          <li>Observe how different wave shapes produce different spectral patterns</li>
          <li>Try the audio to hear how the components sound together</li>
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
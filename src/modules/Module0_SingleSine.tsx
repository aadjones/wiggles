import { useState } from "react";
import { SineCanvas } from "../components/SineCanvas";
import { PhasorCanvas } from "../components/PhasorCanvas";
import { LEDStripCanvas } from "../components/LEDStripCanvas";
import { AmplitudeSlider } from "../components/AmplitudeSlider";
import { PhaseKnob } from "../components/PhaseKnob";
import { AudioControls } from "../components/AudioControls";
import type { WaveParams } from "../types/wave";
import type { ModuleProps } from "../types/module";

// Feature flag to show/hide wave equation
const SHOW_WAVE_EQUATION = false;

type VisualizationMode = 'wave' | 'phasor' | 'leds';

export function Module0_SingleSine({ onComplete, onNext }: ModuleProps) {
  const [waveParams, setWaveParams] = useState<WaveParams>({
    amplitude: 1.0,
    frequency: 3, // Fixed at k=3 for now
    phase: 0,
  });

  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('wave');

  const updateAmplitude = (amplitude: number) => {
    setWaveParams((prev) => ({ ...prev, amplitude }));
  };

  const updatePhase = (phase: number) => {
    setWaveParams((prev) => ({ ...prev, phase }));
  };

  // Simple completion criteria: user has adjusted both amplitude and phase
  const [hasAdjustedAmplitude, setHasAdjustedAmplitude] = useState(false);
  const [hasAdjustedPhase, setHasAdjustedPhase] = useState(false);

  const handleAmplitudeChange = (amplitude: number) => {
    if (Math.abs(amplitude - 1.0) > 0.1) {
      setHasAdjustedAmplitude(true);
    }
    updateAmplitude(amplitude);
  };

  const handlePhaseChange = (phase: number) => {
    if (Math.abs(phase) > 10) {
      setHasAdjustedPhase(true);
    }
    updatePhase(phase);
  };

  const isComplete = hasAdjustedAmplitude && hasAdjustedPhase;

  return (
    <div
      style={{
        padding: "12px",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f9fafb",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          style={{
            fontSize: "14px",
            color: "#6b7280",
            fontWeight: "500",
            marginBottom: "8px",
          }}
        >
          MODULE 0: PURE WIGGLE PRIMER
        </div>
        <h1
          style={{
            color: "#111827",
            fontSize: "2.5rem",
            fontWeight: "700",
            margin: "0 0 10px 0",
          }}
        >
          Meet the Sine Wave
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1.1rem",
            margin: 0,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Explore the DNA of a sine wave: <strong>Amplitude</strong> controls
          height,
          <strong> Phase</strong> shifts it horizontally. Try adjusting both
          controls!
        </p>
      </header>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Visualization Mode Toggle */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {(['wave', 'phasor', 'leds'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setVisualizationMode(mode)}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "600",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: visualizationMode === mode ? "#3b82f6" : "#f3f4f6",
                color: visualizationMode === mode ? "white" : "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.2s ease",
              }}
            >
              {mode === 'wave' ? 'Wave' : mode === 'phasor' ? 'Phasor' : 'LEDs'}
            </button>
          ))}
        </div>

        {/* Wave Visualization */}
        <div
          style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {visualizationMode === 'wave' && (
            <SineCanvas width={680} height={220} waveParams={waveParams} />
          )}
          {visualizationMode === 'phasor' && (
            <PhasorCanvas width={680} height={220} waveParams={waveParams} />
          )}
          {visualizationMode === 'leds' && (
            <LEDStripCanvas width={680} height={220} waveParams={waveParams} />
          )}
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <AmplitudeSlider
            value={waveParams.amplitude}
            onChange={handleAmplitudeChange}
          />

          <div
            style={{
              width: "1px",
              height: "60px",
              backgroundColor: "#e5e7eb",
            }}
          />

          <PhaseKnob value={waveParams.phase} onChange={handlePhaseChange} />

          <div
            style={{
              width: "1px",
              height: "60px",
              backgroundColor: "#e5e7eb",
            }}
          />

          <AudioControls waveParams={waveParams} />
        </div>

        {/* Info Panel */}
        {SHOW_WAVE_EQUATION && (
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              maxWidth: "600px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "#374151", marginTop: 0 }}>
              Current Wave Equation
            </h3>
            <code
              style={{
                fontSize: "1.2rem",
                color: "#3b82f6",
                backgroundColor: "#f3f4f6",
                padding: "10px 15px",
                borderRadius: "6px",
                display: "inline-block",
              }}
            >
              y = {waveParams.amplitude.toFixed(2)} × sin(x +{" "}
              {Math.round(waveParams.phase)}°)
            </code>
            <p style={{ color: "#6b7280", marginBottom: 0, marginTop: "15px" }}>
              <strong>Amplitude</strong> controls the height •{" "}
              <strong>Phase</strong> shifts the wave horizontally
            </p>
          </div>
        )}

        {/* Progress and Next Button */}
        {isComplete && (
          <div
            style={{
              backgroundColor: "#dcfce7",
              border: "1px solid #16a34a",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ color: "#15803d", margin: "0 0 10px 0" }}>
              🎉 Great job!
            </h3>
            <p style={{ color: "#166534", margin: "0 0 15px 0" }}>
              You've mastered the basics of sine wave control. Ready for the
              next challenge?
            </p>
            <button
              onClick={() => {
                onComplete();
                onNext();
              }}
              style={{
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Continue to Module 1 →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

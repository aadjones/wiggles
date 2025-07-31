import { useState } from "react";
import type { SpectralComponent } from "../types/wave";

interface InteractiveSpectralBarsProps {
  components: SpectralComponent[];
  onComponentChange: (index: number, component: SpectralComponent) => void;
  width?: number;
  height?: number;
  maxBars?: number;
}

export function InteractiveSpectralBars({ 
  components,
  onComponentChange,
  width = 600,
  height = 250,
  maxBars = 8
}: InteractiveSpectralBarsProps) {
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    barIndex: number;
    startY: number;
    startAmplitude: number;
  } | null>(null);

  // Ensure we have the right number of components
  const paddedComponents = Array.from({ length: maxBars }, (_, k) => {
    const existing = components.find(c => c.k === k);
    return existing || { k, amplitude: 0, phase: 0 };
  });

  const barWidth = (width - 80) / maxBars; // Leave margin for labels
  const barAreaHeight = height - 80; // Leave space for controls

  const handleBarMouseDown = (e: React.MouseEvent, barIndex: number) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      isDragging: true,
      barIndex,
      startY: e.clientY,
      startAmplitude: paddedComponents[barIndex].amplitude
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState?.isDragging) return;

    const deltaY = dragState.startY - e.clientY; // Inverted for intuitive dragging
    const amplitudeChange = (deltaY / barAreaHeight) * 2; // Scale to 0-2 range
    const newAmplitude = Math.max(0, Math.min(2, dragState.startAmplitude + amplitudeChange));

    const updatedComponent = {
      ...paddedComponents[dragState.barIndex],
      amplitude: newAmplitude
    };

    onComponentChange(dragState.barIndex, updatedComponent);
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  const handlePhaseChange = (barIndex: number, phase: number) => {
    const updatedComponent = {
      ...paddedComponents[barIndex],
      phase
    };
    onComponentChange(barIndex, updatedComponent);
  };

  return (
    <div 
      style={{ width, height, position: "relative", userSelect: "none" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Title */}
      <div style={{ 
        textAlign: "center", 
        fontSize: "16px", 
        fontWeight: "bold",
        marginBottom: "12px"
      }}>
        Harmonic Synthesizer
      </div>

      {/* Bars container */}
      <div style={{ 
        position: "relative", 
        height: barAreaHeight,
        marginLeft: "40px",
        marginRight: "40px",
        borderBottom: "2px solid #333",
        backgroundColor: "#f8f9fa"
      }}>
        {paddedComponents.map((component, index) => {
          const barHeight = (component.amplitude / 2) * barAreaHeight;
          const barColor = index === 0 ? "#e74c3c" : "#3498db"; // DC component in red
          
          return (
            <div key={component.k} style={{ position: "absolute", left: index * barWidth }}>
              {/* Bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: barWidth - 4,
                  height: barHeight,
                  backgroundColor: barColor,
                  border: "2px solid #2c3e50",
                  cursor: "ns-resize",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  transition: dragState?.barIndex === index ? "none" : "height 0.1s ease"
                }}
                onMouseDown={(e) => handleBarMouseDown(e, index)}
              >
                {/* Amplitude display */}
                {component.amplitude > 0.1 && (
                  <div style={{ 
                    fontSize: "10px", 
                    color: "white",
                    textShadow: "1px 1px 1px rgba(0,0,0,0.8)",
                    marginTop: "4px",
                    fontWeight: "bold"
                  }}>
                    {component.amplitude.toFixed(1)}
                  </div>
                )}
              </div>

              {/* Phase knob */}
              <div style={{
                position: "absolute",
                bottom: -50,
                left: (barWidth - 32) / 2,
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#34495e",
                border: "2px solid #2c3e50",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {/* Phase indicator line */}
                <div
                  style={{
                    width: "2px",
                    height: "12px",
                    backgroundColor: "#ecf0f1",
                    transformOrigin: "bottom center",
                    transform: `rotate(${component.phase}deg)`
                  }}
                />
              </div>

              {/* Frequency label */}
              <div style={{
                position: "absolute",
                bottom: -70,
                left: 0,
                width: barWidth - 4,
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                {index === 0 ? "DC" : `${index}f`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase controls info */}
      <div style={{
        position: "absolute",
        bottom: 5,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: "11px",
        color: "#666"
      }}>
        Drag bars to adjust amplitude • Click knobs to adjust phase (coming soon)
      </div>
    </div>
  );
}
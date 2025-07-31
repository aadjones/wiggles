import type { SpectralData } from "../types/wave";

interface SpectralBarsProps {
  spectralData: SpectralData;
  width?: number;
  height?: number;
}

export function SpectralBars({ 
  spectralData, 
  width = 300, 
  height = 200 
}: SpectralBarsProps) {
  const { components, energy } = spectralData;
  
  if (components.length === 0) {
    return (
      <div 
        style={{ 
          width, 
          height, 
          border: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9f9f9",
          color: "#666"
        }}
      >
        No spectral data
      </div>
    );
  }

  // Find max amplitude for scaling
  const maxAmplitude = Math.max(...components.map(c => c.amplitude), 0.1);
  const barWidth = (width - 40) / components.length; // Leave margin for labels

  return (
    <div style={{ width, height, position: "relative" }}>
      {/* Title */}
      <div style={{ 
        textAlign: "center", 
        fontSize: "14px", 
        fontWeight: "bold",
        marginBottom: "8px"
      }}>
        Frequency Components
      </div>

      {/* Bars container */}
      <div style={{ 
        position: "relative", 
        height: height - 60,
        marginLeft: "20px",
        marginRight: "20px",
        borderBottom: "1px solid #333"
      }}>
        {components.map((component, index) => {
          const barHeight = (component.amplitude / maxAmplitude) * (height - 80);
          
          return (
            <div
              key={component.k}
              style={{
                position: "absolute",
                left: index * barWidth,
                bottom: 0,
                width: barWidth - 2,
                height: barHeight,
                backgroundColor: component.k === 0 ? "#e74c3c" : "#3498db",
                border: "1px solid #333",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              {/* Amplitude value */}
              <div style={{ 
                fontSize: "10px", 
                color: "white",
                textShadow: "1px 1px 1px rgba(0,0,0,0.7)",
                marginBottom: "2px"
              }}>
                {component.amplitude.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequency labels */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between",
        marginLeft: "20px",
        marginRight: "20px",
        marginTop: "4px"
      }}>
        {components.map(component => (
          <div key={component.k} style={{ 
            fontSize: "12px", 
            textAlign: "center",
            width: barWidth - 2
          }}>
            k={component.k}
          </div>
        ))}
      </div>

      {/* Energy display */}
      <div style={{ 
        textAlign: "center", 
        fontSize: "12px", 
        marginTop: "8px",
        color: "#666"
      }}>
        Energy: {energy.toFixed(3)}
      </div>
    </div>
  );
}
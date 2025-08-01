import { useRef, useState, useEffect } from "react";

interface AmplitudeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function AmplitudeSlider({ value, onChange }: AmplitudeSliderProps) {
  const faderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const faderHeight = 200;
  const faderWidth = 60;
  const handleHeight = 20;

  // Convert value (0-2) to position (0 to faderHeight - handleHeight)
  const handlePosition = ((2 - value) / 2) * (faderHeight - handleHeight);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !faderRef.current) return;

      const rect = faderRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;

      // Convert mouse position to value (inverted because top = max value)
      const normalizedY = Math.max(
        0,
        Math.min(faderHeight - handleHeight, y - handleHeight / 2),
      );
      const newValue = 2 - (normalizedY / (faderHeight - handleHeight)) * 2;
      const clampedValue = Math.max(0, Math.min(2, newValue));

      onChange(clampedValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onChange]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "12px",
        background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
        borderRadius: "12px",
        border: "1px solid #404040",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        minWidth: "80px",
      }}
    >
      {/* Value display at top */}
      <div
        style={{
          fontSize: "14px",
          fontWeight: "700",
          color: "#00ff88",
          backgroundColor: "#0a0a0a",
          padding: "4px 8px",
          borderRadius: "4px",
          border: "1px solid #333",
          minWidth: "48px",
          textAlign: "center",
          fontFamily: "monospace",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
        }}
      >
        {value.toFixed(1)}
      </div>

      {/* Professional mixing board fader */}
      <div
        ref={faderRef}
        style={{
          position: "relative",
          width: `${faderWidth}px`,
          height: `${faderHeight}px`,
          background: "linear-gradient(to right, #1a1a1a, #2a2a2a, #1a1a1a)",
          border: "2px solid #333",
          borderRadius: "6px",
          cursor: isDragging ? "grabbing" : "grab",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6)",
        }}
      >
        {/* Fader track groove */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "8px",
            bottom: "8px",
            width: "4px",
            transform: "translateX(-50%)",
            background: "linear-gradient(to bottom, #0a0a0a, #1a1a1a)",
            borderRadius: "2px",
            border: "1px solid #555",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)",
          }}
        />


        {/* Professional fader cap */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            top: `${handlePosition}px`,
            left: "2px",
            right: "2px",
            height: `${handleHeight + 4}px`,
            background: "linear-gradient(145deg, #4a4a4a, #2a2a2a)",
            border: "1px solid #555",
            borderRadius: "3px",
            cursor: isDragging ? "grabbing" : "grab",
            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
            transition: isDragging ? "none" : "top 0.1s ease",
          }}
        >
          {/* Fader handle grip lines */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "32px",
              height: "2px",
              background: "#666",
              borderRadius: "1px",
              boxShadow: "0 1px 0 #333, 0 3px 0 #666, 0 4px 0 #333, 0 6px 0 #666, 0 7px 0 #333",
            }}
          />
        </div>
      </div>

      {/* Label at bottom */}
      <label style={{ 
        fontWeight: "600", 
        color: "#ccc", 
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontFamily: "sans-serif",
      }}>
        AMP
      </label>
    </div>
  );
}

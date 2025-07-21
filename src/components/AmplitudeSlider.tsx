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
        gap: "12px",
      }}
    >
      <label style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>
        AMPLITUDE
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Value display */}
        <div
          style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#1d4ed8",
            minWidth: "50px",
            textAlign: "center",
          }}
        >
          {value.toFixed(1)}
        </div>

        {/* Vertical fader */}
        <div
          ref={faderRef}
          style={{
            position: "relative",
            width: `${faderWidth}px`,
            height: `${faderHeight}px`,
            background: "linear-gradient(to bottom, #f3f4f6, #e5e7eb)",
            border: "2px solid #d1d5db",
            borderRadius: "8px",
            cursor: isDragging ? "grabbing" : "grab",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {/* Track marks */}
          <div
            style={{
              position: "absolute",
              right: "-20px",
              top: "0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              fontSize: "10px",
              color: "#6b7280",
            }}
          >
            <span>2.0</span>
            <span>1.5</span>
            <span>1.0</span>
            <span>0.5</span>
            <span>0.0</span>
          </div>

          {/* Fader handle */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              position: "absolute",
              top: `${handlePosition}px`,
              left: "4px",
              right: "4px",
              height: `${handleHeight}px`,
              background: "linear-gradient(to bottom, #3b82f6, #1d4ed8)",
              border: "1px solid #1e40af",
              borderRadius: "4px",
              cursor: isDragging ? "grabbing" : "grab",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              transition: isDragging ? "none" : "top 0.1s ease",
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: "11px", color: "#6b7280", textAlign: "center" }}>
        Drag to adjust
      </div>
    </div>
  );
}

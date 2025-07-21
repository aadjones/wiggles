import { useRef, useState, useEffect } from "react";

interface PhaseKnobProps {
  value: number; // 0-360 degrees
  onChange: (value: number) => void;
}

export function PhaseKnob({ value, onChange }: PhaseKnobProps) {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Calculate angle in degrees (0-360)
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      angle = (angle + 90 + 360) % 360; // Adjust so 0° is at top

      onChange(angle);
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

  // Convert value to rotation
  const rotation = value - 90; // Adjust so 0° appears at top

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <label style={{ fontWeight: "600", color: "#374151" }}>
        Phase: {Math.round(value)}°
      </label>

      <div
        ref={knobRef}
        onMouseDown={handleMouseDown}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
          border: "2px solid #d1d5db",
          cursor: isDragging ? "grabbing" : "grab",
          position: "relative",
          transform: `rotate(${rotation}deg)`,
          transition: isDragging ? "none" : "transform 0.1s ease",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Knob indicator */}
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "3px",
            height: "20px",
            backgroundColor: "#3b82f6",
            borderRadius: "2px",
          }}
        />
      </div>

      <div style={{ fontSize: "12px", color: "#6b7280", textAlign: "center" }}>
        Drag to adjust
      </div>
    </div>
  );
}

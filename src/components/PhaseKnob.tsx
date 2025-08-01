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
      // Adjust so 0° is at top and handle wrapping smoothly
      angle = (angle + 90 + 360) % 360;

      // Prevent jumping by finding the closest angle to current value
      const currentAngle = value % 360;
      const diff1 = Math.abs(angle - currentAngle);
      const diff2 = Math.abs(angle - 360 - currentAngle);
      const diff3 = Math.abs(angle + 360 - currentAngle);
      
      if (diff2 < diff1 && diff2 < diff3) {
        angle = angle - 360;
      } else if (diff3 < diff1 && diff3 < diff2) {
        angle = angle + 360;
      }

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
  }, [isDragging, onChange, value]);

  // Convert value to rotation
  const rotation = value - 90; // Adjust so 0° appears at top

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
        minWidth: "90px",
      }}
    >
      {/* Value display at top */}
      <div
        style={{
          fontSize: "12px",
          fontWeight: "700",
          color: "#00ff88",
          backgroundColor: "#0a0a0a",
          padding: "3px 6px",
          borderRadius: "3px",
          border: "1px solid #333",
          minWidth: "44px",
          textAlign: "center",
          fontFamily: "monospace",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
        }}
      >
        {Math.round(value)}°
      </div>

      {/* Professional rotary knob */}
      <div
        style={{
          position: "relative",
          width: "70px",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Knob base/well */}
        <div
          style={{
            position: "absolute",
            width: "74px",
            height: "74px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #1a1a1a, #0a0a0a)",
            border: "2px solid #333",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)",
          }}
        />

        {/* Knob body */}
        <div
          ref={knobRef}
          onMouseDown={handleMouseDown}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #4a4a4a, #2a2a2a, #1a1a1a)",
            border: "1px solid #555",
            cursor: isDragging ? "grabbing" : "grab",
            position: "relative",
            transform: `rotate(${rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.1s ease",
            boxShadow: "0 3px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.1)",
          }}
        >
          {/* Knob texture rings */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              right: "8px",
              bottom: "8px",
              borderRadius: "50%",
              border: "1px solid #666",
              opacity: 0.3,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              right: "12px",
              bottom: "12px",
              borderRadius: "50%",
              border: "1px solid #666",
              opacity: 0.2,
            }}
          />

          {/* Knob pointer/indicator */}
          <div
            style={{
              position: "absolute",
              top: "6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "3px",
              height: "18px",
              background: "linear-gradient(to bottom, #00ff88, #00cc66)",
              borderRadius: "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.5), 0 0 4px rgba(0,255,136,0.3)",
            }}
          />

          {/* Knob center dot */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #666, #333)",
              border: "1px solid #888",
            }}
          />
        </div>

        {/* Degree markings around knob */}
        <div
          style={{
            position: "absolute",
            width: "90px",
            height: "90px",
            pointerEvents: "none",
          }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "2px",
                height: "6px",
                background: "#666",
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-42px)`,
                borderRadius: "1px",
              }}
            />
          ))}
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
        PHASE
      </label>
    </div>
  );
}

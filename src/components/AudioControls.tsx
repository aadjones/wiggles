import { useAudioSynthesis } from "../hooks/useAudioSynthesis";
import type { WaveParams } from "../types/wave";

interface AudioControlsProps {
  waveParams: WaveParams;
}

export function AudioControls({ waveParams }: AudioControlsProps) {
  const { isPlaying, startAudio, stopAudio, isSupported } =
    useAudioSynthesis(waveParams);

  if (!isSupported) {
    return (
      <div
        style={{
          padding: "12px",
          backgroundColor: "#fef3c7",
          border: "1px solid #f59e0b",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#92400e",
        }}
      >
        Audio not supported in this browser
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <label style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>
        AUDIO
      </label>

      <button
        onClick={isPlaying ? stopAudio : startAudio}
        style={{
          width: "80px",
          height: "40px",
          backgroundColor: isPlaying ? "#dc2626" : "#059669",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
        }}
      >
{isPlaying ? "⏹" : "▶"}
      </button>

      <div style={{ fontSize: "11px", color: "#6b7280", textAlign: "center" }}>
        F3 (174.6 Hz)
      </div>
    </div>
  );
}

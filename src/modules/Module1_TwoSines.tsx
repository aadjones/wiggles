import type { ModuleProps } from "../types/module";

export function Module1_TwoSines({ onNext }: ModuleProps) {
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            color: "#6b7280",
            fontWeight: "500",
            marginBottom: "8px",
          }}
        >
          MODULE 1: PHASE DANCE
        </div>
        <h1
          style={{
            color: "#111827",
            fontSize: "2rem",
            fontWeight: "700",
            margin: "0 0 20px 0",
          }}
        >
          Two Sine Waves
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "1.1rem",
            margin: "0 0 30px 0",
          }}
        >
          Coming soon! This module will explore how two sine waves interact,
          demonstrating phase interference, beating, and
          constructive/destructive patterns.
        </p>

        <div
          style={{
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <p style={{ color: "#92400e", margin: 0, fontSize: "14px" }}>
            🚧 This module is under construction. For now, you can return to
            Module 0 to continue exploring single sine waves.
          </p>
        </div>

        <button
          onClick={() => onNext()}
          style={{
            backgroundColor: "#6b7280",
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
          ← Back to Module 0
        </button>
      </div>
    </div>
  );
}

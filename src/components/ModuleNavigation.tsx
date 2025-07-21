import type { Module, UserProgress } from "../types/module";

interface ModuleNavigationProps {
  modules: Module[];
  currentModule: number;
  userProgress: UserProgress;
  onModuleSelect: (moduleId: number) => void;
}

export function ModuleNavigation({
  modules,
  currentModule,
  userProgress,
  onModuleSelect,
}: ModuleNavigationProps) {
  return (
    <nav
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 20px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo/Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
            }}
          >
            Wiggle Machine
          </h1>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              backgroundColor: "#f3f4f6",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            Educational Series
          </div>
        </div>

        {/* Module Progress */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            Progress:
          </span>

          {modules.map((module) => {
            const isCompleted = userProgress.completedModules.includes(
              module.id,
            );
            const isCurrent = currentModule === module.id;
            const isUnlocked = userProgress.unlockedModules.includes(module.id);

            return (
              <button
                key={module.id}
                onClick={() => (isUnlocked ? onModuleSelect(module.id) : null)}
                disabled={!isUnlocked}
                title={`${module.title}${isCompleted ? " (Completed)" : ""}${!isUnlocked ? " (Locked)" : ""}`}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: isCurrent ? "3px solid #3b82f6" : "2px solid #e5e7eb",
                  backgroundColor: isCompleted
                    ? "#10b981"
                    : isUnlocked
                      ? "#ffffff"
                      : "#f3f4f6",
                  color: isCompleted
                    ? "#ffffff"
                    : isUnlocked
                      ? "#374151"
                      : "#9ca3af",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isUnlocked ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                {isCompleted ? "✓" : module.id}
              </button>
            );
          })}
        </div>

        {/* Current Module Info */}
        <div
          style={{
            textAlign: "right",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              fontWeight: "500",
            }}
          >
            CURRENT MODULE
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#111827",
              fontWeight: "600",
            }}
          >
            {modules.find((m) => m.id === currentModule)?.title || "Unknown"}
          </div>
        </div>
      </div>
    </nav>
  );
}

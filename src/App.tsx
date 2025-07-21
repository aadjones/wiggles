import { useState } from "react";
import { ModuleNavigation } from "./components/ModuleNavigation";
import { Module0_SingleSine } from "./modules/Module0_SingleSine";
import { Module1_TwoSines } from "./modules/Module1_TwoSines";
import type { Module, UserProgress } from "./types/module";
import "./App.css";

function App() {
  // Define available modules
  const modules: Module[] = [
    {
      id: 0,
      title: "Pure Wiggle Primer",
      description: "Meet the sine wave - explore amplitude and phase",
      component: Module0_SingleSine,
    },
    {
      id: 1,
      title: "Phase Dance",
      description: "Two sine waves and phase interference",
      component: Module1_TwoSines,
    },
  ];

  // User progress and current module state
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedModules: [],
    currentModule: 0,
    unlockedModules: [0], // Start with module 0 unlocked
  });

  const [currentModule, setCurrentModule] = useState(0);

  // Handle module completion
  const handleModuleComplete = () => {
    setUserProgress((prev) => ({
      ...prev,
      completedModules: [...prev.completedModules, currentModule],
      unlockedModules: prev.unlockedModules.includes(currentModule + 1)
        ? prev.unlockedModules
        : [...prev.unlockedModules, currentModule + 1],
    }));
  };

  // Handle next module navigation
  const handleNextModule = () => {
    const nextModuleId = currentModule === 1 ? 0 : currentModule + 1; // Loop back to 0 for now
    if (userProgress.unlockedModules.includes(nextModuleId)) {
      setCurrentModule(nextModuleId);
    }
  };

  // Handle direct module selection
  const handleModuleSelect = (moduleId: number) => {
    if (userProgress.unlockedModules.includes(moduleId)) {
      setCurrentModule(moduleId);
    }
  };

  // Get current module component
  const CurrentModuleComponent =
    modules.find((m) => m.id === currentModule)?.component ||
    Module0_SingleSine;

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <ModuleNavigation
        modules={modules}
        currentModule={currentModule}
        userProgress={userProgress}
        onModuleSelect={handleModuleSelect}
      />

      <CurrentModuleComponent
        onComplete={handleModuleComplete}
        onNext={handleNextModule}
      />
    </div>
  );
}

export default App;

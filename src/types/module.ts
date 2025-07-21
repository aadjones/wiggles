export interface Module {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<ModuleProps>;
}

export interface ModuleProps {
  onComplete: () => void;
  onNext: () => void;
}

export interface UserProgress {
  completedModules: number[];
  currentModule: number;
  unlockedModules: number[];
}

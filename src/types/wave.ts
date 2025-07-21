export interface WaveParams {
  amplitude: number; // 0-2
  frequency: number; // 1-8 (k value)
  phase: number; // 0-360 degrees
}

export interface CanvasProps {
  width: number;
  height: number;
  waveParams: WaveParams;
}

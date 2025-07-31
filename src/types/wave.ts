export interface WaveParams {
  amplitude: number; // 0-2
  frequency: number; // 1-8 (k value)
  phase: number; // 0-360 degrees
}

export interface SpectralComponent {
  k: number;           // frequency index
  amplitude: number;   // |C_k|
  phase: number;       // arg(C_k) in degrees
}

export interface SpectralData {
  components: SpectralComponent[];
  energy: number;      // Parseval sum
}

export interface CanvasProps {
  width: number;
  height: number;
  waveParams: WaveParams;
}

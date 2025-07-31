import { useEffect, useRef, useState } from "react";
import type { SpectralData } from "../types/wave";

export function useMultiOscillatorAudio(spectralData: SpectralData) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio context
  useEffect(() => {
    const initAudio = () => {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext: typeof AudioContext;
            }
          ).webkitAudioContext)();

        // Create master gain for overall volume control
        if (audioContextRef.current) {
          masterGainRef.current = audioContextRef.current.createGain();
          masterGainRef.current.connect(audioContextRef.current.destination);
          masterGainRef.current.gain.setValueAtTime(0.1, audioContextRef.current.currentTime); // Lower overall volume
        }
      } catch (error) {
        console.warn("Web Audio API not supported:", error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Start multi-oscillator audio synthesis
  const startAudio = async () => {
    if (!audioContextRef.current || !masterGainRef.current) return;

    try {
      // Resume context if suspended (required for user interaction)
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      // Stop any existing oscillators
      stopAudio();

      const newOscillators: OscillatorNode[] = [];
      const newGainNodes: GainNode[] = [];

      // Create oscillators for each spectral component
      spectralData.components.forEach((component) => {
        if (component.amplitude < 0.01) return; // Skip very quiet components

        const oscillator = audioContextRef.current!.createOscillator();
        const gainNode = audioContextRef.current!.createGain();

        // Set up audio chain: oscillator -> gain -> master gain -> destination
        oscillator.connect(gainNode);
        gainNode.connect(masterGainRef.current!);

        // Configure oscillator
        oscillator.type = "sine";
        const baseFreq = 174.61; // F3 note (174.61 Hz)
        const frequency = baseFreq * (component.k + 1); // k=0 is fundamental, k=1 is first harmonic, etc.
        oscillator.frequency.setValueAtTime(
          frequency,
          audioContextRef.current!.currentTime,
        );

        // Configure gain (amplitude)
        const audioAmplitude = component.amplitude * 0.05; // Scale down for comfortable volume
        gainNode.gain.setValueAtTime(
          audioAmplitude,
          audioContextRef.current!.currentTime,
        );

        // Start oscillator
        oscillator.start();

        newOscillators.push(oscillator);
        newGainNodes.push(gainNode);
      });

      // Store references
      oscillatorsRef.current = newOscillators;
      gainNodesRef.current = newGainNodes;
      setIsPlaying(newOscillators.length > 0);
    } catch (error) {
      console.warn("Could not start audio:", error);
    }
  };

  // Stop audio synthesis
  const stopAudio = () => {
    oscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // Oscillator might already be stopped
      }
    });
    
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
    setIsPlaying(false);
  };

  // Update audio parameters when spectral data changes
  useEffect(() => {
    if (!audioContextRef.current || !isPlaying) return;

    // For now, we restart audio when spectral data changes
    // In a more advanced version, we could dynamically update existing oscillators
    if (isPlaying) {
      startAudio();
    }
  }, [spectralData, isPlaying]);

  return {
    isPlaying,
    startAudio,
    stopAudio,
    isSupported: !!audioContextRef.current,
  };
}
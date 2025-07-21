import { useEffect, useRef, useState } from "react";
import type { WaveParams } from "../types/wave";

export function useAudioSynthesis(waveParams: WaveParams) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
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

  // Start audio synthesis
  const startAudio = async () => {
    if (!audioContextRef.current) return;

    try {
      // Resume context if suspended (required for user interaction)
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      // Stop any existing oscillator
      stopAudio();

      // Create oscillator and gain node
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      // Set up audio chain: oscillator -> gain -> destination
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      // Configure oscillator
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        174.61,
        audioContextRef.current.currentTime,
      ); // F3 note (174.61 Hz)

      // Configure gain (amplitude)
      const audioAmplitude = waveParams.amplitude * 0.1; // Scale down for comfortable volume
      gainNode.gain.setValueAtTime(
        audioAmplitude,
        audioContextRef.current.currentTime,
      );

      // Start oscillator
      oscillator.start();

      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      setIsPlaying(true);
    } catch (error) {
      console.warn("Could not start audio:", error);
    }
  };

  // Stop audio synthesis
  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {
        // Oscillator might already be stopped
      }
      oscillatorRef.current = null;
    }
    gainNodeRef.current = null;
    setIsPlaying(false);
  };

  // Update audio parameters when wave params change
  useEffect(() => {
    if (!audioContextRef.current || !gainNodeRef.current || !isPlaying) return;

    const currentTime = audioContextRef.current.currentTime;

    // Update amplitude (gain)
    const audioAmplitude = waveParams.amplitude * 0.1; // Scale for comfortable volume
    gainNodeRef.current.gain.setTargetAtTime(audioAmplitude, currentTime, 0.01);

    // Note: Phase changes don't affect continuous audio playback
    // In a more advanced version, we could use phase to create audio effects
  }, [waveParams, isPlaying]);

  return {
    isPlaying,
    startAudio,
    stopAudio,
    isSupported: !!audioContextRef.current,
  };
}

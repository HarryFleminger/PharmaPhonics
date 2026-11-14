import { useState, useCallback, useRef, useEffect } from 'react';
import { Medication, SpeechSpeed } from '../types/medication';
import {
  synthesizeMedicationSpeech,
  hasGoogleTtsApiKey,
  UK_NEURAL_VOICE_NAME,
} from '../services/googleTtsService';

export interface UseSpeechSynthesisReturn {
  isApiKeyConfigured: boolean;
  voiceName: string;
  loadingId: string | null;
  speakingId: string | null;
  error: string | null;
  clearError: () => void;
  speed: SpeechSpeed;
  toggleSpeed: () => void;
  speak: (medication: Pick<Medication, 'id' | 'name' | 'ssml'>) => Promise<void>;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [speed, setSpeed] = useState<SpeechSpeed>(1.0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setLoadingId(null);
    setSpeakingId(null);
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const toggleSpeed = useCallback(() => {
    setSpeed((prev) => (prev === 1.0 ? 0.75 : 1.0));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const speak = useCallback(
    async (medication: Pick<Medication, 'id' | 'name' | 'ssml'>) => {
      const { id, name, ssml } = medication;

      // If clicking the same card while it is already playing or loading, stop it
      if (speakingId === id || loadingId === id) {
        stop();
        return;
      }

      stop();
      setError(null);
      setLoadingId(id);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const audioDataUrl = await synthesizeMedicationSpeech({
          name,
          ssml,
          speakingRate: speed,
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) {
          return;
        }

        const audio = new Audio(audioDataUrl);
        audioRef.current = audio;

        audio.onplay = () => {
          setLoadingId((current) => (current === id ? null : current));
          setSpeakingId(id);
        };

        audio.onended = () => {
          setSpeakingId((current) => (current === id ? null : current));
        };

        audio.onerror = () => {
          setLoadingId((current) => (current === id ? null : current));
          setSpeakingId((current) => (current === id ? null : current));
          setError(`Failed to play synthesized audio for ${name}.`);
        };

        await audio.play();
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setLoadingId((current) => (current === id ? null : current));
        setSpeakingId((current) => (current === id ? null : current));
        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while contacting Google Cloud Text-to-Speech.'
        );
      }
    },
    [loadingId, speakingId, speed, stop]
  );

  return {
    isApiKeyConfigured: hasGoogleTtsApiKey(),
    voiceName: UK_NEURAL_VOICE_NAME,
    loadingId,
    speakingId,
    error,
    clearError,
    speed,
    toggleSpeed,
    speak,
    stop,
  };
}
